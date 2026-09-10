/**
 * Generic, hand-drawn illustrations used as a friendlier stand-in for a
 * missing real photo (hasImage: false), grouped by content type. These are
 * decorative and NOT meant to represent the specific producer/product/etc.
 * they sit next to — PlaceholderImage labels them "Ilustrasi" so nobody
 * mistakes one for an actual photo.
 */
export type IllustrationCategory = "producer" | "product" | "case-study" | "article" | "news" | "hero";

function ProducerIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="240" height="160" fill="#ecfdf5" />
      <rect x="60" y="70" width="120" height="60" rx="6" fill="#059669" />
      <rect x="60" y="70" width="120" height="14" rx="6" fill="#047857" />
      <path d="M74 130v14M100 130v14M126 130v14M152 130v14M166 130v14" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <path d="M90 100c8-6 8-16 0-22M120 96c10-8 10-20 0-28M150 100c8-6 8-16 0-22" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
      <circle cx="190" cy="55" r="14" fill="#a7f3d0" />
      <path d="M186 55c2-4 6-6 10-4" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="45" r="9" fill="#fde68a" />
    </svg>
  );
}

function ProductIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="240" height="160" fill="#fffbeb" />
      <path d="M90 60h60l10 70H80l10-70Z" fill="#f59e0b" />
      <path d="M90 60h60v14H90z" fill="#d97706" />
      <path d="M108 60c0-10 6-18 12-18s12 8 12 18" fill="none" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
      <rect x="96" y="86" width="48" height="26" rx="3" fill="#fef3c7" />
      <path d="M104 96h32M104 104h20" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
      <circle cx="170" cy="50" r="10" fill="#a7f3d0" />
      <circle cx="60" cy="110" r="8" fill="#bbf7d0" />
    </svg>
  );
}

function CaseStudyIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="240" height="160" fill="#f0fdf4" />
      <rect x="60" y="100" width="24" height="34" rx="2" fill="#a7f3d0" />
      <rect x="94" y="80" width="24" height="54" rx="2" fill="#6ee7b7" />
      <rect x="128" y="60" width="24" height="74" rx="2" fill="#34d399" />
      <rect x="162" y="40" width="24" height="94" rx="2" fill="#059669" />
      <path d="M64 96c30-8 60-24 118-58" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 8" />
      <path d="M168 40l14-4-2 14Z" fill="#f59e0b" />
    </svg>
  );
}

function ArticleIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="240" height="160" fill="#f0fdfa" />
      <path d="M50 50h68a10 10 0 0 1 10 10v56H60a10 10 0 0 1-10-10V50Z" fill="#0d9488" />
      <path d="M172 50h-54a10 10 0 0 0-10 10v56h54a10 10 0 0 0 10-10V50Z" fill="#14b8a6" />
      <path d="M68 66h34M68 78h34M68 90h24" stroke="#f0fdfa" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 66h34M118 78h34M118 90h24" stroke="#ecfeff" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 122c-4-16 0-40 10-56" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      <path d="M116 66c6-6 6-14 0-20" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function NewsIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="240" height="160" fill="#fef2f2" />
      <rect x="56" y="46" width="128" height="88" rx="4" fill="#fff" stroke="#f87171" strokeWidth="3" />
      <rect x="70" y="58" width="46" height="34" fill="#fecaca" />
      <path d="M126 60h44M126 70h44M126 80h30" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 102h100M70 112h100M70 122h60" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 50c10-2 20 4 22 14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="presentation">
      <rect width="400" height="300" fill="#d1fae5" />
      <rect y="150" width="400" height="150" fill="#a7f3d0" />
      <circle cx="340" cy="55" r="30" fill="#fde68a" />
      <path d="M20 190c30-30 70-30 100 0s70 30 100 0 70-30 100 0 50 20 60 10" fill="none" stroke="#6ee7b7" strokeWidth="6" strokeLinecap="round" opacity="0.7" />

      {/* wooden sifting tray */}
      <path d="M60 190h280l-20 90H80l-20-90Z" fill="#78350f" />
      <path d="M60 190h280v16H60z" fill="#92400e" />
      <path d="M50 180h300v16H50z" fill="#b45309" />

      {/* dark compost fill with worms */}
      <path d="M78 206h244l-14 60H92l-14-60Z" fill="#1c1917" />
      <path d="M110 224c10 6 10 16 0 24M150 220c12 8 12 20 0 30M190 224c10 6 10 16 0 24M230 220c12 8 12 20 0 30M270 224c10 6 10 16 0 24" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />

      {/* sprouts either side of the tray */}
      <path d="M90 190c0-20 14-34 14-34" fill="none" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
      <path d="M104 156c8-4 16 0 18 8-10 4-18-1-18-8Z" fill="#34d399" />
      <path d="M104 156c-8-2-17 3-18 12 10 3 18-3 18-12Z" fill="#059669" />

      <path d="M320 190c0-24-16-40-16-40" fill="none" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
      <path d="M304 150c9-5 19 0 21 9-11 5-21-1-21-9Z" fill="#34d399" />
      <path d="M304 150c-9-2-19 4-20 14 11 3 20-4 20-14Z" fill="#059669" />

      <circle cx="45" cy="120" r="10" fill="#fca5a5" opacity="0.8" />
      <circle cx="365" cy="180" r="8" fill="#5eead4" opacity="0.8" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<IllustrationCategory, () => React.ReactElement> = {
  producer: ProducerIllustration,
  product: ProductIllustration,
  "case-study": CaseStudyIllustration,
  article: ArticleIllustration,
  news: NewsIllustration,
  hero: HeroIllustration,
};

export function CategoryIllustration({ category }: { category: IllustrationCategory }) {
  const Illustration = ILLUSTRATIONS[category];
  return <Illustration />;
}
