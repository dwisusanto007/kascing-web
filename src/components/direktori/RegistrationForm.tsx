"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CERTIFICATIONS_LIST, COMMODITIES_LIST, PRODUCTS_LIST, PROVINCES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+][0-9 -]{7,15}$/;
const MAX_FILE_MB = 5;

interface FormState {
  businessName: string;
  province: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  products: string[];
  commodities: string[];
  capacity: string;
  certifications: string[];
  photoName: string;
  photoError: string;
}

const INITIAL_STATE: FormState = {
  businessName: "",
  province: "",
  city: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  products: [],
  commodities: [],
  capacity: "",
  certifications: [],
  photoName: "",
  photoError: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

export function RegistrationForm() {
  const t = useTranslations("direktori.form");
  const tCommon = useTranslations("common");
  const tDetail = useTranslations("direktori.detail");
  const tFilter = useTranslations("direktori.filter");
  const tCapacity = useTranslations("direktori.capacity");
  const searchParams = useSearchParams();
  const debugError = searchParams.get("debugError") === "1";

  const STEPS = [t("steps.data"), t("steps.kontak"), t("steps.produk"), t("steps.foto")] as const;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitLock = useRef(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleMulti(key: "products" | "commodities" | "certifications", value: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  function validateStep(current: number): Errors {
    const next: Errors = {};
    if (current === 0) {
      if (!form.businessName.trim()) next.businessName = t("errors.businessNameRequired");
      if (!form.province) next.province = t("errors.provinceRequired");
      if (!form.city.trim()) next.city = t("errors.cityRequired");
      if (!form.address.trim()) next.address = t("errors.addressRequired");
    }
    if (current === 1) {
      if (!form.whatsapp.trim() && !form.phone.trim()) {
        next.whatsapp = t("errors.contactRequired");
      }
      if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) next.phone = t("errors.invalidPhone");
      if (form.whatsapp.trim() && !PHONE_RE.test(form.whatsapp.trim())) next.whatsapp = t("errors.invalidWhatsapp");
      if (!form.email.trim()) next.email = t("errors.emailRequired");
      else if (!EMAIL_RE.test(form.email.trim())) next.email = t("errors.invalidEmail");
    }
    if (current === 2) {
      if (form.products.length === 0) next.products = t("errors.productsRequired");
      if (!form.capacity) next.capacity = t("errors.capacityRequired");
    }
    return next;
  }

  function handleNext() {
    const stepErrors = validateStep(step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setForm((f) => ({ ...f, photoName: "", photoError: t("errors.invalidFileType") }));
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setForm((f) => ({ ...f, photoName: "", photoError: t("errors.fileTooLarge", { max: String(MAX_FILE_MB) }) }));
      return;
    }
    setForm((f) => ({ ...f, photoName: file.name, photoError: "" }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Only the last step's button actually submits. This guard also protects
    // against the form being submitted by an Enter keypress, or by a stray
    // click landing on the submit button right as it swaps in for "Lanjut".
    if (step !== STEPS.length - 1) return;
    if (submitLock.current) return; // guard against double-click / double submit
    const stepErrors = validateStep(0);
    if (Object.keys(stepErrors).length > 0) {
      setStep(0);
      setErrors(stepErrors);
      return;
    }
    submitLock.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (debugError) reject(new Error(t("errors.submitConnectionLost")));
          else resolve();
        }, 900);
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t("errors.submitGeneric"));
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <span className="text-4xl" aria-hidden>
          ✅
        </span>
        <h2 className="mt-3 text-lg font-semibold text-emerald-900">{t("success.title")}</h2>
        <p className="mt-2 text-sm text-emerald-800">
          {t.rich("success.message", {
            name: form.businessName,
            email: form.email,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <Link href="/direktori" className="mt-5 inline-block rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800">
          {t("success.cta")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full font-semibold",
                i === step
                  ? "bg-emerald-700 text-white"
                  : i < step
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-stone-400",
              )}
            >
              {i + 1}
            </span>
            <span className={i === step ? "font-medium text-stone-900" : "text-stone-400"}>{label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 text-stone-300">—</span>}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label={t("fields.businessName")} error={errors.businessName} required>
              <input
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                className={inputClass(!!errors.businessName)}
              />
            </Field>
            <Field label={t("fields.province")} error={errors.province} required>
              <select value={form.province} onChange={(e) => update("province", e.target.value)} className={inputClass(!!errors.province)}>
                <option value="">{t("fields.provincePlaceholder")}</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("fields.city")} error={errors.city} required>
              <input value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass(!!errors.city)} />
            </Field>
            <Field label={t("fields.address")} error={errors.address} required>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                rows={3}
                className={inputClass(!!errors.address)}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Field label={t("fields.whatsapp")} error={errors.whatsapp} required>
              <input
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                placeholder="62812xxxxxxx"
                className={inputClass(!!errors.whatsapp)}
              />
            </Field>
            <Field label={t("fields.phone")} error={errors.phone}>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass(!!errors.phone)} />
            </Field>
            <Field label={t("fields.email")} error={errors.email} required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass(!!errors.email)}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <CheckboxGroup
              label={tDetail("productsTitle")}
              required
              error={errors.products}
              options={PRODUCTS_LIST}
              selected={form.products}
              onToggle={(v) => toggleMulti("products", v)}
            />
            <Field label={tFilter("kapasitas")} error={errors.capacity} required>
              <select value={form.capacity} onChange={(e) => update("capacity", e.target.value)} className={inputClass(!!errors.capacity)}>
                <option value="">{t("fields.capacityPlaceholder")}</option>
                <option value="kecil">{tCapacity("kecil")}</option>
                <option value="menengah">{tCapacity("menengah")}</option>
                <option value="besar">{tCapacity("besar")}</option>
              </select>
            </Field>
            <CheckboxGroup
              label={t("fields.commoditiesOptional")}
              options={COMMODITIES_LIST}
              selected={form.commodities}
              onToggle={(v) => toggleMulti("commodities", v)}
            />
            <CheckboxGroup
              label={t("fields.certificationsOptional")}
              options={CERTIFICATIONS_LIST}
              selected={form.certifications}
              onToggle={(v) => toggleMulti("certifications", v)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <Field label={t("fields.photoUpload")} error={form.photoError}>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
              {form.photoName && (
                <p className="mt-1 text-xs text-emerald-700">{t("fields.fileSelected", { filename: form.photoName })}</p>
              )}
            </Field>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
              <p className="font-medium text-stone-800">{t("summary.title")}</p>
              <dl className="mt-2 grid grid-cols-1 gap-1 text-stone-600 sm:grid-cols-2">
                <SummaryRow label={t("summary.businessName")} value={form.businessName} />
                <SummaryRow label={t("summary.location")} value={`${form.city}, ${form.province}`} />
                <SummaryRow label={t("summary.whatsapp")} value={form.whatsapp || form.phone || "-"} />
                <SummaryRow label={t("summary.email")} value={form.email} />
                <SummaryRow label={t("summary.products")} value={form.products.join(", ") || "-"} />
                <SummaryRow label={t("summary.capacity")} value={form.capacity || "-"} />
              </dl>
            </div>

            {submitError && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {t("errors.submitErrorSuffix", { error: submitError })}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {tCommon("kembali")}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              key="next-button"
              type="button"
              onClick={handleNext}
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
            >
              {t("next")}
            </button>
          ) : (
            <button
              key="submit-button"
              type="submit"
              disabled={submitting}
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {submitting ? tCommon("sending") : t("submit")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500",
    hasError ? "border-red-400" : "border-stone-300",
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  required,
  error,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-stone-700">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={cn(
              "cursor-pointer rounded-lg border px-3 py-1.5 text-sm",
              selected.includes(opt) ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-stone-300 text-stone-600",
            )}
          >
            <input type="checkbox" className="sr-only" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
            {opt}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 sm:block">
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="font-medium text-stone-800">{value}</dd>
    </div>
  );
}
