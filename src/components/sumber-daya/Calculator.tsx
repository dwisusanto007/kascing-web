"use client";

import { useState, type FormEvent } from "react";
import { calculatorRates } from "@/lib/mock-data";

const OPTIONS = [...calculatorRates.map((r) => r.commodity), "Lainnya"];

export function Calculator() {
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
      setError("Luas lahan wajib diisi.");
      return;
    }
    const value = Number(area);
    if (Number.isNaN(value)) {
      setError("Masukkan angka yang valid untuk luas lahan.");
      return;
    }
    if (value <= 0) {
      setError("Luas lahan harus lebih besar dari 0.");
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
          Luas Lahan (m²)
        </label>
        <input
          id="calc-area"
          type="text"
          inputMode="decimal"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="mis. 100"
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="calc-commodity" className="mb-1 block text-sm font-medium text-stone-700">
          Jenis Komoditas
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
          className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Hitung Kebutuhan
        </button>
      </div>

      {error && (
        <p role="alert" className="sm:col-span-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {noData && (
        <p role="status" className="sm:col-span-3 text-sm text-amber-600">
          Data perhitungan belum tersedia untuk komoditas &ldquo;{commodity}&rdquo;.
        </p>
      )}
      {result && (
        <div role="status" className="sm:col-span-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Estimasi kebutuhan kascing untuk {area} m² lahan {result.commodity.toLowerCase()}: {" "}
          <strong>{result.kg} kg</strong>.
        </div>
      )}
    </form>
  );
}
