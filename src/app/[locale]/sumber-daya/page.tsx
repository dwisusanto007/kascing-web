import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Calculator } from "@/components/sumber-daya/Calculator";
import { DownloadList } from "@/components/sumber-daya/DownloadList";
import { Accordion } from "@/components/ui/Accordion";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { faqItems } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sumberDaya" });
  return { title: t("title") };
}

export default async function SumberDayaPage() {
  const t = await getTranslations("sumberDaya");
  const tNav = await getTranslations("nav");
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">{t("subtitle")}</p>

      <section id="kalkulator" className="mt-10 scroll-mt-24 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">{tNav("sumberDaya.children.kalkulator.label")}</h2>
        <p className="mt-1 text-sm text-stone-500">{t("kalkulator.description")}</p>
        <div className="mt-6">
          <SectionErrorBoundary label={t("kalkulator.errorLabel")}>
            <Calculator />
          </SectionErrorBoundary>
        </div>
      </section>

      <section id="unduhan" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold text-stone-900">{tNav("sumberDaya.children.unduhan.label")}</h2>
        <p className="mt-1 text-sm text-stone-500">{t("unduhan.description")}</p>
        <div className="mt-6">
          <SectionErrorBoundary label={t("unduhan.errorLabel")}>
            <DownloadList />
          </SectionErrorBoundary>
        </div>
      </section>

      <section id="faq" className="mt-10 scroll-mt-24 pb-10">
        <h2 className="text-lg font-semibold text-stone-900">{t("faqTitle")}</h2>
        <div className="mt-6">
          <Accordion items={faqItems} />
        </div>
      </section>
    </div>
  );
}
