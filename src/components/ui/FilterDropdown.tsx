"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  multi?: boolean;
}

/** Base filter/dropdown component supporting single & multi-select. */
export function FilterDropdown({ label, options, selected, onChange, multi = true }: FilterDropdownProps) {
  const t = useTranslations("common.filter");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function toggle(value: string) {
    if (multi) {
      onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    } else {
      onChange(selected.includes(value) ? [] : [value]);
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
          selected.length > 0
            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
            : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50",
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-emerald-600 px-1.5 text-xs font-medium text-white">
            {selected.length}
          </span>
        )}
        <span aria-hidden className={cn("transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 max-h-64 w-56 overflow-y-auto rounded-lg border border-stone-200 bg-white p-2 shadow-lg"
        >
          {options.length === 0 && <p className="px-2 py-1.5 text-sm text-stone-400">{t("noOptions")}</p>}
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-stone-50"
            >
              <input
                type={multi ? "checkbox" : "radio"}
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="accent-emerald-600"
              />
              {opt.label}
            </label>
          ))}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-md px-2 py-1 text-left text-xs text-stone-500 hover:bg-stone-50"
            >
              {t("resetLabel", { label: label.toLowerCase() })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
