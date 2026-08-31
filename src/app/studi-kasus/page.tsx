import { Suspense } from "react";
import type { Metadata } from "next";
import { CaseStudyExplorer } from "@/components/studi-kasus/CaseStudyExplorer";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Studi Kasus" };

export default function StudiKasusPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Studi Kasus</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">
        Cerita nyata penggunaan kascing dari hobiis, perkebunan besar, hingga eksportir.
      </p>
      <div className="mt-8">
        <SectionErrorBoundary label="studi kasus">
          <Suspense fallback={<SkeletonCardGrid count={3} />}>
            <CaseStudyExplorer />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
