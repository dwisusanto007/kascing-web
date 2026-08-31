export type Persona = "hobiis" | "perkebunan-besar" | "eksportir";

export const PERSONA_LABELS: Record<Persona, string> = {
  hobiis: "Hobiis",
  "perkebunan-besar": "Perkebunan Besar",
  eksportir: "Eksportir",
};

export interface Producer {
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
  rating?: number;
  relatedArticleSlug?: string;
}

export interface Article {
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
  relatedSlugs: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: "Industri" | "Riset Update" | "Press Release";
  excerpt: string;
  content: string[];
  publishedAt: string;
  source: string;
  hasImage: boolean;
  relatedArticleSlug?: string;
}

export interface ResearchPaper {
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

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  persona: Persona;
  summary: string;
  story: string[];
  metrics: CaseStudyMetric[];
  testimonials: Testimonial[];
  hasImage: boolean;
  relatedProducerSlug?: string;
  relatedResearchSlug?: string;
}

export interface DownloadResource {
  id: string;
  title: string;
  type: "Panduan PDF" | "Poster Edukasi";
  sizeKb: number;
  available: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CalculatorRate {
  commodity: string;
  kgPerM2: number;
}
