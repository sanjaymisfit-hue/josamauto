"use client";

import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/[0.05] border border-white/[0.06] bg-onyx">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-coal sm:px-8"
            >
              <span className={`font-display text-base sm:text-lg ${isOpen ? "text-gold" : "text-ivory"}`}>
                {item.q}
              </span>
              <span
                className={`font-display shrink-0 text-2xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45 text-gold" : "text-sand"}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-sand sm:px-8 sm:text-[15px]">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
