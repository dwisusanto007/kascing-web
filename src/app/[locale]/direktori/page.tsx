import { Suspense } from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { DirectoryExplorer } from "@/components/direktori/DirectoryExplorer";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Direktori Produsen Kascing" };

export default function DirektoriPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Direktori Produsen Kascing</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-500">
            Temukan produsen kascing terdekat berdasarkan lokasi, jenis produk, kapasitas produksi, dan sertifikasi.
          </p>
        </div>
        <Link
          href="/direktori/daftar"
          className="shrink-0 rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Daftarkan Bisnis Anda
        </Link>
      </div>

      <div className="mt-8">
        <SectionErrorBoundary label="daftar produsen">
          <Suspense fallback={<SkeletonCardGrid count={6} />}>
            <DirectoryExplorer />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
