import { Suspense } from "react";
import type { Metadata } from "next";
import { NewsExplorer } from "@/components/berita/NewsExplorer";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Berita & Artikel" };

export default function BeritaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Berita & Artikel</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">
        Kabar terbaru seputar industri kascing, update riset, dan press release, terurut dari yang terbaru.
      </p>
      <div className="mt-8">
        <SectionErrorBoundary label="daftar berita">
          <Suspense fallback={<SkeletonCardGrid count={6} />}>
            <NewsExplorer />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
