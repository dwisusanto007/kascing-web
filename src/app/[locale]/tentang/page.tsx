import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("tentang.label") };
}

export default async function TentangPage() {
  const t = await getTranslations("tentang.comingSoon");
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <span className="text-4xl" aria-hidden>
        🚧
      </span>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-2 text-sm text-stone-500">{t("description")}</p>
    </div>
  );
}
