import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Full-width solid-green CTA banner, join.com-style, closing out the homepage. */
export async function CtaBanner() {
  const t = await getTranslations("home.ctaBanner");
  const tCommon = await getTranslations("common");

  return (
    <section id="cta-banner" className="bg-emerald-700">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{t("title")}</h2>
          <p className="mt-2 max-w-xl text-emerald-50">{t("description")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/direktori"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            {tCommon("cariProdusenCta")}
          </Link>
          <Link
            href="/direktori/daftar"
            className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Daftarkan Bisnis Anda
          </Link>
        </div>
      </div>
    </section>
  );
}
