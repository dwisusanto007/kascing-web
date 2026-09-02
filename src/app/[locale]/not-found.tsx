import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors.notFound");
  const tCommon = await getTranslations("common");
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-5xl" aria-hidden>
        🪱
      </span>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-2 text-sm text-stone-500">{t("description")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {tCommon("kembaliKeBeranda")}
        </Link>
        <Link
          href="/direktori"
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          {tCommon("cariProdusenCta")}
        </Link>
      </div>
    </div>
  );
}
