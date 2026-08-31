import type { Metadata } from "next";
import { Calculator } from "@/components/sumber-daya/Calculator";
import { DownloadList } from "@/components/sumber-daya/DownloadList";
import { Accordion } from "@/components/ui/Accordion";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { faqItems } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Sumber Daya" };

export default function SumberDayaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Sumber Daya</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">
        Kalkulator kebutuhan kascing, unduhan panduan, dan pertanyaan yang sering diajukan.
      </p>

      <section id="kalkulator" className="mt-10 scroll-mt-24 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">Kalkulator Kebutuhan Kascing</h2>
        <p className="mt-1 text-sm text-stone-500">
          Estimasi kebutuhan kascing berdasarkan luas lahan dan jenis komoditas.
        </p>
        <div className="mt-6">
          <SectionErrorBoundary label="kalkulator">
            <Calculator />
          </SectionErrorBoundary>
        </div>
      </section>

      <section id="unduhan" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold text-stone-900">Unduhan</h2>
        <p className="mt-1 text-sm text-stone-500">Panduan PDF dan poster edukasi seputar kascing.</p>
        <div className="mt-6">
          <SectionErrorBoundary label="daftar unduhan">
            <DownloadList />
          </SectionErrorBoundary>
        </div>
      </section>

      <section id="faq" className="mt-10 scroll-mt-24 pb-10">
        <h2 className="text-lg font-semibold text-stone-900">Pertanyaan yang Sering Diajukan</h2>
        <div className="mt-6">
          <Accordion items={faqItems} />
        </div>
      </section>
    </div>
  );
}
