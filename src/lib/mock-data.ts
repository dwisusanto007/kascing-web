import type {
  Article,
  CalculatorRate,
  CaseStudy,
  DownloadResource,
  FaqItem,
  NewsItem,
  Producer,
  ResearchPaper,
} from "./types";

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

export const producers: Producer[] = [
  {
    id: "p1",
    slug: "tani-subur-kascing",
    name: "Tani Subur Kascing",
    province: "Jawa Barat",
    city: "Bandung",
    description: "Produsen kascing curah & kemasan untuk kebutuhan pertanian skala kecil-menengah.",
    longDescription:
      "Tani Subur Kascing telah beroperasi sejak 2015, fokus pada produksi kascing berkualitas dari limbah organik lokal. Kami melayani petani hobiis hingga perkebunan menengah di wilayah Jawa Barat dengan standar kelembapan dan unsur hara yang terjaga.",
    address: "Jl. Raya Lembang No. 12, Bandung Barat",
    products: ["Kascing Curah", "Kascing Kemasan", "Teh Kascing (Cairan)"],
    commodities: ["Sayuran", "Tanaman Hias"],
    capacity: "menengah",
    capacityLabel: "5-10 ton/bulan",
    certifications: ["Organik Indonesia", "SNI Pupuk Organik"],
    contact: { phone: "0221234567", whatsapp: "6281234567890", email: "info@tanisubur.id" },
    gallery: ["fasilitas produksi", "gudang kascing", "proses pengemasan"],
    hasImage: true,
    rating: 4.6,
    relatedArticleSlug: "cara-memulai-budidaya-kascing-untuk-pemula",
  },
  {
    id: "p2",
    slug: "nusantara-organik-fertilizer",
    name: "Nusantara Organik Fertilizer",
    province: "Jawa Timur",
    city: "Malang",
    description: "Produsen skala besar untuk kebutuhan perkebunan dan ekspor.",
    longDescription:
      "Nusantara Organik Fertilizer merupakan produsen kascing berskala industri dengan kapasitas produksi tinggi, melayani perkebunan sawit dan kopi skala besar serta mitra ekspor ke Asia Tenggara.",
    address: "Kawasan Industri Singosari, Malang",
    products: ["Kascing Curah", "Media Tanam Campuran"],
    commodities: ["Sawit", "Kopi"],
    capacity: "besar",
    capacityLabel: "50-80 ton/bulan",
    certifications: ["ISO 9001", "Organik Indonesia", "Halal MUI"],
    contact: { phone: "0341567890", whatsapp: "6285678901234", email: "sales@nusantaraorganik.co.id" },
    gallery: ["gudang besar", "armada distribusi"],
    hasImage: true,
    rating: 4.8,
    relatedArticleSlug: "kascing-untuk-perkebunan-skala-besar",
  },
  {
    id: "p3",
    slug: "hijau-lestari-vermikompos",
    name: "Hijau Lestari Vermikompos",
    province: "Jawa Tengah",
    city: "Solo",
    description: "Kascing rumahan untuk komunitas hobiis tanaman hias.",
    longDescription:
      "Berawal dari komunitas pecinta tanaman hias, Hijau Lestari Vermikompos kini menjadi produsen kascing rumahan yang berfokus pada kualitas untuk tanaman hias dan sayuran pot.",
    address: "Jl. Slamet Riyadi Gg. 5, Solo",
    products: ["Kascing Kemasan", "Bibit Cacing Lumbricus"],
    commodities: ["Tanaman Hias"],
    capacity: "kecil",
    capacityLabel: "< 1 ton/bulan",
    certifications: [],
    contact: { whatsapp: "6289876543210" },
    gallery: [],
    hasImage: false,
    relatedArticleSlug: "cara-memulai-budidaya-kascing-untuk-pemula",
  },
  {
    id: "p4",
    slug: "sumatra-vermi-agro",
    name: "Sumatra Vermi Agro",
    province: "Sumatera Utara",
    city: "Medan",
    description: "Fokus pada kascing untuk komoditas kakao dan kopi ekspor.",
    longDescription:
      "Sumatra Vermi Agro melayani kebutuhan pupuk organik untuk perkebunan kakao dan kopi rakyat di Sumatera Utara, dengan sertifikasi organik untuk mendukung produk ekspor.",
    address: "Jl. Perkebunan No. 8, Deli Serdang",
    products: ["Kascing Curah", "Teh Kascing (Cairan)"],
    commodities: ["Kakao", "Kopi"],
    capacity: "menengah",
    capacityLabel: "10-20 ton/bulan",
    certifications: ["Organik Indonesia"],
    contact: { phone: "0614567890", email: "cs@sumatravermi.com" },
    gallery: ["kebun percontohan"],
    hasImage: true,
    relatedArticleSlug: "kascing-untuk-perkebunan-skala-besar",
  },
  {
    id: "p5",
    slug: "lampung-kascing-mandiri",
    name: "Lampung Kascing Mandiri",
    province: "Lampung",
    city: "Bandar Lampung",
    description: "Kascing untuk lahan sawah dan palawija.",
    longDescription:
      "Lampung Kascing Mandiri adalah koperasi produsen kascing yang mendukung petani padi dan palawija di wilayah Lampung dengan harga terjangkau dan distribusi cepat.",
    address: "Jl. Soekarno-Hatta KM 15, Bandar Lampung",
    products: ["Kascing Curah"],
    commodities: ["Padi"],
    capacity: "menengah",
    capacityLabel: "8-15 ton/bulan",
    certifications: ["SNI Pupuk Organik"],
    contact: { whatsapp: "6281122334455", phone: "0721334455" },
    gallery: [],
    hasImage: false,
  },
  {
    id: "p6",
    slug: "bali-organic-vermicompost",
    name: "Bali Organic Vermicompost",
    province: "Bali",
    city: "Tabanan",
    description: "Kascing premium untuk pertanian organik bersertifikat.",
    longDescription:
      "Berlokasi di kawasan pertanian Tabanan, Bali Organic Vermicompost memproduksi kascing premium untuk mendukung pertanian organik bersertifikat dan agrowisata.",
    address: "Jl. Raya Baturiti No. 3, Tabanan",
    products: ["Kascing Kemasan", "Teh Kascing (Cairan)", "Media Tanam Campuran"],
    commodities: ["Sayuran", "Tanaman Hias"],
    capacity: "kecil",
    capacityLabel: "1-3 ton/bulan",
    certifications: ["Organik Indonesia", "Halal MUI"],
    contact: { whatsapp: "6281399887766", email: "hello@baliorganic.id" },
    gallery: ["kebun organik", "produk kemasan"],
    hasImage: true,
  },
];

export const articles: Article[] = [
  {
    id: "a1",
    slug: "cara-memulai-budidaya-kascing-untuk-pemula",
    title: "Cara Memulai Budidaya Kascing untuk Pemula",
    category: "Pemula",
    tags: ["pemula", "panduan"],
    excerpt: "Langkah dasar memulai budidaya cacing tanah untuk menghasilkan kascing di rumah.",
    content: [
      "Kascing (bekas cacing) adalah pupuk organik hasil pengolahan bahan organik oleh cacing tanah. Untuk pemula, budidaya bisa dimulai dengan skala kecil menggunakan wadah sederhana.",
      "Siapkan media berupa campuran tanah, kompos, dan bahan organik lain seperti sisa sayuran. Jaga kelembapan media sekitar 60-70% agar cacing dapat hidup optimal.",
      "Pilih bibit cacing Lumbricus rubellus yang umum digunakan karena mudah beradaptasi. Panen kascing biasanya dapat dilakukan setelah 40-60 hari.",
      "Setelah mahir, Anda bisa meningkatkan skala produksi dan menjualnya melalui direktori produsen kascing terdekat.",
    ],
    publishedAt: "2026-07-02",
    readingTimeMin: 5,
    hasImage: true,
    relatedSlugs: ["memahami-manfaat-kascing-bagi-tanah", "menjaga-kualitas-kascing-saat-penyimpanan"],
  },
  {
    id: "a2",
    slug: "memahami-manfaat-kascing-bagi-tanah",
    title: "Memahami Manfaat Kascing bagi Kesuburan Tanah",
    category: "Pemula",
    tags: ["pemula", "edukasi"],
    excerpt: "Kascing memperbaiki struktur tanah dan meningkatkan mikroorganisme baik.",
    content: [
      "Kascing kaya akan unsur hara makro dan mikro yang mudah diserap tanaman. Selain itu, kascing membantu menjaga struktur tanah agar tetap gembur.",
      "Kandungan mikroorganisme dalam kascing membantu menekan pertumbuhan patogen tanah, sehingga tanaman lebih tahan penyakit.",
      "Penggunaan kascing secara rutin dapat mengurangi ketergantungan pada pupuk kimia dalam jangka panjang.",
    ],
    publishedAt: "2026-06-20",
    readingTimeMin: 4,
    hasImage: true,
    relatedSlugs: ["cara-memulai-budidaya-kascing-untuk-pemula"],
  },
  {
    id: "a3",
    slug: "kascing-untuk-perkebunan-skala-besar",
    title: "Strategi Penggunaan Kascing untuk Perkebunan Skala Besar",
    category: "Perkebunan Besar",
    tags: ["perkebunan besar", "sawit", "kopi"],
    excerpt: "Perhitungan kebutuhan kascing dan strategi distribusi untuk lahan luas.",
    content: [
      "Perkebunan skala besar memerlukan perhitungan volume kascing yang matang agar biaya produksi tetap efisien.",
      "Kombinasi kascing dengan pupuk lain dapat mempercepat masa pertumbuhan tanaman sawit dan kopi tanpa merusak keseimbangan tanah.",
      "Kerja sama dengan produsen kascing skala besar penting untuk menjamin pasokan yang konsisten sepanjang musim tanam.",
    ],
    publishedAt: "2026-05-15",
    readingTimeMin: 6,
    hasImage: true,
    relatedSlugs: ["memahami-manfaat-kascing-bagi-tanah"],
  },
  {
    id: "a4",
    slug: "menjaga-kualitas-kascing-saat-penyimpanan",
    title: "Tips Menjaga Kualitas Kascing Saat Penyimpanan",
    category: "Pemula",
    tags: ["pemula", "penyimpanan"],
    excerpt: "Kelembapan dan wadah penyimpanan menentukan daya simpan kascing.",
    content: [
      "Simpan kascing di tempat teduh dengan kelembapan terjaga agar mikroorganisme di dalamnya tetap hidup.",
      "Gunakan karung yang bisa 'bernapas', hindari plastik kedap udara yang dapat memicu fermentasi berlebihan.",
    ],
    publishedAt: "2026-04-10",
    readingTimeMin: 3,
    hasImage: false,
    relatedSlugs: ["cara-memulai-budidaya-kascing-untuk-pemula"],
  },
  {
    id: "a5",
    slug: "kascing-untuk-ekspor-standar-mutu",
    title: "Standar Mutu Kascing untuk Kebutuhan Ekspor",
    category: "Eksportir",
    tags: ["eksportir", "standar mutu"],
    excerpt: "Persyaratan sertifikasi dan mutu kascing untuk pasar ekspor.",
    content: [
      "Pasar ekspor menuntut standar mutu dan sertifikasi organik yang ketat, termasuk pengujian kandungan logam berat.",
      "Produsen perlu bekerja sama dengan lembaga sertifikasi resmi untuk memastikan produk kascing memenuhi standar negara tujuan.",
    ],
    publishedAt: "2026-03-01",
    readingTimeMin: 5,
    hasImage: true,
    relatedSlugs: ["kascing-untuk-perkebunan-skala-besar"],
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    slug: "permintaan-kascing-nasional-meningkat-2026",
    title: "Permintaan Kascing Nasional Meningkat 20% pada 2026",
    category: "Industri",
    excerpt: "Tren pertanian organik mendorong kenaikan permintaan kascing di berbagai daerah.",
    content: [
      "Asosiasi Petani Organik mencatat kenaikan permintaan kascing nasional sebesar 20% dibanding tahun sebelumnya, didorong oleh tren pertanian ramah lingkungan.",
      "Sejumlah produsen kascing skala menengah mulai memperluas kapasitas produksi untuk memenuhi permintaan pasar domestik dan ekspor.",
    ],
    publishedAt: "2026-08-20",
    source: "Redaksi Kascing",
    hasImage: true,
    relatedArticleSlug: "memahami-manfaat-kascing-bagi-tanah",
  },
  {
    id: "n2",
    slug: "riset-terbaru-efektivitas-kascing-padi",
    title: "Riset Terbaru: Efektivitas Kascing pada Tanaman Padi",
    category: "Riset Update",
    excerpt: "Studi menunjukkan peningkatan hasil panen padi dengan kombinasi kascing dan pupuk NPK.",
    content: [
      "Sebuah studi lapangan menunjukkan penggunaan kascing yang dikombinasikan dengan pupuk NPK dosis rendah dapat meningkatkan hasil panen padi hingga 15%.",
      "Hasil ini membuka peluang penerapan kascing yang lebih luas di sentra produksi padi nasional.",
    ],
    publishedAt: "2026-08-10",
    source: "Jurnal Pertanian Nusantara",
    hasImage: true,
    relatedArticleSlug: "kascing-untuk-perkebunan-skala-besar",
  },
  {
    id: "n3",
    slug: "kascing-id-luncurkan-direktori-produsen",
    title: "Kascing.id Resmi Luncurkan Direktori Produsen Nasional",
    category: "Press Release",
    excerpt: "Platform direktori mempermudah petani menemukan produsen kascing terdekat.",
    content: [
      "Kascing.id resmi meluncurkan fitur direktori produsen yang memuat informasi lengkap produsen kascing di seluruh Indonesia.",
      "Fitur ini diharapkan mempercepat rantai pasok kascing dari produsen ke petani maupun perkebunan besar.",
    ],
    publishedAt: "2026-07-28",
    source: "Kascing.id",
    hasImage: false,
  },
  {
    id: "n4",
    slug: "pelatihan-budidaya-cacing-untuk-umkm",
    title: "Pelatihan Budidaya Cacing Tanah untuk Pelaku UMKM",
    category: "Industri",
    excerpt: "Program pelatihan gratis digelar untuk mendorong pelaku UMKM masuk ke bisnis kascing.",
    content: [
      "Program pelatihan budidaya cacing tanah digelar di beberapa kota untuk membekali pelaku UMKM memulai usaha kascing.",
      "Peserta dibekali materi teknis produksi hingga strategi pemasaran produk kascing.",
    ],
    publishedAt: "2026-07-05",
    source: "Redaksi Kascing",
    hasImage: true,
  },
];

export const researchPapers: ResearchPaper[] = [
  {
    id: "r1",
    slug: "efektivitas-kascing-pada-produktivitas-sawit",
    title: "Efektivitas Aplikasi Kascing terhadap Produktivitas Kelapa Sawit",
    commodity: "Sawit",
    docType: "Jurnal",
    year: 2025,
    abstract:
      "Penelitian ini mengkaji pengaruh aplikasi kascing terhadap produktivitas tandan buah segar kelapa sawit pada lahan gambut selama dua musim tanam.",
    authors: "Dr. Andi Prasetyo, dkk.",
    fileAvailable: true,
    relatedArticleSlug: "kascing-untuk-perkebunan-skala-besar",
  },
  {
    id: "r2",
    slug: "white-paper-standar-mutu-kascing-nasional",
    title: "White Paper: Menuju Standar Mutu Kascing Nasional",
    commodity: "Umum",
    docType: "White Paper",
    year: 2026,
    abstract:
      "Dokumen ini merangkum usulan standar mutu kascing nasional berdasarkan kajian komparatif dengan standar internasional.",
    authors: "Tim Riset Kascing.id",
    fileAvailable: true,
  },
  {
    id: "r3",
    slug: "pengaruh-kascing-terhadap-tanaman-hias",
    title: "Pengaruh Pemberian Kascing terhadap Pertumbuhan Tanaman Hias",
    commodity: "Tanaman Hias",
    docType: "Jurnal",
    year: 2024,
    abstract:
      "Studi eksperimental mengenai dosis optimal kascing untuk pertumbuhan tanaman hias dalam pot pada skala rumah tangga.",
    authors: "Ir. Rina Wulandari, M.Sc.",
    fileAvailable: true,
    relatedArticleSlug: "memahami-manfaat-kascing-bagi-tanah",
  },
  {
    id: "r4",
    slug: "laporan-adopsi-kascing-petani-kopi-2025",
    title: "Laporan Adopsi Kascing oleh Petani Kopi 2025",
    commodity: "Kopi",
    docType: "Laporan",
    year: 2025,
    abstract:
      "Laporan tahunan mengenai tingkat adopsi kascing di kalangan petani kopi rakyat serta tantangan distribusinya.",
    authors: "Tim Riset Kascing.id",
    fileAvailable: false,
  },
  {
    id: "r5",
    slug: "kajian-kandungan-hara-kascing-sayuran",
    title: "Kajian Kandungan Hara Kascing untuk Budidaya Sayuran",
    commodity: "Sayuran",
    docType: "Jurnal",
    year: 2026,
    abstract:
      "Analisis kandungan unsur hara pada kascing dari berbagai bahan baku organik dan pengaruhnya terhadap budidaya sayuran.",
    authors: "Dr. Siti Marlina",
    fileAvailable: true,
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "c1",
    slug: "budi-hobiis-tanaman-hias-jakarta",
    title: "Budi: Dari Hobi Tanaman Hias ke Bisnis Kascing Rumahan",
    persona: "hobiis",
    summary: "Kascing rumahan mengubah hobi tanaman hias Budi menjadi usaha sampingan yang menguntungkan.",
    story: [
      "Budi awalnya hanya membuat kascing untuk kebutuhan tanaman hiasnya sendiri di teras rumah.",
      "Setelah melihat hasil tanaman yang lebih subur, ia mulai menjual kelebihan produksi kascing ke tetangga dan komunitas pecinta tanaman hias.",
      "Kini Budi memproduksi kascing skala kecil secara rutin dan memasarkannya melalui media sosial.",
    ],
    metrics: [
      { label: "Sebelum", value: "Tanaman kurang subur, sering layu" },
      { label: "Sesudah", value: "Daun lebih hijau & rimbun dalam 2 bulan" },
    ],
    testimonials: [
      { name: "Budi Santoso", role: "Hobiis Tanaman Hias", quote: "Sejak pakai kascing sendiri, tanaman di rumah jauh lebih sehat." },
    ],
    hasImage: true,
    relatedProducerSlug: "hijau-lestari-vermikompos",
  },
  {
    id: "c2",
    slug: "perkebunan-sawit-riau-tingkatkan-produktivitas",
    title: "Perkebunan Sawit di Riau Tingkatkan Produktivitas dengan Kascing",
    persona: "perkebunan-besar",
    summary: "Kombinasi kascing dan pupuk kimia dosis rendah meningkatkan produktivitas TBS sebesar 12%.",
    story: [
      "Sebuah perkebunan sawit seluas 500 hektar di Riau mengadopsi kascing sebagai bagian dari program pemupukan berimbang.",
      "Dalam satu musim tanam, produktivitas tandan buah segar (TBS) meningkat signifikan dibanding periode sebelumnya.",
      "Penggunaan kascing juga membantu memperbaiki struktur tanah gambut yang sebelumnya kurang subur.",
    ],
    metrics: [
      { label: "Produktivitas TBS", value: "+12% per hektar" },
      { label: "Biaya pupuk kimia", value: "-18%" },
    ],
    testimonials: [
      { name: "Hendra Wijaya", role: "Manajer Kebun", quote: "Kascing membantu kami menekan biaya pupuk kimia tanpa mengorbankan hasil panen." },
    ],
    hasImage: true,
    relatedProducerSlug: "nusantara-organik-fertilizer",
    relatedResearchSlug: "efektivitas-kascing-pada-produktivitas-sawit",
  },
  {
    id: "c3",
    slug: "eksportir-kopi-sumatra-standar-organik",
    title: "Eksportir Kopi Sumatra Penuhi Standar Organik dengan Kascing",
    persona: "eksportir",
    summary: "Sertifikasi organik untuk kopi ekspor tercapai berkat penggunaan kascing bersertifikat.",
    story: [
      "Sebuah kelompok tani kopi di Sumatera Utara bermitra dengan eksportir untuk memenuhi standar organik pasar Eropa.",
      "Penggunaan kascing bersertifikat menjadi salah satu syarat utama dalam proses sertifikasi organik.",
      "Produk kopi kini berhasil diekspor dengan label organik, meningkatkan nilai jual hingga 25%.",
    ],
    metrics: [
      { label: "Nilai jual", value: "+25% dengan label organik" },
      { label: "Luas lahan bersertifikat", value: "80 hektar" },
    ],
    testimonials: [],
    hasImage: false,
    relatedProducerSlug: "sumatra-vermi-agro",
  },
];

export const downloadResources: DownloadResource[] = [
  { id: "d1", title: "Panduan Dasar Budidaya Kascing", type: "Panduan PDF", sizeKb: 2400, available: true },
  { id: "d2", title: "Poster Edukasi: Manfaat Kascing bagi Tanah", type: "Poster Edukasi", sizeKb: 1800, available: true },
  { id: "d3", title: "Panduan Perhitungan Dosis Kascing per Komoditas", type: "Panduan PDF", sizeKb: 3100, available: true },
  { id: "d4", title: "Poster Edukasi: Siklus Hidup Cacing Tanah", type: "Poster Edukasi", sizeKb: 2100, available: false },
];

export const faqItems: FaqItem[] = [
  {
    id: "f1",
    question: "Apa itu kascing?",
    answer: "Kascing (bekas cacing) adalah pupuk organik hasil pengolahan bahan organik oleh cacing tanah, kaya unsur hara dan mikroorganisme baik untuk tanah.",
  },
  {
    id: "f2",
    question: "Berapa dosis kascing yang tepat untuk lahan saya?",
    answer: "Dosis bervariasi tergantung jenis komoditas dan kondisi tanah. Gunakan kalkulator kebutuhan kascing di halaman ini sebagai estimasi awal, lalu sesuaikan dengan uji tanah.",
  },
  {
    id: "f3",
    question: "Apakah kascing aman untuk semua jenis tanaman?",
    answer: "Ya, kascing umumnya aman untuk berbagai jenis tanaman karena bersifat organik dan tidak merusak struktur tanah.",
  },
  {
    id: "f4",
    question: "Bagaimana cara menemukan produsen kascing terdekat?",
    answer: "Gunakan halaman Direktori untuk mencari produsen berdasarkan lokasi, jenis produk, dan kapasitas produksi.",
  },
];

export const calculatorRates: CalculatorRate[] = [
  { commodity: "Sayuran", kgPerM2: 0.5 },
  { commodity: "Tanaman Hias", kgPerM2: 0.3 },
  { commodity: "Sawit", kgPerM2: 1.2 },
  { commodity: "Kopi", kgPerM2: 0.8 },
  { commodity: "Kakao", kgPerM2: 0.9 },
  { commodity: "Padi", kgPerM2: 0.4 },
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
