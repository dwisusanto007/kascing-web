"use client";

// global-error.tsx replaces the ROOT layout when the layout itself crashes,
// so it must render its own <html>/<body> — this is the last-resort fallback
// that guarantees the user never sees a blank screen.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <span style={{ fontSize: "2.5rem" }} aria-hidden>
          ⚠️
        </span>
        <h1 className="mt-4 text-xl font-semibold text-stone-900">Terjadi kesalahan pada aplikasi</h1>
        <p className="mt-2 max-w-sm text-sm text-stone-500">
          Mohon maaf, halaman gagal dimuat. Silakan coba lagi.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-2 max-w-full overflow-x-auto rounded bg-stone-100 p-2 text-left text-xs text-stone-500">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white"
        >
          Coba lagi
        </button>
      </body>
    </html>
  );
}
