export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Belajar Kascing",
    href: "/belajar-kascing",
    children: [
      { label: "Semua Artikel", href: "/belajar-kascing", description: "Panduan dasar hingga lanjutan" },
      { label: "Untuk Pemula", href: "/belajar-kascing?kategori=Pemula" },
      { label: "Untuk Perkebunan Besar", href: "/belajar-kascing?kategori=Perkebunan+Besar" },
      { label: "Untuk Eksportir", href: "/belajar-kascing?kategori=Eksportir" },
    ],
  },
  {
    label: "Berita & Artikel",
    href: "/berita",
    children: [
      { label: "Semua Berita", href: "/berita" },
      { label: "Industri", href: "/berita?kategori=Industri" },
      { label: "Riset Update", href: "/berita?kategori=Riset+Update" },
      { label: "Press Release", href: "/berita?kategori=Press+Release" },
    ],
  },
  {
    label: "Riset & Publikasi",
    href: "/riset",
    children: [
      { label: "Semua Riset & Publikasi", href: "/riset" },
      { label: "Unduh White Paper", href: "/riset?jenis=White+Paper" },
    ],
  },
  {
    label: "Direktori",
    href: "/direktori",
    children: [
      { label: "Cari Produsen", href: "/direktori", description: "Jelajahi produsen kascing terdekat" },
      { label: "Daftarkan Bisnis Anda", href: "/direktori/daftar" },
    ],
  },
  {
    label: "Studi Kasus",
    href: "/studi-kasus",
    children: [
      { label: "Hobiis", href: "/studi-kasus?persona=hobiis" },
      { label: "Perkebunan Besar", href: "/studi-kasus?persona=perkebunan-besar" },
      { label: "Eksportir", href: "/studi-kasus?persona=eksportir" },
    ],
  },
  {
    label: "Sumber Daya",
    href: "/sumber-daya",
    children: [
      { label: "Kalkulator Kebutuhan Kascing", href: "/sumber-daya#kalkulator" },
      { label: "Unduhan", href: "/sumber-daya#unduhan" },
      { label: "FAQ", href: "/sumber-daya#faq" },
    ],
  },
  {
    label: "Tentang",
    href: "/tentang",
  },
];
