"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { caseStudies } from "@/lib/mock-data";
import type { CaseStudy, Persona } from "@/lib/types";
import { PERSONA_LABEL_KEYS } from "@/lib/types";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const PERSONAS: Persona[] = ["hobiis", "perkebunan-besar", "eksportir"];

export function CaseStudyExplorer() {
  const tPersona = useTranslations("taxonomy.persona");
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";
  const initialPersona = searchParams.get("persona") as Persona | null;

  const { status, data, isSlow, retry } = useAsyncData<CaseStudy[]>(
    () => (debugEmpty ? [] : caseStudies),
    [debugEmpty],
  );

  const [activePersona, setActivePersona] = useState<Persona>(
    initialPersona && PERSONAS.includes(initialPersona) ? initialPersona : "hobiis",
  );

  const filtered = useMemo(() => (data ?? []).filter((c) => c.persona === activePersona), [data, activePersona]);

  if (status === "loading") {
    return (
      <div>
        <SkeletonCardGrid count={3} />
        {isSlow && <SlowLoadingNotice />}
      </div>
    );
  }

  if (status === "error") {
    throw new Error("Gagal memuat studi kasus.");
  }

  return (
    <div>
      <div role="tablist" aria-label="Segmentasi persona" className="flex flex-wrap gap-2">
        {PERSONAS.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={activePersona === p}
            onClick={() => setActivePersona(p)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              activePersona === p ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200",
            )}
          >
            {tPersona(PERSONA_LABEL_KEYS[p])}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            variant="no-data"
            title={`Belum ada studi kasus untuk ${tPersona(PERSONA_LABEL_KEYS[activePersona])}`}
            description="Studi kasus untuk segmen ini akan segera hadir."
            actionLabel="Muat ulang"
            onAction={retry}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Card
                key={c.id}
                href={`/studi-kasus/${c.slug}`}
                title={c.title}
                excerpt={c.summary}
                tag={tPersona(PERSONA_LABEL_KEYS[c.persona])}
                hasImage={c.hasImage}
                imageSrc={c.imageUrl}
                cta="Baca studi kasus"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
