import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonForm } from "@/components/ui/Skeleton";
import { RegistrationForm } from "@/components/direktori/RegistrationForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "direktori.daftar" });
  return { title: t("metaTitle") };
}

export default async function DaftarProdusenPage() {
  const t = await getTranslations("direktori.daftar");
  const tNav = await getTranslations("nav");
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: tNav("direktori.label"), href: "/direktori" }, { label: t("breadcrumbLabel") }]} />
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-stone-500">{t("subtitle")}</p>
      <div className="mt-8">
        <SectionErrorBoundary label={t("errorLabel")}>
          <Suspense fallback={<SkeletonForm fields={5} />}>
            <RegistrationForm />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
