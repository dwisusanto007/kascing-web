import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  number: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: { label: string; href: string };
}

/**
 * Numbered section heading (01, 02, ...) used to break the page into
 * labeled sections, join.com-style. Keep numbering consistent (increasing,
 * no gaps) wherever this pattern is reused on a page.
 */
export function SectionHeading({ number, title, subtitle, align = "left", action }: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", align === "center" && "sm:flex-col sm:items-center sm:text-center")}>
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-700">
            {number}
          </span>
          <span className="h-px w-12 bg-emerald-200" aria-hidden />
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action && (
        <a href={action.href} className="shrink-0 text-sm font-semibold text-emerald-700 hover:underline">
          {action.label} →
        </a>
      )}
    </div>
  );
}
