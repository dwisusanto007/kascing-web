import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PetaniPadiInteractive, PetaniPadiLegalDocCta } from "@/components/petani-padi/PetaniPadiInteractive";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "untukPetaniPadi.hero" });
  return { title: t("title") };
}

export default async function UntukPetaniPadiPage() {
  const t = await getTranslations("untukPetaniPadi");

  return (
    <div>
      <section className="border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-base text-stone-600">{t("hero.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("intro.title")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{t("intro.description")}</p>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("legalDoc.title")}</h2>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          {t("legalDoc.sampleLabel")}
        </p>
        <p className="mt-3 text-sm text-stone-600">{t("legalDoc.description")}</p>
        <PetaniPadiLegalDocCta />
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("testimonial.title")}</h2>
        <Link
          href="/studi-kasus/kelompok-tani-padi-organik-sertifikasi-kascing"
          className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          {t("testimonial.cta")}
        </Link>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("penyuluh.title")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{t("penyuluh.description")}</p>
      </section>

      <PetaniPadiInteractive />
    </div>
  );
}
