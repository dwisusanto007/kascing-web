"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Magic value QA can use to exercise the "email already registered" state. */
const DUPLICATE_EMAIL = "sudah@terdaftar.com";

type Status = "idle" | "loading" | "success" | "error" | "duplicate";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !EMAIL_RE.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 500));
    if (email.trim().toLowerCase() === DUPLICATE_EMAIL) {
      setStatus("duplicate");
      return;
    }
    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return <p className="text-sm font-medium text-emerald-700">Terima kasih! Email kamu sudah terdaftar untuk newsletter.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-2", !compact && "sm:flex-row")} noValidate>
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Alamat email
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle" && status !== "loading") setStatus("idle");
          }}
          placeholder="Alamat email kamu"
          aria-invalid={status === "error"}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
            status === "error" ? "border-red-400" : "border-stone-300",
          )}
        />
        {status === "error" && (
          <p className="mt-1 text-xs text-red-600">Masukkan alamat email yang valid.</p>
        )}
        {status === "duplicate" && (
          <p className="mt-1 text-xs text-amber-600">Email ini sudah terdaftar di newsletter kami.</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {status === "loading" ? "Mengirim…" : "Berlangganan"}
      </button>
    </form>
  );
}
