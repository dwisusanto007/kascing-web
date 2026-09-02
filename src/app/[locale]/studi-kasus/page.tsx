import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CaseStudyExplorer } from "@/components/studi-kasus/CaseStudyExplorer";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studiKasus" });
  return { title: t("title") };
}

export default async function StudiKasusPage() {
  const t = await getTranslations("studiKasus");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">{t("subtitle")}</p>
      <div className="mt-8">
        <SectionErrorBoundary label={t("errorLabel")}>
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <CaseStudyExplorer />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
