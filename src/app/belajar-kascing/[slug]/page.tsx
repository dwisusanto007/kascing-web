import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, findArticleBySlug } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TOC_THRESHOLD = 3;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticleBySlug(slug);
  return { title: article ? article.title : "Artikel tidak ditemukan" };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = findArticleBySlug(slug);
  if (!article) notFound();

  const related = article.relatedSlugs
    .map((s) => findArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => !!a);
  const showToc = article.content.length > TOC_THRESHOLD;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Belajar Kascing", href: "/belajar-kascing" },
          { label: article.title },
        ]}
      />

      <PlaceholderImage label={article.title} hasImage={article.hasImage} className="h-56 w-full rounded-xl sm:h-72" />

      <span className="mt-6 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        {article.category}
      </span>
      <h1 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">{article.title}</h1>
      <p className="mt-2 text-sm text-stone-500">
        {formatDate(article.publishedAt)} · {article.readingTimeMin} menit baca
      </p>

      {showToc && (
        <nav aria-label="Daftar isi" className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-stone-800">Daftar Isi</p>
          <ol className="flex flex-col gap-1">
            {article.content.map((_, i) => (
              <li key={i}>
                <a href={`#bagian-${i + 1}`} className="text-emerald-700 hover:underline">
                  Bagian {i + 1}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="prose prose-stone mt-6 flex max-w-none flex-col gap-4">
        {article.content.map((paragraph, i) => (
          <p key={i} id={`bagian-${i + 1}`} className="scroll-mt-24 text-base leading-relaxed text-stone-700">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {related[0] ? (
          <Link
            href={`/belajar-kascing/${related[0].slug}`}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Baca Lanjut →
          </Link>
        ) : null}
        <Link
          href="/direktori"
          className="rounded-lg border border-emerald-700 px-5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Cari Produsen
        </Link>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">Artikel Terkait</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {related.map((a) => (
              <Card
                key={a.id}
                href={`/belajar-kascing/${a.slug}`}
                title={a.title}
                excerpt={a.excerpt}
                meta={formatDate(a.publishedAt)}
                tag={a.category}
                hasImage={a.hasImage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
