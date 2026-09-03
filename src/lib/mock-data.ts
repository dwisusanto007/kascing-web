export { producers } from "./generated/producers.generated";
export { articles } from "./generated/articles.generated";
export { newsItems } from "./generated/news-items.generated";
export { researchPapers } from "./generated/research-papers.generated";
export { caseStudies } from "./generated/case-studies.generated";
export { downloadResources } from "./generated/download-resources.generated";
export { faqItems } from "./generated/faq-items.generated";
export { calculatorRates } from "./generated/calculator-rates.generated";

import { producers } from "./generated/producers.generated";
import { articles } from "./generated/articles.generated";
import { newsItems } from "./generated/news-items.generated";
import { researchPapers } from "./generated/research-papers.generated";
import { caseStudies } from "./generated/case-studies.generated";

export const PRODUCTS_LIST = [
  "Kascing Curah",
  "Kascing Kemasan",
  "Bibit Cacing Lumbricus",
  "Teh Kascing (Cairan)",
  "Media Tanam Campuran",
];

export const CERTIFICATIONS_LIST = [
  "Organik Indonesia",
  "ISO 9001",
  "Halal MUI",
  "SNI Pupuk Organik",
];

export const COMMODITIES_LIST = [
  "Sawit",
  "Tanaman Hias",
  "Sayuran",
  "Padi",
  "Kopi",
  "Kakao",
];

export const PROVINCES = [
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Sumatera Utara",
  "Lampung",
  "Bali",
];

export function findProducerBySlug(slug: string) {
  return producers.find((p) => p.slug === slug);
}

export function findArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function findNewsBySlug(slug: string) {
  return newsItems.find((n) => n.slug === slug);
}

export function findResearchBySlug(slug: string) {
  return researchPapers.find((r) => r.slug === slug);
}

export function findCaseStudyBySlug(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
