import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { findArticleBySlug, findResearchBySlug, researchPapers } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DownloadPaperButton } from "@/components/riset/DownloadPaperButton";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return researchPapers.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const paper = findResearchBySlug(slug);
  if (paper) return { title: paper.title };
  const t = await getTranslations({ locale, namespace: "riset.detail" });
  return { title: t("notFoundTitle") };
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const paper = findResearchBySlug(slug);
  if (!paper) notFound();

  const t = await getTranslations("riset.detail");
  const tNav = await getTranslations("nav");

  const relatedArticle = paper.relatedArticleSlug ? findArticleBySlug(paper.relatedArticleSlug) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: tNav("riset.label"), href: "/riset" }, { label: paper.title }]} />

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{paper.docType}</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">{paper.commodity}</span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{paper.year}</span>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-stone-900 sm:text-3xl">{paper.title}</h1>
      <p className="mt-2 text-sm text-stone-500">{paper.authors}</p>

      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-stone-900">{t("abstractTitle")}</h2>
        <p className="text-base leading-relaxed text-stone-700">{paper.abstract}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <DownloadPaperButton title={paper.title} fileAvailable={paper.fileAvailable} />
        {relatedArticle && (
          <Link
            href={`/belajar-kascing/${relatedArticle.slug}`}
            className="rounded-full border border-emerald-700 px-5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            {t("simplifiedVersionCta")}
          </Link>
        )}
      </div>
    </div>
  );
}
