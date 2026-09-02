"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { producers, PROVINCES, PRODUCTS_LIST, CERTIFICATIONS_LIST, COMMODITIES_LIST } from "@/lib/mock-data";
import type { Producer } from "@/lib/types";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { hashString } from "@/lib/utils";

const PAGE_SIZE = 6;

export function DirectoryExplorer() {
  const t = useTranslations("direktori");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";

  const CAPACITY_OPTIONS = [
    { value: "kecil", label: t("capacity.kecil") },
    { value: "menengah", label: t("capacity.menengah") },
    { value: "besar", label: t("capacity.besar") },
  ];

  const { status, data, isSlow, retry } = useAsyncData<Producer[]>(
    () => (debugEmpty ? [] : producers),
    [debugEmpty],
  );

  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [capacities, setCapacities] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [commodities, setCommodities] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "map">("list");
  const [page, setPage] = useState(1);

  const hasActiveFilters =
    provinces.length + products.length + capacities.length + certifications.length + commodities.length > 0 ||
    search.trim().length > 0;

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        p.city.toLowerCase().includes(search.trim().toLowerCase());
      const matchesProvince = provinces.length === 0 || provinces.includes(p.province);
      const matchesProducts = products.length === 0 || products.some((prod) => p.products.includes(prod));
      const matchesCapacity = capacities.length === 0 || capacities.includes(p.capacity);
      const matchesCert = certifications.length === 0 || certifications.some((c) => p.certifications.includes(c));
      const matchesCommodity = commodities.length === 0 || commodities.some((c) => p.commodities.includes(c));
      return matchesSearch && matchesProvince && matchesProducts && matchesCapacity && matchesCert && matchesCommodity;
    });
  }, [data, search, provinces, products, capacities, certifications, commodities]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  function resetFilters() {
    setSearch("");
    setProvinces([]);
    setProducts([]);
    setCapacities([]);
    setCertifications([]);
    setCommodities([]);
    setPage(1);
  }

  function withReset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

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

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="directory-search" className="sr-only">
              {t("search.label")}
            </label>
            <input
              id="directory-search"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("search.placeholder")}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex overflow-hidden rounded-lg border border-stone-300 text-sm">
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={view === "list" ? "bg-emerald-700 px-3 py-2 text-white" : "bg-white px-3 py-2 text-stone-600"}
            >
              {t("view.list")}
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              aria-pressed={view === "map"}
              className={view === "map" ? "bg-emerald-700 px-3 py-2 text-white" : "bg-white px-3 py-2 text-stone-600"}
            >
              {t("view.map")}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label={t("filter.lokasi")}
            options={PROVINCES.map((p) => ({ value: p, label: p }))}
            selected={provinces}
            onChange={withReset(setProvinces)}
          />
          <FilterDropdown
            label={t("filter.jenisProduk")}
            options={PRODUCTS_LIST.map((p) => ({ value: p, label: p }))}
            selected={products}
            onChange={withReset(setProducts)}
          />
          <FilterDropdown
            label={t("filter.kapasitas")}
            options={CAPACITY_OPTIONS}
            selected={capacities}
            onChange={withReset(setCapacities)}
          />
          <FilterDropdown
            label={t("filter.sertifikasi")}
            options={CERTIFICATIONS_LIST.map((c) => ({ value: c, label: c }))}
            selected={certifications}
            onChange={withReset(setCertifications)}
          />
          <FilterDropdown
            label={t("filter.komoditas")}
            options={COMMODITIES_LIST.map((c) => ({ value: c, label: c }))}
            selected={commodities}
            onChange={withReset(setCommodities)}
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
            >
              {tCommon("resetSemuaFilter")}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-stone-500">{t("resultsCount", { count: filtered.length })}</p>

      <div className="mt-4">
        {data && data.length === 0 ? (
          <EmptyState
            variant="no-data"
            title={t("empty.noData.title")}
            description={t("empty.noData.description")}
            actionLabel={tCommon("muatUlang")}
            onAction={retry}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            variant="no-results"
            title={t("empty.noResults.title")}
            description={t("empty.noResults.description")}
            actionLabel={tCommon("resetFilter")}
            onAction={resetFilters}
          />
        ) : view === "list" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((p) => (
              <Card
                key={p.id}
                href={`/direktori/${p.slug}`}
                title={p.name}
                excerpt={p.description}
                meta={`${p.city}, ${p.province}`}
                tag={p.capacityLabel}
                hasImage={p.hasImage}
                imageSrc={p.imageUrl}
                cta={t("card.cta")}
              />
            ))}
          </div>
        ) : (
          <div className="relative h-[420px] overflow-hidden rounded-xl border border-stone-200 bg-emerald-50">
            <p className="absolute left-3 top-3 z-10 rounded-md bg-white/90 px-2 py-1 text-xs text-stone-500">
              {t("map.disclaimer")}
            </p>
            {filtered.map((p) => {
              const h = hashString(p.id);
              const left = 8 + (h % 84);
              const top = 16 + ((h >> 4) % 76);
              return (
                <a
                  key={p.id}
                  href={`/direktori/${p.slug}`}
                  title={`${p.name} — ${p.city}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full text-emerald-700 hover:scale-110"
                >
                  <span aria-hidden className="text-2xl drop-shadow">
                    📍
                  </span>
                  <span className="sr-only">{p.name}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {view === "list" && filtered.length > 0 && (
        <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
      )}
    </div>
  );
}
