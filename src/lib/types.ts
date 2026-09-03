export type Persona = "hobiis" | "perkebunan-besar" | "eksportir";

/** Maps a Persona id to its message key under the `taxonomy.persona` namespace. */
export const PERSONA_LABEL_KEYS: Record<Persona, string> = {
  hobiis: "hobiis",
  "perkebunan-besar": "perkebunanBesar",
  eksportir: "eksportir",
};

/** Citation metadata every crawled/researched entry must carry. */
export interface Sourced {
  sourceUrl: string;
  sourceName?: string;
  retrievedAt?: string;
}

export interface Producer extends Sourced {
  id: string;
  slug: string;
  name: string;
  province: string;
  city: string;
  description: string;
  longDescription: string;
  address: string;
  products: string[];
  commodities: string[];
  capacity: "kecil" | "menengah" | "besar";
  capacityLabel: string;
  certifications: string[];
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  gallery: string[];
  hasImage: boolean;
  imageUrl?: string;
  rating?: number;
  relatedArticleSlug?: string;
}

export interface Article extends Sourced {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string[];
  publishedAt: string;
  readingTimeMin: number;
  hasImage: boolean;
  imageUrl?: string;
  relatedSlugs: string[];
}

export interface NewsItem extends Sourced {
  id: string;
  slug: string;
  title: string;
  category: "Industri" | "Riset Update" | "Press Release";
  excerpt: string;
  content: string[];
  publishedAt: string;
  source: string;
  hasImage: boolean;
  imageUrl?: string;
  relatedArticleSlug?: string;
}

export interface ResearchPaper extends Sourced {
  id: string;
  slug: string;
  title: string;
  commodity: string;
  docType: "Jurnal" | "White Paper" | "Laporan";
  year: number;
  abstract: string;
  authors: string;
  fileAvailable: boolean;
  relatedArticleSlug?: string;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface CaseStudy extends Sourced {
  id: string;
  slug: string;
  title: string;
  persona: Persona;
  summary: string;
  story: string[];
  metrics: CaseStudyMetric[];
  testimonials: Testimonial[];
  hasImage: boolean;
  imageUrl?: string;
  relatedProducerSlug?: string;
  relatedResearchSlug?: string;
}

export interface DownloadResource extends Sourced {
  id: string;
  title: string;
  type: "Panduan PDF" | "Poster Edukasi";
  sizeKb: number;
  available: boolean;
}

export interface FaqItem extends Sourced {
  id: string;
  question: string;
  answer: string;
}

export interface CalculatorRate extends Sourced {
  id: string;
  commodity: string;
  kgPerM2: number;
}

export interface AffiliateProduct extends Sourced {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price?: string;
  marketplace: string;
  buyUrl: string;
  producerSlug?: string;
  hasImage: boolean;
  imageUrl?: string;
}
