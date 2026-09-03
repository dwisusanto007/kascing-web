"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { affiliateProducts, PRODUCTS_LIST } from "@/lib/mock-data";
import type { AffiliateProduct } from "@/lib/types";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProductExplorer() {
  const t = useTranslations("produk");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";
  const initialCategory = searchParams.get("kategori");

  const { status, data, isSlow, retry } = useAsyncData<AffiliateProduct[]>(
    () => (debugEmpty ? [] : affiliateProducts),
    [debugEmpty],
  );

  const [categories, setCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (categories.length === 0) return data;
    return data.filter((p) => categories.includes(p.category));
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
    throw new Error(t("errorMessage"));
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title={t("empty.noData.title")}
        description={t("empty.noData.description")}
        actionLabel={tCommon("muatUlang")}
        onAction={retry}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label={t("filter.kategori")}
          options={PRODUCTS_LIST.map((c) => ({ value: c, label: c }))}
          selected={categories}
          onChange={setCategories}
        />
        {categories.length > 0 && (
          <button
            type="button"
            onClick={() => setCategories([])}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
          >
            {tCommon("resetKategori")}
          </button>
        )}
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            variant="no-results"
            title={t("empty.noResults.title")}
            description={t("empty.noResults.description")}
            actionLabel={tCommon("resetKategori")}
            onAction={() => setCategories([])}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Card
                key={p.id}
                href={`/produk/${p.slug}`}
                title={p.name}
                excerpt={p.description}
                meta={p.marketplace}
                tag={p.category}
                hasImage={p.hasImage}
                imageSrc={p.imageUrl}
                cta={t("card.cta")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
