"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { researchPapers } from "@/lib/mock-data";
import type { ResearchPaper } from "@/lib/types";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const DOC_TYPES = ["Jurnal", "White Paper", "Laporan"];

export function ResearchExplorer() {
  const t = useTranslations("riset");
  const tDirektori = useTranslations("direktori");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";
  const initialDocType = searchParams.get("jenis");

  const { status, data, isSlow, retry } = useAsyncData<ResearchPaper[]>(
    () => (debugEmpty ? [] : researchPapers),
    [debugEmpty],
  );

  const commodities = useMemo(
    () => Array.from(new Set((data ?? []).map((r) => r.commodity))),
    [data],
  );
  const years = useMemo(
    () =>
      Array.from(new Set((data ?? []).filter((r) => r.year != null).map((r) => String(r.year)))).sort(
        (a, b) => Number(b) - Number(a),
      ),
    [data],
  );

  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([]);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>(initialDocType ? [initialDocType] : []);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) => {
      const matchCommodity = selectedCommodities.length === 0 || selectedCommodities.includes(r.commodity);
      const matchDocType = selectedDocTypes.length === 0 || selectedDocTypes.includes(r.docType);
      const matchYear = selectedYears.length === 0 || (r.year != null && selectedYears.includes(String(r.year)));
      return matchCommodity && matchDocType && matchYear;
    });
  }, [data, selectedCommodities, selectedDocTypes, selectedYears]);

  function resetAll() {
    setSelectedCommodities([]);
    setSelectedDocTypes([]);
    setSelectedYears([]);
  }

  if (status === "loading") {
    return (
      <div>
        <SkeletonCardGrid count={5} />
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

  const hasActiveFilters = selectedCommodities.length + selectedDocTypes.length + selectedYears.length > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label={tDirektori("filter.komoditas")}
          options={commodities.map((c) => ({ value: c, label: c }))}
          selected={selectedCommodities}
          onChange={setSelectedCommodities}
        />
        <FilterDropdown
          label={t("filter.jenisDokumen")}
          options={DOC_TYPES.map((d) => ({ value: d, label: d }))}
          selected={selectedDocTypes}
          onChange={setSelectedDocTypes}
        />
        <FilterDropdown
          label={t("filter.tahun")}
          options={years.map((y) => ({ value: y, label: y }))}
          selected={selectedYears}
          onChange={setSelectedYears}
        />
        {hasActiveFilters && (
          <button type="button" onClick={resetAll} className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100">
            {tCommon("resetSemuaFilter")}
          </button>
        )}
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            variant="no-results"
            title={t("empty.noResults.title")}
            description={t("empty.noResults.description")}
            actionLabel={tCommon("resetFilter")}
            onAction={resetAll}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <Card
                key={r.id}
                href={`/riset/${r.slug}`}
                title={r.title}
                excerpt={r.abstract}
                meta={r.year != null ? `${r.docType} · ${r.year}` : r.docType}
                tag={r.commodity}
                hasImage={false}
                cta={t("card.cta")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
