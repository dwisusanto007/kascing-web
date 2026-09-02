import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { NewsletterForm } from "@/components/NewsletterForm";

export async function Footer() {
  const t = await getTranslations("nav");
  const tFooter = await getTranslations("footer");

  const navItems = NAV_ITEMS.map((item) => ({ ...item, label: t(item.labelKey) }));

  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-emerald-800">
              <span className="text-lg">Vermicompost.id</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-stone-500">{tFooter("tagline")}</p>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-stone-700">{tFooter("newsletterLabel")}</p>
              <NewsletterForm compact />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">{tFooter("columns.produk")}</p>
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className="text-sm text-stone-500 hover:text-emerald-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">{tFooter("columns.perusahaan")}</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/tentang" className="text-sm text-stone-500 hover:text-emerald-700">
                  {tFooter("links.tentangKami")}
                </Link>
              </li>
              <li>
                <Link href="/direktori/daftar" className="text-sm text-stone-500 hover:text-emerald-700">
                  {t("direktori.children.daftar.label")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">{t("sumberDaya.label")}</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/sumber-daya#kalkulator" className="text-sm text-stone-500 hover:text-emerald-700">
                  {tFooter("links.kalkulator")}
                </Link>
              </li>
              <li>
                <Link href="/sumber-daya#unduhan" className="text-sm text-stone-500 hover:text-emerald-700">
                  {t("sumberDaya.children.unduhan.label")}
                </Link>
              </li>
              <li>
                <Link href="/sumber-daya#faq" className="text-sm text-stone-500 hover:text-emerald-700">
                  {t("sumberDaya.children.faq.label")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">{tFooter("columns.legal")}</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/tentang" className="text-sm text-stone-500 hover:text-emerald-700">
                  {tFooter("links.kebijakanPrivasi")}
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-sm text-stone-500 hover:text-emerald-700">
                  {tFooter("links.syaratKetentuan")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-6 text-xs text-stone-400">
          {tFooter("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
