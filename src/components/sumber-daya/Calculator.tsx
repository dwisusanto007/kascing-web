"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { calculatorRates } from "@/lib/mock-data";

export function Calculator() {
  const t = useTranslations("sumberDaya.calculator");
  const OPTIONS = [...calculatorRates.map((r) => r.commodity), t("fields.commodityOther")];
  const [area, setArea] = useState("");
  const [commodity, setCommodity] = useState(calculatorRates[0].commodity);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ kg: number; commodity: string } | null>(null);
  const [noData, setNoData] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(null);
    setNoData(false);

    if (area.trim() === "") {
      setError(t("errors.areaRequired"));
      return;
    }
    const value = Number(area);
    if (Number.isNaN(value)) {
      setError(t("errors.areaInvalid"));
      return;
    }
    if (value <= 0) {
      setError(t("errors.areaPositive"));
      return;
    }

    const rate = calculatorRates.find((r) => r.commodity === commodity);
    if (!rate) {
      setError("");
      setNoData(true);
      return;
    }

    setError("");
    setResult({ kg: Math.round(value * rate.kgPerM2 * 10) / 10, commodity });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
      <div className="sm:col-span-1">
        <label htmlFor="calc-area" className="mb-1 block text-sm font-medium text-stone-700">
          {t("fields.area")}
        </label>
        <input
          id="calc-area"
          type="text"
          inputMode="decimal"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder={t("fields.areaPlaceholder")}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="calc-commodity" className="mb-1 block text-sm font-medium text-stone-700">
          {t("fields.commodity")}
        </label>
        <select
          id="calc-commodity"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-1">
        <button
          type="submit"
          className="w-full rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {t("submit")}
        </button>
      </div>

      {error && (
        <p role="alert" className="sm:col-span-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {noData && (
        <p role="status" className="sm:col-span-3 text-sm text-amber-600">
          {t("noData", { commodity })}
        </p>
      )}
      {result && (
        <div role="status" className="sm:col-span-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t("result", { area, commodity: result.commodity.toLowerCase() })} <strong>{t("resultKg", { kg: result.kg })}</strong>.
        </div>
      )}
    </form>
  );
}
