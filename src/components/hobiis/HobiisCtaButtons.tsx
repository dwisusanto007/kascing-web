"use client";

import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/gtag";

const WHATSAPP_NUMBER = "6285183034318";
const MARKETPLACE_URL =
  "https://www.tokopedia.com/pupuk-alami-center/kascing-pupuk-organik-cacing-fermentasi-siap-pakai-untuk-media-tanam-tanaman-kode-1735603054276151252-1735603349951711188";

export function HobiisMarketplaceCta() {
  const t = useTranslations("untukHobiis.starterPack");
  return (
    // Plain <a> to an external URL (not next/link) so GA4 Enhanced Measurement's
    // "Outbound clicks" auto-tracks this - no custom event needed per the brief.
    <a
      href={MARKETPLACE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
    >
      {t("cta")}
    </a>
  );
}

export function HobiisWhatsappCta() {
  const t = useTranslations("untukHobiis.waCta");
  const message = t("message");
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click_hobiis", { persona: "hobiis", page_location: typeof window !== "undefined" ? window.location.href : undefined })}
      className="rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
    >
      {t("cta")}
    </a>
  );
}
