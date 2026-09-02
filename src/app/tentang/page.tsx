import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tentang" };

export default function TentangPage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <span className="text-4xl" aria-hidden>
        🚧
      </span>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Segera Hadir</h1>
      <p className="mt-2 text-sm text-stone-500">
        Halaman &ldquo;Tentang Vermicompost.id&rdquo; sedang kami siapkan. Sementara itu, jelajahi konten edukasi dan
        direktori produsen kami.
      </p>
    </div>
  );
}
