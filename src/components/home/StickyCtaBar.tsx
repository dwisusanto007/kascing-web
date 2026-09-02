"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "kascing:sticky-cta-dismissed";

/**
 * Floating bottom CTA bar, join.com-style. Appears once the hero has
 * scrolled out of view, hides again near the hero and once the full-width
 * CtaBanner at the end of the page is visible (so the two CTAs never
 * compete on screen), and stays dismissed for the rest of the browser
 * session once closed. Looks up the hero and CtaBanner by id rather than
 * via props, so it can be dropped onto the homepage on its own.
 */
export function StickyCtaBar() {
  const t = useTranslations("home.stickyCta");
  const tCommon = useTranslations("common");
  const [pastHero, setPastHero] = useState(false);
  const [nearFooterCta, setNearFooterCta] = useState(false);
  // pastHero is false at mount either way, so `visible` starts false regardless
  // of this value — reading sessionStorage here can't cause a hydration mismatch.
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dismissed) return;

    const hero = document.getElementById("hero");
    const footerCta = document.getElementById("cta-banner");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
        threshold: 0,
      });
      heroObserver.observe(hero);
      observers.push(heroObserver);
    }

    if (footerCta) {
      const footerObserver = new IntersectionObserver(([entry]) => setNearFooterCta(entry.isIntersecting), {
        threshold: 0,
      });
      footerObserver.observe(footerCta);
      observers.push(footerObserver);
    }

    return () => observers.forEach((o) => o.disconnect());
    // Only re-run if `dismissed` was already true at mount (nothing to observe then).
    // Dismissing later shouldn't tear the observers down — `visible` already covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = pastHero && !nearFooterCta && !dismissed;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[92%] max-w-md items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 shadow-lg transition-all duration-300 motion-reduce:transition-none sm:w-auto",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <p className="flex-1 text-sm font-medium text-stone-700">{t("message")}</p>
      <Link
        href="/direktori"
        tabIndex={visible ? 0 : -1}
        className="shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        {tCommon("cariProdusenCta")}
      </Link>
      <button
        type="button"
        onClick={handleDismiss}
        tabIndex={visible ? 0 : -1}
        aria-label={tCommon("tutup")}
        className="shrink-0 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
      >
        ✕
      </button>
    </div>
  );
}
