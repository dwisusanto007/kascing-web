"use client";

import { useSearchParams } from "next/navigation";
import { producers } from "@/lib/mock-data";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function DirectoryPreview() {
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";

  const { status, data, isSlow, retry } = useAsyncData(
    () => (debugEmpty ? [] : producers.slice(0, 3)),
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
    throw new Error("Gagal memuat preview direktori produsen.");
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="Belum ada produsen terdaftar"
        description="Produsen kascing di sekitar kamu akan segera tampil di sini."
        actionLabel="Muat ulang"
        onAction={retry}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => (
        <Card
          key={p.id}
          href={`/direktori/${p.slug}`}
          title={p.name}
          excerpt={p.description}
          meta={`${p.city}, ${p.province}`}
          tag={p.capacityLabel}
          hasImage={p.hasImage}
          imageSrc={p.imageUrl}
          cta="Lihat profil"
        />
      ))}
    </div>
  );
}
