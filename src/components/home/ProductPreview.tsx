"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { affiliateProducts } from "@/lib/mock-data";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProductPreview() {
  const t = useTranslations("home.productPreview");
  const tCard = useTranslations("produk");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";

  const { status, data, isSlow, retry } = useAsyncData(
    () => (debugEmpty ? [] : affiliateProducts.slice(0, 3)),
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
    throw new Error(t("errorMessage"));
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title={t("empty.title")}
        description={t("empty.description")}
        actionLabel={tCommon("muatUlang")}
        onAction={retry}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => (
        <Card
          key={p.id}
          href={`/produk/${p.slug}`}
          title={p.name}
          excerpt={p.description}
          meta={p.marketplace}
          tag={p.category}
          hasImage={p.hasImage}
          imageSrc={p.imageUrl}
          cta={tCard("card.cta")}
        />
      ))}
    </div>
  );
}
