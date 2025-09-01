import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { ScrollArea } from "@/components/scroll-area";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import * as React from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

type Option = string;

export type AutocompleteMultiProps = {
  options: readonly Option[];
  value: Option[];
  onChange: (next: Option[]) => void;
  placeholder?: string;
  maxResults?: number;
  dedupe?: boolean;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  chipClassName?: string;
  fuzzyMatchFn: (
    candidate: string,
    query: string,
  ) => { score: number; indices: number[] } | null;
  emptyMessage?: string;
  onSelectOption?: (opt: Option) => void;
};

export function AutocompleteMulti({
  options,
  value,
  onChange,
  placeholder = "Search…",
  maxResults = 8,
  dedupe = true,
  className,
  inputClassName,
  listClassName,
  chipClassName,
  fuzzyMatchFn,
  emptyMessage = "No results",
  onSelectOption,
}: AutocompleteMultiProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);

  // Keep popover same width as the trigger
  useLayoutEffect(() => {
    const el = triggerRef.current;
    if (!el) {
      return;
    }
    const measure = () => setPopoverWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const selectedLc = useMemo(
    () => new Set(value.map((v) => v.toLowerCase())),
    [value],
  );

  const results = useMemo(() => {
    const scored = options
      .filter((opt) => !dedupe || !selectedLc.has(opt.toLowerCase()))
      .map((opt) => {
        const m = fuzzyMatchFn(opt, query);
        return m ? { opt, ...m } : null;
      })
      .filter(Boolean) as { opt: Option; score: number; indices: number[] }[];

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxResults);
  }, [options, dedupe, selectedLc, query, maxResults, fuzzyMatchFn]);

  const add = (opt: Option) => {
    if (dedupe && selectedLc.has(opt.toLowerCase())) {
      return;
    }
    const next = [...value, opt];
    onChange(next);
    onSelectOption?.(opt);
    setQuery("");
    setActiveIdx(0);
    setOpen(true);
    inputRef.current?.focus();
  };

  const remove = (opt: Option) => {
    onChange(value.filter((v) => v.toLowerCase() !== opt.toLowerCase()));
    inputRef.current?.focus();
  };

  const clearAll = () => {
    onChange([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (results[activeIdx]) {
        e.preventDefault();
        add(results[activeIdx].opt);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && query === "" && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* Keep focus on input; open on focus */}
          <div
            ref={triggerRef}
            className="relative"
            onFocus={() => setOpen(true)}
          >
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIdx(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                "pr-10 h-10 border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20",
                inputClassName,
              )}
              aria-expanded={open}
              aria-autocomplete="list"
              role="combobox"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Properly centered search icon */}
            <Search
              className="pointer-events-none absolute inset-y-0 right-2 my-auto h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "z-50 p-0 border border-slate-700 rounded-md shadow-md shadow-slate-900/50",
            "bg-slate-800 text-slate-100",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[side=bottom]:slide-in-from-top-2",
            listClassName,
          )}
          style={{ width: popoverWidth ?? undefined }}
        >
          <ScrollArea className="max-h-fit">
            {results.length === 0 ? (
              <div className="px-3 py-8 text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              <ul role="listbox" aria-label="Search results" className="py-1">
                {results.map((r, idx) => (
                  <li key={r.opt}>
                    <button
                      type="button"
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm",
                        "hover:bg-slate-700 hover:text-slate-100",
                        idx === activeIdx && "bg-slate-700/70",
                      )}
                      role="option"
                      aria-selected={idx === activeIdx}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => add(r.opt)}
                    >
                      <ResultText option={r.opt} indices={r.indices} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Selected chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {value.map((v) => (
          <Badge
            key={v.toLowerCase()}
            variant="secondary"
            className={cn(
              "rounded-md border border-slate-700 bg-slate-800 text-slate-100",
              "px-3 py-1 text-sm shadow-sm",
              "hover:bg-slate-700 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              chipClassName,
            )}
          >
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-sm hover:bg-secondary-foreground/10 transition-colors"
              onClick={() => remove(v)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}

        {value.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={clearAll}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultText({
  option,
  indices,
}: {
  option: string;
  indices: number[];
}) {
  if (!indices.length) {
    return <span>{option}</span>;
  }
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i]!;
    if (idx > last) {
      parts.push(<span key={`n-${i}-${last}`}>{option.slice(last, idx)}</span>);
    }
    parts.push(
      <span
        key={`h-${i}-${idx}`}
        className="font-medium underline underline-offset-2"
      >
        {option[idx]}
      </span>,
    );
    last = idx + 1;
  }
  if (last < option.length) {
    parts.push(<span key={`t-${last}`}>{option.slice(last)}</span>);
  }
  return <>{parts}</>;
}
