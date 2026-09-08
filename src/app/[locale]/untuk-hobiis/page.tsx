import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HobiisMarketplaceCta, HobiisWhatsappCta } from "@/components/hobiis/HobiisCtaButtons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "untukHobiis.hero" });
  return { title: t("title") };
}

export default async function UntukHobiisPage() {
  const t = await getTranslations("untukHobiis");

  const COMPARISON_ITEMS = ["kascing", "kompos", "kimia"] as const;

  return (
    <div>
      <section className="border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-base text-stone-600">{t("hero.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("comparison.title")}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COMPARISON_ITEMS.map((key) => (
            <div
              key={key}
              className={`rounded-xl border p-5 ${
                key === "kascing" ? "border-emerald-300 bg-emerald-50" : "border-stone-200 bg-white"
              }`}
            >
              <h3 className="font-bold text-stone-900">{t(`comparison.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(`comparison.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("testimonial.title")}</h2>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          {t("testimonial.sampleLabel")}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-medium text-stone-400">{t("testimonial.before")}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-medium text-emerald-700">{t("testimonial.after")}</p>
          </div>
        </div>
      </section>

      <section className="bg-emerald-700">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{t("starterPack.title")}</h2>
          <p className="mt-2 text-emerald-50">{t("starterPack.description")}</p>
          <p className="mt-1 text-xs text-emerald-100">{t("starterPack.priceLabel")}</p>
          <div className="mt-6 flex justify-center">
            <HobiisMarketplaceCta />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("waCta.title")}</h2>
        <p className="mt-2 text-sm text-stone-600">{t("waCta.description")}</p>
        <div className="mt-6 flex justify-center">
          <HobiisWhatsappCta />
        </div>
      </section>
    </div>
  );
}
