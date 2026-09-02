import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { findArticleBySlug, findNewsBySlug, newsItems } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return newsItems.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const news = findNewsBySlug(slug);
  if (news) return { title: news.title };
  const t = await getTranslations({ locale, namespace: "berita.detail" });
  return { title: t("notFoundTitle") };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = findNewsBySlug(slug);
  if (!news) notFound();

  const t = await getTranslations("berita.detail");
  const tNav = await getTranslations("nav");

  const relatedArticle = news.relatedArticleSlug ? findArticleBySlug(news.relatedArticleSlug) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: tNav("berita.label"), href: "/berita" }, { label: news.title }]} />

      <PlaceholderImage label={news.title} hasImage={news.hasImage} imageSrc={news.imageUrl} className="h-56 w-full rounded-xl sm:h-72" />

      <span className="mt-6 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        {news.category}
      </span>
      <h1 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">{news.title}</h1>
      <p className="mt-2 text-sm text-stone-500">
        {formatDate(news.publishedAt)} · {t("sourcePrefix", { source: news.source })}
      </p>

      <div className="prose prose-stone mt-6 flex max-w-none flex-col gap-4">
        {news.content.map((paragraph, i) => (
          <p key={i} className="text-base leading-relaxed text-stone-700">
            {paragraph}
          </p>
        ))}
      </div>

      {relatedArticle && (
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-800">{t("relatedArticlePrompt")}</p>
          <Link
            href={`/belajar-kascing/${relatedArticle.slug}`}
            className="mt-1 inline-block text-sm font-semibold text-emerald-700 hover:underline"
          >
            {t("readGuidePrefix", { title: relatedArticle.title })}
          </Link>
        </div>
      )}

      <div className="mt-10 rounded-xl border border-stone-200 bg-stone-50 p-6">
        <p className="mb-2 text-sm font-semibold text-stone-800">{t("newsletterPrompt")}</p>
        <NewsletterForm compact />
      </div>
    </div>
  );
}
