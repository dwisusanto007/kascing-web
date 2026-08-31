import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findArticleBySlug, findProducerBySlug, producers } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Card } from "@/components/ui/Card";
import { ReadMore } from "@/components/ui/ReadMore";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function generateStaticParams() {
  return producers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const producer = findProducerBySlug(slug);
  if (!producer) return { title: "Produsen tidak ditemukan" };
  return { title: producer.name };
}

export default async function ProducerProfilePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const producer = findProducerBySlug(slug);

  if (!producer) notFound();

  const debugNoContact = sp.debugNoContact === "1";
  const contact = debugNoContact ? {} : producer.contact;
  const hasContact = !!(contact.whatsapp || contact.phone || contact.email);

  const relatedArticle = producer.relatedArticleSlug ? findArticleBySlug(producer.relatedArticleSlug) : undefined;
  const relatedProducers = producers
    .filter((p) => p.id !== producer.id && p.province === producer.province)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Direktori", href: "/direktori" },
          { label: producer.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PlaceholderImage label={producer.name} hasImage={producer.hasImage} className="h-56 w-full rounded-xl sm:h-72" />

          <h1 className="mt-6 text-2xl font-bold text-stone-900 sm:text-3xl">{producer.name}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {producer.city}, {producer.province} · {producer.address}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Kapasitas: {producer.capacityLabel}
            </span>
            {producer.certifications.map((c) => (
              <span key={c} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                {c}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-stone-900">Tentang Produsen</h2>
            <ReadMore text={producer.longDescription} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-stone-900">Jenis Produk</h2>
              <ul className="flex flex-col gap-1 text-sm text-stone-600">
                {producer.products.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold text-stone-900">Komoditas Dilayani</h2>
              <ul className="flex flex-col gap-1 text-sm text-stone-600">
                {producer.commodities.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-stone-900">Galeri</h2>
            {producer.gallery.length === 0 ? (
              <PlaceholderImage
                label={producer.name}
                hasImage={false}
                fallbackText="Belum ada foto galeri"
                className="h-32 w-full rounded-lg"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {producer.gallery.map((g) => (
                  <PlaceholderImage key={g} label={g} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            )}
          </div>

          {relatedArticle && (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm text-emerald-800">Belum yakin mau pakai kascing? Baca panduan dulu.</p>
              <Link
                href={`/belajar-kascing/${relatedArticle.slug}`}
                className="mt-1 inline-block text-sm font-semibold text-emerald-700 hover:underline"
              >
                {relatedArticle.title} →
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24 rounded-xl border border-stone-200 bg-white p-5">
            <h2 className="text-base font-semibold text-stone-900">Hubungi Produsen</h2>
            {hasContact ? (
              <div className="mt-3 flex flex-col gap-2">
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Halo ${producer.name}, saya tertarik dengan produk kascing Anda.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-800"
                  >
                    Chat via WhatsApp
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="rounded-lg border border-stone-300 px-4 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Telepon {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="rounded-lg border border-stone-300 px-4 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Email {contact.email}
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-3 rounded-lg bg-stone-100 px-4 py-2.5 text-sm text-stone-500">
                Kontak produsen belum tersedia.
              </p>
            )}
          </div>
        </div>
      </div>

      {relatedProducers.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">Produsen Lain di {producer.province}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducers.map((p) => (
              <Card
                key={p.id}
                href={`/direktori/${p.slug}`}
                title={p.name}
                excerpt={p.description}
                meta={`${p.city}, ${p.province}`}
                tag={p.capacityLabel}
                hasImage={p.hasImage}
                cta="Lihat profil"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
