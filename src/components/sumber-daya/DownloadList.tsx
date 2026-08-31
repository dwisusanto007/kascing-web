"use client";

import { useState } from "react";
import { downloadResources } from "@/lib/mock-data";

export function DownloadList() {
  const [message, setMessage] = useState<Record<string, string>>({});

  function handleDownload(id: string, available: boolean, title: string) {
    if (!available) {
      setMessage((m) => ({ ...m, [id]: "File tidak tersedia saat ini. Coba lagi nanti." }));
      return;
    }
    setMessage((m) => ({ ...m, [id]: `Mengunduh "${title}"…` }));
  }

  return (
    <ul className="flex flex-col gap-3">
      {downloadResources.map((d) => (
        <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4">
          <div>
            <p className="font-medium text-stone-900">{d.title}</p>
            <p className="text-xs text-stone-400">
              {d.type} · {(d.sizeKb / 1024).toFixed(1)} MB
            </p>
            {message[d.id] && (
              <p className={`mt-1 text-xs ${message[d.id].startsWith("File tidak") ? "text-red-600" : "text-emerald-700"}`}>
                {message[d.id]}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleDownload(d.id, d.available, d.title)}
            className="shrink-0 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Unduh
          </button>
        </li>
      ))}
    </ul>
  );
}
