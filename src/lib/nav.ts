export interface NavChild {
  labelKey: string;
  href: string;
  descriptionKey?: string;
}

export interface NavItem {
  labelKey: string;
  href: string;
  descriptionKey?: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "belajarKascing.label",
    href: "/belajar-kascing",
    descriptionKey: "belajarKascing.description",
    children: [
      { labelKey: "belajarKascing.children.all.label", href: "/belajar-kascing", descriptionKey: "belajarKascing.children.all.description" },
      { labelKey: "belajarKascing.children.beginner.label", href: "/belajar-kascing?kategori=Pemula", descriptionKey: "belajarKascing.children.beginner.description" },
      { labelKey: "belajarKascing.children.largePlantation.label", href: "/belajar-kascing?kategori=Perkebunan+Besar", descriptionKey: "belajarKascing.children.largePlantation.description" },
      { labelKey: "belajarKascing.children.exporter.label", href: "/belajar-kascing?kategori=Eksportir", descriptionKey: "belajarKascing.children.exporter.description" },
    ],
  },
  {
    labelKey: "berita.label",
    href: "/berita",
    descriptionKey: "berita.description",
    children: [
      { labelKey: "berita.children.all.label", href: "/berita", descriptionKey: "berita.children.all.description" },
      { labelKey: "berita.children.industri.label", href: "/berita?kategori=Industri", descriptionKey: "berita.children.industri.description" },
      { labelKey: "berita.children.risetUpdate.label", href: "/berita?kategori=Riset+Update", descriptionKey: "berita.children.risetUpdate.description" },
      { labelKey: "berita.children.pressRelease.label", href: "/berita?kategori=Press+Release", descriptionKey: "berita.children.pressRelease.description" },
    ],
  },
  {
    labelKey: "riset.label",
    href: "/riset",
    descriptionKey: "riset.description",
    children: [
      { labelKey: "riset.children.all.label", href: "/riset", descriptionKey: "riset.children.all.description" },
      { labelKey: "riset.children.whitePaper.label", href: "/riset?jenis=White+Paper", descriptionKey: "riset.children.whitePaper.description" },
    ],
  },
  {
    labelKey: "direktori.label",
    href: "/direktori",
    descriptionKey: "direktori.description",
    children: [
      { labelKey: "direktori.children.cari.label", href: "/direktori", descriptionKey: "direktori.children.cari.description" },
      { labelKey: "direktori.children.daftar.label", href: "/direktori/daftar", descriptionKey: "direktori.children.daftar.description" },
    ],
  },
  {
    labelKey: "produk.label",
    href: "/produk",
    descriptionKey: "produk.description",
  },
  {
    labelKey: "studiKasus.label",
    href: "/studi-kasus",
    descriptionKey: "studiKasus.description",
    children: [
      { labelKey: "studiKasus.children.importir.label", href: "/studi-kasus?persona=importir", descriptionKey: "studiKasus.children.importir.description" },
      { labelKey: "studiKasus.children.hobiis.label", href: "/studi-kasus?persona=hobiis", descriptionKey: "studiKasus.children.hobiis.description" },
      { labelKey: "studiKasus.children.perkebunan.label", href: "/studi-kasus?persona=perkebunan", descriptionKey: "studiKasus.children.perkebunan.description" },
      { labelKey: "studiKasus.children.petaniPadi.label", href: "/studi-kasus?persona=petani-padi", descriptionKey: "studiKasus.children.petaniPadi.description" },
    ],
  },
  {
    labelKey: "sumberDaya.label",
    href: "/sumber-daya",
    descriptionKey: "sumberDaya.description",
    children: [
      { labelKey: "sumberDaya.children.kalkulator.label", href: "/sumber-daya#kalkulator", descriptionKey: "sumberDaya.children.kalkulator.description" },
      { labelKey: "sumberDaya.children.unduhan.label", href: "/sumber-daya#unduhan", descriptionKey: "sumberDaya.children.unduhan.description" },
      { labelKey: "sumberDaya.children.faq.label", href: "/sumber-daya#faq", descriptionKey: "sumberDaya.children.faq.description" },
    ],
  },
  {
    labelKey: "tentang.label",
    href: "/tentang",
    descriptionKey: "tentang.description",
  },
];
