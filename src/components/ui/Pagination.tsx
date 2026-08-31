"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Navigasi halaman" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Sebelumnya
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={
            p === page
              ? "h-8 w-8 rounded-lg bg-emerald-700 text-sm font-medium text-white"
              : "h-8 w-8 rounded-lg text-sm text-stone-600 hover:bg-stone-100"
          }
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Berikutnya →
      </button>
    </nav>
  );
}
