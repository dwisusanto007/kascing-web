import { cn, hashString, initials } from "@/lib/utils";

const PALETTE = [
  "bg-emerald-600",
  "bg-amber-600",
  "bg-lime-700",
  "bg-teal-600",
  "bg-orange-600",
  "bg-green-700",
];

interface PlaceholderImageProps {
  label: string;
  hasImage?: boolean;
  className?: string;
  fallbackText?: string;
}

/**
 * Deterministic colored placeholder used in place of real photos everywhere
 * in the app. Also acts as the "broken/missing image" fallback: when
 * hasImage is false it renders a neutral placeholder instead of a broken
 * image icon.
 */
export function PlaceholderImage({
  label,
  hasImage = true,
  className,
  fallbackText = "Foto belum tersedia",
}: PlaceholderImageProps) {
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

  const color = PALETTE[hashString(label) % PALETTE.length];
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center text-white", color, className)}
      aria-hidden
    >
      <span className="text-lg font-semibold tracking-wide">{initials(label)}</span>
    </div>
  );
}
