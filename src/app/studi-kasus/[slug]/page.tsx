import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, findCaseStudyBySlug, findProducerBySlug, findResearchBySlug } from "@/lib/mock-data";
import { PERSONA_LABELS } from "@/lib/types";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = findCaseStudyBySlug(slug);
  return { title: caseStudy ? caseStudy.title : "Studi kasus tidak ditemukan" };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = findCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  const relatedProducer = caseStudy.relatedProducerSlug ? findProducerBySlug(caseStudy.relatedProducerSlug) : undefined;
  const relatedResearch = caseStudy.relatedResearchSlug ? findResearchBySlug(caseStudy.relatedResearchSlug) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Studi Kasus", href: "/studi-kasus" }, { label: caseStudy.title }]} />

      <PlaceholderImage label={caseStudy.title} hasImage={caseStudy.hasImage} imageSrc={caseStudy.imageUrl} className="h-56 w-full rounded-xl sm:h-72" />

      <span className="mt-6 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        {PERSONA_LABELS[caseStudy.persona]}
      </span>
      <h1 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">{caseStudy.title}</h1>
      <p className="mt-2 text-base text-stone-600">{caseStudy.summary}</p>

      {caseStudy.metrics.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {caseStudy.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs text-stone-400">{m.label}</p>
              <p className="mt-1 text-lg font-semibold text-stone-900">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="prose prose-stone mt-8 flex max-w-none flex-col gap-4">
        {caseStudy.story.map((paragraph, i) => (
          <p key={i} className="text-base leading-relaxed text-stone-700">
            {paragraph}
          </p>
        ))}
      </div>

      {caseStudy.testimonials.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {caseStudy.testimonials.map((t) => (
            <blockquote key={t.name} className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-5">
              <PlaceholderImage label={t.name} className="h-12 w-12 rounded-full" />
              <div>
                <p className="text-sm italic text-stone-700">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-2 text-sm font-medium text-stone-900">
                  {t.name} <span className="font-normal text-stone-400">— {t.role}</span>
                </p>
              </div>
            </blockquote>
          ))}
        </div>
      )}

      {(relatedProducer || relatedResearch) && (
        <div className="mt-10 flex flex-wrap gap-3">
          {relatedProducer && (
            <Link
              href={`/direktori/${relatedProducer.slug}`}
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Lihat Produsen Terkait →
            </Link>
          )}
          {relatedResearch && (
            <Link
              href={`/riset/${relatedResearch.slug}`}
              className="rounded-full border border-emerald-700 px-5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Baca Riset Pendukung →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
