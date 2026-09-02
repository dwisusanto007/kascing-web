import { notFound } from "next/navigation";

// Catches any path under /[locale]/... that doesn't match a real route, so
// the request enters this segment tree and triggers the sibling
// not-found.tsx instead of falling through to Next's generic default 404
// (which has no locale awareness).
export default function CatchAll() {
  notFound();
}
