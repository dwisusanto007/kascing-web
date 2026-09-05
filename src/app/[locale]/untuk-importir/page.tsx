import type { Metadata } from "next";
import { ImportirCtaButtons } from "@/components/importir/ImportirCtaButtons";

export const metadata: Metadata = {
  title: "For Malaysian Importers — Vermicompost.id",
  description: "Bulk vermicompost (kascing) supply for importers, with export-grade specifications and ASEAN logistics support.",
};

/**
 * Content on this page is hardcoded in English regardless of site locale,
 * per an explicit brief requirement (importer audience, not a toggle) —
 * unlike every other page, which is fully translated via next-intl.
 */
export default function UntukImportirPage() {
  return (
    <div>
      <section className="border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Malaysian Importers
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Bulk Vermicompost Supply for Regional Importers
          </h1>
          <p className="mt-4 max-w-2xl text-base text-stone-600">
            We supply export-grade vermicompost (kascing) in bulk to importers and distributors across
            ASEAN, with logistics routes optimised for the nearest sea and land ports into Malaysia.
          </p>
          <ImportirCtaButtons />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">Company Profile</h2>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Sample content — full company profile is being finalised. This is placeholder text, not final
          company information.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Vermicompost.id connects a network of Indonesian vermicompost producers with buyers across the
          region. We coordinate quality control, export documentation, and consolidated shipping so
          importers can source reliably from a single point of contact instead of negotiating with
          individual small producers.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">Product Specification</h2>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Sample values below are illustrative placeholders, not final lab-verified results. Download the
          sample spec sheet for the full placeholder document.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Nitrogen (N)", value: "1.8% (sample)" },
            { label: "Phosphorus (P)", value: "0.9% (sample)" },
            { label: "Potassium (K)", value: "1.2% (sample)" },
            { label: "C/N Ratio", value: "15:1 (sample)" },
            { label: "Moisture", value: "35% (sample)" },
            { label: "pH", value: "6.8 (sample)" },
          ].map((row) => (
            <div key={row.label} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs text-stone-400">{row.label}</p>
              <p className="mt-1 text-lg font-semibold text-stone-900">{row.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">Certification &amp; Export Documentation</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
          <li>SNI (Indonesian National Standard) compliance — pending verification</li>
          <li>Halal certification — availability to be confirmed per batch</li>
          <li>Export permit and phytosanitary documentation coordinated per shipment</li>
          <li>Estimated lead time to Malaysian ports (Port Klang / Penang): to be confirmed per order volume</li>
        </ul>
      </section>

      <section className="bg-emerald-700">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Ready to discuss volume and pricing?
          </h2>
          <p className="mt-2 text-emerald-50">
            Chat with our team directly on WhatsApp for spec sheets, samples, and FOB pricing.
          </p>
          <div className="mt-6 flex justify-center">
            <ImportirCtaButtons />
          </div>
        </div>
      </section>
    </div>
  );
}
