"use client";

import { trackEvent } from "@/lib/gtag";

const WHATSAPP_NUMBER = "6285183034318";
const WHATSAPP_MESSAGE =
  "Hello, I'm [company name] from [country], interested in kascing/vermicompost supply, volume [fill in]/month. [Source: Web-Importir]";

export function ImportirCtaButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click_importir", { persona: "importir", page_location: typeof window !== "undefined" ? window.location.href : undefined })}
        className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Chat via WhatsApp
      </a>
      <a
        href="/downloads/importir-spec-sheet-sample.pdf"
        download
        onClick={() => trackEvent("spec_sheet_download_importir", { persona: "importir" })}
        className="rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
      >
        Download Spec Sheet
      </a>
    </div>
  );
}
