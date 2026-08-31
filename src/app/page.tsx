import { Suspense } from "react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";
import { HighlightSection } from "@/components/home/HighlightSection";
import { CaseStudyPreview } from "@/components/home/CaseStudyPreview";
import { DirectoryPreview } from "@/components/home/DirectoryPreview";
import { PERSONA_LABELS } from "@/lib/types";

const PERSONAS = [
  {
    persona: "hobiis" as const,
    title: "Hobiis",
    description: "Baru mulai atau hobi tanaman hias? Pelajari dasar-dasar kascing untuk halaman rumahmu.",
    href: "/belajar-kascing?kategori=Pemula",
  },
  {
    persona: "perkebunan-besar" as const,
    title: "Perkebunan Besar",
    description: "Tingkatkan produktivitas lahan luas dengan strategi kascing berbasis data.",
    href: "/belajar-kascing?kategori=Perkebunan+Besar",
  },
  {
    persona: "eksportir" as const,
    title: "Eksportir",
    description: "Penuhi standar mutu organik untuk pasar ekspor dengan kascing bersertifikat.",
    href: "/belajar-kascing?kategori=Eksportir",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Pupuk Organik Kascing untuk Pertanian yang Lebih Subur
            </h1>
            <p className="mt-4 max-w-xl text-base text-stone-600">
              Kascing.id membantu hobiis, perkebunan besar, hingga eksportir memahami manfaat kascing dan
              menemukan produsen terpercaya di seluruh Indonesia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/belajar-kascing"
                className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Mulai Belajar
              </Link>
              <Link
                href="/direktori"
                className="rounded-lg border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Cari Produsen Terdekat
              </Link>
            </div>
          </div>
          <PlaceholderImage
            label="Hero Kascing"
            className="h-64 w-full rounded-2xl sm:h-80 lg:h-96"
          />
        </div>
      </section>

      {/* Persona entry points */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Mulai Sesuai Kebutuhanmu</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <Link
              key={p.persona}
              href={p.href}
              className="group flex flex-col rounded-xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {PERSONA_LABELS[p.persona]}
              </span>
              <h3 className="mt-3 font-semibold text-stone-900 group-hover:text-emerald-700">{p.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{p.description}</p>
              <span className="mt-auto pt-4 text-sm font-medium text-emerald-700">Pelajari lebih lanjut →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlight artikel & berita */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Edukasi & Kabar Terbaru</h2>
        <div className="mt-6">
          <SectionErrorBoundary label="artikel & berita terbaru">
            <Suspense fallback={<SkeletonCardGrid count={3} />}>
              <HighlightSection />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </section>

      {/* Studi kasus preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Studi Kasus</h2>
          <Link href="/studi-kasus" className="text-sm font-medium text-emerald-700 hover:underline">
            Lihat semua →
          </Link>
        </div>
        <SectionErrorBoundary label="preview studi kasus">
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <CaseStudyPreview />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      {/* Direktori preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Direktori Produsen</h2>
          <Link href="/direktori" className="text-sm font-medium text-emerald-700 hover:underline">
            Lihat semua →
          </Link>
        </div>
        <SectionErrorBoundary label="preview direktori produsen">
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <DirectoryPreview />
          </Suspense>
        </SectionErrorBoundary>
      </section>
    </div>
  );
}
