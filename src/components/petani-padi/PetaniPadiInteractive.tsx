"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/gtag";

const WHATSAPP_NUMBER = "6285183034318";

export function PetaniPadiInteractive() {
  const t = useTranslations("untukPetaniPadi.waCta");
  const [poktan, setPoktan] = useState("");
  const [desa, setDesa] = useState("");

  const message = t("messageTemplate", {
    poktan: poktan.trim() || t("poktanFallback"),
    desa: desa.trim() || t("desaFallback"),
  });
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <section className="bg-emerald-700">
      <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">{t("title")}</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          <div>
            <label htmlFor="pp-poktan" className="mb-1 block text-sm font-medium text-emerald-50">
              {t("fields.poktan")}
            </label>
            <input
              id="pp-poktan"
              type="text"
              value={poktan}
              onChange={(e) => setPoktan(e.target.value)}
              placeholder={t("fields.poktanPlaceholder")}
              className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div>
            <label htmlFor="pp-desa" className="mb-1 block text-sm font-medium text-emerald-50">
              {t("fields.desa")}
            </label>
            <input
              id="pp-desa"
              type="text"
              value={desa}
              onChange={(e) => setDesa(e.target.value)}
              placeholder={t("fields.desaPlaceholder")}
              className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click_petanipadi", { persona: "petani-padi" })}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}

export function PetaniPadiLegalDocCta() {
  const t = useTranslations("untukPetaniPadi.legalDoc");
  return (
    <a
      href="/downloads/petani-padi-dokumen-legal-sample.pdf"
      download
      onClick={() => trackEvent("legal_doc_download_petanipadi", { persona: "petani-padi" })}
      className="mt-4 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
    >
      {t("cta")}
    </a>
  );
}
