import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";
import { HighlightSection } from "@/components/home/HighlightSection";
import { CaseStudyPreview } from "@/components/home/CaseStudyPreview";
import { DirectoryPreview } from "@/components/home/DirectoryPreview";
import { ProductPreview } from "@/components/home/ProductPreview";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { StatsStrip } from "@/components/home/StatsStrip";
import { CtaBanner } from "@/components/home/CtaBanner";
import { PersonaCarousel } from "@/components/home/PersonaCarousel";
import { ScrollStorySection } from "@/components/home/ScrollStorySection";
import { StickyCtaBar } from "@/components/home/StickyCtaBar";
import { PERSONA_LABEL_KEYS } from "@/lib/types";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tPersona = await getTranslations("taxonomy.persona");

  const STORY_POINTS = [
    {
      title: t("story.directory.title"),
      description: t("story.directory.description"),
      imageSrc: "/images/story-directory.jpg",
    },
    {
      title: t("story.data.title"),
      description: t("story.data.description"),
      imageSrc: "/images/story-data-check.jpg",
    },
    {
      title: t("story.news.title"),
      description: t("story.news.description"),
      imageSrc: "/images/news-stack.jpg",
    },
  ];

  const PERSONAS = [
    {
      persona: "hobiis" as const,
      title: tPersona(PERSONA_LABEL_KEYS.hobiis),
      description: t("personas.hobiis.description"),
      href: "/belajar-kascing?kategori=Pemula",
    },
    {
      persona: "perkebunan-besar" as const,
      title: tPersona(PERSONA_LABEL_KEYS["perkebunan-besar"]),
      description: t("personas.perkebunanBesar.description"),
      href: "/belajar-kascing?kategori=Perkebunan+Besar",
    },
    {
      persona: "eksportir" as const,
      title: tPersona(PERSONA_LABEL_KEYS.eksportir),
      description: t("personas.eksportir.description"),
      href: "/belajar-kascing?kategori=Eksportir",
    },
  ];

  return (
    <div>
      <StickyCtaBar />

      {/* Hero */}
      <section id="hero" className="border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 max-w-xl text-base text-stone-600">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/belajar-kascing"
                className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                {t("hero.ctaPrimary")}
              </Link>
              <Link
                href="/direktori"
                className="rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
          <PlaceholderImage
            label={t("hero.imageLabel")}
            imageSrc="/images/hero-kascing.jpg"
            className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-96"
          />
        </div>
      </section>

      <StatsStrip />

      {/* 01 — Persona entry points */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading number="01" title={t("sections.personas.title")} />
        <PersonaCarousel ariaLabel={t("sections.personas.ariaLabel")}>
          {PERSONAS.map((p) => (
            <Link
              key={p.persona}
              href={p.href}
              className="group flex h-full flex-col rounded-xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {tPersona(PERSONA_LABEL_KEYS[p.persona])}
              </span>
              <h3 className="mt-3 font-bold text-stone-900 group-hover:text-emerald-700">{p.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{p.description}</p>
              <span className="mt-auto pt-4 text-sm font-medium text-emerald-700">{t("personas.ctaLabel")}</span>
            </Link>
          ))}
        </PersonaCarousel>
      </section>

      {/* 02 — Scroll-driven value proposition story */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading number="02" title={t("sections.story.title")} />
        <SectionErrorBoundary label={t("sections.story.errorLabel")}>
          <ScrollStorySection points={STORY_POINTS} />
        </SectionErrorBoundary>
      </section>

      {/* 03 — Feature/category grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          number="03"
          title={t("sections.features.title")}
          subtitle={t("sections.features.subtitle")}
        />
        <FeatureGrid />
      </section>

      {/* 04 — Highlight artikel & berita */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading number="04" title={t("sections.highlights.title")} />
        <SectionErrorBoundary label={t("sections.highlights.errorLabel")}>
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <HighlightSection />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      {/* 05 — Studi kasus preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading number="05" title={t("sections.caseStudies.title")} action={{ label: tCommon("lihatSemua"), href: "/studi-kasus" }} />
        <SectionErrorBoundary label={t("sections.caseStudies.errorLabel")}>
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <CaseStudyPreview />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      {/* 06 — Direktori preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          number="06"
          title={t("sections.directory.title")}
          action={{ label: tCommon("lihatSemua"), href: "/direktori" }}
        />
        <SectionErrorBoundary label={t("sections.directory.errorLabel")}>
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <DirectoryPreview />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      {/* 07 — Produk affiliate preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          number="07"
          title={t("sections.produk.title")}
          action={{ label: tCommon("lihatSemua"), href: "/produk" }}
        />
        <SectionErrorBoundary label={t("sections.produk.errorLabel")}>
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <ProductPreview />
          </Suspense>
        </SectionErrorBoundary>
      </section>

      <CtaBanner />
    </div>
  );
}
