import Link from "next/link";
import { PlaceholderImage } from "./PlaceholderImage";

interface CardProps {
  href: string;
  title: string;
  excerpt?: string;
  meta?: string;
  tag?: string;
  hasImage?: boolean;
  imageSrc?: string;
  cta?: string;
}

/** Base card used across Direktori, Belajar Kascing, Berita, Riset, Studi Kasus. */
export function Card({ href, title, excerpt, meta, tag, hasImage = true, imageSrc, cta = "Lihat detail" }: CardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <PlaceholderImage label={title} hasImage={hasImage} imageSrc={imageSrc} className="h-36 w-full" />
      <div className="flex flex-1 flex-col p-4">
        {tag && (
          <span className="mb-1 w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {tag}
          </span>
        )}
        <h3 className="line-clamp-2 font-semibold text-stone-900 group-hover:text-emerald-700">{title}</h3>
        {excerpt && <p className="mt-1 line-clamp-2 text-sm text-stone-500">{excerpt}</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xs text-stone-400">{meta}</span>
          <span className="shrink-0 text-sm font-medium text-emerald-700">{cta} →</span>
        </div>
      </div>
    </Link>
  );
}
