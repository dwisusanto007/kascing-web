"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { caseStudies } from "@/lib/mock-data";
import { PERSONA_LABEL_KEYS } from "@/lib/types";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { Card } from "@/components/ui/Card";
import { SkeletonCardGrid, SlowLoadingNotice } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function CaseStudyPreview() {
  const t = useTranslations("home.caseStudiesPreview");
  const tCard = useTranslations("studiKasus.card");
  const tPersona = useTranslations("taxonomy.persona");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const debugEmpty = searchParams.get("debugEmpty") === "1";

  const { status, data, isSlow, retry } = useAsyncData(
    () => (debugEmpty ? [] : caseStudies.filter((c) => !c.hidden).slice(0, 3)),
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
      {data.map((c) => (
        <Card
          key={c.id}
          href={`/studi-kasus/${c.slug}`}
          title={c.title}
          excerpt={c.summary}
          tag={tPersona(PERSONA_LABEL_KEYS[c.persona])}
          hasImage={c.hasImage}
          imageSrc={c.imageUrl}
          cta={tCard("cta")}
        />
      ))}
    </div>
  );
}
