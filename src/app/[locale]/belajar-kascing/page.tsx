import { Suspense } from "react";
import type { Metadata } from "next";
import { ArticleExplorer } from "@/components/belajar/ArticleExplorer";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Belajar Kascing" };

export default function BelajarKascingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Belajar Kascing</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">
        Panduan dan artikel edukasi seputar budidaya dan pemanfaatan kascing, dari pemula hingga kebutuhan ekspor.
      </p>
      <div className="mt-8">
        <SectionErrorBoundary label="daftar artikel">
          <Suspense fallback={<SkeletonCardGrid count={6} />}>
            <ArticleExplorer />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
