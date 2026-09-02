"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Collapses long text with a "baca selengkapnya" toggle so layout never overflows. */
export function ReadMore({ text, lines = 4 }: { text: string; lines?: number }) {
  const t = useTranslations("common.readMore");
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={cn("whitespace-pre-line text-sm leading-relaxed text-stone-600", !expanded && "line-clamp-[8]")}
        style={!expanded ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-2 text-sm font-medium text-emerald-700 hover:underline"
      >
        {expanded ? t("less") : t("more")}
      </button>
    </div>
  );
}
