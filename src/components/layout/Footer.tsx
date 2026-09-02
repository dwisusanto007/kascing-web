import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { NewsletterForm } from "@/components/NewsletterForm";

export async function Footer() {
  const t = await getTranslations("nav");
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-emerald-800">
              <span className="text-lg">Vermicompost.id</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-stone-500">
              Pusat edukasi, riset, dan direktori produsen kascing (bekas cacing) untuk hobiis, perkebunan besar, hingga eksportir.
            </p>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-stone-700">Berlangganan newsletter</p>
              <NewsletterForm compact />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">Produk & Section</p>
            <ul className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className="text-sm text-stone-500 hover:text-emerald-700">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">Perusahaan</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/tentang" className="text-sm text-stone-500 hover:text-emerald-700">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/direktori/daftar" className="text-sm text-stone-500 hover:text-emerald-700">
                  Daftarkan Bisnis Anda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">Sumber Daya</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/sumber-daya#kalkulator" className="text-sm text-stone-500 hover:text-emerald-700">
                  Kalkulator Kascing
                </Link>
              </li>
              <li>
                <Link href="/sumber-daya#unduhan" className="text-sm text-stone-500 hover:text-emerald-700">
                  Unduhan
                </Link>
              </li>
              <li>
                <Link href="/sumber-daya#faq" className="text-sm text-stone-500 hover:text-emerald-700">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">Legal</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/tentang" className="text-sm text-stone-500 hover:text-emerald-700">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-sm text-stone-500 hover:text-emerald-700">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-6 text-xs text-stone-400">
          © {new Date().getFullYear()} Vermicompost.id. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
