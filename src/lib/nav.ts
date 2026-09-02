export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Belajar Kascing",
    href: "/belajar-kascing",
    description: "Panduan edukasi seputar budidaya & pemanfaatan kascing",
    children: [
      { label: "Semua Artikel", href: "/belajar-kascing", description: "Panduan dasar hingga lanjutan" },
      { label: "Untuk Pemula", href: "/belajar-kascing?kategori=Pemula", description: "Mulai dari dasar budidaya kascing" },
      {
        label: "Untuk Perkebunan Besar",
        href: "/belajar-kascing?kategori=Perkebunan+Besar",
        description: "Strategi kascing untuk lahan luas",
      },
      { label: "Untuk Eksportir", href: "/belajar-kascing?kategori=Eksportir", description: "Standar mutu untuk pasar ekspor" },
    ],
  },
  {
    label: "Berita & Artikel",
    href: "/berita",
    description: "Kabar terbaru seputar industri dan riset kascing",
    children: [
      { label: "Semua Berita", href: "/berita", description: "Kabar terbaru, terurut dari yang terkini" },
      { label: "Industri", href: "/berita?kategori=Industri", description: "Perkembangan industri kascing" },
      { label: "Riset Update", href: "/berita?kategori=Riset+Update", description: "Temuan riset terbaru" },
      { label: "Press Release", href: "/berita?kategori=Press+Release", description: "Rilis resmi Kascing.id" },
    ],
  },
  {
    label: "Riset & Publikasi",
    href: "/riset",
    description: "Jurnal, laporan, dan white paper seputar kascing",
    children: [
      { label: "Semua Riset & Publikasi", href: "/riset", description: "Jurnal, laporan, dan white paper" },
      { label: "Unduh White Paper", href: "/riset?jenis=White+Paper", description: "Dokumen ringkas siap unduh" },
    ],
  },
  {
    label: "Direktori",
    href: "/direktori",
    description: "Temukan dan daftarkan produsen kascing",
    children: [
      { label: "Cari Produsen", href: "/direktori", description: "Jelajahi produsen kascing terdekat" },
      { label: "Daftarkan Bisnis Anda", href: "/direktori/daftar", description: "Masukkan bisnis Anda ke direktori" },
    ],
  },
  {
    label: "Studi Kasus",
    href: "/studi-kasus",
    description: "Cerita nyata penggunaan kascing per persona",
    children: [
      { label: "Hobiis", href: "/studi-kasus?persona=hobiis", description: "Cerita dari pecinta tanaman hias" },
      {
        label: "Perkebunan Besar",
        href: "/studi-kasus?persona=perkebunan-besar",
        description: "Dampak kascing pada produktivitas lahan luas",
      },
      { label: "Eksportir", href: "/studi-kasus?persona=eksportir", description: "Memenuhi standar organik untuk ekspor" },
    ],
  },
  {
    label: "Sumber Daya",
    href: "/sumber-daya",
    description: "Kalkulator, unduhan, dan FAQ seputar kascing",
    children: [
      { label: "Kalkulator Kebutuhan Kascing", href: "/sumber-daya#kalkulator", description: "Estimasi kebutuhan per luas lahan" },
      { label: "Unduhan", href: "/sumber-daya#unduhan", description: "Panduan PDF & poster edukasi" },
      { label: "FAQ", href: "/sumber-daya#faq", description: "Pertanyaan yang sering diajukan" },
    ],
  },
  {
    label: "Tentang",
    href: "/tentang",
    description: "Tentang Kascing.id",
  },
];
