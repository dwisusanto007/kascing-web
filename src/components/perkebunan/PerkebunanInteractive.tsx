"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/gtag";

const WHATSAPP_NUMBER = "6285183034318";
const PRICE_PER_KG = 2500;

const COMMODITIES = ["karet", "sawit", "durian", "alpukat"] as const;
type CommodityKey = (typeof COMMODITIES)[number];

const COMMODITY_LABELS: Record<CommodityKey, string> = {
  karet: "Karet",
  sawit: "Sawit",
  durian: "Durian",
  alpukat: "Alpukat",
};

/**
 * Illustrative kg-per-hectare dosage, NOT the same kgPerM2 unit as the general
 * Sumber Daya calculator (which is calibrated for small garden plots). Plantations
 * only fertilize the root/canopy zone around each tree, not the whole hectare, so
 * naively scaling a garden-plot rate by 10,000 m²/ha produces absurd tonnage.
 * Still dummy data pending agronomist validation - see disclaimer in the UI.
 */
const KG_PER_HECTARE: Record<CommodityKey, number> = {
  karet: 800,
  sawit: 1000,
  durian: 600,
  alpukat: 700,
};

/** Only the entry with a matching real, sourced case study - others fall back to the generic Perkebunan tab. */
const CASE_STUDY_SLUGS: Partial<Record<CommodityKey, string>> = {
  sawit: "perkebunan-sawit-riau-tingkatkan-produktivitas",
};

export function PerkebunanInteractive() {
  const t = useTranslations("untukPerkebunan");
  const [commodity, setCommodity] = useState<CommodityKey>("sawit");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ kg: number; cost: number; area: string } | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(null);

    if (area.trim() === "") {
      setError(t("calculator.errors.areaRequired"));
      return;
    }
    const value = Number(area);
    if (Number.isNaN(value)) {
      setError(t("calculator.errors.areaInvalid"));
      return;
    }
    if (value <= 0) {
      setError(t("calculator.errors.areaPositive"));
      return;
    }

    const kg = Math.round(value * KG_PER_HECTARE[commodity] * 10) / 10;
    const cost = Math.round(kg * PRICE_PER_KG);

    setError("");
    setResult({ kg, cost, area });
    trackEvent("calculator_submit_perkebunan", { persona: "perkebunan", komoditas: commodity });
  }

  const waMessage = t("waCta.messageTemplate", {
    commodity: COMMODITY_LABELS[commodity],
    location: location.trim() || t("waCta.locationPlaceholder"),
    area: area.trim() || t("waCta.areaPlaceholder"),
  });
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  function handleWaClick() {
    trackEvent("whatsapp_click_perkebunan", { persona: "perkebunan", komoditas: commodity });
  }

  const caseStudySlug = CASE_STUDY_SLUGS[commodity];

  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("commodity.title")}</h2>
        <div role="tablist" aria-label={t("commodity.title")} className="mt-4 flex flex-wrap gap-2">
          {COMMODITIES.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={commodity === key}
              onClick={() => setCommodity(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                commodity === key ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {t(`commodity.${key}.label`)}
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          {t("commodity.sampleLabel")}
        </p>
        <div role="tabpanel" className="mt-4 rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-700">{t(`commodity.${commodity}.dosage`)}</p>
          <p className="mt-2 text-sm text-stone-600">{t(`commodity.${commodity}.benefit`)}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("caseStudy.title")}</h2>
        {caseStudySlug ? (
          <Link href={`/studi-kasus/${caseStudySlug}`} className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline">
            {t("caseStudy.specificCta", { commodity: t(`commodity.${commodity}.label`) })}
          </Link>
        ) : (
          <Link href="/studi-kasus?persona=perkebunan" className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline">
            {t("caseStudy.genericCta")}
          </Link>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("calculator.title")}</h2>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          {t("calculator.disclaimer")}
        </p>
        <form onSubmit={handleSubmit} noValidate className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end">
          <div>
            <label htmlFor="pk-area" className="mb-1 block text-sm font-medium text-stone-700">
              {t("calculator.fields.area")}
            </label>
            <input
              id="pk-area"
              type="text"
              inputMode="decimal"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={t("calculator.fields.areaPlaceholder")}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="pk-commodity" className="mb-1 block text-sm font-medium text-stone-700">
              {t("calculator.fields.commodity")}
            </label>
            <select
              id="pk-commodity"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value as CommodityKey)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {COMMODITIES.map((key) => (
                <option key={key} value={key}>
                  {t(`commodity.${key}.label`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pk-location" className="mb-1 block text-sm font-medium text-stone-700">
              {t("calculator.fields.location")}
            </label>
            <input
              id="pk-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("calculator.fields.locationPlaceholder")}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
            >
              {t("calculator.submit")}
            </button>
          </div>

          {error && (
            <p role="alert" className="sm:col-span-4 text-sm text-red-600">
              {error}
            </p>
          )}
          {result && (
            <div role="status" className="sm:col-span-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {t("calculator.result", { area: result.area, commodity: t(`commodity.${commodity}.label`).toLowerCase() })}{" "}
              <strong>{t("calculator.resultKg", { kg: result.kg })}</strong>
              {" "}
              <strong>{t("calculator.resultCost", { cost: result.cost.toLocaleString("id-ID") })}</strong>
            </div>
          )}
        </form>
      </section>

      <section className="bg-emerald-700">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{t("waCta.demoTitle")}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWaClick}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              {t("waCta.demoCta")}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900">{t("waCta.bulkTitle")}</h2>
        <div className="mt-6 flex justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWaClick}
            className="rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            {t("waCta.bulkCta")}
          </a>
        </div>
      </section>
    </div>
  );
}
