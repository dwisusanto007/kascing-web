"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-stone-200", className)} />;
}

/** Skeleton shaped like Card.tsx: image + title + excerpt + meta row. */
export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
      <SkeletonBlock className="h-36 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-4 w-4/5" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-2/3" />
        <div className="mt-2 flex items-center justify-between">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/** Skeleton shaped like a detail page: hero image + title + paragraphs. */
export function SkeletonDetail() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-5">
      <SkeletonBlock className="h-56 w-full sm:h-72" />
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-7 w-3/4" />
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-2/3" />
      </div>
    </div>
  );
}

/** Skeleton shaped like a form: label + input pairs. */
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
      ))}
      <SkeletonBlock className="h-10 w-32" />
    </div>
  );
}

/** Shown once a loading state has taken longer than the configured timeout. */
export function SlowLoadingNotice() {
  const t = useTranslations("common");
  return (
    <p role="status" className="mt-3 text-center text-sm text-stone-500">
      {t("slowLoading")}
    </p>
  );
}
