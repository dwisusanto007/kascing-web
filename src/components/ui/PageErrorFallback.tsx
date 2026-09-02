"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface PageErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  label?: string;
}

const MAX_ATTEMPTS = 3;

/**
 * Shared UI for Next.js route-level `error.tsx` boundaries. Tracks retry
 * attempts so hammering "Coba lagi" on the same broken page does not retry
 * forever; the counter resets whenever a new error instance is thrown.
 */
export function PageErrorFallback({ error, reset, label }: PageErrorFallbackProps) {
  const t = useTranslations("errors.pageFallback");
  const tCommon = useTranslations("common");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    console.error("[PageErrorBoundary]", error);
  }, [error]);

  const exhausted = attempts >= MAX_ATTEMPTS;

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-4xl" aria-hidden>
        ⚠️
      </span>
      <h1 className="mt-4 text-xl font-semibold text-stone-900">
        {label ? t("titleWithLabel", { label }) : t("titleGeneric")}
      </h1>
      <p className="mt-2 text-sm text-stone-500">{t("description")}</p>
      {process.env.NODE_ENV === "development" && (
        <p className="mt-2 max-w-full overflow-x-auto rounded bg-stone-100 p-2 text-left text-xs text-stone-500">
          {error.message}
        </p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setAttempts((a) => a + 1);
            reset();
          }}
          disabled={exhausted}
          className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tCommon("cobaLagi")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          {tCommon("kembaliKeBeranda")}
        </Link>
      </div>
    </div>
  );
}
