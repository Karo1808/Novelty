import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useState } from "react";

export type Step = {
  id: string;
  label: string;
  description?: string;
};

type OnboardingShellProps = {
  steps: Step[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (i: number) => void;
  allowJumpAhead?: boolean;
  /** e.g. "w-64" */
  sidebarWidth?: string;
  renderStep?: (index: number, step: Step) => React.ReactNode;
  renderFooter?: (ctx: {
    index: number;
    isFirst: boolean;
    isLast: boolean;
    goTo: (i: number) => void;
    next: () => void;
    back: () => void;
    step?: Step;
  }) => React.ReactNode;
  title?: string;
  description?: string;
  onFinish?: (finalIndex: number) => void;

  /** Optional: override container bg + max width */
  containerClassName?: string; // background, centering surface
  maxWidthClassName?: string; // default max-w-5xl
};

export default function OnboardingShell({
  steps,
  index,
  defaultIndex = 0,
  onIndexChange,
  allowJumpAhead = false,
  sidebarWidth = "sm:w-64",
  renderStep,
  renderFooter,
  title = "Onboarding",
  description = "Follow the steps to get set up.",
  onFinish,
  containerClassName,
  maxWidthClassName = "max-w-5xl",
}: OnboardingShellProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const controlled = typeof index === "number";
  const i = controlled ? (index as number) : internalIndex;

  const isFirst = i === 0;
  const isLast = i === steps.length - 1;

  const goTo = useCallback(
    (next: number) => {
      if (!allowJumpAhead && next > i) {
        return;
      }
      if (next < 0 || next > steps.length - 1) {
        return;
      }
      controlled ? onIndexChange?.(next) : setInternalIndex(next);
    },
    [allowJumpAhead, controlled, i, onIndexChange, steps.length],
  );

  const next = useCallback(() => {
    if (isLast) {
      onFinish?.(i);
      return;
    }
    const target = i + 1;
    controlled ? onIndexChange?.(target) : setInternalIndex(target);
  }, [controlled, i, isLast, onIndexChange, onFinish]);

  const back = useCallback(() => {
    if (isFirst) {
      return;
    }
    const target = i - 1;
    controlled ? onIndexChange?.(target) : setInternalIndex(target);
  }, [controlled, i, isFirst, onIndexChange]);

  const step = steps[i];

  return (
    // Full-page container: centers content and provides page background
    <div
      className={cn(
        "bg-slate-900 text-slate-100", // page background (customize here)
        containerClassName,
      )}
    >
      {/* Centered surface with max width */}
      <div
        className={cn(
          "w-full",
          maxWidthClassName,
          "sm:rounded-2xl sm:border sm:border-slate-700 sm:bg-slate-800 sm:shadow-lg sm:shadow-slate-900/50 border-none shadow-none bg-transparent h-full",
        )}
      >
        {/* Two-column layout */}
        <div className="flex flex-col gap-x-6 h-full sm:flex-row">
          {/* Sidebar (fixed width) */}
          <aside
            className={cn(
              "flex flex-col sm:border-r sm:border-slate-700 sm:bg-slate-800 p-4 md:p-6",
              "sticky top-0 self-center sm:h-full sm:min-h-[50vh] sm:rounded-l-2xl sm:rounded-r-none flex-nowrap", // keeps sidebar visible if content scrolls
              sidebarWidth,
            )}
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold">Onboarding</h2>
              <p className="text-xs text-muted-foreground">Steps at a glance</p>
            </div>

            <nav aria-label="Onboarding steps">
              <ol className="space-y-1 flex flex-row sm:flex-col flex-wrap">
                {steps.map((s, idx) => {
                  const isActive = idx === i;
                  const isPast = idx < i;
                  const canClick = isPast || allowJumpAhead || idx === i;

                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => canClick && goTo(idx)}
                        aria-current={isActive ? "step" : undefined}
                        aria-disabled={!canClick}
                        className={cn(
                          "group flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition",
                          canClick
                            ? "hover:bg-muted/70"
                            : "cursor-not-allowed opacity-60",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                            isActive &&
                              "border-primary text-primary ring-4 ring-primary/10",
                            isPast &&
                              "bg-primary text-primary-foreground border-primary",
                            !isActive &&
                              !isPast &&
                              "border-muted-foreground/30",
                          )}
                        >
                          {isPast ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                        </span>

                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">
                            {s.label}
                          </span>
                          {s.description ? (
                            <span className="truncate text-xs text-slate-400">
                              {s.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          {/* Main column */}
          <section className="flex-1 min-w- flex flex-col justify-between">
            {/* Title */}
            <div>
              {/* Step content */}
              <div className="p-4 md:p-6">
                {renderStep && step ? (
                  renderStep(i, step)
                ) : (
                  <div className="rounded-lg border border-slate-700 p-6 text-sm text-slate-300 bg-slate-800">
                    Provide <code>renderStep</code> to render your form/content
                    for: <strong>{step?.label}</strong>.
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <footer className="flex items-end justify-between p-4 md:p-6 justify-self-end">
              <Button
                type="button"
                variant="outline"
                disabled={isFirst}
                onClick={back}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {renderFooter ? (
                renderFooter({
                  index: i,
                  isFirst,
                  isLast,
                  goTo,
                  next,
                  back,
                  step,
                })
              ) : (
                <div className="flex gap-2">
                  {!isLast ? (
                    <Button type="button" onClick={next} className="gap-2">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit">Finish</Button>
                  )}
                </div>
              )}
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}
