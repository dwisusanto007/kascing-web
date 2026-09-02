"use client";

import Link from "next/link";

type EmptyStateVariant = "no-results" | "no-data" | "access-denied";

const ICONS: Record<EmptyStateVariant, string> = {
  "no-results": "🔍",
  "no-data": "🌱",
  "access-denied": "🔒",
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  variant = "no-data",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden>
        {ICONS[variant]}
      </span>
      <p className="mt-3 text-base font-semibold text-stone-800">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
