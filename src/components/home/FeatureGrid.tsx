import { Link } from "@/i18n/navigation";

const FEATURES = [
  {
    title: "Belajar Kascing",
    description: "Panduan edukasi dari dasar budidaya hingga strategi untuk perkebunan skala besar.",
    href: "/belajar-kascing",
  },
  {
    title: "Direktori Produsen",
    description: "Temukan dan bandingkan produsen kascing terdekat sesuai kebutuhan Anda.",
    href: "/direktori",
  },
  {
    title: "Berita & Artikel",
    description: "Kabar terbaru seputar industri kascing, update riset, dan press release.",
    href: "/berita",
  },
  {
    title: "Riset & Publikasi",
    description: "Jurnal, laporan, dan white paper berbasis data untuk pengambilan keputusan.",
    href: "/riset",
  },
  {
    title: "Studi Kasus",
    description: "Cerita nyata penggunaan kascing dari hobiis, perkebunan besar, hingga eksportir.",
    href: "/studi-kasus",
  },
  {
    title: "Sumber Daya",
    description: "Kalkulator kebutuhan kascing, unduhan panduan, dan jawaban pertanyaan umum.",
    href: "/sumber-daya",
  },
];

/** Feature/category grid — join.com-style cards with a title and 1-2 line description, not just an icon + link. */
export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <Link
          key={f.title}
          href={f.href}
          className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
        >
          <h3 className="font-bold text-stone-900 group-hover:text-emerald-700">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">{f.description}</p>
          <span className="mt-4 text-sm font-medium text-emerald-700">Jelajahi →</span>
        </Link>
      ))}
    </div>
  );
}
