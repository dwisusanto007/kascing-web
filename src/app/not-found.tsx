import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-5xl" aria-hidden>
        🪱
      </span>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-stone-500">
        Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau belum tersedia.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/direktori"
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Cari Produsen
        </Link>
      </div>
    </div>
  );
}
