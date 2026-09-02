"use client";

import { Component, Fragment, type ErrorInfo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const MAX_ATTEMPTS = 3;

interface Props {
  children: ReactNode;
  label?: string;
  t: (key: string, values?: Record<string, string>) => string;
  tCommon: (key: string) => string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  attempts: number;
}

class SectionErrorBoundaryImpl extends Component<Props, State> {
  state: State = { hasError: false, error: null, attempts: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[SectionErrorBoundary${this.props.label ? `:${this.props.label}` : ""}]`, error, info.componentStack);
  }

  handleRetry = () => {
    this.setState((s) => ({ hasError: false, error: null, attempts: s.attempts + 1 }));
  };

  render() {
    const { hasError, error, attempts } = this.state;
    const { t, tCommon, label } = this.props;
    if (hasError) {
      const exhausted = attempts >= MAX_ATTEMPTS;
      return (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800">
            {label ? t("titleWithLabel", { label }) : t("titleGeneric")}
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              disabled={exhausted}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tCommon("cobaLagi")}
            </button>
            <Link
              href="/"
              className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              {tCommon("kembaliKeBeranda")}
            </Link>
          </div>
          {exhausted && <p className="mt-3 text-xs text-red-500">{t("exhausted")}</p>}
        </div>
      );
    }
    // Keyed fragment forces children to remount on retry, so their effects re-run.
    return <Fragment key={attempts}>{this.props.children}</Fragment>;
  }
}

/**
 * Scoped error boundary for an individual section/widget on a page — a crash
 * inside `children` only replaces that section with a fallback, the rest of
 * the page (nav, footer, sibling sections) keeps working. Retry is capped so
 * a persistently failing section can't loop forever.
 *
 * Thin functional wrapper: `useTranslations` is a hook and can't be called
 * inside the class component above, so this wrapper resolves the strings
 * and forwards them as props.
 */
export function SectionErrorBoundary({ children, label }: { children: ReactNode; label?: string }) {
  const t = useTranslations("errors.sectionFallback");
  const tCommon = useTranslations("common");
  return (
    <SectionErrorBoundaryImpl label={label} t={t} tCommon={tCommon}>
      {children}
    </SectionErrorBoundaryImpl>
  );
}
