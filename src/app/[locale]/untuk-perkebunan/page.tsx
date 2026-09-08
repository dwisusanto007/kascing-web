import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PerkebunanInteractive } from "@/components/perkebunan/PerkebunanInteractive";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "untukPerkebunan.hero" });
  return { title: t("title") };
}

export default async function UntukPerkebunanPage() {
  const t = await getTranslations("untukPerkebunan");

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

      <PerkebunanInteractive />
    </div>
  );
}
