"use client";

import { useSearchParams } from "next/navigation";
import { caseStudies } from "@/lib/mock-data";
import { PERSONA_LABELS } from "@/lib/types";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function CaseStudyPreview() {
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";

  const { status, data, isSlow, retry } = useAsyncData(
    () => (debugEmpty ? [] : caseStudies.slice(0, 3)),
    [debugEmpty],
  );

  if (status === "loading") {
    return (
      <div>
        <SkeletonCardGrid count={3} />
        {isSlow && <SlowLoadingNotice />}
      </div>
    );
  }

  if (status === "error") {
    throw new Error("Gagal memuat preview studi kasus.");
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="Belum ada studi kasus"
        description="Studi kasus dari berbagai persona akan segera hadir."
        actionLabel="Muat ulang"
        onAction={retry}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((c) => (
        <Card
          key={c.id}
          href={`/studi-kasus/${c.slug}`}
          title={c.title}
          excerpt={c.summary}
          tag={PERSONA_LABELS[c.persona]}
          hasImage={c.hasImage}
          imageSrc={c.imageUrl}
          cta="Baca studi kasus"
        />
      ))}
    </div>
  );
}
