import { Suspense } from "react";
import type { Metadata } from "next";
import { ResearchExplorer } from "@/components/riset/ResearchExplorer";
import { ProposePublicationForm } from "@/components/riset/ProposePublicationForm";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonCardGrid } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Riset & Publikasi" };

export default function RisetPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Riset & Publikasi</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone-500">
        Jurnal, laporan, dan white paper seputar kascing dari berbagai komoditas.
      </p>
      <div className="mt-8">
        <SectionErrorBoundary label="daftar riset & publikasi">
          <Suspense fallback={<SkeletonCardGrid count={5} />}>
            <ResearchExplorer />
          </Suspense>
        </SectionErrorBoundary>
      </div>

      <div className="mt-16 rounded-xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-stone-900">Ajukan Publikasi</h2>
        <p className="mt-1 max-w-2xl text-sm text-stone-500">
          Peneliti dapat mengajukan jurnal atau laporan untuk dipublikasikan melalui Vermicompost.id.
        </p>
        <div className="mt-6">
          <ProposePublicationForm />
        </div>
      </div>
    </div>
  );
}
