import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { affiliateProducts, findAffiliateProductBySlug, findProducerBySlug } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return affiliateProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = findAffiliateProductBySlug(slug);
  if (product) return { title: product.name };
  const t = await getTranslations({ locale, namespace: "produk.detail" });
  return { title: t("notFoundTitle") };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = findAffiliateProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("produk.detail");
  const tNav = await getTranslations("nav");
  const relatedProducer = product.producerSlug ? findProducerBySlug(product.producerSlug) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: tNav("produk.label"), href: "/produk" }, { label: product.name }]} />

      <PlaceholderImage
        label={product.name}
        hasImage={product.hasImage}
        imageSrc={product.imageUrl}
        className="h-56 w-full rounded-xl sm:h-72"
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{product.category}</span>
        {product.price && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">{product.price}</span>
        )}
      </div>

      <h1 className="mt-4 text-2xl font-bold text-stone-900 sm:text-3xl">{product.name}</h1>
      <p className="mt-2 text-sm text-stone-500">{t("marketplaceLabel", { marketplace: product.marketplace })}</p>

      <div className="mt-6">
        <p className="text-base leading-relaxed text-stone-700">{product.description}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={product.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {t("buyButtonPrefix", { marketplace: product.marketplace })} →
        </a>
      </div>

      {relatedProducer && (
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-800">{t("fromProducerPrompt")}</p>
          <Link
            href={`/direktori/${relatedProducer.slug}`}
            className="mt-1 inline-block text-sm font-semibold text-emerald-700 hover:underline"
          >
            {relatedProducer.name} →
          </Link>
        </div>
      )}
    </div>
  );
}
