"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-stone-900"
            >
              {item.question}
              <span className={cn("shrink-0 transition-transform", isOpen && "rotate-45")} aria-hidden>
                +
              </span>
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm text-stone-600">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
