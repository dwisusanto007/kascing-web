"use client";

import { Component, Fragment, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";

const MAX_ATTEMPTS = 3;

interface Props {
  children: ReactNode;
  /** Human readable label used in the fallback message, e.g. "daftar produsen". */
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  attempts: number;
}

/**
 * Scoped error boundary for an individual section/widget on a page — a crash
 * inside `children` only replaces that section with a fallback, the rest of
 * the page (nav, footer, sibling sections) keeps working. Retry is capped so
 * a persistently failing section can't loop forever.
 */
export class SectionErrorBoundary extends Component<Props, State> {
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
    if (hasError) {
      const exhausted = attempts >= MAX_ATTEMPTS;
      return (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800">
            {this.props.label ? `Gagal memuat ${this.props.label}.` : "Terjadi kesalahan saat memuat bagian ini."}
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              disabled={exhausted}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Coba lagi
            </button>
            <Link
              href="/"
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Kembali ke Beranda
            </Link>
          </div>
          {exhausted && (
            <p className="mt-3 text-xs text-red-500">
              Sudah dicoba beberapa kali dan masih gagal. Silakan muat ulang halaman nanti.
            </p>
          )}
        </div>
      );
    }
    // Keyed fragment forces children to remount on retry, so their effects re-run.
    return <Fragment key={attempts}>{this.props.children}</Fragment>;
  }
}
