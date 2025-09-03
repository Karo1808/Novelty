import { useCallback, useEffect, useRef, useState } from "react";
import { useWatch, type Control, type FieldValues } from "react-hook-form";
import { useDebounce } from "./use-debounce";

type UseDraftOptions<TValues extends FieldValues, TProjected> = {
  /** Debounce interval before calling `saveDraft` (ms). Default: 600 */
  debounceMs?: number;
  /** Enable/disable the autosave behavior. Default: true */
  enabled?: boolean;
  /** Project full form values to a subset for change detection. Default: identity */
  project?: (values: TValues) => TProjected;
  /** Equality check for projected values to avoid redundant saves. Defaults to JSON compare. */
  isEqual?: (a: TProjected, b: TProjected) => boolean;
  /** Called if `saveDraft` throws. */
  onError?: (error: unknown, values: TValues) => void;
};

type UseDraftReturn = {
  /** Immediately run a save of the current form values. */
  flush: () => Promise<void>;
  /** Cancel any scheduled save. */
  cancel: () => void;
  /** True while the latest queued save is in-flight. */
  isSaving: boolean;
  /** The last error thrown by `saveDraft`, if any. */
  lastError: unknown | null;
};

/**
 * useDraft — Debounced server-side draft caching for React Hook Form.
 * Subscribes to the form, debounces *projected* changes via `useDebounce`,
 * then calls your async `saveDraft(values)`.
 */
export function useDraft<TValues extends FieldValues, TProjected = TValues>(
  control: Control<TValues>,
  saveDraft: (values: TValues) => Promise<void>,
  {
    debounceMs = 600,
    enabled = true,
    project,
    isEqual,
    onError,
  }: UseDraftOptions<TValues, TProjected> = {},
): UseDraftReturn {
  // watch the entire form (compatible with any RHF setup)
  const values = useWatch({ control }) as TValues;

  // keep latest values for immediate flush (not debounced)
  const latestValuesRef = useRef(values);
  useEffect(() => {
    latestValuesRef.current = values;
  }, [values]);

  // project to a subset for change detection
  const projected = project
    ? project(values)
    : (values as unknown as TProjected);

  // debounce the projected value
  const { debounced: debouncedProjected, cancel: cancelDebounce } =
    useDebounce<TProjected>(projected, debounceMs, {
      enabled,
      isEqual,
    });

  // dedupe saves if debounced payload didn't actually change
  const lastSavedProjectedRef = useRef<TProjected | undefined>(undefined);

  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<unknown | null>(null);
  const versionRef = useRef(0); // last write wins

  const eqProjected = useCallback(
    (a: TProjected | undefined, b: TProjected | undefined) => {
      if (a === undefined || b === undefined) {
        return false;
      }
      if (isEqual) {
        return isEqual(a, b);
      }
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch {
        return Object.is(a, b);
      }
    },
    [isEqual],
  );

  const doSave = useCallback(async () => {
    const ver = ++versionRef.current;
    const payload = latestValuesRef.current;
    setIsSaving(true);
    setLastError(null);
    try {
      await saveDraft(payload);
    } catch (e) {
      setLastError(e);
      onError?.(e, payload);
    } finally {
      if (versionRef.current === ver) {
        setIsSaving(false);
      }
    }
  }, [saveDraft, onError]);

  // trigger save whenever the debounced projection changes (and isn't a duplicate)
  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (eqProjected(debouncedProjected, lastSavedProjectedRef.current)) {
      return;
    }
    lastSavedProjectedRef.current = debouncedProjected;

    void doSave();
  }, [debouncedProjected, enabled, doSave, eqProjected]);

  const flush = useCallback(async () => {
    // ensure any pending debounce is cleared, then save current form values immediately
    cancelDebounce();
    await doSave();
  }, [cancelDebounce, doSave]);

  const cancel = useCallback(() => {
    cancelDebounce();
  }, [cancelDebounce]);

  // cleanup is handled by useDebounce; nothing else to do here.

  return { flush, cancel, isSaving, lastError };
}
