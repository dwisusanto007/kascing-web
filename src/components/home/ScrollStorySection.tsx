"use client";

import { useEffect, useRef, useState } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/utils";

export interface ScrollStoryPoint {
  title: string;
  description: string;
  imageSrc?: string;
}

interface ScrollStorySectionProps {
  points: ScrollStoryPoint[];
}

/**
 * join.com-style scroll story: each point's title/description sits in the
 * left column, and a sticky visual on the right swaps to match whichever
 * point is nearest the viewport center. Sticky only kicks in at lg+ — below
 * that every point carries its own inline visual instead, so the section is
 * a plain stacked read with no scroll-driven behavior on mobile.
 */
export function ScrollStorySection({ points }: ScrollStorySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = itemRefs.current.findIndex((el) => el === entry.target);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [points.length]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-16 lg:gap-24">
        {points.map((point, index) => (
          <div
            key={point.title}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="flex flex-col justify-center lg:min-h-[45vh]"
          >
            <span className="text-xs font-bold text-emerald-700">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-xl font-bold text-stone-900 sm:text-2xl">{point.title}</h3>
            <p className="mt-3 max-w-md text-stone-600">{point.description}</p>
            <PlaceholderImage
              label={point.title}
              imageSrc={point.imageSrc}
              className="mt-6 h-56 w-full rounded-2xl object-cover lg:hidden"
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-24 h-[420px] overflow-hidden rounded-2xl">
          {points.map((point, index) => (
            <PlaceholderImage
              key={point.title}
              label={point.title}
              imageSrc={point.imageSrc}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none",
                index === activeIndex ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
