import { getTranslations } from "next-intl/server";
import { articles, caseStudies, producers, researchPapers } from "@/lib/mock-data";

/**
 * "Trusted by" style social-proof strip. We don't have real partner logos to
 * show, so this uses aggregate counts from our own content instead — the
 * card's breakdown explicitly allows "jumlah artikel/direktori" as an
 * alternative to logos. The whole strip hides itself if there's nothing to
 * show, per the card's empty-state test scenario.
 */
export async function StatsStrip() {
  const t = await getTranslations("home.stats");

  const stats = [
    { label: t("produsen"), value: producers.length },
    { label: t("artikel"), value: articles.length },
    { label: t("riset"), value: researchPapers.length },
    { label: t("studiKasus"), value: caseStudies.length },
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <div className="border-y border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-extrabold text-emerald-700">{s.value}+</p>
            <p className="mt-1 text-sm text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
