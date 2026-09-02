# Bilingual UI (English / Indonesian) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English/Indonesian bilingual UI support to Vermicompost.id, with English as the always-shown default locale, using URL-prefixed routing (`/en/...`, `/id/...`).

**Architecture:** Move every route under `src/app/[locale]/...`, add `next-intl` middleware for locale-prefixed routing (default `en`, no browser-language auto-detection), and extract every UI-chrome string (nav, buttons, headings, forms, empty/error states, and the short marketing copy embedded in component code) into `src/messages/en.json` / `src/messages/id.json`. Content sourced from `mock-data.ts` (articles, news, research, case studies, producer descriptions) and `PROVINCES` stay Indonesian-only in both locales, per the spec.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `next-intl` (new dependency — install via `npm install next-intl@latest`, no version pinned here since it's a fast-moving library; the routing/message patterns in this plan have been next-intl's stable App Router API for multiple major versions). No test framework is configured in this repo (`package.json` has no jest/vitest/playwright) — every task's verification step is `npx eslint .` + `npx next build`, plus a manual Chrome check of both `/en/...` and `/id/...` for the pages that task touches. This mirrors how every prior feature in this session was verified.

**Spec:** `docs/superpowers/specs/2026-09-02-i18n-english-indonesian-design.md`

## Global Constraints

- Default locale is `en`; both locales are always URL-prefixed (`localePrefix: "always"` — never a bare `/direktori`). No `Accept-Language` auto-detection.
- No cookie/localStorage persistence of the chosen locale — each URL is self-contained.
- Only UI chrome is translated. Everything in `mock-data.ts` that is prose/content (producer `description`/`longDescription`, `articles[].content`, `newsItems[].content`, `researchPapers[].abstract`, `caseStudies[].story`/`testimonials`/`metrics`) stays Indonesian in both locales — do not translate it.
- `PROVINCES`, `PRODUCTS_LIST`, `CERTIFICATIONS_LIST`, `COMMODITIES_LIST` (all in `mock-data.ts`), and the local `CATEGORIES`/`DOC_TYPES` arrays in `ArticleExplorer`/`NewsExplorer`/`ResearchExplorer` stay as-is in both locales — do not translate them. Their values double as literal stored data on producer/article/news/research records (rendered directly as badges elsewhere), so translating the label without the data would silently break filter matching. See the spec's 2026-09-02 scope revision.
- `PERSONA_LABELS` (in `types.ts`, replaced by `PERSONA_LABEL_KEYS` in Task 6) and the capacity-tier filter labels hardcoded in `DirectoryExplorer`/`RegistrationForm` (`direktori.capacity.*`) DO get translated — both are pure UI labels keyed by a stable enum id (`Persona`, `capacity`) that's separate from the display text, so there's no data-mismatch risk.
- Every `import ... from "next/link"` in a file this plan touches must become `import { Link } from "@/i18n/navigation"` (the locale-aware wrapper created in Task 1), so hrefs keep the current locale prefix. Internal `href` values stay unprefixed (e.g. `href="/direktori"`) — the `Link` wrapper adds the locale prefix automatically. Do not hand-prefix hrefs with `/en` or `/id`.
- Brand name "Vermicompost.id" is never translated or altered by this plan.
- After every task: run `npx eslint .` (must be clean, matching the existing baseline — see below) and `npx next build` (must succeed) before committing.
- **Existing lint baseline:** `.remember/tmp/last-ndc.ts` has one pre-existing unrelated warning (`@typescript-eslint/no-unused-expressions`). That warning is not introduced by this plan and does not need fixing — just confirm no *new* errors/warnings appear.

---

## Phase 1: Infra + Homepage

### Task 1: Install next-intl, create routing config, restructure `src/app` under `[locale]`

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Modify: `next.config.ts`
- Create: `src/messages/en.json`, `src/messages/id.json`
- Move: every file/dir under `src/app/*` EXCEPT `favicon.ico`, `globals.css`, `global-error.tsx` → same path under `src/app/[locale]/*`
- Delete: `src/app/layout.tsx` (recreated below as `src/app/[locale]/layout.tsx`, not a straight move — its content changes substantially)
- Create: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `routing` (from `@/i18n/routing`, exports `.locales: readonly ["en","id"]` and `.defaultLocale: "en"`) — every later task that needs the list of locales imports this.
- Produces: `Link`, `usePathname`, `useRouter`, `redirect`, `getPathname` (from `@/i18n/navigation`) — every later task replaces `import Link from "next/link"` with `import { Link } from "@/i18n/navigation"`.
- Produces: `src/messages/en.json` / `id.json` with a `common.meta` namespace populated (`title`, `description`). Every later task adds its own namespace(s) to these two files — always keep both files' key structure identical (same keys, only values differ).

- [ ] **Step 1: Install next-intl**

Run: `npm install next-intl@latest`

- [ ] **Step 2: Create the routing config**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
  // next-intl's middleware negotiates a locale from the Accept-Language
  // header by default when a visitor hits an unprefixed path. The spec
  // requires English as a hard default regardless of browser language —
  // this flag turns that negotiation off, so an unprefixed path always
  // redirects to defaultLocale ("en"), never to a browser-preferred locale.
  localeDetection: false,
});
```

- [ ] **Step 3: Create the locale-aware navigation wrapper**

Create `src/i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Create the request config**

Create `src/i18n/request.ts`:

```ts
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 5: Create the middleware**

Create `src/middleware.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 6: Wire the next-intl plugin into next.config.ts**

Replace the full contents of `next.config.ts`:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Create the initial message files**

Create `src/messages/en.json`:

```json
{
  "common": {
    "meta": {
      "title": "Vermicompost.id — Education & Producer Directory",
      "description": "A hub for education, research, and a producer directory for vermicompost (worm castings) — for hobbyists, large plantations, and exporters alike."
    }
  }
}
```

Create `src/messages/id.json`:

```json
{
  "common": {
    "meta": {
      "title": "Vermicompost.id — Edukasi & Direktori Produsen Kascing",
      "description": "Pusat edukasi, riset, dan direktori produsen kascing (bekas cacing) untuk hobiis, perkebunan besar, hingga eksportir."
    }
  }
}
```

(These are the exact strings currently in `src/app/layout.tsx`'s `metadata` export — `id.json` preserves them verbatim, `en.json` is the English translation.)

- [ ] **Step 8: Move every route under `src/app/[locale]/`**

Run:

```bash
mkdir -p "src/app/[locale]"
git mv src/app/belajar-kascing "src/app/[locale]/belajar-kascing"
git mv src/app/berita "src/app/[locale]/berita"
git mv src/app/direktori "src/app/[locale]/direktori"
git mv src/app/riset "src/app/[locale]/riset"
git mv src/app/studi-kasus "src/app/[locale]/studi-kasus"
git mv src/app/sumber-daya "src/app/[locale]/sumber-daya"
git mv src/app/tentang "src/app/[locale]/tentang"
git mv src/app/page.tsx "src/app/[locale]/page.tsx"
git mv src/app/error.tsx "src/app/[locale]/error.tsx"
git mv src/app/not-found.tsx "src/app/[locale]/not-found.tsx"
git rm src/app/layout.tsx
```

`favicon.ico`, `globals.css`, and `global-error.tsx` stay at `src/app/` — do not move them. (`global-error.tsx` must stay at the true root: it replaces the root layout itself on a catastrophic error, and can't rely on the `[locale]` param having resolved.)

- [ ] **Step 9: Create the new locale-aware root layout**

Create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.meta" });
  return {
    title: {
      default: t("title"),
      template: "%s · Vermicompost.id",
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-stone-900">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Note the `globals.css` import changed from `"./globals.css"` to `"../globals.css"` — the file itself didn't move, but this layout now lives one directory deeper.

- [ ] **Step 10: Safety check for stray relative imports**

Run: `grep -rn 'from "\.' src/app; grep -rn 'import "\.' src/app`
Expected: only `src/app/[locale]/layout.tsx:../globals.css` (the one just written). If anything else shows up, fix that import path before continuing (it broke because its file moved one directory deeper).

- [ ] **Step 11: Verify — lint and build**

Run: `npx eslint .`
Expected: no new errors (the one pre-existing warning in `.remember/tmp/last-ndc.ts` is fine).

Run: `npx next build`
Expected: succeeds. `Header`/`Footer`/every page still contain hardcoded Indonesian strings and `next/link` imports at this point — that's fine, later tasks fix those. The build succeeding here proves the routing skeleton (locale param resolution, middleware, message loading, layout) works end to end.

- [ ] **Step 12: Manual verification**

Run `npm run dev`, then in a browser:
- Visit `/` → should redirect to `/en`.
- Visit `/en` → homepage loads, browser tab title reads "Vermicompost.id — Education & Producer Directory".
- Visit `/id` → homepage loads, browser tab title reads "Vermicompost.id — Edukasi & Direktori Produsen Kascing".
- Visit `/en/direktori/tani-subur-kascing` → producer detail page loads (still all-Indonesian content, that's expected).
- Confirm the hard-default behavior: `curl -s -H "Accept-Language: id" -o /dev/null -w "%{redirect_url}\n" http://localhost:3000/` (adjust the port if `npm run dev` picked a different one) should print a redirect to `/en`, not `/id` — this is the `localeDetection: false` setting from Step 2, proving a browser set to Indonesian still lands on the English default.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Add next-intl routing skeleton, move all routes under [locale]"
```

---

### Task 2: Bulk-swap `next/link` for the locale-aware `Link` everywhere

Purely mechanical — no text/content changes. Done as its own task, before any
translation work starts, so that from this point on every page-to-page
navigation preserves whichever locale the visitor is currently on (without
this, a visitor on `/id/...` clicking any link would silently bounce to
`/en/...`, since a bare `next/link` href doesn't carry a locale prefix and
the middleware redirects unprefixed paths to the default locale).

**Files (all get the same one-line import change):**
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/not-found.tsx`
- `src/app/[locale]/direktori/page.tsx`
- `src/app/[locale]/direktori/[slug]/page.tsx`
- `src/app/[locale]/belajar-kascing/[slug]/page.tsx`
- `src/app/[locale]/berita/[slug]/page.tsx`
- `src/app/[locale]/riset/[slug]/page.tsx`
- `src/app/[locale]/studi-kasus/[slug]/page.tsx`
- `src/components/direktori/RegistrationForm.tsx`
- `src/components/home/CtaBanner.tsx`
- `src/components/home/FeatureGrid.tsx`
- `src/components/home/StickyCtaBar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/ui/Breadcrumb.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/PageErrorFallback.tsx`
- `src/components/ui/SectionErrorBoundary.tsx`

**Interfaces:**
- Consumes: `Link` from `@/i18n/navigation` (Task 1).
- Produces: nothing new — every file's public interface is unchanged, only its `Link` import source changes.

- [ ] **Step 1: Confirm every occurrence is the same simple default import**

Run: `grep -rn 'from "next/link"' src`
Expected: one line per file above, all reading exactly `import Link from "next/link";` (no aliasing, no other named imports on that line). If any line differs from that exact form, fix it by hand for that file instead of using the blanket sed in Step 2.

- [ ] **Step 2: Replace the import in every file**

```bash
grep -rl 'from "next/link"' src | xargs sed -i '' 's/import Link from "next\/link";/import { Link } from "@\/i18n\/navigation";/'
```

- [ ] **Step 3: Verify no `next/link` imports remain in app code**

Run: `grep -rn 'from "next/link"' src`
Expected: no output.

- [ ] **Step 4: Lint and build**

Run: `npx eslint .`
Expected: no new errors.

Run: `npx next build`
Expected: succeeds.

- [ ] **Step 5: Manual verification — locale is preserved across navigation**

`npm run dev`, then in a browser: visit `/id`, click through to Direktori, then to a producer detail page, then back to the homepage via the header logo/nav. Confirm the URL stays under `/id/...` the entire time (never silently drops to `/en/...`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Swap next/link for the locale-aware Link everywhere"
```

---

### Task 3: Add the language switcher to Header (desktop + mobile)

**Files:**
- Create: `src/components/layout/LocaleSwitcher.tsx`
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `routing` (`@/i18n/routing`, from Task 1), `Link`/`usePathname` (`@/i18n/navigation`, from Task 1), `useLocale` (from `next-intl`).
- Produces: `LocaleSwitcher` component (default export), no props — reads locale/pathname from context itself. Later tasks don't depend on this beyond importing it into `Header.tsx`.

This task only adds the switcher UI — it does not translate Header's existing
nav strings (that's Task 6). The switcher's own labels are the two-letter
locale codes ("EN"/"ID"), which are not translated content — they're
universally-understood language codes, not UI prose, so no message keys are
needed for them.

- [ ] **Step 1: Create the switcher component**

Create `src/components/layout/LocaleSwitcher.tsx`:

```tsx
"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** EN/ID toggle. Switches locale for the current page without resetting to the homepage. */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-300 p-0.5 text-xs font-semibold">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition",
            loc === locale ? "bg-emerald-700 text-white" : "text-stone-500 hover:text-emerald-700",
          )}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Add it to the desktop header**

In `src/components/layout/Header.tsx`, add the import:

```tsx
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
```

Find the desktop CTA block (the `<div className="hidden shrink-0 lg:block">` wrapping the "Cari Produsen" `Link`) and add `<LocaleSwitcher />` immediately before it, wrapped in a flex row:

```tsx
<div className="hidden shrink-0 items-center gap-3 lg:flex">
  <LocaleSwitcher />
  <Link
    href="/direktori"
    className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
  >
    Cari Produsen
  </Link>
</div>
```

(This replaces the existing `<div className="hidden shrink-0 lg:block">...</div>` wrapper — same child `Link`, new parent `div` classes and the switcher added as a sibling.)

- [ ] **Step 3: Add it to the mobile menu**

In the mobile `<nav>` block (`{mobileOpen && (...)}`), add `<LocaleSwitcher />` right after the closing `</ul>` and before the "Cari Produsen" mobile `Link`:

```tsx
          </ul>
          <div className="mt-3 flex justify-center">
            <LocaleSwitcher />
          </div>
          <Link
            href="/direktori"
            className="mt-3 block rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Cari Produsen
          </Link>
```

- [ ] **Step 4: Lint and build**

Run: `npx eslint .` — expect no new errors.
Run: `npx next build` — expect success.

- [ ] **Step 5: Manual verification**

`npm run dev`. On `/en/direktori`, click "ID" in the switcher — confirm you land on `/id/direktori` (same page, not the homepage). Click "EN" — confirm you're back on `/en/direktori`. Repeat on mobile width (resize under 1024px, open the hamburger menu).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add EN/ID language switcher to header"
```

---

### Task 4: Translate the homepage core (`page.tsx`)

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

**Interfaces:**
- Consumes: `useTranslations`/`getTranslations` (next-intl) — `page.tsx` is a Server Component, so use `getTranslations` (async).
- Produces: `home.hero.*`, `home.sections.*`, `home.personas.*`, `home.story.*` namespaces, plus new shared keys `common.cariProdusenCta`, `common.lihatSemua`. Later tasks (Task 5, Task 8, Phase 3 pages) reuse `common.cariProdusenCta` and `common.lihatSemua` — check for their existence before re-adding.

- [ ] **Step 1: Add the new message keys**

Add to `src/messages/en.json` (merge into the existing top-level object — add `home` as a new top-level key, add `cariProdusenCta`/`lihatSemua` under the existing `common` key):

```json
{
  "common": {
    "meta": { "...": "unchanged from Task 1" },
    "cariProdusenCta": "Find Producers",
    "lihatSemua": "See all"
  },
  "home": {
    "hero": {
      "title": "Organic Vermicompost for Richer Farming",
      "subtitle": "Vermicompost.id helps hobbyists, large plantations, and exporters understand the benefits of vermicompost and find trusted producers across Indonesia.",
      "ctaPrimary": "Start Learning",
      "ctaSecondary": "Find a Nearby Producer",
      "imageLabel": "Vermicompost Hero"
    },
    "sections": {
      "personas": { "title": "Get Started Based on Your Needs", "ariaLabel": "Get started based on your needs" },
      "story": { "title": "Why Start with Vermicompost.id", "errorLabel": "Vermicompost.id value proposition" },
      "features": { "title": "Explore Vermicompost.id", "subtitle": "Everything you need about vermicompost, in one place." },
      "highlights": { "title": "Education & Latest News", "errorLabel": "latest articles & news" },
      "caseStudies": { "errorLabel": "case study preview" },
      "directory": { "title": "Producer Directory", "errorLabel": "producer directory preview" }
    },
    "personas": {
      "hobiis": { "description": "Just starting out or into ornamental plants? Learn vermicompost basics for your home garden." },
      "perkebunanBesar": { "description": "Boost large-scale land productivity with a data-driven vermicompost strategy." },
      "eksportir": { "description": "Meet organic quality standards for export markets with certified vermicompost." },
      "ctaLabel": "Learn more →"
    },
    "story": {
      "directory": { "title": "Find already-verified producers", "description": "Our directory filters producers by location, production capacity, and certification — not just a contact list." },
      "data": { "title": "Learn from case studies & real data", "description": "See real results from hobbyists, large plantations, and exporters, backed by figures and supporting research." },
      "news": { "title": "Follow the latest vermicompost industry news", "description": "New research updates, press releases, and educational articles publish regularly, so your decisions are always based on current information." }
    }
  }
}
```

Add the parallel structure to `src/messages/id.json` (same keys, original Indonesian values — these are the exact strings already in the current `page.tsx`, verbatim):

```json
{
  "common": {
    "meta": { "...": "unchanged from Task 1" },
    "cariProdusenCta": "Cari Produsen",
    "lihatSemua": "Lihat semua"
  },
  "home": {
    "hero": {
      "title": "Pupuk Organik Kascing untuk Pertanian yang Lebih Subur",
      "subtitle": "Vermicompost.id membantu hobiis, perkebunan besar, hingga eksportir memahami manfaat kascing dan menemukan produsen terpercaya di seluruh Indonesia.",
      "ctaPrimary": "Mulai Belajar",
      "ctaSecondary": "Cari Produsen Terdekat",
      "imageLabel": "Hero Kascing"
    },
    "sections": {
      "personas": { "title": "Mulai Sesuai Kebutuhanmu", "ariaLabel": "Mulai sesuai kebutuhanmu" },
      "story": { "title": "Kenapa Mulai dari Vermicompost.id", "errorLabel": "value proposition Vermicompost.id" },
      "features": { "title": "Jelajahi Vermicompost.id", "subtitle": "Semua yang kamu butuhkan seputar kascing, dalam satu tempat." },
      "highlights": { "title": "Edukasi & Kabar Terbaru", "errorLabel": "artikel & berita terbaru" },
      "caseStudies": { "errorLabel": "preview studi kasus" },
      "directory": { "title": "Direktori Produsen", "errorLabel": "preview direktori produsen" }
    },
    "personas": {
      "hobiis": { "description": "Baru mulai atau hobi tanaman hias? Pelajari dasar-dasar kascing untuk halaman rumahmu." },
      "perkebunanBesar": { "description": "Tingkatkan produktivitas lahan luas dengan strategi kascing berbasis data." },
      "eksportir": { "description": "Penuhi standar mutu organik untuk pasar ekspor dengan kascing bersertifikat." },
      "ctaLabel": "Pelajari lebih lanjut →"
    },
    "story": {
      "directory": { "title": "Cari produsen yang sudah terverifikasi", "description": "Direktori kami menyaring produsen berdasarkan lokasi, kapasitas produksi, dan sertifikasi — bukan sekadar daftar kontak." },
      "data": { "title": "Belajar dari studi kasus & data nyata", "description": "Lihat hasil nyata dari hobiis, perkebunan besar, hingga eksportir, lengkap dengan angka dan riset pendukung." },
      "news": { "title": "Ikuti kabar terbaru industri kascing", "description": "Update riset, press release, dan artikel edukasi baru tayang rutin, supaya keputusanmu selalu berbasis info terkini." }
    }
  }
}
```

(The `"..."` line is a placeholder for "keep what Task 1 already wrote there" — replace the whole `common` and add `home` alongside it in the real JSON file; don't literally write the string `"..."`.)

- [ ] **Step 2: Wire `page.tsx` to the translations**

Add the import and fetch translations at the top of the component:

```tsx
import { getTranslations } from "next-intl/server";
```

In `export default async function HomePage()`, make it async and fetch the namespaces it needs:

```tsx
export default async function HomePage() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  return (
    // ...
  );
}
```

Then replace every literal string with its translation call. Exact replacements:

| Old (Indonesian literal in current source) | New |
|---|---|
| `Pupuk Organik Kascing untuk Pertanian yang Lebih Subur` | `{t("hero.title")}` |
| `Vermicompost.id membantu hobiis, ... di seluruh Indonesia.` | `{t("hero.subtitle")}` |
| `Mulai Belajar` | `{t("hero.ctaPrimary")}` |
| `Cari Produsen Terdekat` | `{t("hero.ctaSecondary")}` |
| `label="Hero Kascing"` | `label={t("hero.imageLabel")}` |
| `title="Mulai Sesuai Kebutuhanmu"` (SectionHeading 01) | `title={t("sections.personas.title")}` |
| `ariaLabel="Mulai sesuai kebutuhanmu"` (PersonaCarousel) | `ariaLabel={t("sections.personas.ariaLabel")}` |
| `title="Kenapa Mulai dari Vermicompost.id"` (SectionHeading 02) | `title={t("sections.story.title")}` |
| `label="value proposition Vermicompost.id"` (SectionErrorBoundary) | `label={t("sections.story.errorLabel")}` |
| `title="Jelajahi Vermicompost.id"` (SectionHeading 03) | `title={t("sections.features.title")}` |
| `subtitle="Semua yang kamu butuhkan seputar kascing, dalam satu tempat."` | `subtitle={t("sections.features.subtitle")}` |
| `title="Edukasi & Kabar Terbaru"` (SectionHeading 04) | `title={t("sections.highlights.title")}` |
| `label="artikel & berita terbaru"` | `label={t("sections.highlights.errorLabel")}` |
| `label="preview studi kasus"` | `label={t("sections.caseStudies.errorLabel")}` |
| `action={{ label: "Lihat semua", href: "/studi-kasus" }}` (SectionHeading 05) | `action={{ label: tCommon("lihatSemua"), href: "/studi-kasus" }}` |
| `title="Direktori Produsen"` (SectionHeading 06) | `title={t("sections.directory.title")}` |
| `action={{ label: "Lihat semua", href: "/direktori" }}` | `action={{ label: tCommon("lihatSemua"), href: "/direktori" }}` |
| `label="preview direktori produsen"` | `label={t("sections.directory.errorLabel")}` |

For the `STORY_POINTS` array, replace its 3 literal `title`/`description` pairs with translation calls (keep `imageSrc` as-is — that's an asset path, not text):

```tsx
const STORY_POINTS = [
  {
    title: t("story.directory.title"),
    description: t("story.directory.description"),
    imageSrc: "/images/story-directory.jpg",
  },
  {
    title: t("story.data.title"),
    description: t("story.data.description"),
    imageSrc: "/images/story-data-check.jpg",
  },
  {
    title: t("story.news.title"),
    description: t("story.news.description"),
    imageSrc: "/images/news-stack.jpg",
  },
];
```

Since `t` now comes from `await getTranslations("home")` inside the async component body, move the `STORY_POINTS` array construction from module scope into the component body (after the `t`/`tCommon` calls), since it now depends on `t`.

For the `PERSONAS` array's `description` field, replace the 3 literal Indonesian strings with `t("personas.hobiis.description")`, `t("personas.perkebunanBesar.description")`, `t("personas.eksportir.description")` respectively (keep `persona`, `title`, `href` fields as-is — `title` here duplicates `PERSONA_LABELS` and is handled in Task 6 when `PERSONA_LABELS` itself moves into messages; leave `PERSONAS[].title` as a literal for now, it gets touched again in Task 6). Same as `STORY_POINTS`, move `PERSONAS` construction into the component body since its `description` fields now depend on `t`.

Replace the persona card's `"Pelajari lebih lanjut →"` literal with `{t("personas.ctaLabel")}`.

Replace `Cari Produsen` in the hero's secondary button — **wait**, that one is `hero.ctaSecondary` ("Cari Produsen Terdekat"), a different string from the generic `common.cariProdusenCta` ("Cari Produsen") used by `Header`/`Footer`/`CtaBanner`/`StickyCtaBar`. Do not conflate them — the homepage hero uses its own `hero.ctaSecondary` key, not `common.cariProdusenCta`.

- [ ] **Step 3: Lint and build**

Run: `npx eslint .` — expect no new errors.
Run: `npx next build` — expect success.

- [ ] **Step 4: Manual verification**

`npm run dev`. Visit `/en` — hero, section headings, persona cards, and scroll-story points all read in English. Visit `/id` — same content reads in the original Indonesian. Confirm the scroll-story sticky-image swap still works in both locales (unrelated to this task's changes, but worth re-confirming nothing broke).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Translate homepage core content (page.tsx)"
```

---

### Task 5: Translate homepage supporting components

**Files:**
- Modify: `src/components/home/FeatureGrid.tsx`
- Modify: `src/components/home/StatsStrip.tsx`
- Modify: `src/components/home/CtaBanner.tsx`
- Modify: `src/components/home/StickyCtaBar.tsx`
- Modify: `src/components/home/PersonaCarousel.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

**Interfaces:**
- Consumes: `useTranslations` (client components: `StickyCtaBar`, `PersonaCarousel` are `"use client"`) / `getTranslations` (server components: `FeatureGrid`, `StatsStrip`, `CtaBanner` have no `"use client"` directive currently — confirm each file's directive before picking the hook). Reuses `common.cariProdusenCta`, `home.sections.directory.title` (both from Task 4), `nav.*` labels — **wait**, `nav.*` doesn't exist yet (that's Task 6). For `FeatureGrid`'s reuse of nav-equivalent labels ("Belajar Kascing", "Berita & Artikel", etc.), mint them here under `home.features.*` instead and let Task 6 decide whether to later consolidate — do NOT block this task on Task 6. Each `FeatureGrid` card gets its own full title+description pair under `home.features.<key>`.
- Produces: `home.features.*`, `home.stats.*`, `home.ctaBanner.*`, `home.stickyCta.*`, `common.carousel.*`, `common.tutup`.

- [ ] **Step 1: Add the new message keys**

Add to `src/messages/en.json` under `home` (alongside the existing `hero`/`sections`/`personas`/`story` keys from Task 4) and under `common`:

```json
{
  "common": {
    "tutup": "Close",
    "carousel": { "previous": "Previous", "next": "Next" }
  },
  "home": {
    "features": {
      "belajarKascing": { "title": "Learn Vermicomposting", "description": "Educational guides from the basics to strategies for large-scale plantations." },
      "direktoriProdusen": { "title": "Producer Directory", "description": "Find and compare nearby vermicompost producers that fit your needs." },
      "berita": { "title": "News & Articles", "description": "The latest on the vermicompost industry, research updates, and press releases." },
      "riset": { "title": "Research & Publications", "description": "Journals, reports, and data-driven white papers for decision-making." },
      "studiKasus": { "title": "Case Studies", "description": "Real stories of vermicompost use from hobbyists, large plantations, and exporters." },
      "sumberDaya": { "title": "Resources", "description": "A vermicompost needs calculator, guide downloads, and answers to common questions." },
      "cardCta": "Explore →"
    },
    "stats": {
      "produsen": "Registered Producers",
      "artikel": "Educational Articles",
      "riset": "Research & Publications",
      "studiKasus": "Case Studies"
    },
    "ctaBanner": {
      "title": "Ready to get started with vermicompost?",
      "description": "Find a trusted producer near you, or list your vermicompost business in our directory."
    },
    "stickyCta": { "message": "Ready to find a nearby vermicompost producer?" }
  }
}
```

Add the parallel Indonesian structure to `src/messages/id.json`:

```json
{
  "common": {
    "tutup": "Tutup",
    "carousel": { "previous": "Sebelumnya", "next": "Berikutnya" }
  },
  "home": {
    "features": {
      "belajarKascing": { "title": "Belajar Kascing", "description": "Panduan edukasi dari dasar budidaya hingga strategi untuk perkebunan skala besar." },
      "direktoriProdusen": { "title": "Direktori Produsen", "description": "Temukan dan bandingkan produsen kascing terdekat sesuai kebutuhan Anda." },
      "berita": { "title": "Berita & Artikel", "description": "Kabar terbaru seputar industri kascing, update riset, dan press release." },
      "riset": { "title": "Riset & Publikasi", "description": "Jurnal, laporan, dan white paper berbasis data untuk pengambilan keputusan." },
      "studiKasus": { "title": "Studi Kasus", "description": "Cerita nyata penggunaan kascing dari hobiis, perkebunan besar, hingga eksportir." },
      "sumberDaya": { "title": "Sumber Daya", "description": "Kalkulator kebutuhan kascing, unduhan panduan, dan jawaban pertanyaan umum." },
      "cardCta": "Jelajahi →"
    },
    "stats": {
      "produsen": "Produsen Terdaftar",
      "artikel": "Artikel Edukasi",
      "riset": "Riset & Publikasi",
      "studiKasus": "Studi Kasus"
    },
    "ctaBanner": {
      "title": "Siap mulai dengan kascing?",
      "description": "Temukan produsen terpercaya di sekitar Anda, atau daftarkan bisnis kascing Anda ke direktori kami."
    },
    "stickyCta": { "message": "Siap cari produsen kascing terdekat?" }
  }
}
```

- [ ] **Step 2: Wire each component**

`FeatureGrid.tsx` (no `"use client"` — Server Component, use `getTranslations`): make the component `async`, `const t = await getTranslations("home.features");`, move the `FEATURES` array construction inside the function body, replace each entry's `title`/`description` with `t("belajarKascing.title")`/`t("belajarKascing.description")` (and so on per card), replace the `"Jelajahi →"` literal with `{t("cardCta")}`. Keep `href` fields as literal path strings (`"/belajar-kascing"` etc.) — those aren't translated text, and the `Link` from Task 2 already handles locale-prefixing them.

`StatsStrip.tsx` (Server Component): `const t = await getTranslations("home.stats");`, replace the 4 `label` literals in the `stats` array with `t("produsen")`, `t("artikel")`, `t("riset")`, `t("studiKasus")`.

`CtaBanner.tsx` (Server Component): `const t = await getTranslations("home.ctaBanner"); const tCommon = await getTranslations("common");`. Replace `"Siap mulai dengan kascing?"` → `{t("title")}`, the description paragraph → `{t("description")}`, `"Cari Produsen"` → `{tCommon("cariProdusenCta")}`. Leave `"Daftarkan Bisnis Anda"` as a literal for now — it moves to a shared `nav.direktori.children.daftar.label` key in Task 6; touching it here would create a duplicate key. Note this file gets touched again in Task 6.

`StickyCtaBar.tsx` (`"use client"` — use `useTranslations`, not `getTranslations`, since hooks can't be awaited in client components): `const t = useTranslations("home.stickyCta"); const tCommon = useTranslations("common");`. Replace `"Siap cari produsen kascing terdekat?"` → `{t("message")}`, `"Cari Produsen"` → `{tCommon("cariProdusenCta")}`, `aria-label="Tutup"` → `aria-label={tCommon("tutup")}`.

`PersonaCarousel.tsx` (`"use client"`): `const t = useTranslations("common.carousel");`. Replace `aria-label="Sebelumnya"` → `aria-label={t("previous")}`, `aria-label="Berikutnya"` → `aria-label={t("next")}`.

- [ ] **Step 3: Lint and build**

Run: `npx eslint .` — expect no new errors.
Run: `npx next build` — expect success.

- [ ] **Step 4: Manual verification**

`npm run dev`. On `/en`, confirm: feature-grid card titles/descriptions, stats-strip labels, CTA banner text (except "Daftarkan Bisnis Anda", still Indonesian — expected until Task 6), sticky bar message, and carousel arrow `aria-label`s (inspect via screen reader or the accessibility tree) are all in English. Confirm `/id` still shows the original Indonesian for all of these.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Translate homepage supporting components"
```

---

## Conventions for every remaining task

To keep the remaining tasks concise without dropping precision:

- **Server Component** (no `"use client"` directive): make it `async`, call `const t = await getTranslations("namespace");` from `next-intl/server`. If it needs more than one namespace, call `getTranslations` once per namespace (e.g. `const t = await getTranslations("direktori"); const tCommon = await getTranslations("common");`).
- **Client Component** (`"use client"` present): `const t = useTranslations("namespace");` from `next-intl` (not `next-intl/server`) — no `await`, hooks can't be async.
- Every task's message-key additions are given as a flat list: `namespace.path.key: "English text" / "Indonesian text"`. Add each as a nested JSON key in both `src/messages/en.json` and `src/messages/id.json` (create the intermediate objects as needed — e.g. `direktori.filter.lokasi` means `{"direktori": {"filter": {"lokasi": "..."}}}`). Where a key is marked **(reuse)**, it already exists from an earlier task — reference it, don't redefine it (if it's genuinely missing, that's a bug in this plan; add it and note the discrepancy in the commit message).
- Every task's string replacements are given as a flat list: `"<exact literal from current source>" → t("key")` (or `tCommon("key")` when reusing a `common.*` namespace value). Template strings with an interpolated data value (e.g. `` `Kapasitas: ${producer.capacityLabel}` ``) use next-intl's `t("key", { variable })` with `{variable}` placeholders in the message value — shown per-task where relevant.
- Every task ends with the same three verification steps unless stated otherwise: (a) `npx eslint .` — no new errors; (b) `npx next build` — succeeds; (c) manual check of the affected page(s) under both `/en/...` and `/id/...` via `npm run dev`. These are abbreviated to **"Verify (standard)"** below instead of being spelled out every time.
- Every task ends with `git add -A && git commit -m "<message>"` — the commit message is given per task.

---

### Task 6: Make persona labels translatable

`PERSONA_LABELS` (a plain `Record<Persona, string>` in `types.ts`) is replaced with a key-mapping, since a static exported constant can't hold translated text — the actual text now lives in messages, looked up via the mapped key.

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/app/[locale]/page.tsx` (finishes the `PERSONAS[].title` field left literal in Task 4)
- Modify: `src/app/[locale]/studi-kasus/[slug]/page.tsx`
- Modify: `src/components/studi-kasus/CaseStudyExplorer.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

**Interfaces:**
- Consumes: nothing new.
- Produces: `PERSONA_LABEL_KEYS: Record<Persona, string>` (exported from `@/lib/types`, replaces `PERSONA_LABELS`) and the `taxonomy.persona.*` message namespace. Task 7 (homepage preview components) and the Phase 3 Studi Kasus task both consume `PERSONA_LABEL_KEYS`.

- [ ] **Step 1: Replace `PERSONA_LABELS` in `types.ts`**

Find:
```ts
export const PERSONA_LABELS: Record<Persona, string> = {
  hobiis: "Hobiis",
  "perkebunan-besar": "Perkebunan Besar",
  eksportir: "Eksportir",
};
```

Replace with:
```ts
/** Maps a Persona id to its message key under the `taxonomy.persona` namespace. */
export const PERSONA_LABEL_KEYS: Record<Persona, string> = {
  hobiis: "hobiis",
  "perkebunan-besar": "perkebunanBesar",
  eksportir: "eksportir",
};
```

- [ ] **Step 2: Add the message keys**

`taxonomy.persona.hobiis`: `"Hobbyists"` / `"Hobiis"`
`taxonomy.persona.perkebunanBesar`: `"Large Plantations"` / `"Perkebunan Besar"`
`taxonomy.persona.eksportir`: `"Exporters"` / `"Eksportir"`

- [ ] **Step 3: Update every consumer**

Every consumer that imported `PERSONA_LABELS` and did `PERSONA_LABELS[somePersona]` now needs a translator and does `t(PERSONA_LABEL_KEYS[somePersona])` instead.

`src/app/[locale]/page.tsx`: import `PERSONA_LABEL_KEYS` instead of `PERSONA_LABELS`; it already has `const t = await getTranslations("home");` from Task 4 — add a second call `const tPersona = await getTranslations("taxonomy.persona");`. In the `PERSONAS` array (already moved into the component body in Task 4), replace the 3 literal `title` values (`"Hobiis"`, `"Perkebunan Besar"`, `"Eksportir"`) with `tPersona(PERSONA_LABEL_KEYS.hobiis)`, `tPersona(PERSONA_LABEL_KEYS["perkebunan-besar"])`, `tPersona(PERSONA_LABEL_KEYS.eksportir)` respectively. Also replace the `{PERSONA_LABELS[p.persona]}` badge inside the card JSX with `{tPersona(PERSONA_LABEL_KEYS[p.persona])}`.

`src/app/[locale]/studi-kasus/[slug]/page.tsx`: import `PERSONA_LABEL_KEYS` instead of `PERSONA_LABELS`. This file isn't otherwise translated until the Phase 3 Studi Kasus task — for now, just fix this one usage so the build doesn't break: add `const tPersona = await getTranslations("taxonomy.persona");` and replace `PERSONA_LABELS[caseStudy.persona]` with `tPersona(PERSONA_LABEL_KEYS[caseStudy.persona])`.

`src/components/studi-kasus/CaseStudyExplorer.tsx` (`"use client"`): import `PERSONA_LABEL_KEYS` instead of `PERSONA_LABELS`. Add `const tPersona = useTranslations("taxonomy.persona");`. Replace every `PERSONA_LABELS[...]` usage (the fork's inventory notes it's used both for tab labels and the empty-state `"Belum ada studi kasus untuk {persona}"` message — leave the empty-state message's own translation for the Phase 3 task, just fix the `PERSONA_LABELS` reference itself so it compiles: `PERSONA_LABELS[activePersona]` → `tPersona(PERSONA_LABEL_KEYS[activePersona])`).

- [ ] **Step 4: Verify (standard)**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Make persona labels translatable (PERSONA_LABELS -> PERSONA_LABEL_KEYS)"
```

---

### Task 7: Translate homepage preview components

**Files:**
- Modify: `src/components/home/HighlightSection.tsx`
- Modify: `src/components/home/CaseStudyPreview.tsx`
- Modify: `src/components/home/DirectoryPreview.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

All three are `"use client"` — use `useTranslations`.

**Interfaces:**
- Consumes: `PERSONA_LABEL_KEYS` (Task 6, used by `CaseStudyPreview.tsx`).
- Produces: `home.highlights.*`, `home.caseStudiesPreview.*`, `home.directoryPreview.*`, and the shared `common.muatUlang` key (first minted here, reused heavily in Phase 3).

- [ ] **Step 1: Add the message keys**

`common.muatUlang`: `"Reload"` / `"Muat ulang"`
`common.lihatDetail`: `"View details"` / `"Lihat detail"` *(this is `Card.tsx`'s default `cta` prop value — `Card` itself is a plain synchronous function used inside both Server and Client component trees, so it can't safely call `useTranslations`/`getTranslations` itself. Its default stays hardcoded Indonesian dead code; every caller must pass `cta` explicitly instead. This task's two `HighlightSection.tsx` Card usages are the first to need this.)*

`home.highlights.errorMessage` (thrown `Error` text, dev-only): `"Failed to load article & news highlights."` / `"Gagal memuat highlight artikel & berita."`
`home.highlights.emptyAll.title`: `"No articles or news yet"` / `"Belum ada artikel atau berita"`
`home.highlights.emptyAll.description`: `"Educational content and the latest news will appear here soon."` / `"Konten edukasi dan berita terbaru akan segera hadir di sini."`
`home.highlights.emptyArticles.title`: `"No articles yet"` / `"Belum ada artikel"`
`home.highlights.emptyNews.title`: `"No news yet"` / `"Belum ada berita"`
`home.highlights.articlesTitle`: `"Latest Educational Articles"` / `"Artikel Edukasi Terbaru"`
`home.highlights.newsTitle`: `"Latest News"` / `"Berita Terbaru"`

`home.caseStudiesPreview.errorMessage`: `"Failed to load the case study preview."` / `"Gagal memuat preview studi kasus."`
`home.caseStudiesPreview.empty.title`: `"No case studies yet"` / `"Belum ada studi kasus"`
`home.caseStudiesPreview.empty.description`: `"Case studies from various personas will be available soon."` / `"Studi kasus dari berbagai persona akan segera hadir."`
`studiKasus.card.cta`: `"Read case study"` / `"Baca studi kasus"` *(minted here since this is the first place it's needed; the Phase 3 Studi Kasus task reuses it in `CaseStudyExplorer.tsx`)*

`home.directoryPreview.errorMessage`: `"Failed to load the producer directory preview."` / `"Gagal memuat preview direktori produsen."`
`home.directoryPreview.empty.title`: `"No registered producers yet"` / `"Belum ada produsen terdaftar"`
`home.directoryPreview.empty.description`: `"Producers near you will appear here soon."` / `"Produsen kascing di sekitar kamu akan segera tampil di sini."`
`direktori.card.cta`: `"View profile"` / `"Lihat profil"` *(minted here; the Phase 3 Direktori task reuses it in `DirectoryExplorer.tsx` and the producer detail page)*

- [ ] **Step 2: Wire `HighlightSection.tsx`**

Add `import { useTranslations } from "next-intl";`. Add `const t = useTranslations("home.highlights");` at the top of the component.

Replacements:
- `throw new Error("Gagal memuat highlight artikel & berita.")` → `throw new Error(t("errorMessage"))`
- `title="Belum ada artikel atau berita"` → `title={t("emptyAll.title")}`
- `description="Konten edukasi dan berita terbaru akan segera hadir di sini."` → `description={t("emptyAll.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={t("muatUlang")}` — **note:** `muatUlang` lives under `common`, not `home.highlights`; use a second translator `const tCommon = useTranslations("common");` and write `actionLabel={tCommon("muatUlang")}` instead.
- `title="Belum ada artikel"` → `title={t("emptyArticles.title")}`
- `title="Belum ada berita"` → `title={t("emptyNews.title")}`
- `"Artikel Edukasi Terbaru"` → `{t("articlesTitle")}`
- `"Berita Terbaru"` → `{t("newsTitle")}`
- Both `<Card ... />` calls in this file currently omit `cta` (relying on `Card`'s hardcoded default). Add `cta={tCommon("lihatDetail")}` to both.

- [ ] **Step 3: Wire `CaseStudyPreview.tsx`**

Add `import { useTranslations } from "next-intl";` and `import { PERSONA_LABEL_KEYS } from "@/lib/types";` (replacing the old `PERSONA_LABELS` import — Task 6 already did this import swap; if it's still `PERSONA_LABELS` here, that's this task's job to finish). `const t = useTranslations("home.caseStudiesPreview"); const tCard = useTranslations("studiKasus.card"); const tPersona = useTranslations("taxonomy.persona");`

Replacements:
- `throw new Error("Gagal memuat preview studi kasus.")` → `throw new Error(t("errorMessage"))`
- `title="Belum ada studi kasus"` → `title={t("empty.title")}`
- `description="Studi kasus dari berbagai persona akan segera hadir."` → `description={t("empty.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={useTranslations("common")("muatUlang")}` (or hoist a `tCommon` variable, same as Step 2)
- `tag={PERSONA_LABELS[c.persona]}` → `tag={tPersona(PERSONA_LABEL_KEYS[c.persona])}`
- `cta="Baca studi kasus"` → `cta={tCard("cta")}`

- [ ] **Step 4: Wire `DirectoryPreview.tsx`**

Add `import { useTranslations } from "next-intl";`. `const t = useTranslations("home.directoryPreview"); const tCard = useTranslations("direktori.card"); const tCommon = useTranslations("common");`

Replacements:
- `throw new Error("Gagal memuat preview direktori produsen.")` → `throw new Error(t("errorMessage"))`
- `title="Belum ada produsen terdaftar"` → `title={t("empty.title")}`
- `description="Produsen kascing di sekitar kamu akan segera tampil di sini."` → `description={t("empty.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={tCommon("muatUlang")}`
- `cta="Lihat profil"` → `cta={tCard("cta")}`

- [ ] **Step 5: Verify (standard)**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate homepage preview components (Highlight/CaseStudy/Directory)"
```

---

## Phase 2: Shared Chrome & Primitives

### Task 8: Translate `nav.ts` and wire `Header.tsx`

`NAV_ITEMS` currently stores literal `label`/`description` strings. It becomes a structure of **key paths** instead — the actual text moves into `src/messages/*.json` under a new `nav` namespace, and consumers (`Header.tsx` here, `Footer.tsx` in Task 9) map over `NAV_ITEMS` combined with a translator to build the final translated array at render time.

**Files:**
- Modify: `src/lib/nav.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

**Interfaces:**
- Produces: `NavItem`/`NavChild` types change from `{ label, href, description? }` to `{ labelKey, href, descriptionKey? }`. `NAV_ITEMS` keeps the same array shape/order/hrefs, only the text fields are renamed+repurposed as key paths. Task 9 (Footer) consumes this same updated `NAV_ITEMS` shape.

- [ ] **Step 1: Rewrite `nav.ts`**

Replace the full file:

```ts
export interface NavChild {
  labelKey: string;
  href: string;
  descriptionKey?: string;
}

export interface NavItem {
  labelKey: string;
  href: string;
  descriptionKey?: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "belajarKascing.label",
    href: "/belajar-kascing",
    descriptionKey: "belajarKascing.description",
    children: [
      { labelKey: "belajarKascing.children.all.label", href: "/belajar-kascing", descriptionKey: "belajarKascing.children.all.description" },
      { labelKey: "belajarKascing.children.beginner.label", href: "/belajar-kascing?kategori=Pemula", descriptionKey: "belajarKascing.children.beginner.description" },
      { labelKey: "belajarKascing.children.largePlantation.label", href: "/belajar-kascing?kategori=Perkebunan+Besar", descriptionKey: "belajarKascing.children.largePlantation.description" },
      { labelKey: "belajarKascing.children.exporter.label", href: "/belajar-kascing?kategori=Eksportir", descriptionKey: "belajarKascing.children.exporter.description" },
    ],
  },
  {
    labelKey: "berita.label",
    href: "/berita",
    descriptionKey: "berita.description",
    children: [
      { labelKey: "berita.children.all.label", href: "/berita", descriptionKey: "berita.children.all.description" },
      { labelKey: "berita.children.industri.label", href: "/berita?kategori=Industri", descriptionKey: "berita.children.industri.description" },
      { labelKey: "berita.children.risetUpdate.label", href: "/berita?kategori=Riset+Update", descriptionKey: "berita.children.risetUpdate.description" },
      { labelKey: "berita.children.pressRelease.label", href: "/berita?kategori=Press+Release", descriptionKey: "berita.children.pressRelease.description" },
    ],
  },
  {
    labelKey: "riset.label",
    href: "/riset",
    descriptionKey: "riset.description",
    children: [
      { labelKey: "riset.children.all.label", href: "/riset", descriptionKey: "riset.children.all.description" },
      { labelKey: "riset.children.whitePaper.label", href: "/riset?jenis=White+Paper", descriptionKey: "riset.children.whitePaper.description" },
    ],
  },
  {
    labelKey: "direktori.label",
    href: "/direktori",
    descriptionKey: "direktori.description",
    children: [
      { labelKey: "direktori.children.cari.label", href: "/direktori", descriptionKey: "direktori.children.cari.description" },
      { labelKey: "direktori.children.daftar.label", href: "/direktori/daftar", descriptionKey: "direktori.children.daftar.description" },
    ],
  },
  {
    labelKey: "studiKasus.label",
    href: "/studi-kasus",
    descriptionKey: "studiKasus.description",
    children: [
      { labelKey: "studiKasus.children.hobiis.label", href: "/studi-kasus?persona=hobiis", descriptionKey: "studiKasus.children.hobiis.description" },
      { labelKey: "studiKasus.children.perkebunanBesar.label", href: "/studi-kasus?persona=perkebunan-besar", descriptionKey: "studiKasus.children.perkebunanBesar.description" },
      { labelKey: "studiKasus.children.eksportir.label", href: "/studi-kasus?persona=eksportir", descriptionKey: "studiKasus.children.eksportir.description" },
    ],
  },
  {
    labelKey: "sumberDaya.label",
    href: "/sumber-daya",
    descriptionKey: "sumberDaya.description",
    children: [
      { labelKey: "sumberDaya.children.kalkulator.label", href: "/sumber-daya#kalkulator", descriptionKey: "sumberDaya.children.kalkulator.description" },
      { labelKey: "sumberDaya.children.unduhan.label", href: "/sumber-daya#unduhan", descriptionKey: "sumberDaya.children.unduhan.description" },
      { labelKey: "sumberDaya.children.faq.label", href: "/sumber-daya#faq", descriptionKey: "sumberDaya.children.faq.description" },
    ],
  },
  {
    labelKey: "tentang.label",
    href: "/tentang",
    descriptionKey: "tentang.description",
  },
];
```

(Note: `studiKasus.children.hobiis.label` etc. duplicate the *text* of `taxonomy.persona.*` from Task 6 but are separate keys — kept as separate `nav.*` entries rather than cross-referencing the `taxonomy` namespace, to avoid the added complexity of resolving keys across two namespaces from a single translator. The English/Indonesian text is identical to `taxonomy.persona.*` in Step 2 below; this is intentional, minor duplication, not an oversight.)

- [ ] **Step 2: Add the `nav.*` message keys**

```
nav.belajarKascing.label: "Learn Vermicomposting" / "Belajar Kascing"
nav.belajarKascing.description: "Educational guides on growing & using vermicompost" / "Panduan edukasi seputar budidaya & pemanfaatan kascing"
nav.belajarKascing.children.all.label: "All Articles" / "Semua Artikel"
nav.belajarKascing.children.all.description: "Basic to advanced guides" / "Panduan dasar hingga lanjutan"
nav.belajarKascing.children.beginner.label: "For Beginners" / "Untuk Pemula"
nav.belajarKascing.children.beginner.description: "Start with vermicomposting basics" / "Mulai dari dasar budidaya kascing"
nav.belajarKascing.children.largePlantation.label: "For Large Plantations" / "Untuk Perkebunan Besar"
nav.belajarKascing.children.largePlantation.description: "Vermicompost strategy for large land areas" / "Strategi kascing untuk lahan luas"
nav.belajarKascing.children.exporter.label: "For Exporters" / "Untuk Eksportir"
nav.belajarKascing.children.exporter.description: "Quality standards for export markets" / "Standar mutu untuk pasar ekspor"
nav.berita.label: "News & Articles" / "Berita & Artikel"
nav.berita.description: "The latest on the vermicompost industry and research" / "Kabar terbaru seputar industri dan riset kascing"
nav.berita.children.all.label: "All News" / "Semua Berita"
nav.berita.children.all.description: "Latest news, most recent first" / "Kabar terbaru, terurut dari yang terkini"
nav.berita.children.industri.label: "Industry" / "Industri"
nav.berita.children.industri.description: "Vermicompost industry developments" / "Perkembangan industri kascing"
nav.berita.children.risetUpdate.label: "Research Update" / "Riset Update"
nav.berita.children.risetUpdate.description: "The latest research findings" / "Temuan riset terbaru"
nav.berita.children.pressRelease.label: "Press Release" / "Press Release"
nav.berita.children.pressRelease.description: "Official Vermicompost.id releases" / "Rilis resmi Vermicompost.id"
nav.riset.label: "Research & Publications" / "Riset & Publikasi"
nav.riset.description: "Journals, reports, and white papers on vermicompost" / "Jurnal, laporan, dan white paper seputar kascing"
nav.riset.children.all.label: "All Research & Publications" / "Semua Riset & Publikasi"
nav.riset.children.all.description: "Journals, reports, and white papers" / "Jurnal, laporan, dan white paper"
nav.riset.children.whitePaper.label: "Download White Paper" / "Unduh White Paper"
nav.riset.children.whitePaper.description: "Concise documents ready to download" / "Dokumen ringkas siap unduh"
nav.direktori.label: "Directory" / "Direktori"
nav.direktori.description: "Find and list vermicompost producers" / "Temukan dan daftarkan produsen kascing"
nav.direktori.children.cari.label: "Find Producers" / "Cari Produsen"
nav.direktori.children.cari.description: "Browse nearby vermicompost producers" / "Jelajahi produsen kascing terdekat"
nav.direktori.children.daftar.label: "List Your Business" / "Daftarkan Bisnis Anda"
nav.direktori.children.daftar.description: "Add your business to the directory" / "Masukkan bisnis Anda ke direktori"
nav.studiKasus.label: "Case Studies" / "Studi Kasus"
nav.studiKasus.description: "Real vermicompost stories by persona" / "Cerita nyata penggunaan kascing per persona"
nav.studiKasus.children.hobiis.label: "Hobbyists" / "Hobiis"
nav.studiKasus.children.hobiis.description: "Stories from ornamental plant lovers" / "Cerita dari pecinta tanaman hias"
nav.studiKasus.children.perkebunanBesar.label: "Large Plantations" / "Perkebunan Besar"
nav.studiKasus.children.perkebunanBesar.description: "Vermicompost's impact on large-land productivity" / "Dampak kascing pada produktivitas lahan luas"
nav.studiKasus.children.eksportir.label: "Exporters" / "Eksportir"
nav.studiKasus.children.eksportir.description: "Meeting organic standards for export" / "Memenuhi standar organik untuk ekspor"
nav.sumberDaya.label: "Resources" / "Sumber Daya"
nav.sumberDaya.description: "Calculator, downloads, and FAQ about vermicompost" / "Kalkulator, unduhan, dan FAQ seputar kascing"
nav.sumberDaya.children.kalkulator.label: "Vermicompost Needs Calculator" / "Kalkulator Kebutuhan Kascing"
nav.sumberDaya.children.kalkulator.description: "Estimate your needs per land area" / "Estimasi kebutuhan per luas lahan"
nav.sumberDaya.children.unduhan.label: "Downloads" / "Unduhan"
nav.sumberDaya.children.unduhan.description: "PDF guides & educational posters" / "Panduan PDF & poster edukasi"
nav.sumberDaya.children.faq.label: "FAQ" / "FAQ"
nav.sumberDaya.children.faq.description: "Frequently asked questions" / "Pertanyaan yang sering diajukan"
nav.tentang.label: "About" / "Tentang"
nav.tentang.description: "About Vermicompost.id" / "Tentang Vermicompost.id"
```

- [ ] **Step 3: Add `header.*` message keys**

```
header.nav.ariaLabel: "Main navigation" / "Navigasi utama"
header.mobileMenuButton.ariaLabel: "Open navigation menu" / "Buka menu navigasi"
header.mobileNav.ariaLabel: "Mobile navigation" / "Navigasi mobile"
header.mobileSubmenu.ariaLabel: "Open {label} submenu" / "Buka submenu {label}"
```

- [ ] **Step 4: Wire `Header.tsx`**

Add `import { useTranslations } from "next-intl";`. Inside the component, add:

```tsx
const t = useTranslations("nav");
const tHeader = useTranslations("header");
const tCommon = useTranslations("common");
```

Build the translated nav array once, right after those hooks:

```tsx
const navItems = NAV_ITEMS.map((item) => ({
  ...item,
  label: t(item.labelKey),
  description: item.descriptionKey ? t(item.descriptionKey) : undefined,
  children: item.children?.map((child) => ({
    ...child,
    label: t(child.labelKey),
    description: child.descriptionKey ? t(child.descriptionKey) : undefined,
  })),
}));
```

Replace every `NAV_ITEMS.map(...)` with `navItems.map(...)` (there are two loops — desktop nav and mobile nav — both switch to `navItems`). Inside those loops, `item.label`/`item.description`/`child.label`/`child.description` now already contain translated text (no further `t()` call needed at the JSX usage site, since `navItems` was pre-translated above).

Other replacements in `Header.tsx`:
- `aria-label="Navigasi utama"` → `aria-label={tHeader("nav.ariaLabel")}`
- `"Cari Produsen"` (desktop button, added in Task 3) → `{tCommon("cariProdusenCta")}`
- `aria-label="Buka menu navigasi"` → `aria-label={tHeader("mobileMenuButton.ariaLabel")}`
- `aria-label="Navigasi mobile"` → `aria-label={tHeader("mobileNav.ariaLabel")}`
- `` aria-label={`Buka submenu ${item.label}`} `` → `aria-label={tHeader("mobileSubmenu.ariaLabel", { label: item.label })}` (uses next-intl's interpolation — `item.label` here is already-translated per the mapping above)
- `"Cari Produsen"` (mobile button) → `{tCommon("cariProdusenCta")}`

- [ ] **Step 5: Verify (standard)** — additionally confirm the mega-menu descriptions (desktop hover, mobile expand) show translated text in both locales, not just the top-level labels.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate nav.ts and wire Header.tsx"
```

---

### Task 9: Translate `Footer.tsx`, finish `CtaBanner.tsx`

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/home/CtaBanner.tsx` (finishes the one literal Task 5 deliberately left alone)
- Modify: `src/messages/en.json`, `src/messages/id.json`

**Interfaces:**
- Consumes: `NAV_ITEMS` (Task 8's updated shape), `nav.direktori.children.daftar.label` (Task 8), `nav.sumberDaya.children.{kalkulator,unduhan,faq}.label` (Task 8).

- [ ] **Step 1: Add the message keys**

```
footer.tagline: "A hub for education, research, and a producer directory for vermicompost (worm castings) — for hobbyists, large plantations, and exporters alike." / "Pusat edukasi, riset, dan direktori produsen kascing (bekas cacing) untuk hobiis, perkebunan besar, hingga eksportir."
footer.newsletterLabel: "Subscribe to our newsletter" / "Berlangganan newsletter"
footer.columns.produk: "Product & Sections" / "Produk & Section"
footer.columns.perusahaan: "Company" / "Perusahaan"
footer.columns.legal: "Legal" / "Legal"
footer.links.tentangKami: "About Us" / "Tentang Kami"
footer.links.kalkulator: "Vermicompost Calculator" / "Kalkulator Kascing"
footer.links.kebijakanPrivasi: "Privacy Policy" / "Kebijakan Privasi"
footer.links.syaratKetentuan: "Terms & Conditions" / "Syarat & Ketentuan"
footer.copyright: "© {year} Vermicompost.id. All rights reserved." / "© {year} Vermicompost.id. Seluruh hak cipta dilindungi."
```

- [ ] **Step 2: Wire `Footer.tsx`**

Server Component (no `"use client"`) — make it `async`:

```tsx
export async function Footer() {
  const t = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  ...
}
```

(add `import { getTranslations } from "next-intl/server";`)

Build the translated `NAV_ITEMS` labels the same way as Task 8's `Header.tsx` did (only the top-level `label` is needed here, not `description`/`children`):

```tsx
const navItems = NAV_ITEMS.map((item) => ({ ...item, label: t(item.labelKey) }));
```

Replacements:
- `"Pusat edukasi, riset, ... eksportir."` → `{tFooter("tagline")}`
- `"Berlangganan newsletter"` → `{tFooter("newsletterLabel")}`
- `"Produk & Section"` → `{tFooter("columns.produk")}`
- `{NAV_ITEMS.map((item) => (...))}` → `{navItems.map((item) => (...))}`, using `item.label` (already translated, no further `t()` needed inside the loop)
- `"Perusahaan"` → `{tFooter("columns.perusahaan")}`
- `"Tentang Kami"` → `{t("tentang.label")}` — **note:** reuses `nav.tentang.label` ("About"), not a new `footer.*` key, since it's the identical concept as the nav item, just phrased as a link. If you'd rather it read literally "About Us" in the footer, keep `footer.links.tentangKami` instead — this plan uses `footer.links.tentangKami` (already added in Step 1) to preserve the current Indonesian copy's distinct wording ("Tentang Kami" vs. nav's "Tentang").
- `"Daftarkan Bisnis Anda"` → `{t("direktori.children.daftar.label")}` (reuse from Task 8)
- `"Sumber Daya"` → `{t("sumberDaya.label")}` (reuse from Task 8)
- `"Kalkulator Kascing"` → `{tFooter("links.kalkulator")}`
- `"Unduhan"` → `{t("sumberDaya.children.unduhan.label")}` (reuse)
- `"FAQ"` → `{t("sumberDaya.children.faq.label")}` (reuse)
- `"Legal"` → `{tFooter("columns.legal")}`
- `"Kebijakan Privasi"` → `{tFooter("links.kebijakanPrivasi")}`
- `"Syarat & Ketentuan"` → `{tFooter("links.syaratKetentuan")}`
- `` © {new Date().getFullYear()} Vermicompost.id. Seluruh hak cipta dilindungi. `` → `{tFooter("copyright", { year: new Date().getFullYear() })}`

- [ ] **Step 3: Finish `CtaBanner.tsx`**

`CtaBanner.tsx` is already `async` with `t`/`tCommon` from Task 5. Add one more replacement:
- `"Daftarkan Bisnis Anda"` → needs `t("direktori.children.daftar.label")` from the `nav` namespace — add `const tNav = await getTranslations("nav");` alongside the existing translators, then use `{tNav("direktori.children.daftar.label")}`.

- [ ] **Step 4: Verify (standard)**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Translate Footer.tsx, finish CtaBanner.tsx"
```

---

### Task 10: Translate shared UI primitives — Skeleton, Pagination, Breadcrumb, ReadMore, FilterDropdown, Modal

**Files:**
- Modify: `src/components/ui/Skeleton.tsx`
- Modify: `src/components/ui/Pagination.tsx`
- Modify: `src/components/ui/Breadcrumb.tsx`
- Modify: `src/components/ui/ReadMore.tsx`
- Modify: `src/components/ui/FilterDropdown.tsx`
- Modify: `src/components/ui/Modal.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

All six are `"use client"` — use `useTranslations`. `Card.tsx` and `EmptyState.tsx` are deliberately **not** touched by this task (see Task 7's note on `Card`; `EmptyState.tsx` has no literal strings of its own — its `title`/`description`/`actionLabel` are always supplied by the caller).

- [ ] **Step 1: Add the message keys**

```
common.slowLoading: "Still loading, please wait…" / "Masih memuat, mohon tunggu sebentar…"
common.pagination.ariaLabel: "Page navigation" / "Navigasi halaman"
common.pagination.previous: "← Previous" / "← Sebelumnya"
common.pagination.next: "Next →" / "Berikutnya →"
common.breadcrumb.ariaLabel: "Breadcrumb" / "Navigasi breadcrumb"
common.readMore.less: "Show less" / "Tampilkan lebih sedikit"
common.readMore.more: "Read more" / "Baca selengkapnya"
common.filter.noOptions: "No options" / "Tidak ada opsi"
common.filter.resetLabel: "Reset {label}" / "Reset {label}"
```

- [ ] **Step 2: Wire each file**

`Skeleton.tsx` — `SlowLoadingNotice`: add `import { useTranslations } from "next-intl";`, `const t = useTranslations("common");` inside the function, replace `"Masih memuat, mohon tunggu sebentar…"` → `{t("slowLoading")}`.

`Pagination.tsx`: add `const t = useTranslations("common.pagination");`. Replace `aria-label="Navigasi halaman"` → `aria-label={t("ariaLabel")}`, `"← Sebelumnya"` → `{t("previous")}`, `"Berikutnya →"` → `{t("next")}`.

`Breadcrumb.tsx`: this file currently has no `"use client"` directive and isn't in a hook-incompatible position (it's used inside both server and client trees like `Card`/`EmptyState`) — same constraint applies. Do **not** add `useTranslations` here; instead accept the aria-label as this task's one exception: hardcode it inline instead of going through messages, since `Breadcrumb` is a plain synchronous component like `Card`. Replace `aria-label="Breadcrumb"` with `aria-label="Breadcrumb"` (English literal, same in both locales — "Breadcrumb" is a technical a11y-landmark term convention, acceptable to leave untranslated; this is a deliberate exception, not an oversight). **No JSON keys needed for this one** — remove `common.breadcrumb.ariaLabel` from Step 1's additions if you haven't added it yet, or leave it unused if you have (harmless either way, but cleaner not to add it).

`ReadMore.tsx`: add `const t = useTranslations("common.readMore");`. Replace `{expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}` → `{expanded ? t("less") : t("more")}`.

`FilterDropdown.tsx`: add `const t = useTranslations("common.filter");`. Replace `"Tidak ada opsi"` → `{t("noOptions")}`. Replace `` Reset {label.toLowerCase()} `` → `{t("resetLabel", { label: label.toLowerCase() })}`.

`Modal.tsx`: add `const t = useTranslations("common");`. Replace `aria-label="Tutup"` → `aria-label={t("tutup")}` (reuse — already minted in Task 5).

- [ ] **Step 3: Verify (standard)**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Translate shared UI primitives (Skeleton, Pagination, Breadcrumb, ReadMore, FilterDropdown, Modal)"
```

---

### Task 11: Translate `PageErrorFallback.tsx` and `SectionErrorBoundary.tsx`

**Files:**
- Modify: `src/components/ui/PageErrorFallback.tsx`
- Modify: `src/components/ui/SectionErrorBoundary.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

Both are `"use client"` — use `useTranslations`. `SectionErrorBoundary` is a class component (`extends Component`) — hooks can't be called inside a class, so it needs a small wrapper: pass the translations in via a function-component wrapper, or call `useTranslations` in the parent... **simplest fix:** since `next-intl`'s `useTranslations` is a hook and class components can't use hooks directly, wrap the translated strings by having `SectionErrorBoundary` accept them as props with defaults resolved by a thin functional wrapper. Concretely: rename the existing class to `SectionErrorBoundaryImpl`, add a small functional wrapper named `SectionErrorBoundary` that calls the hook and forwards the strings as props.

**Interfaces:**
- Consumes: `common.cobaLagi`, `common.kembaliKeBeranda` (minted here, reused by every Phase 3 task that has its own retry/back-home buttons, and by `not-found.tsx`/`global-error.tsx` in Phase 4).

- [ ] **Step 1: Add the message keys**

```
common.cobaLagi: "Try again" / "Coba lagi"
common.kembaliKeBeranda: "Back to Home" / "Kembali ke Beranda"
errors.pageFallback.titleWithLabel: "Failed to load {label}" / "Gagal memuat {label}"
errors.pageFallback.titleGeneric: "Something went wrong" / "Terjadi kesalahan"
errors.pageFallback.description: "This page ran into a problem while loading. Please try again or go back to the homepage." / "Halaman ini mengalami masalah saat memuat. Silakan coba lagi atau kembali ke beranda."
errors.sectionFallback.titleWithLabel: "Failed to load {label}." / "Gagal memuat {label}."
errors.sectionFallback.titleGeneric: "Something went wrong while loading this section." / "Terjadi kesalahan saat memuat bagian ini."
errors.sectionFallback.exhausted: "Already retried several times and still failing. Please reload the page later." / "Sudah dicoba beberapa kali dan masih gagal. Silakan muat ulang halaman nanti."
```

- [ ] **Step 2: Wire `PageErrorFallback.tsx`**

Add `import { useTranslations } from "next-intl";`. Inside the component:

```tsx
const t = useTranslations("errors.pageFallback");
const tCommon = useTranslations("common");
```

Replacements:
- `` {label ? `Gagal memuat ${label}` : "Terjadi kesalahan"} `` → `{label ? t("titleWithLabel", { label }) : t("titleGeneric")}`
- `"Halaman ini mengalami masalah saat memuat. Silakan coba lagi atau kembali ke beranda."` → `{t("description")}`
- `"Coba lagi"` → `{tCommon("cobaLagi")}`
- `"Kembali ke Beranda"` → `{tCommon("kembaliKeBeranda")}`

- [ ] **Step 3: Wire `SectionErrorBoundary.tsx`**

Current structure: `export class SectionErrorBoundary extends Component<Props, State> { ... }`. Change to:

```tsx
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
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tCommon("cobaLagi")}
            </button>
            <Link
              href="/"
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              {tCommon("kembaliKeBeranda")}
            </Link>
          </div>
          {exhausted && <p className="mt-3 text-xs text-red-500">{t("exhausted")}</p>}
        </div>
      );
    }
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
```

(This also swaps the `next/link` import for `@/i18n/navigation`'s — Task 2's bulk sed already did this for this file assuming the import line was the plain `import Link from "next/link";` form; the rewrite above keeps that already-swapped import. If Task 2 already changed it, don't double up — just confirm the final import line reads `import { Link } from "@/i18n/navigation";`.)

- [ ] **Step 4: Verify (standard)** — additionally: temporarily break something inside one `SectionErrorBoundary`-wrapped section (e.g. throw in `HighlightSection`) to confirm the fallback UI still renders and retries correctly in both locales, then revert the temporary break.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Translate PageErrorFallback.tsx and SectionErrorBoundary.tsx"
```

---

### Task 12: Translate `NewsletterForm.tsx`

**Files:**
- Modify: `src/components/NewsletterForm.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

`"use client"` — use `useTranslations`.

- [ ] **Step 1: Add the message keys**

```
forms.newsletter.success: "Thank you! Your email is now subscribed to our newsletter." / "Terima kasih! Email kamu sudah terdaftar untuk newsletter."
forms.newsletter.emailLabel: "Email address" / "Alamat email"
forms.newsletter.emailPlaceholder: "Your email address" / "Alamat email kamu"
forms.newsletter.invalidEmail: "Enter a valid email address." / "Masukkan alamat email yang valid."
forms.newsletter.duplicateEmail: "This email is already subscribed to our newsletter." / "Email ini sudah terdaftar di newsletter kami."
common.sending: "Sending…" / "Mengirim…"
forms.newsletter.submit: "Subscribe" / "Berlangganan"
```

- [ ] **Step 2: Wire the component**

Add `import { useTranslations } from "next-intl";`. Inside the component: `const t = useTranslations("forms.newsletter"); const tCommon = useTranslations("common");`

Replacements:
- `"Terima kasih! Email kamu sudah terdaftar untuk newsletter."` → `{t("success")}`
- `"Alamat email"` (sr-only label) → `{t("emailLabel")}`
- `placeholder="Alamat email kamu"` → `placeholder={t("emailPlaceholder")}`
- `"Masukkan alamat email yang valid."` → `{t("invalidEmail")}`
- `"Email ini sudah terdaftar di newsletter kami."` → `{t("duplicateEmail")}`
- `` {status === "loading" ? "Mengirim…" : "Berlangganan"} `` → `{status === "loading" ? tCommon("sending") : t("submit")}`

- [ ] **Step 3: Verify (standard)** — additionally test the duplicate-email path (submit `sudah@terdaftar.com`) and the invalid-email path in both locales.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Translate NewsletterForm.tsx"
```

---

## Phase 3: Page-by-Page Batches

Reminder of the Global Constraint that matters most in this phase: `PROVINCES`, `PRODUCTS_LIST`, `CERTIFICATIONS_LIST`, `COMMODITIES_LIST`, and every article/news `CATEGORIES` array stay **untranslated** (Indonesian in both locales) — only translate the surrounding UI labels (filter group headings, empty-state copy, buttons, form field labels), never the option *values* themselves, and never the `capacity`/`category`-derived badge text shown on cards (that's `producer.capacityLabel`, `article.category`, etc. — data, out of scope).

### Task 13: Direktori — list page + `DirectoryExplorer`

**Files:**
- Modify: `src/app/[locale]/direktori/page.tsx`
- Modify: `src/components/direktori/DirectoryExplorer.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

**Interfaces:**
- Consumes: `common.cariProdusenCta`? No — reuses `nav.direktori.children.daftar.label` (Task 8), `common.muatUlang`/`common.resetFilter` (new), `direktori.card.cta` (Task 7).
- Produces: `direktori.*` namespace (title/subtitle, filters, results, empty states), `common.resetFilter`, `common.resetSemuaFilter`.

- [ ] **Step 1: Add the message keys**

```
common.resetFilter: "Reset filter" / "Reset filter"
common.resetSemuaFilter: "Reset all filters" / "Reset semua filter"
direktori.title: "Vermicompost Producer Directory" / "Direktori Produsen Kascing"
direktori.subtitle: "Find nearby vermicompost producers by location, product type, production capacity, and certification." / "Temukan produsen kascing terdekat berdasarkan lokasi, jenis produk, kapasitas produksi, dan sertifikasi."
direktori.errorLabel: "producer list" / "daftar produsen"
direktori.errorMessage: "Failed to load the producer list." / "Gagal memuat daftar produsen."
direktori.search.label: "Search producer name or city" / "Cari nama atau kota produsen"
direktori.search.placeholder: "Search producer name or city…" / "Cari nama produsen atau kota…"
direktori.view.list: "List" / "List"
direktori.view.map: "Map" / "Peta"
direktori.filter.lokasi: "Location" / "Lokasi"
direktori.filter.jenisProduk: "Product Type" / "Jenis Produk"
direktori.filter.kapasitas: "Production Capacity" / "Kapasitas Produksi"
direktori.filter.sertifikasi: "Certification" / "Sertifikasi"
direktori.filter.komoditas: "Commodity" / "Komoditas"
direktori.capacity.kecil: "Small (< 1 ton/month)" / "Kecil (< 1 ton/bulan)"
direktori.capacity.menengah: "Medium (1-20 tons/month)" / "Menengah (1-20 ton/bulan)"
direktori.capacity.besar: "Large (> 20 tons/month)" / "Besar (> 20 ton/bulan)"
direktori.resultsCount: "{count} producers found" / "{count} produsen ditemukan"
direktori.empty.noData.title: "No registered producers yet" / "Belum ada produsen terdaftar"
direktori.empty.noData.description: "Vermicompost producers will appear here soon." / "Produsen kascing akan segera tampil di sini."
direktori.empty.noResults.title: "No matching producers" / "Tidak ada produsen yang cocok"
direktori.empty.noResults.description: "Try changing your search keyword or filter combination." / "Coba ubah kata kunci pencarian atau kombinasi filter yang digunakan."
direktori.map.disclaimer: "Schematic map view (illustrative producer locations)" / "Tampilan peta skematik (ilustrasi lokasi produsen)"
```

(`direktori.card.cta` was already minted in Task 7 — don't redefine it.)

- [ ] **Step 2: Wire `direktori/page.tsx`**

Change `export const metadata: Metadata = { title: "Direktori Produsen Kascing" };` to a locale-aware `generateMetadata`, matching the pattern from Task 1's root layout:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "direktori" });
  return { title: t("title") };
}
```

(add `import { getTranslations } from "next-intl/server";`; this pattern — swap a static `metadata` export for an async `generateMetadata` reading `params.locale` — repeats for every list/detail page in Phase 3 that currently has a static `metadata` export. Later tasks just say "apply the Task 13 metadata pattern" instead of repeating this snippet.)

Make the page component `async`, add `const t = await getTranslations("direktori");`. Replacements:
- `"Direktori Produsen Kascing"` (h1) → `{t("title")}`
- `"Temukan produsen kascing terdekat ... sertifikasi."` → `{t("subtitle")}`
- `"Daftarkan Bisnis Anda"` → needs the `nav` namespace: add `const tNav = await getTranslations("nav");`, use `{tNav("direktori.children.daftar.label")}`
- `label="daftar produsen"` (SectionErrorBoundary) → `label={t("errorLabel")}`

- [ ] **Step 3: Wire `DirectoryExplorer.tsx`**

`"use client"` — `const t = useTranslations("direktori"); const tCommon = useTranslations("common");`

Move `CAPACITY_OPTIONS` from module scope into the component body (it now depends on `t`):

```tsx
const CAPACITY_OPTIONS = [
  { value: "kecil", label: t("capacity.kecil") },
  { value: "menengah", label: t("capacity.menengah") },
  { value: "besar", label: t("capacity.besar") },
];
```

Replacements:
- `throw new Error("Gagal memuat daftar produsen.")` → `throw new Error(t("errorMessage"))`
- `"Cari nama atau kota produsen"` (sr-only label) → `{t("search.label")}`
- `placeholder="Cari nama produsen atau kota…"` → `placeholder={t("search.placeholder")}`
- `"List"` → `{t("view.list")}`
- `"Peta"` → `{t("view.map")}`
- `label="Lokasi"` → `label={t("filter.lokasi")}`
- `label="Jenis Produk"` → `label={t("filter.jenisProduk")}`
- `label="Kapasitas Produksi"` → `label={t("filter.kapasitas")}`
- `label="Sertifikasi"` → `label={t("filter.sertifikasi")}`
- `label="Komoditas"` → `label={t("filter.komoditas")}`
- `"Reset semua filter"` → `{tCommon("resetSemuaFilter")}`
- `` {filtered.length} produsen ditemukan `` → `{t("resultsCount", { count: filtered.length })}`
- `title="Belum ada produsen terdaftar"` → `title={t("empty.noData.title")}`
- `description="Produsen kascing akan segera tampil di sini."` → `description={t("empty.noData.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={tCommon("muatUlang")}`
- `title="Tidak ada produsen yang cocok"` → `title={t("empty.noResults.title")}`
- `description="Coba ubah kata kunci ... digunakan."` → `description={t("empty.noResults.description")}`
- `actionLabel="Reset filter"` → `actionLabel={tCommon("resetFilter")}`
- `cta="Lihat profil"` → `cta={t("card.cta")}` (reuse the `direktori.card.cta` key from Task 7 — note it's nested under `direktori`, so plain `t("card.cta")` works since this component's translator is already scoped to `direktori`)
- `"Tampilan peta skematik (ilustrasi lokasi produsen)"` → `{t("map.disclaimer")}`

`PROVINCES.map(...)`, `PRODUCTS_LIST.map(...)`, `CERTIFICATIONS_LIST.map(...)`, `COMMODITIES_LIST.map(...)` are **left exactly as-is** — do not touch these four lines, they stay Indonesian per the Global Constraints.

- [ ] **Step 4: Verify (standard)** — additionally: confirm switching EN/ID doesn't change the filter *option values* (still Indonesian), only the filter group labels and capacity-tier option labels.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Translate Direktori list page and DirectoryExplorer"
```

---

### Task 14: Direktori — detail page, daftar page, `RegistrationForm`

**Files:**
- Modify: `src/app/[locale]/direktori/[slug]/page.tsx`
- Modify: `src/app/[locale]/direktori/daftar/page.tsx`
- Modify: `src/components/direktori/RegistrationForm.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

**Interfaces:**
- Consumes: `nav.direktori.label` (breadcrumb), `direktori.card.cta` (Task 7), `direktori.capacity.*` (Task 13, RegistrationForm's capacity `<select>` — but see the note in Step 3 about why those options are handled differently here).

- [ ] **Step 1: Add the message keys**

```
direktori.detail.notFoundTitle: "Producer not found" / "Produsen tidak ditemukan"
direktori.detail.capacityPrefix: "Capacity: {label}" / "Kapasitas: {label}"
direktori.detail.aboutTitle: "About the Producer" / "Tentang Produsen"
direktori.detail.productsTitle: "Product Types" / "Jenis Produk"
direktori.detail.commoditiesTitle: "Commodities Served" / "Komoditas Dilayani"
direktori.detail.galleryTitle: "Gallery" / "Galeri"
direktori.detail.noGalleryPhoto: "No gallery photos yet" / "Belum ada foto galeri"
direktori.detail.relatedArticlePrompt: "Not sure about using vermicompost yet? Read the guide first." / "Belum yakin mau pakai kascing? Baca panduan dulu."
direktori.detail.contactTitle: "Contact the Producer" / "Hubungi Produsen"
direktori.detail.contactWhatsapp: "Chat via WhatsApp" / "Chat via WhatsApp"
direktori.detail.contactPhone: "Call {phone}" / "Telepon {phone}"
direktori.detail.contactEmail: "Email {email}" / "Email {email}"
direktori.detail.noContact: "Producer contact info isn't available yet." / "Kontak produsen belum tersedia."
direktori.detail.relatedProducersTitle: "Other Producers in {province}" / "Produsen Lain di {province}"
direktori.daftar.metaTitle: "List Your Business" / "Daftarkan Bisnis Anda"
direktori.daftar.breadcrumbLabel: "List Your Business" / "Daftarkan Bisnis"
direktori.daftar.title: "List Your Vermicompost Business" / "Daftarkan Bisnis Kascing Anda"
direktori.daftar.subtitle: "Complete the form below to list your vermicompost business in the Vermicompost.id directory. Our team will review your submission before it goes public." / "Lengkapi formulir berikut untuk mendaftarkan produsen kascing Anda ke direktori Vermicompost.id. Tim kami akan meninjau pendaftaran sebelum tampil secara publik."
direktori.daftar.errorLabel: "registration form" / "formulir pendaftaran"
direktori.form.steps.data: "Business Info" / "Data Bisnis"
direktori.form.steps.kontak: "Contact" / "Kontak"
direktori.form.steps.produk: "Product & Capacity" / "Produk & Kapasitas"
direktori.form.steps.foto: "Photo & Review" / "Foto & Review"
direktori.form.errors.businessNameRequired: "Business name is required." / "Nama bisnis wajib diisi."
direktori.form.errors.provinceRequired: "Select a province." / "Pilih provinsi."
direktori.form.errors.cityRequired: "City is required." / "Kota wajib diisi."
direktori.form.errors.addressRequired: "Address is required." / "Alamat wajib diisi."
direktori.form.errors.contactRequired: "Fill in at least one: WhatsApp or phone." / "Isi minimal salah satu: WhatsApp atau telepon."
direktori.form.errors.invalidPhone: "Invalid phone number format." / "Format nomor telepon tidak valid."
direktori.form.errors.invalidWhatsapp: "Invalid WhatsApp number format." / "Format nomor WhatsApp tidak valid."
direktori.form.errors.emailRequired: "Email is required." / "Email wajib diisi."
direktori.form.errors.invalidEmail: "Invalid email format." / "Format email tidak valid."
direktori.form.errors.productsRequired: "Select at least one product type." / "Pilih minimal satu jenis produk."
direktori.form.errors.capacityRequired: "Select a production capacity." / "Pilih kapasitas produksi."
direktori.form.errors.invalidFileType: "Unsupported file format. Upload an image file (JPG/PNG)." / "Format file tidak didukung. Unggah file gambar (JPG/PNG)."
direktori.form.errors.fileTooLarge: "Maximum file size is {max}MB." / "Ukuran file maksimal {max}MB."
direktori.form.errors.submitConnectionLost: "Connection lost while submitting the form." / "Koneksi terputus saat mengirim formulir."
direktori.form.errors.submitGeneric: "Something went wrong while submitting the form." / "Terjadi kesalahan saat mengirim formulir."
direktori.form.errors.submitErrorSuffix: "{error} Your form data wasn't lost — please try submitting again." / "{error} Data formulir Anda tidak hilang, silakan coba kirim ulang."
direktori.form.success.title: "Registration Submitted" / "Pendaftaran Berhasil Dikirim"
direktori.form.success.message: "Thank you, {name}. Your registration is **pending admin review**. We'll contact you at {email} once the review is complete." / "Terima kasih, {name}. Pendaftaran Anda berstatus **menunggu review admin**. Kami akan menghubungi Anda melalui email {email} setelah proses review selesai."
direktori.form.success.cta: "Back to Directory" / "Kembali ke Direktori"
direktori.form.fields.businessName: "Business Name" / "Nama Bisnis"
direktori.form.fields.province: "Province" / "Provinsi"
direktori.form.fields.provincePlaceholder: "Select a province" / "Pilih provinsi"
direktori.form.fields.city: "City/Regency" / "Kota/Kabupaten"
direktori.form.fields.address: "Full Address" / "Alamat Lengkap"
direktori.form.fields.whatsapp: "WhatsApp Number" / "Nomor WhatsApp"
direktori.form.fields.phone: "Phone Number (optional)" / "Nomor Telepon (opsional)"
direktori.form.fields.email: "Email" / "Email"
direktori.form.fields.capacityPlaceholder: "Select capacity" / "Pilih kapasitas"
direktori.form.fields.commoditiesOptional: "Commodities Served (optional)" / "Komoditas Dilayani (opsional)"
direktori.form.fields.certificationsOptional: "Certifications (optional)" / "Sertifikasi (opsional)"
direktori.form.fields.photoUpload: "Upload Product/Facility Photo (optional)" / "Unggah Foto Produk/Fasilitas (opsional)"
direktori.form.fields.fileSelected: "Selected: {filename}" / "Terpilih: {filename}"
direktori.form.summary.title: "Registration Summary" / "Ringkasan Pendaftaran"
direktori.form.summary.businessName: "Business Name" / "Nama Bisnis"
direktori.form.summary.location: "Location" / "Lokasi"
direktori.form.summary.whatsapp: "WhatsApp" / "WhatsApp"
direktori.form.summary.email: "Email" / "Email"
direktori.form.summary.products: "Products" / "Produk"
direktori.form.summary.capacity: "Capacity" / "Kapasitas"
common.kembali: "← Back" / "← Kembali"
direktori.form.next: "Next →" / "Lanjut →"
direktori.form.submit: "Submit Registration" / "Kirim Pendaftaran"
```

- [ ] **Step 2: Wire `direktori/[slug]/page.tsx`**

Apply the Task 13 `generateMetadata` pattern, namespace `"direktori.detail"`, with a fallback for the not-found case:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const producer = findProducerBySlug(slug);
  if (!producer) {
    const t = await getTranslations({ locale, namespace: "direktori.detail" });
    return { title: t("notFoundTitle") };
  }
  return { title: producer.name };
}
```

Make the page component itself already-`async` (it already is) and add `const t = await getTranslations("direktori.detail"); const tCard = await getTranslations("direktori.card");`.

Replacements:
- Breadcrumb `{ label: "Direktori", href: "/direktori" }` → needs `nav`: add `const tNav = await getTranslations("nav");`, use `{ label: tNav("direktori.label"), href: "/direktori" }`
- `` Kapasitas: {producer.capacityLabel} `` → `{t("capacityPrefix", { label: producer.capacityLabel })}`
- `"Tentang Produsen"` → `{t("aboutTitle")}`
- `"Jenis Produk"` (first occurrence, the products section heading) → `{t("productsTitle")}`
- `"Komoditas Dilayani"` → `{t("commoditiesTitle")}`
- `"Galeri"` → `{t("galleryTitle")}`
- `fallbackText="Belum ada foto galeri"` → `fallbackText={t("noGalleryPhoto")}`
- `"Belum yakin mau pakai kascing? Baca panduan dulu."` → `{t("relatedArticlePrompt")}`
- `"Hubungi Produsen"` → `{t("contactTitle")}`
- `"Chat via WhatsApp"` → `{t("contactWhatsapp")}`
- `` Telepon {contact.phone} `` → `{t("contactPhone", { phone: contact.phone })}`
- `` Email {contact.email} `` → `{t("contactEmail", { email: contact.email })}`
- `"Kontak produsen belum tersedia."` → `{t("noContact")}`
- `` Produsen Lain di {producer.province} `` → `{t("relatedProducersTitle", { province: producer.province })}`
- `cta="Lihat profil"` (bottom related-producers Card) → `cta={tCard("cta")}`

`producer.products.map(...)` and `producer.commodities.map(...)` list items, and the `producer.certifications.map(...)` badge loop, stay exactly as-is (data, out of scope).

- [ ] **Step 3: Wire `direktori/daftar/page.tsx`**

Apply the Task 13 metadata pattern, namespace `"direktori.daftar"`, key `metaTitle`. Make the component `async`, `const t = await getTranslations("direktori.daftar"); const tNav = await getTranslations("nav");`

Replacements:
- Breadcrumb: `{ label: "Direktori", href: "/direktori" }` → `{ label: tNav("direktori.label"), href: "/direktori" }`; `{ label: "Daftarkan Bisnis" }` → `{ label: t("breadcrumbLabel") }`
- `"Daftarkan Bisnis Kascing Anda"` (h1) → `{t("title")}`
- `"Lengkapi formulir berikut ... secara publik."` → `{t("subtitle")}`
- `label="formulir pendaftaran"` → `label={t("errorLabel")}`

- [ ] **Step 4: Wire `RegistrationForm.tsx`**

`"use client"` — `const t = useTranslations("direktori.form"); const tCommon = useTranslations("common");`

Move `STEPS` from module scope into the component body (now depends on `t`):

```tsx
const STEPS = [t("steps.data"), t("steps.kontak"), t("steps.produk"), t("steps.foto")] as const;
```

Replacements inside `validateStep`, `handleFileChange`, `handleSubmit` (all become `t("errors.xxx")` calls — note these functions are defined inside the component body already, so they close over `t` fine):
- `"Nama bisnis wajib diisi."` → `t("errors.businessNameRequired")`
- `"Pilih provinsi."` → `t("errors.provinceRequired")`
- `"Kota wajib diisi."` → `t("errors.cityRequired")`
- `"Alamat wajib diisi."` → `t("errors.addressRequired")`
- `"Isi minimal salah satu: WhatsApp atau telepon."` → `t("errors.contactRequired")`
- `"Format nomor telepon tidak valid."` → `t("errors.invalidPhone")`
- `"Format nomor WhatsApp tidak valid."` → `t("errors.invalidWhatsapp")`
- `"Email wajib diisi."` → `t("errors.emailRequired")`
- `"Format email tidak valid."` → `t("errors.invalidEmail")`
- `"Pilih minimal satu jenis produk."` → `t("errors.productsRequired")`
- `"Pilih kapasitas produksi."` → `t("errors.capacityRequired")`
- `"Format file tidak didukung. Unggah file gambar (JPG/PNG)."` → `t("errors.invalidFileType")`
- `` `Ukuran file maksimal ${MAX_FILE_MB}MB.` `` → `t("errors.fileTooLarge", { max: String(MAX_FILE_MB) })`
- `"Koneksi terputus saat mengirim formulir."` → `t("errors.submitConnectionLost")`
- `"Terjadi kesalahan saat mengirim formulir."` → `t("errors.submitGeneric")`

JSX replacements:
- `"Pendaftaran Berhasil Dikirim"` → `{t("success.title")}`
- The success paragraph (`` Terima kasih, {form.businessName}. ... `` with the bold "menunggu review admin") → `{t.rich("success.message", { name: form.businessName, email: form.email, strong: (chunks) => <strong>{chunks}</strong> })}` — this uses next-intl's `t.rich` for the embedded `<strong>` tag; the message value's `**menunggu review admin**` markdown-style bold from Step 1 should instead be written using next-intl's rich-text tag syntax in the JSON: `"Thank you, {name}. Your registration is <strong>pending admin review</strong>. We'll contact you at {email} once the review is complete."` (and the Indonesian equivalent with `<strong>...</strong>` around "menunggu review admin") — **fix Step 1's `direktori.form.success.message` value to use `<strong>...</strong>` tags, not `**...**` markdown**, since that's what `t.rich` expects.
- `"Kembali ke Direktori"` → `{t("success.cta")}`
- `label="Nama Bisnis"` → `label={t("fields.businessName")}`
- `label="Provinsi"` → `label={t("fields.province")}`
- `"Pilih provinsi"` (the empty `<option>`) → `{t("fields.provincePlaceholder")}`
- `label="Kota/Kabupaten"` → `label={t("fields.city")}`
- `label="Alamat Lengkap"` → `label={t("fields.address")}`
- `label="Nomor WhatsApp"` → `label={t("fields.whatsapp")}`
- `label="Nomor Telepon (opsional)"` → `label={t("fields.phone")}`
- `label="Email"` (this form's own field) → `label={t("fields.email")}`
- `label="Jenis Produk"` (CheckboxGroup) → `label={t("productsTitle") /* wait — this key doesn't exist under direktori.form */}` — **use `useTranslations("direktori.detail")` for this one label instead**, i.e. add `const tDetail = useTranslations("direktori.detail");` and use `label={tDetail("productsTitle")}` (reuses the Task 14 Step 1 `direktori.detail.productsTitle` key — same concept, same text, avoid minting a duplicate).
- `label="Kapasitas Produksi"` → needs `direktori.filter.kapasitas` from Task 13: add `const tFilter = useTranslations("direktori.filter");`, use `label={tFilter("kapasitas")}`.
- `"Pilih kapasitas"` (empty `<option>`) → `{t("fields.capacityPlaceholder")}`
- `<option value="kecil">Kecil (&lt; 1 ton/bulan)</option>` etc. (3 options) → reuse Task 13's `direktori.capacity.*`: add `const tCapacity = useTranslations("direktori.capacity");`, replace the three literal option children with `{tCapacity("kecil")}`, `{tCapacity("menengah")}`, `{tCapacity("besar")}`.
- `label="Komoditas Dilayani (opsional)"` → `label={t("fields.commoditiesOptional")}`
- `label="Sertifikasi (opsional)"` → `label={t("fields.certificationsOptional")}`
- `label="Unggah Foto Produk/Fasilitas (opsional)"` → `label={t("fields.photoUpload")}`
- `` Terpilih: {form.photoName} `` → `{t("fields.fileSelected", { filename: form.photoName })}`
- `"Ringkasan Pendaftaran"` → `{t("summary.title")}`
- `label="Nama Bisnis"` (SummaryRow) → `label={t("summary.businessName")}`
- `label="Lokasi"` → `label={t("summary.location")}`
- `label="WhatsApp"` → `label={t("summary.whatsapp")}`
- `label="Email"` (SummaryRow) → `label={t("summary.email")}`
- `label="Produk"` → `label={t("summary.products")}`
- `label="Kapasitas"` → `label={t("summary.capacity")}`
- `` {submitError} Data formulir Anda tidak hilang, silakan coba kirim ulang. `` → `{t("errors.submitErrorSuffix", { error: submitError })}`
- `"← Kembali"` → `{tCommon("kembali")}`
- `"Lanjut →"` → `{t("next")}`
- `"Mengirim…"` → `{tCommon("sending")}`
- `"Kirim Pendaftaran"` → `{t("submit")}`

`PROVINCES.map(...)` (the province `<option>` list), `PRODUCTS_LIST`/`COMMODITIES_LIST`/`CERTIFICATIONS_LIST` passed into `CheckboxGroup`, and the values rendered inside `CheckboxGroup`'s own `{opt}` — all stay exactly as-is (data, out of scope).

- [ ] **Step 5: Verify (standard)** — additionally: complete the full 4-step registration flow in both `/en` and `/id`, including one validation-error path per step and the final success screen, to confirm every interpolated `{variable}` renders correctly (no literal `{name}`/`{email}`/`{filename}` leaking into the UI).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate Direktori detail page, daftar page, and RegistrationForm"
```

---

### Task 15: Belajar Kascing — list page, detail page, `ArticleExplorer`

**Files:**
- Modify: `src/app/[locale]/belajar-kascing/page.tsx`
- Modify: `src/app/[locale]/belajar-kascing/[slug]/page.tsx`
- Modify: `src/components/belajar/ArticleExplorer.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

`ArticleExplorer.CATEGORIES` (`["Pemula", "Perkebunan Besar", "Eksportir"]`) is a **filter option list whose values are also the literal `article.category` data field** (unlike `direktori.capacity`, there's no separate stable ID here) — leave it completely untouched, matching `PROVINCES`. Only the surrounding "Kategori"/"Reset kategori" UI labels get translated.

- [ ] **Step 1: Add the message keys**

```
belajarKascing.title: "Learn Vermicomposting" / "Belajar Kascing"
belajarKascing.subtitle: "Educational guides and articles on vermicompost cultivation and use, from beginner to export needs." / "Panduan dan artikel edukasi seputar budidaya dan pemanfaatan kascing, dari pemula hingga kebutuhan ekspor."
belajarKascing.errorLabel: "article list" / "daftar artikel"
belajarKascing.errorMessage: "Failed to load the article list." / "Gagal memuat daftar artikel."
belajarKascing.filter.kategori: "Category" / "Kategori"
common.resetKategori: "Reset category" / "Reset kategori"
belajarKascing.empty.noData.title: "No articles yet" / "Belum ada artikel"
belajarKascing.empty.noData.description: "Belajar Kascing educational content is coming soon." / "Konten edukasi Belajar Kascing akan segera hadir."
belajarKascing.empty.noResults.title: "No articles in this category yet" / "Belum ada artikel di kategori ini"
belajarKascing.empty.noResults.description: "Try selecting a different category." / "Coba pilih kategori lain."
belajarKascing.card.meta: "{date} · {minutes} min read" / "{date} · {minutes} menit baca"
belajarKascing.detail.notFoundTitle: "Article not found" / "Artikel tidak ditemukan"
belajarKascing.detail.readingTime: "{minutes} min read" / "{minutes} menit baca"
belajarKascing.detail.tocAriaLabel: "Table of contents" / "Daftar isi"
belajarKascing.detail.tocTitle: "Table of Contents" / "Daftar Isi"
belajarKascing.detail.section: "Section {n}" / "Bagian {n}"
belajarKascing.detail.readMoreCta: "Read More →" / "Baca Lanjut →"
belajarKascing.detail.relatedTitle: "Related Articles" / "Artikel Terkait"
```

(`nav.belajarKascing.label`, `common.cariProdusenCta`, `common.lihatDetail`, `common.muatUlang` already exist — reuse them.)

- [ ] **Step 2: Wire `belajar-kascing/page.tsx`**

Apply the Task 13 metadata pattern, namespace `"belajarKascing"`, key `title`. Make the component `async`, `const t = await getTranslations("belajarKascing");`

Replacements:
- `"Belajar Kascing"` (h1) → `{t("title")}`
- `"Panduan dan artikel edukasi ... kebutuhan ekspor."` → `{t("subtitle")}`
- `label="daftar artikel"` → `label={t("errorLabel")}`

- [ ] **Step 3: Wire `belajar-kascing/[slug]/page.tsx`**

`generateMetadata` already exists here — adapt it to the Task 13 pattern (add `locale` to `PageProps.params`, fetch `getTranslations({ locale, namespace: "belajarKascing.detail" })` for the not-found fallback):

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = findArticleBySlug(slug);
  if (article) return { title: article.title };
  const t = await getTranslations({ locale, namespace: "belajarKascing.detail" });
  return { title: t("notFoundTitle") };
}
```

(`PageProps.params` becomes `Promise<{ locale: string; slug: string }>`.)

In the page component, add `const t = await getTranslations("belajarKascing.detail"); const tNav = await getTranslations("nav"); const tCommon = await getTranslations("common");`

Replacements:
- Breadcrumb `{ label: "Belajar Kascing", href: "/belajar-kascing" }` → `{ label: tNav("belajarKascing.label"), href: "/belajar-kascing" }`
- `` {formatDate(article.publishedAt)} · {article.readingTimeMin} menit baca `` → `{formatDate(article.publishedAt)} · {t("readingTime", { minutes: article.readingTimeMin })}`
- `aria-label="Daftar isi"` → `aria-label={t("tocAriaLabel")}`
- `"Daftar Isi"` → `{t("tocTitle")}`
- `` Bagian {i + 1} `` (both the link text and — leave the `id`/`href` anchor values `bagian-${i+1}` as literal, only the visible text changes) → `{t("section", { n: i + 1 })}`
- `"Baca Lanjut →"` → `{t("readMoreCta")}`
- `"Cari Produsen"` → `{tCommon("cariProdusenCta")}`
- `"Artikel Terkait"` → `{t("relatedTitle")}`
- The related-articles `<Card ...>` has no `cta` prop (relies on the default) — add `cta={tCommon("lihatDetail")}`.

`article.category` badge and `article.content.map(...)` paragraph text stay exactly as-is (data, out of scope).

- [ ] **Step 4: Wire `ArticleExplorer.tsx`**

`"use client"` — `const t = useTranslations("belajarKascing"); const tCommon = useTranslations("common");`

Replacements:
- `throw new Error("Gagal memuat daftar artikel.")` → `throw new Error(t("errorMessage"))`
- `label="Kategori"` → `label={t("filter.kategori")}`
- `"Reset kategori"` (both occurrences — the button and the `EmptyState` `actionLabel`) → `{tCommon("resetKategori")}`
- `title="Belum ada artikel"` → `title={t("empty.noData.title")}`
- `description="Konten edukasi Belajar Kascing akan segera hadir."` → `description={t("empty.noData.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={tCommon("muatUlang")}`
- `title="Belum ada artikel di kategori ini"` → `title={t("empty.noResults.title")}`
- `description="Coba pilih kategori lain."` → `description={t("empty.noResults.description")}`
- `` meta={`${formatDate(a.publishedAt)} · ${a.readingTimeMin} menit baca`} `` → `meta={t("card.meta", { date: formatDate(a.publishedAt), minutes: a.readingTimeMin })}`
- The `<Card ...>` in the results grid has no `cta` prop — add `cta={tCommon("lihatDetail")}`.

`CATEGORIES` array and `FilterDropdown options={CATEGORIES.map(...)}` stay exactly as-is (data, out of scope).

- [ ] **Step 5: Verify (standard)**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate Belajar Kascing list, detail, and ArticleExplorer"
```

---

### Task 16: Berita — list page, detail page, `NewsExplorer`

**Files:**
- Modify: `src/app/[locale]/berita/page.tsx`
- Modify: `src/app/[locale]/berita/[slug]/page.tsx`
- Modify: `src/components/berita/NewsExplorer.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

Same pattern as Task 15: `NewsExplorer.CATEGORIES` (`["Industri", "Riset Update", "Press Release"]`) is data (equals `news.category`), stays untouched.

- [ ] **Step 1: Add the message keys**

```
berita.title: "News & Articles" / "Berita & Artikel"
berita.subtitle: "The latest on the vermicompost industry, research updates, and press releases, sorted newest first." / "Kabar terbaru seputar industri kascing, update riset, dan press release, terurut dari yang terbaru."
berita.errorLabel: "news list" / "daftar berita"
berita.errorMessage: "Failed to load the news list." / "Gagal memuat daftar berita."
berita.empty.noData.title: "No news yet" / "Belum ada berita"
berita.empty.noData.description: "The latest news and articles will appear here soon." / "Berita dan artikel terbaru akan segera tampil di sini."
berita.empty.noResults.title: "No news in this category yet" / "Belum ada berita di kategori ini"
berita.detail.notFoundTitle: "News not found" / "Berita tidak ditemukan"
berita.detail.sourcePrefix: "Source: {source}" / "Sumber: {source}"
berita.detail.relatedArticlePrompt: "Want to understand the basics?" / "Ingin memahami dasar-dasarnya?"
berita.detail.readGuidePrefix: "Read the basic guide: {title} →" / "Baca panduan dasarnya: {title} →"
berita.detail.newsletterPrompt: "Don't miss other recent news" / "Jangan lewatkan berita terbaru lainnya"
```

(`belajarKascing.filter.kategori`, `common.resetKategori`, `common.muatUlang`, `common.lihatDetail`, `nav.berita.label` already exist — reuse them.)

- [ ] **Step 2: Wire `berita/page.tsx`**

Apply the Task 13 metadata pattern, namespace `"berita"`, key `title`. Make `async`, `const t = await getTranslations("berita");`

Replacements:
- `"Berita & Artikel"` (h1) → `{t("title")}`
- `"Kabar terbaru seputar industri ... terbaru."` → `{t("subtitle")}`
- `label="daftar berita"` → `label={t("errorLabel")}`

- [ ] **Step 3: Wire `berita/[slug]/page.tsx`**

Adapt `generateMetadata` to the Task 13/15 pattern (`params` gains `locale`, fallback uses `getTranslations({ locale, namespace: "berita.detail" })`, key `notFoundTitle`).

Add `const t = await getTranslations("berita.detail"); const tNav = await getTranslations("nav");`

Replacements:
- Breadcrumb `{ label: "Berita & Artikel", href: "/berita" }` → `{ label: tNav("berita.label"), href: "/berita" }`
- `` {formatDate(news.publishedAt)} · Sumber: {news.source} `` → `` {formatDate(news.publishedAt)} · {t("sourcePrefix", { source: news.source })} ``
- `"Ingin memahami dasar-dasarnya?"` → `{t("relatedArticlePrompt")}`
- `` Baca panduan dasarnya: {relatedArticle.title} → `` → `{t("readGuidePrefix", { title: relatedArticle.title })}`
- `"Jangan lewatkan berita terbaru lainnya"` → `{t("newsletterPrompt")}`

`news.category` badge and `news.content.map(...)` paragraphs stay exactly as-is (data, out of scope).

- [ ] **Step 4: Wire `NewsExplorer.tsx`**

`"use client"` — `const t = useTranslations("berita"); const tCommon = useTranslations("common");`

Replacements:
- `throw new Error("Gagal memuat daftar berita.")` → `throw new Error(t("errorMessage"))`
- `label="Kategori"` → `label={useTranslations("belajarKascing")("filter.kategori")}` (or hoist a dedicated `const tFilter = useTranslations("belajarKascing.filter");` and use `tFilter("kategori")` — cleaner; use this form)
- `"Reset kategori"` (both occurrences) → `{tCommon("resetKategori")}`
- `title="Belum ada berita"` → `title={t("empty.noData.title")}`
- `description="Berita dan artikel terbaru akan segera tampil di sini."` → `description={t("empty.noData.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={tCommon("muatUlang")}`
- `title="Belum ada berita di kategori ini"` → `title={t("empty.noResults.title")}` (this `EmptyState` has no `description` prop in the current source — leave it that way, don't add one)
- The `<Card ...>` in the results grid has no `cta` prop — add `cta={tCommon("lihatDetail")}`.

`CATEGORIES` array stays exactly as-is (data, out of scope).

- [ ] **Step 5: Verify (standard)**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate Berita list, detail, and NewsExplorer"
```

---

### Task 17: Riset — list page, `ResearchExplorer`

**Files:**
- Modify: `src/app/[locale]/riset/page.tsx`
- Modify: `src/components/riset/ResearchExplorer.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

`ResearchExplorer.DOC_TYPES` (data, equals `r.docType`) and the dynamically-computed `commodities`/`years` filter option lists stay untouched.

- [ ] **Step 1: Add the message keys**

```
riset.title: "Research & Publications" / "Riset & Publikasi"
riset.subtitle: "Journals, reports, and white papers on vermicompost across various commodities." / "Jurnal, laporan, dan white paper seputar kascing dari berbagai komoditas."
riset.errorLabel: "research & publications list" / "daftar riset & publikasi"
riset.errorMessage: "Failed to load the research & publications list." / "Gagal memuat daftar riset & publikasi."
riset.proposeSection.title: "Propose a Publication" / "Ajukan Publikasi"
riset.proposeSection.description: "Researchers can propose a journal or report to be published via Vermicompost.id." / "Peneliti dapat mengajukan jurnal atau laporan untuk dipublikasikan melalui Vermicompost.id."
riset.filter.jenisDokumen: "Document Type" / "Jenis Dokumen"
riset.filter.tahun: "Year" / "Tahun"
riset.empty.noData.title: "No research & publications yet" / "Belum ada riset & publikasi"
riset.empty.noData.description: "Research documents will be available here soon." / "Dokumen riset akan segera hadir di sini."
riset.empty.noResults.title: "No matching documents" / "Tidak ada dokumen yang cocok"
riset.empty.noResults.description: "Try changing the commodity, document type, or year filter combination." / "Coba ubah kombinasi filter komoditas, jenis dokumen, atau tahun."
riset.card.cta: "Read details" / "Baca detail"
```

(`direktori.filter.komoditas`, `common.resetSemuaFilter`, `common.resetFilter`, `common.muatUlang` already exist — reuse them.)

- [ ] **Step 2: Wire `riset/page.tsx`**

Apply the Task 13 metadata pattern, namespace `"riset"`, key `title`. Make `async`, `const t = await getTranslations("riset"); const tDirektori = await getTranslations("direktori");`

Replacements:
- `"Riset & Publikasi"` (h1) → `{t("title")}`
- `"Jurnal, laporan, dan white paper ... komoditas."` → `{t("subtitle")}`
- `label="daftar riset & publikasi"` → `label={t("errorLabel")}`
- `"Ajukan Publikasi"` (h2) → `{t("proposeSection.title")}`
- `"Peneliti dapat mengajukan ... Vermicompost.id."` → `{t("proposeSection.description")}`

- [ ] **Step 3: Wire `ResearchExplorer.tsx`**

`"use client"` — `const t = useTranslations("riset"); const tDirektori = useTranslations("direktori"); const tCommon = useTranslations("common");`

Replacements:
- `throw new Error("Gagal memuat daftar riset & publikasi.")` → `throw new Error(t("errorMessage"))`
- `label="Komoditas"` → `label={tDirektori("filter.komoditas")}`
- `label="Jenis Dokumen"` → `label={t("filter.jenisDokumen")}`
- `label="Tahun"` → `label={t("filter.tahun")}`
- `"Reset semua filter"` → `{tCommon("resetSemuaFilter")}`
- `title="Belum ada riset & publikasi"` → `title={t("empty.noData.title")}`
- `description="Dokumen riset akan segera hadir di sini."` → `description={t("empty.noData.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={tCommon("muatUlang")}`
- `title="Tidak ada dokumen yang cocok"` → `title={t("empty.noResults.title")}`
- `description="Coba ubah kombinasi ... tahun."` → `description={t("empty.noResults.description")}`
- `actionLabel="Reset filter"` → `actionLabel={tCommon("resetFilter")}`
- `cta="Baca detail"` → `cta={t("card.cta")}`

`DOC_TYPES`, `commodities`, `years` arrays/options stay exactly as-is (data, out of scope). `hasImage={false}` stays as-is (research papers never have photos, by design).

- [ ] **Step 4: Verify (standard)**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Translate Riset list page and ResearchExplorer"
```

---

### Task 18: Riset — detail page, `DownloadPaperButton`, `ProposePublicationForm`

**Files:**
- Modify: `src/app/[locale]/riset/[slug]/page.tsx`
- Modify: `src/components/riset/DownloadPaperButton.tsx`
- Modify: `src/components/riset/ProposePublicationForm.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

- [ ] **Step 1: Add the message keys**

```
riset.detail.notFoundTitle: "Document not found" / "Dokumen tidak ditemukan"
riset.detail.abstractTitle: "Abstract" / "Abstrak"
riset.detail.simplifiedVersionCta: "Read the Simplified Version →" / "Baca Versi Sederhana →"
riset.download.invalidEmail: "Enter a valid email address to receive the download link." / "Masukkan alamat email yang valid untuk menerima tautan unduhan."
riset.download.unavailable: "This document isn't available for download right now." / "Dokumen tidak tersedia untuk diunduh saat ini."
riset.download.buttonLabel: "Download White Paper" / "Unduh White Paper"
riset.download.modalTitle: "Download Document" / "Unduh Dokumen"
riset.download.sentMessage: "The download link for <strong>{title}</strong> has been sent to <strong>{email}</strong>." / "Tautan unduhan untuk <strong>{title}</strong> telah dikirim ke <strong>{email}</strong>."
riset.download.prompt: "Enter your email to receive the download link for “{title}”." / "Masukkan email untuk menerima tautan unduhan “{title}”."
riset.download.emailLabel: "Email" / "Email"
riset.download.emailPlaceholder: "name@email.com" / "nama@email.com"
riset.download.submit: "Send Download Link" / "Kirim Tautan Unduhan"
riset.propose.invalidFileType: "Unsupported document format. Use PDF or DOC/DOCX." / "Format dokumen tidak didukung. Gunakan PDF atau DOC/DOCX."
riset.propose.errors.titleRequired: "Publication title is required." / "Judul publikasi wajib diisi."
riset.propose.errors.authorRequired: "Researcher name is required." / "Nama peneliti wajib diisi."
riset.propose.errors.emailInvalid: "Invalid email format." / "Format email tidak valid."
riset.propose.errors.abstractRequired: "Abstract/summary is required." / "Abstrak/ringkasan wajib diisi."
riset.propose.success.title: "Thank you, we've received your publication proposal." / "Terima kasih, pengajuan publikasi Anda telah kami terima."
riset.propose.success.message: "Our editorial team will review it and contact you at {email}." / "Tim editorial akan meninjau dan menghubungi Anda melalui {email}."
riset.propose.fields.title: "Publication Title" / "Judul Publikasi"
riset.propose.fields.author: "Researcher Name" / "Nama Peneliti"
riset.propose.fields.email: "Email" / "Email"
riset.propose.fields.abstract: "Abstract/Summary" / "Abstrak/Ringkasan"
riset.propose.fields.upload: "Upload Document (PDF/DOC, optional)" / "Unggah Dokumen (PDF/DOC, opsional)"
riset.propose.fields.fileSelected: "Selected: {filename}" / "Terpilih: {filename}"
riset.propose.submit: "Propose Publication" / "Ajukan Publikasi"
```

- [ ] **Step 2: Wire `riset/[slug]/page.tsx`**

Adapt `generateMetadata` to the established pattern (namespace `"riset.detail"`, key `notFoundTitle`). Add `const t = await getTranslations("riset.detail"); const tNav = await getTranslations("nav");`

Replacements:
- Breadcrumb `{ label: "Riset & Publikasi", href: "/riset" }` → `{ label: tNav("riset.label"), href: "/riset" }`
- `"Abstrak"` (h2) → `{t("abstractTitle")}`
- `"Baca Versi Sederhana →"` → `{t("simplifiedVersionCta")}`

`paper.docType`/`paper.commodity`/`paper.year` badges, `paper.title`, `paper.authors`, `paper.abstract` stay exactly as-is (data, out of scope).

- [ ] **Step 3: Wire `DownloadPaperButton.tsx`**

`"use client"` — `const t = useTranslations("riset.download");`

Replacements:
- `"Masukkan alamat email yang valid untuk menerima tautan unduhan."` → `t("invalidEmail")`
- `"Dokumen tidak tersedia untuk diunduh saat ini."` → `{t("unavailable")}`
- `"Unduh White Paper"` → `{t("buttonLabel")}`
- `title="Unduh Dokumen"` (Modal prop) → `title={t("modalTitle")}`
- The sent-confirmation paragraph (`` Tautan unduhan untuk <strong>{title}</strong> telah dikirim ke <strong>{email}</strong>. `` — already uses literal `<strong>` JSX tags around `{title}`/`{email}`, not text) → use `t.rich("sentMessage", { title: () => title, email: () => email, strong: (chunks) => <strong>{chunks}</strong> })` — **note:** since `title`/`email` are plain values (not translatable chunks), the simpler approach is to keep the JSX structure as-is and only translate the surrounding text: replace `` Tautan unduhan untuk `` with `{t("sentMessage").split("{title}")[0] /* do NOT do this */}` — **use this instead:** keep the two `<strong>` elements as literal JSX (don't route them through `t.rich`), and just wrap the plain-text portions:

```tsx
<p className="text-sm text-emerald-700">
  {t("sentPrefix")} <strong>{title}</strong> {t("sentMiddle")} <strong>{email}</strong>.
</p>
```

This means Step 1's `riset.download.sentMessage` key should instead be split into two keys — **replace it** with:
```
riset.download.sentPrefix: "The download link for" / "Tautan unduhan untuk"
riset.download.sentMiddle: "has been sent to" / "telah dikirim ke"
```
(simpler than `t.rich` for a two-variable sentence with literal bold wrapping already in JSX — avoids introducing rich-text formatting machinery for a single call site).

- `"Tutup"` → `{useTranslations("common")("tutup")}` (or hoist `const tCommon = useTranslations("common");` — use this form)
- `` Masukkan email untuk menerima tautan unduhan &ldquo;{title}&rdquo;. `` → `{t("prompt", { title })}`
- `"Email"` (sr-only label) → `{t("emailLabel")}`
- `placeholder="nama@email.com"` → `placeholder={t("emailPlaceholder")}`
- `"Kirim Tautan Unduhan"` → `{t("submit")}`

- [ ] **Step 4: Wire `ProposePublicationForm.tsx`**

`"use client"` — `const t = useTranslations("riset.propose");`

Replacements:
- `"Format dokumen tidak didukung. Gunakan PDF atau DOC/DOCX."` → `t("invalidFileType")`
- `"Judul publikasi wajib diisi."` → `t("errors.titleRequired")`
- `"Nama peneliti wajib diisi."` → `t("errors.authorRequired")`
- `"Format email tidak valid."` → `t("errors.emailInvalid")`
- `"Abstrak/ringkasan wajib diisi."` → `t("errors.abstractRequired")`
- `"Terima kasih, pengajuan publikasi Anda telah kami terima."` → `{t("success.title")}`
- `` Tim editorial akan meninjau dan menghubungi Anda melalui {form.email}. `` → `{t("success.message", { email: form.email })}`
- `"Judul Publikasi"` → `{t("fields.title")}`
- `"Nama Peneliti"` → `{t("fields.author")}`
- `"Email"` → `{t("fields.email")}`
- `"Abstrak/Ringkasan"` → `{t("fields.abstract")}`
- `"Unggah Dokumen (PDF/DOC, opsional)"` → `{t("fields.upload")}`
- `` Terpilih: {fileName} `` → `{t("fields.fileSelected", { filename: fileName })}`
- `"Ajukan Publikasi"` → `{t("submit")}`

- [ ] **Step 5: Verify (standard)** — additionally: run the download-link flow (email validation + sent confirmation) and the propose-publication flow (all field errors + success) in both locales.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate Riset detail page, DownloadPaperButton, ProposePublicationForm"
```

---

### Task 19: Studi Kasus — list page, detail page, `CaseStudyExplorer`

**Files:**
- Modify: `src/app/[locale]/studi-kasus/page.tsx`
- Modify: `src/app/[locale]/studi-kasus/[slug]/page.tsx`
- Modify: `src/components/studi-kasus/CaseStudyExplorer.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

Task 6 already swapped the `PERSONA_LABELS` import for `PERSONA_LABEL_KEYS` in the two files below and fixed one usage each so the build kept working — this task finishes translating everything else in those files, including every *remaining* `PERSONA_LABELS`-shaped reference.

- [ ] **Step 1: Add the message keys**

```
studiKasus.title: "Case Studies" / "Studi Kasus"
studiKasus.subtitle: "Real vermicompost usage stories from hobbyists, large plantations, and exporters." / "Cerita nyata penggunaan kascing dari hobiis, perkebunan besar, hingga eksportir."
studiKasus.errorLabel: "case studies" / "studi kasus"
studiKasus.errorMessage: "Failed to load case studies." / "Gagal memuat studi kasus."
studiKasus.tabs.ariaLabel: "Persona segmentation" / "Segmentasi persona"
studiKasus.empty.noData.title: "No case studies for {persona} yet" / "Belum ada studi kasus untuk {persona}"
studiKasus.empty.noData.description: "Case studies for this segment will be available soon." / "Studi kasus untuk segmen ini akan segera hadir."
studiKasus.detail.notFoundTitle: "Case study not found" / "Studi kasus tidak ditemukan"
studiKasus.detail.relatedProducerCta: "View Related Producer →" / "Lihat Produsen Terkait →"
studiKasus.detail.relatedResearchCta: "Read Supporting Research →" / "Baca Riset Pendukung →"
```

(`studiKasus.card.cta` already exists from Task 7 — reuse it. `common.muatUlang` already exists.)

- [ ] **Step 2: Wire `studi-kasus/page.tsx`**

Apply the Task 13 metadata pattern, namespace `"studiKasus"`, key `title`. Make `async`, `const t = await getTranslations("studiKasus");`

Replacements:
- `"Studi Kasus"` (h1) → `{t("title")}`
- `"Cerita nyata penggunaan kascing ... eksportir."` → `{t("subtitle")}`
- `label="studi kasus"` → `label={t("errorLabel")}`

- [ ] **Step 3: Wire `studi-kasus/[slug]/page.tsx`**

Adapt `generateMetadata` to the established pattern (namespace `"studiKasus.detail"`, key `notFoundTitle`). Add `const t = await getTranslations("studiKasus.detail"); const tNav = await getTranslations("nav"); const tPersona = await getTranslations("taxonomy.persona");`

Replacements:
- Breadcrumb `{ label: "Studi Kasus", href: "/studi-kasus" }` → `{ label: tNav("studiKasus.label"), href: "/studi-kasus" }`
- `{PERSONA_LABELS[caseStudy.persona]}` — Task 6 already converted this to `{tPersona(PERSONA_LABEL_KEYS[caseStudy.persona])}`; if it's still the old form, fix it now.
- `"Lihat Produsen Terkait →"` → `{t("relatedProducerCta")}`
- `"Baca Riset Pendukung →"` → `{t("relatedResearchCta")}`

`caseStudy.summary`, `caseStudy.metrics[].label/.value`, `caseStudy.story` paragraphs, `caseStudy.testimonials[].quote/.name/.role` all stay exactly as-is (data, out of scope).

- [ ] **Step 4: Wire `CaseStudyExplorer.tsx`**

`"use client"` — add `const t = useTranslations("studiKasus"); const tCard = useTranslations("studiKasus.card"); const tPersona = useTranslations("taxonomy.persona"); const tCommon = useTranslations("common");`

Replacements:
- `throw new Error("Gagal memuat studi kasus.")` → `throw new Error(t("errorMessage"))`
- `aria-label="Segmentasi persona"` → `aria-label={t("tabs.ariaLabel")}`
- `{PERSONA_LABELS[p]}` (tab button label) → `{tPersona(PERSONA_LABEL_KEYS[p])}` — Task 6 fixed one `PERSONA_LABELS` usage in this file already; confirm this one (the tab loop) is also converted, fixing it now if not.
- `` title={`Belum ada studi kasus untuk ${PERSONA_LABELS[activePersona]}`} `` → `title={t("empty.noData.title", { persona: tPersona(PERSONA_LABEL_KEYS[activePersona]) })}`
- `description="Studi kasus untuk segmen ini akan segera hadir."` → `description={t("empty.noData.description")}`
- `actionLabel="Muat ulang"` → `actionLabel={tCommon("muatUlang")}`
- `tag={PERSONA_LABELS[c.persona]}` (Card prop) → `tag={tPersona(PERSONA_LABEL_KEYS[c.persona])}`
- `cta="Baca studi kasus"` → `cta={tCard("cta")}`

`import { PERSONA_LABELS } from "@/lib/types";` should now read `import { PERSONA_LABEL_KEYS } from "@/lib/types";` (confirm Task 6 already changed this import; if not, fix it now — the file won't compile with a lingering `PERSONA_LABELS` import once nothing references it, or worse, if something still does and it no longer exists as an export).

- [ ] **Step 5: Verify (standard)** — additionally: click through all 3 persona tabs in both locales, confirming both the tab labels and the empty-state `{persona}` interpolation (if you hit a persona with no case studies via `?debugEmpty=1`) read correctly.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate Studi Kasus list, detail, and CaseStudyExplorer"
```

---

### Task 20: Sumber Daya — page, `Calculator`, `DownloadList`

**Files:**
- Modify: `src/app/[locale]/sumber-daya/page.tsx`
- Modify: `src/components/sumber-daya/Calculator.tsx`
- Modify: `src/components/sumber-daya/DownloadList.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

`calculatorRates[].commodity` (equals `COMMODITIES_LIST` values) and `downloadResources[].title/.type` stay untouched (data, out of scope).

- [ ] **Step 1: Add the message keys**

```
sumberDaya.title: "Resources" / "Sumber Daya"
sumberDaya.subtitle: "Vermicompost needs calculator, guide downloads, and frequently asked questions." / "Kalkulator kebutuhan kascing, unduhan panduan, dan pertanyaan yang sering diajukan."
sumberDaya.kalkulator.description: "Estimate vermicompost needs based on land area and commodity type." / "Estimasi kebutuhan kascing berdasarkan luas lahan dan jenis komoditas."
sumberDaya.kalkulator.errorLabel: "calculator" / "kalkulator"
sumberDaya.unduhan.description: "PDF guides and educational posters about vermicompost." / "Panduan PDF dan poster edukasi seputar kascing."
sumberDaya.unduhan.errorLabel: "download list" / "daftar unduhan"
sumberDaya.faqTitle: "Frequently Asked Questions" / "Pertanyaan yang Sering Diajukan"
sumberDaya.calculator.fields.area: "Land Area (m²)" / "Luas Lahan (m²)"
sumberDaya.calculator.fields.areaPlaceholder: "e.g. 100" / "mis. 100"
sumberDaya.calculator.fields.commodity: "Commodity Type" / "Jenis Komoditas"
sumberDaya.calculator.fields.commodityOther: "Other" / "Lainnya"
sumberDaya.calculator.submit: "Calculate Needs" / "Hitung Kebutuhan"
sumberDaya.calculator.errors.areaRequired: "Land area is required." / "Luas lahan wajib diisi."
sumberDaya.calculator.errors.areaInvalid: "Enter a valid number for the land area." / "Masukkan angka yang valid untuk luas lahan."
sumberDaya.calculator.errors.areaPositive: "Land area must be greater than 0." / "Luas lahan harus lebih besar dari 0."
sumberDaya.calculator.noData: "Calculation data isn't available yet for the “{commodity}” commodity." / "Data perhitungan belum tersedia untuk komoditas “{commodity}”."
sumberDaya.calculator.result: "Estimated vermicompost needed for {area} m² of {commodity} land:" / "Estimasi kebutuhan kascing untuk {area} m² lahan {commodity}:"
sumberDaya.calculator.resultKg: "{kg} kg" / "{kg} kg"
sumberDaya.downloads.unavailable: "File isn't available right now. Try again later." / "File tidak tersedia saat ini. Coba lagi nanti."
sumberDaya.downloads.downloading: "Downloading “{title}”…" / "Mengunduh “{title}”…"
common.unduh: "Download" / "Unduh"
```

(`nav.sumberDaya.label` and its `children.kalkulator.label`/`children.unduhan.label` already exist from Task 8 — reuse them for the h2 headings, matching the current source's re-use of the same Indonesian text.)

- [ ] **Step 2: Wire `sumber-daya/page.tsx`**

Apply the Task 13 metadata pattern, namespace `"sumberDaya"`, key `title`. Make `async`, `const t = await getTranslations("sumberDaya"); const tNav = await getTranslations("nav");`

Replacements:
- `"Sumber Daya"` (h1) → `{t("title")}`
- `"Kalkulator kebutuhan kascing ... diajukan."` → `{t("subtitle")}`
- `"Kalkulator Kebutuhan Kascing"` (h2) → `{tNav("sumberDaya.children.kalkulator.label")}`
- `"Estimasi kebutuhan kascing berdasarkan luas lahan dan jenis komoditas."` → `{t("kalkulator.description")}`
- `label="kalkulator"` (SectionErrorBoundary) → `label={t("kalkulator.errorLabel")}`
- `"Unduhan"` (h2) → `{tNav("sumberDaya.children.unduhan.label")}`
- `"Panduan PDF dan poster edukasi seputar kascing."` → `{t("unduhan.description")}`
- `label="daftar unduhan"` → `label={t("unduhan.errorLabel")}`
- `"Pertanyaan yang Sering Diajukan"` (h2) → `{t("faqTitle")}`

`faqItems` passed to `<Accordion>` stays exactly as-is (data, out of scope).

- [ ] **Step 3: Wire `Calculator.tsx`**

`"use client"` — add `const t = useTranslations("sumberDaya.calculator");`

Move `OPTIONS` from module scope into the component body (now depends on `t`):

```tsx
const OPTIONS = [...calculatorRates.map((r) => r.commodity), t("fields.commodityOther")];
```

Replacements:
- `"Luas Lahan (m²)"` → `{t("fields.area")}`
- `placeholder="mis. 100"` → `placeholder={t("fields.areaPlaceholder")}`
- `"Jenis Komoditas"` → `{t("fields.commodity")}`
- `"Hitung Kebutuhan"` → `{t("submit")}`
- `"Luas lahan wajib diisi."` → `t("errors.areaRequired")`
- `"Masukkan angka yang valid untuk luas lahan."` → `t("errors.areaInvalid")`
- `"Luas lahan harus lebih besar dari 0."` → `t("errors.areaPositive")`
- `` Data perhitungan belum tersedia untuk komoditas &ldquo;{commodity}&rdquo;. `` → `{t("noData", { commodity })}`
- The result paragraph — currently `` Estimasi kebutuhan kascing untuk {area} m² lahan {result.commodity.toLowerCase()}: <strong>{result.kg} kg</strong>. `` → 

```tsx
{t("result", { area, commodity: result.commodity.toLowerCase() })} <strong>{t("resultKg", { kg: result.kg })}</strong>.
```

`calculatorRates.map((r) => r.commodity)` values stay exactly as-is (data, out of scope) — only the appended `"Lainnya"`/`"Other"` entry and the surrounding labels are translated.

- [ ] **Step 4: Wire `DownloadList.tsx`**

`"use client"` — add `const t = useTranslations("sumberDaya.downloads"); const tCommon = useTranslations("common");`

The current `message[d.id].startsWith("File tidak")` check for styling (red vs. green text) breaks once the message text is translated/localized — string-matching a translated string is fragile. Replace the `message` state shape to track success/error explicitly instead of inspecting text:

```tsx
const [message, setMessage] = useState<Record<string, { text: string; isError: boolean }>>({});

function handleDownload(id: string, available: boolean, title: string) {
  if (!available) {
    setMessage((m) => ({ ...m, [id]: { text: t("unavailable"), isError: true } }));
    return;
  }
  setMessage((m) => ({ ...m, [id]: { text: t("downloading", { title }), isError: false } }));
}
```

And the render side:

```tsx
{message[d.id] && (
  <p className={`mt-1 text-xs ${message[d.id].isError ? "text-red-600" : "text-emerald-700"}`}>
    {message[d.id].text}
  </p>
)}
```

Replace `"Unduh"` (button) → `{tCommon("unduh")}`.

`d.title`/`d.type` stay exactly as-is (data, out of scope).

- [ ] **Step 5: Verify (standard)** — additionally: trigger both the calculator's "no data" path (pick a commodity, if any, without a `calculatorRates` entry — currently all commodities have rates, so this path may be unreachable with real data; confirm the code path still compiles) and a successful calculation, and both the available/unavailable download-button paths, in both locales.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Translate Sumber Daya page, Calculator, DownloadList"
```

---

### Task 21: Tentang

**Files:**
- Modify: `src/app/[locale]/tentang/page.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`

- [ ] **Step 1: Add the message keys**

```
tentang.comingSoon.title: "Coming Soon" / "Segera Hadir"
tentang.comingSoon.description: "The “About Vermicompost.id” page is being prepared. In the meantime, explore our educational content and producer directory." / "Halaman “Tentang Vermicompost.id” sedang kami siapkan. Sementara itu, jelajahi konten edukasi dan direktori produsen kami."
```

- [ ] **Step 2: Wire the page**

Apply the Task 13 metadata pattern, namespace `"nav"`, reusing `tentang.label` (i.e. `const t = await getTranslations("nav"); return { title: t("tentang.label") };` — no new metadata key needed, matches the current source exactly, which reuses "Tentang" for both the nav label and the page title).

Make the component `async`, add `const t = await getTranslations("tentang.comingSoon");`

Replacements:
- `"Segera Hadir"` → `{t("title")}`
- `` Halaman &ldquo;Tentang Vermicompost.id&rdquo; sedang kami siapkan. ... `` → `{t("description")}`

- [ ] **Step 3: Verify (standard)**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Translate Tentang page"
```

---

## Phase 4: Error / Edge Pages

### Task 22: Translate `not-found.tsx`; leave `global-error.tsx` as a structural exception

**Files:**
- Modify: `src/app/[locale]/not-found.tsx`
- Modify: `src/messages/en.json`, `src/messages/id.json`
- No changes to: `src/app/global-error.tsx` (see rationale below), `src/app/[locale]/error.tsx` (already fully covered — it only renders `<PageErrorFallback>`, translated in Task 11)

**Interfaces:**
- Consumes: `common.kembaliKeBeranda`, `common.cariProdusenCta` (both already exist).

- [ ] **Step 1: Add the message keys**

```
errors.notFound.title: "Page not found" / "Halaman tidak ditemukan"
errors.notFound.description: "The page you're looking for may have moved, been deleted, or isn't available yet." / "Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau belum tersedia."
```

- [ ] **Step 2: Wire `src/app/[locale]/not-found.tsx`**

This is a Server Component (no `"use client"`) — make it `async`, add `const t = await getTranslations("errors.notFound"); const tCommon = await getTranslations("common");`

Replacements:
- `"Halaman tidak ditemukan"` → `{t("title")}`
- `"Halaman yang kamu cari ... belum tersedia."` → `{t("description")}`
- `"Kembali ke Beranda"` → `{tCommon("kembaliKeBeranda")}`
- `"Cari Produsen"` → `{tCommon("cariProdusenCta")}`

- [ ] **Step 3: Confirm `global-error.tsx` is intentionally left untranslated**

`src/app/global-error.tsx` replaces the ROOT layout itself when that layout throws — it renders its own `<html>`/`<body>` and sits *above* the `[locale]` segment entirely, so it has no access to the locale param or the `NextIntlClientProvider` (whose presence lives inside `src/app/[locale]/layout.tsx`, the very thing that may have crashed). It cannot safely call `useTranslations`.

Change only its hardcoded language, from Indonesian to English (matching the new default locale), since it's the one piece of UI that can't be bilingual by construction:

- `<html lang="id">` → `<html lang="en">`
- `"Terjadi kesalahan pada aplikasi"` → `"Something went wrong"`
- `"Mohon maaf, halaman gagal dimuat. Silakan coba lagi."` → `"Sorry, the page failed to load. Please try again."`
- `"Coba lagi"` → `"Try again"`

No message-dictionary keys — this file stays intentionally hardcoded, in English only, as documented in its existing top-of-file comment (extend that comment to note the i18n exception too).

- [ ] **Step 4: Verify (standard)** — additionally: visit a nonexistent path under both `/en/nowhere` and `/id/nowhere` to confirm the translated 404 page renders correctly in each locale. `global-error.tsx` is awkward to trigger deliberately (it only fires when the root layout itself throws) — a visual read-through of the diff is sufficient; don't contort the code to force-trigger it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Translate not-found.tsx; update global-error.tsx to English-only fallback"
```

---

## Final Verification (whole-plan)

After all 22 tasks:

- [ ] Run `npx eslint .` — no errors beyond the pre-existing `.remember/tmp/last-ndc.ts` warning.
- [ ] Run `npx next build` — succeeds, and check the build output lists every route twice (once per locale) for both static and SSG pages.
- [ ] Grep for any literal leftover Indonesian UI strings that should have moved to messages: `grep -rn "Muat ulang\|Coba lagi\|Lihat detail\|Kembali ke Beranda" src --include="*.tsx" | grep -v "src/messages"` — expect no output (everything should now be `t("...")` calls, not literals). Re-run with a few other common leftover-check phrases if anything looks suspicious (`"Cari Produsen"`, `"Reset filter"`).
- [ ] Grep for any remaining `next/link` imports: `grep -rn 'from "next/link"' src` — expect no output.
- [ ] Manually click through the entire site in `/en`, then the entire site in `/id`: homepage, all 7 section list pages, at least one detail page per section, the registration form (full flow), the propose-publication form, the download-paper modal, the calculator, the newsletter form (success + duplicate + invalid paths), and a 404 page. Confirm no layout breakage from text-length differences between the two locales (the risk named in the spec).
- [ ] Confirm the language switcher works from every page type (homepage, list page, detail page, form page) and always lands on the equivalent page in the other locale, never the homepage.
- [ ] Confirm `PROVINCES`, `PRODUCTS_LIST`, `CERTIFICATIONS_LIST`, `COMMODITIES_LIST`, and every `CATEGORIES`/`DOC_TYPES` array still render identically in both locales (this is the intended, correct behavior — not a bug).
- [ ] Confirm the `?debugEmpty=1` debug flag still works under the new `[locale]` segment — visit `/en/?debugEmpty=1` and `/id/?debugEmpty=1` and confirm the homepage's highlight/case-study/directory preview sections show their empty states (this exercises `HighlightSection`/`CaseStudyPreview`/`DirectoryPreview` from Task 7). It should work unmodified since `useSearchParams()` reads query params independently of the path segment — this check just confirms that holds in practice.

