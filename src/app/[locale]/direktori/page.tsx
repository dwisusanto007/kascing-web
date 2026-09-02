import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DirectoryExplorer } from "@/components/direktori/DirectoryExplorer";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "direktori" });
  return { title: t("title") };
}

export default async function DirektoriPage() {
  const t = await getTranslations("direktori");
  const tNav = await getTranslations("nav");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-500">{t("subtitle")}</p>
        </div>
        <Link
          href="/direktori/daftar"
          className="shrink-0 rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          {tNav("direktori.children.daftar.label")}
        </Link>
      </div>

      <div className="mt-8">
        <SectionErrorBoundary label={t("errorLabel")}>
          <Suspense fallback={<SkeletonCardGrid count={6} />}>
            <DirectoryExplorer />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
