"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DownloadPaperButton({ title, fileAvailable }: { title: string; fileAvailable: boolean }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !EMAIL_RE.test(email)) {
      setError("Masukkan alamat email yang valid untuk menerima tautan unduhan.");
      return;
    }
    setError("");
    setSent(true);
  }

  function handleClose() {
    setOpen(false);
    setEmail("");
    setError("");
    setSent(false);
  }

  if (!fileAvailable) {
    return (
      <div className="rounded-lg bg-stone-100 px-4 py-2.5 text-sm text-stone-500">
        Dokumen tidak tersedia untuk diunduh saat ini.
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Unduh White Paper
      </button>
      <Modal open={open} onClose={handleClose} title="Unduh Dokumen">
        {sent ? (
          <div>
            <p className="text-sm text-emerald-700">
              Tautan unduhan untuk <strong>{title}</strong> telah dikirim ke <strong>{email}</strong>.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="mb-3 text-sm text-stone-500">
              Masukkan email untuk menerima tautan unduhan &ldquo;{title}&rdquo;.
            </p>
            <label htmlFor="paper-email" className="sr-only">
              Email
            </label>
            <input
              id="paper-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Kirim Tautan Unduhan
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
