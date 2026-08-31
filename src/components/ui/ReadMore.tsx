"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Collapses long text with a "baca selengkapnya" toggle so layout never overflows. */
export function ReadMore({ text, lines = 4 }: { text: string; lines?: number }) {
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
        {expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
      </button>
    </div>
  );
}
