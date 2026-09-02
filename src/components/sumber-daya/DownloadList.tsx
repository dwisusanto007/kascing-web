"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { downloadResources } from "@/lib/mock-data";

export function DownloadList() {
  const t = useTranslations("sumberDaya.downloads");
  const tCommon = useTranslations("common");
  const [message, setMessage] = useState<Record<string, { text: string; isError: boolean }>>({});

  function handleDownload(id: string, available: boolean, title: string) {
    if (!available) {
      setMessage((m) => ({ ...m, [id]: { text: t("unavailable"), isError: true } }));
      return;
    }
    setMessage((m) => ({ ...m, [id]: { text: t("downloading", { title }), isError: false } }));
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
              <p className={`mt-1 text-xs ${message[d.id].isError ? "text-red-600" : "text-emerald-700"}`}>
                {message[d.id].text}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleDownload(d.id, d.available, d.title)}
            className="shrink-0 rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            {tCommon("unduh")}
          </button>
        </li>
      ))}
    </ul>
  );
}
