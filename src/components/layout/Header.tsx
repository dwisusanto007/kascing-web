"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close menus on route change — adjusted synchronously during render
  // (React's recommended pattern for resetting state when an input changes)
  // instead of in an Effect.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-emerald-800">
          <span className="text-lg">Vermicompost.id</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const hasChildren = !!item.children?.length;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasChildren && setOpenMenu(item.label)}
                onMouseLeave={() => hasChildren && setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  onFocus={() => hasChildren && setOpenMenu(item.label)}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={hasChildren ? openMenu === item.label : undefined}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition",
                    active ? "text-emerald-700" : "text-stone-600 hover:text-emerald-700",
                  )}
                >
                  {item.label}
                  {hasChildren && (
                    <span aria-hidden className="text-xs">
                      ▾
                    </span>
                  )}
                </Link>
                {hasChildren && openMenu === item.label && (
                  <div className="absolute left-0 top-full w-72 rounded-xl border border-stone-200 bg-white p-2 shadow-lg">
                    {item.description && (
                      <p className="border-b border-stone-100 px-3 pb-2 pt-1 text-xs text-stone-400">{item.description}</p>
                    )}
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <span className="block font-medium">{child.label}</span>
                        {child.description && (
                          <span className="block text-xs text-stone-400">{child.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link
            href="/direktori"
            className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Cari Produsen
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Buka menu navigasi"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 text-stone-600 lg:hidden"
        >
          <span aria-hidden>{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && (
        <nav aria-label="Navigasi mobile" className="border-t border-stone-200 bg-white px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              const hasChildren = !!item.children?.length;
              const expanded = mobileExpanded === item.label;
              return (
                <li key={item.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex-1 rounded-md px-2 py-2 text-sm font-medium",
                        active ? "text-emerald-700" : "text-stone-700",
                      )}
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        aria-label={`Buka submenu ${item.label}`}
                        aria-expanded={expanded}
                        onClick={() => setMobileExpanded(expanded ? null : item.label)}
                        className="px-2 py-2 text-stone-400"
                      >
                        <span aria-hidden className={cn("inline-block transition-transform", expanded && "rotate-180")}>
                          ▾
                        </span>
                      </button>
                    )}
                  </div>
                  {hasChildren && expanded && (
                    <ul className="ml-3 flex flex-col gap-1 border-l border-stone-200 pl-3">
                      {item.children!.map((child) => (
                        <li key={child.label}>
                          <Link href={child.href} className="block rounded-md px-2 py-1.5 text-sm text-stone-500 hover:text-emerald-700">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href="/direktori"
            className="mt-3 block rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Cari Produsen
          </Link>
        </nav>
      )}
    </header>
  );
}
