import { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";
import { SkeletonForm } from "@/components/ui/Skeleton";
import { RegistrationForm } from "@/components/direktori/RegistrationForm";

export const metadata: Metadata = { title: "Daftarkan Bisnis Anda" };

export default function DaftarProdusenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Direktori", href: "/direktori" }, { label: "Daftarkan Bisnis" }]} />
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Daftarkan Bisnis Kascing Anda</h1>
      <p className="mt-2 text-sm text-stone-500">
        Lengkapi formulir berikut untuk mendaftarkan produsen kascing Anda ke direktori Vermicompost.id. Tim kami akan
        meninjau pendaftaran sebelum tampil secara publik.
      </p>
      <div className="mt-8">
        <SectionErrorBoundary label="formulir pendaftaran">
          <Suspense fallback={<SkeletonForm fields={5} />}>
            <RegistrationForm />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
