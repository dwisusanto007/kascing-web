"use client";

import { useState } from "react";
import { cn, hashString } from "@/lib/utils";

const GRADIENTS = [
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-lime-600 to-lime-800",
  "from-teal-500 to-teal-700",
  "from-orange-500 to-orange-700",
  "from-green-600 to-green-800",
];

function IconLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12c0-5 4-9 9-9h5v5c0 5-4 9-9 9H5v-5Z" />
      <path d="M6 18 15 9" />
    </svg>
  );
}

function IconSprout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21V11" />
      <path d="M12 11c0-3.5-2.5-6-6-6 0 3.5 2.5 6 6 6Z" />
      <path d="M12 8c0-2.5 1.8-4.5 4.5-4.5C16.5 6 14.5 8 12 8Z" />
    </svg>
  );
}

function IconDroplet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" />
    </svg>
  );
}

function IconSun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

function IconPackage({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3.5 7 8.5-4 8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 7v10l8.5 4 8.5-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

const ICONS = [IconLeaf, IconSprout, IconDroplet, IconSun, IconPackage, IconMapPin];

interface PlaceholderImageProps {
  label: string;
  hasImage?: boolean;
  className?: string;
  fallbackText?: string;
  /** Real photo URL, when one is available. Falls back to the icon placeholder on load failure. */
  imageSrc?: string;
}

/**
 * Placeholder used in place of real photos everywhere in the app. Also acts
 * as the "broken/missing image" fallback: when hasImage is false it renders
 * a neutral placeholder instead of a broken image icon. When imageSrc is
 * given, renders the real photo and falls back to the icon placeholder if it
 * fails to load — so filling in real assets later never risks a broken
 * <img>.
 */
export function PlaceholderImage({
  label,
  hasImage = true,
  className,
  fallbackText = "Foto belum tersedia",
  imageSrc,
}: PlaceholderImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!hasImage) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-stone-100 text-center text-stone-400",
          className,
        )}
      >
        <span className="px-2 text-xs">{fallbackText}</span>
      </div>
    );
  }

  if (imageSrc && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- no remote image loader configured; this stays a plain img.
      <img
        src={imageSrc}
        alt={label}
        onError={() => setImageFailed(true)}
        className={cn("shrink-0 object-cover", className)}
      />
    );
  }

  const index = hashString(label) % GRADIENTS.length;
  const Icon = ICONS[index];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br text-white",
        GRADIENTS[index],
        className,
      )}
      aria-hidden
    >
      <Icon className="h-10 w-10 opacity-90" />
    </div>
  );
}
