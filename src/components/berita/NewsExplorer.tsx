"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newsItems } from "@/lib/mock-data";
import type { NewsItem } from "@/lib/types";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

const CATEGORIES = ["Industri", "Riset Update", "Press Release"];

export function NewsExplorer() {
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";
  const initialCategory = searchParams.get("kategori");

  const { status, data, isSlow, retry } = useAsyncData<NewsItem[]>(
    () =>
      debugEmpty
        ? []
        : [...newsItems].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [debugEmpty],
  );

  const [categories, setCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (categories.length === 0) return data;
    return data.filter((n) => categories.includes(n.category));
  }, [data, categories]);

  if (status === "loading") {
    return (
      <div>
        <SkeletonCardGrid count={6} />
        {isSlow && <SlowLoadingNotice />}
      </div>
    );
  }

  if (status === "error") {
    throw new Error("Gagal memuat daftar berita.");
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="Belum ada berita"
        description="Berita dan artikel terbaru akan segera tampil di sini."
        actionLabel="Muat ulang"
        onAction={retry}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Kategori"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          selected={categories}
          onChange={setCategories}
        />
        {categories.length > 0 && (
          <button
            type="button"
            onClick={() => setCategories([])}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
          >
            Reset kategori
          </button>
        )}
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            variant="no-results"
            title="Belum ada berita di kategori ini"
            actionLabel="Reset kategori"
            onAction={() => setCategories([])}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((n) => (
              <Card
                key={n.id}
                href={`/berita/${n.slug}`}
                title={n.title}
                excerpt={n.excerpt}
                meta={formatDate(n.publishedAt)}
                tag={n.category}
                hasImage={n.hasImage}
                imageSrc={n.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
