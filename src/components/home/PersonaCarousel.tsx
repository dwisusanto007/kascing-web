"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface PersonaCarouselProps {
  ariaLabel: string;
  children: ReactNode[];
}

/**
 * Horizontal snap carousel, join.com-style ("Built for every team that's
 * hiring"). Arrows only render once there's actually somewhere to scroll —
 * if every card already fits the viewport, this reads as a plain static
 * row. Swipe works for free via native overflow-x scroll + snap; arrow keys
 * move focus card-to-card while the track has focus.
 */
export function PersonaCarousel({ ariaLabel, children }: PersonaCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollPrev(track.scrollLeft > 4);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-item]");
    const amount = (card?.offsetWidth ?? track.clientWidth) + 20;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.querySelectorAll<HTMLElement>("[data-carousel-item]"));
    const activeItem = (e.target as HTMLElement).closest<HTMLElement>("[data-carousel-item]");
    const currentIndex = activeItem ? items.indexOf(activeItem) : -1;
    const nextIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1;
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    e.preventDefault();
    nextItem.querySelector<HTMLElement>("a, button, [tabindex]")?.focus();
    nextItem.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const showControls = canScrollPrev || canScrollNext;

  return (
    <div>
      {showControls && (
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            aria-label="Sebelumnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            aria-label="Berikutnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div key={index} data-carousel-item className="w-[85%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
