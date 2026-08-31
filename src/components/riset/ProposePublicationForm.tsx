"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACCEPTED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

interface FormState {
  title: string;
  author: string;
  email: string;
  abstract: string;
}

export function ProposePublicationForm() {
  const [form, setForm] = useState<FormState>({ title: "", author: "", email: "", abstract: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Format dokumen tidak didukung. Gunakan PDF atau DOC/DOCX.");
      setFileName("");
      return;
    }
    setFileError("");
    setFileName(file.name);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<FormState> = {};
    if (!form.title.trim()) next.title = "Judul publikasi wajib diisi.";
    if (!form.author.trim()) next.author = "Nama peneliti wajib diisi.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) next.email = "Format email tidak valid.";
    if (!form.abstract.trim()) next.abstract = "Abstrak/ringkasan wajib diisi.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-medium text-emerald-900">Terima kasih, pengajuan publikasi Anda telah kami terima.</p>
        <p className="mt-1 text-sm text-emerald-800">Tim editorial akan meninjau dan menghubungi Anda melalui {form.email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Judul Publikasi</label>
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Nama Peneliti</label>
          <input
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.author && <p className="mt-1 text-xs text-red-600">{errors.author}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Abstrak/Ringkasan</label>
        <textarea
          rows={4}
          value={form.abstract}
          onChange={(e) => update("abstract", e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {errors.abstract && <p className="mt-1 text-xs text-red-600">{errors.abstract}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Unggah Dokumen (PDF/DOC, opsional)</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="text-sm" />
        {fileName && <p className="mt-1 text-xs text-emerald-700">Terpilih: {fileName}</p>}
        {fileError && <p className="mt-1 text-xs text-red-600">{fileError}</p>}
      </div>
      <button
        type="submit"
        className="w-fit rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Ajukan Publikasi
      </button>
    </form>
  );
}
