import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Feature/category grid — join.com-style cards with a title and 1-2 line description, not just an icon + link. */
export async function FeatureGrid() {
  const t = await getTranslations("home.features");

  const FEATURES = [
    {
      title: t("belajarKascing.title"),
      description: t("belajarKascing.description"),
      href: "/belajar-kascing",
    },
    {
      title: t("direktoriProdusen.title"),
      description: t("direktoriProdusen.description"),
      href: "/direktori",
    },
    {
      title: t("berita.title"),
      description: t("berita.description"),
      href: "/berita",
    },
    {
      title: t("riset.title"),
      description: t("riset.description"),
      href: "/riset",
    },
    {
      title: t("studiKasus.title"),
      description: t("studiKasus.description"),
      href: "/studi-kasus",
    },
    {
      title: t("sumberDaya.title"),
      description: t("sumberDaya.description"),
      href: "/sumber-daya",
    },
  ];

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
          <span className="mt-4 text-sm font-medium text-emerald-700">{t("cardCta")}</span>
        </Link>
      ))}
    </div>
  );
}
