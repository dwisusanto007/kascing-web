"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** EN/ID toggle. Switches locale for the current page without resetting to the homepage. */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-300 p-0.5 text-xs font-semibold">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition",
            loc === locale ? "bg-emerald-700 text-white" : "text-stone-500 hover:text-emerald-700",
          )}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
