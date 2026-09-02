# Bilingual UI (English / Indonesian) — Design

## Goal

Add English/Indonesian bilingual support to Vermicompost.id, with English
as the default locale. Confirmed with the user across four rounds of
questions (see summary below); this doc records the resulting design.

## Scope

**In scope — translated:**
- All UI chrome: navigation (`nav.ts`), header, footer, buttons, section
  headings, form labels/placeholders/validation messages, empty-state and
  error messages, breadcrumbs, pagination, loading-state copy.
- Short marketing/interface copy that lives in component code: hero
  heading/subhead, `PERSONAS` (persona carousel entries), `FeatureGrid`
  entries, `ScrollStorySection` points, `CtaBanner`, `StickyCtaBar`,
  page-intro paragraphs on list pages.
- Taxonomy/filter-option vocabulary defined in `mock-data.ts` but used as
  UI labels, not prose: `PRODUCTS_LIST`, `CERTIFICATIONS_LIST`,
  `COMMODITIES_LIST`, persona labels (`PERSONA_LABELS`). These move into
  the message dictionaries.

**Out of scope — stays Indonesian in both locales:**
- All long-form mock content: producer names/descriptions, article
  bodies, news content, research abstracts, case-study narratives and
  testimonials. A detail page under `/en/...` shows English chrome around
  the same Indonesian content as `/id/...`.
- `PROVINCES` (province names) — left as-is, not translated, per explicit
  user decision ("Leave province names as-is").

## Architecture

- **Library**: [`next-intl`](https://next-intl.dev), the standard
  App-Router i18n library, built around URL-prefixed locale routing.
- **Routing**: all routes move under `src/app/[locale]/...`. Locale
  prefix is always shown (`/en/...`, `/id/...` — never bare `/direktori`).
  `middleware.ts` handles the redirect from an unprefixed path to
  `/en/<path>` and locale negotiation for the `[locale]` segment.
- **Default locale**: `en`. No `Accept-Language` auto-detection overriding
  it — a fresh visitor always lands on English, per explicit user
  instruction that English is *the* default, not just a fallback.
- **Messages**: `src/messages/en.json` and `src/messages/id.json`,
  namespaced to mirror the app's section structure (`common`, `nav`,
  `header`, `footer`, `home`, `direktori`, `belajarKascing`, `berita`,
  `riset`, `studiKasus`, `sumberDaya`, `tentang`, `forms`, `errors`).
- **Links**: every `next/link` import across the app is replaced with the
  locale-aware `Link` next-intl exports from the app's routing config, so
  hrefs automatically carry the current locale prefix.
- **Switcher**: an EN/ID toggle in the `Header` (desktop) and mobile menu.
  Switching preserves the current path (e.g.
  `/en/direktori/tani-subur-kascing` ↔ `/id/direktori/tani-subur-kascing`).
- **No persistence beyond the URL** — no cookie remembering "last
  language". Each URL is self-contained: a shared `/en/...` link always
  shows English regardless of the visitor's previous choice. This was an
  explicit trade-off accepted by the user in favor of simplicity and
  avoiding cookie-vs-URL conflicts.

## Dynamic routes & metadata

- Detail pages (`[locale]/berita/[slug]`, `[locale]/belajar-kascing/[slug]`,
  `[locale]/riset/[slug]`, `[locale]/studi-kasus/[slug]`,
  `[locale]/direktori/[slug]`) need `generateStaticParams` to produce the
  cross product of both locales × all existing slugs, so SSG output
  doubles but every existing detail page keeps working under both
  prefixes.
- Page `<title>`/`<meta description>` get a translated variant per locale
  (title template stays `%s · Vermicompost.id` in both — the brand name
  itself isn't translated).
- `not-found.tsx`, `error.tsx`, `global-error.tsx` get locale-aware
  copy too, since a broken/missing page can be hit under either prefix.
- The `?debugEmpty=1` query-param debug flag used by the homepage preview
  sections (`HighlightSection`, `CaseStudyPreview`, `DirectoryPreview`) to
  force an empty-state test must keep working unaffected by the new
  `[locale]` segment.

## Implementation phasing

Checkpointed phases, each independently buildable and visually verifiable
(`next build` + `eslint`, plus a Chrome pass toggling EN/ID):

1. **Infra + homepage** — install `next-intl`, `middleware.ts`, routing
   config, move `src/app/*` → `src/app/[locale]/*`, root layout provider,
   `common` + `home` message namespaces, full homepage translation, header
   switcher.
2. **Shared chrome & primitives** — `Header` nav (all `nav.ts` entries),
   `Footer`, and the components reused everywhere: `Card`, `EmptyState`,
   `Skeleton`, `PageErrorFallback`, `SectionErrorBoundary`, `Pagination`,
   `Breadcrumb`, `FilterDropdown`, `Accordion`, `NewsletterForm`. Doing
   these before the page batches avoids re-touching them repeatedly.
3. **Page-by-page batches** — Direktori (list + detail + daftar form),
   Belajar Kascing (list + detail), Berita (list + detail), Riset (list +
   detail + propose-publication form), Studi Kasus (list + detail),
   Sumber Daya (calculator + downloads + FAQ), Tentang. Each batch: extract
   strings into messages, swap `Link` imports, verify.
4. **Error/edge pages** — `not-found.tsx`, `error.tsx`, `global-error.tsx`.

## Named risks

- **Text-length layout breakage**: Indonesian strings often run longer
  than their English equivalents (and vice versa for some UI labels).
  Mitigated by visually checking both locales per phase rather than only
  at the end — this is the most likely visual regression from this change.
- **SSG output doubling**: `generateStaticParams` across `[locale]` ×
  existing slugs needs to be verified to not silently drop a locale or a
  slug.
- **Scope creep on the UI/content line**: the taxonomy-list judgment call
  (filter labels move to messages; long-form content doesn't) is the one
  place this boundary could be second-guessed mid-implementation. If a
  new borderline case turns up, default to *not* translating it (leave it
  as Indonesian content) and flag it rather than deciding unilaterally.

## Explicitly out of scope

- Cookie-based "remembered language" persistence.
- Browser `Accept-Language` auto-detection.
- Translating mock-data prose (articles, news, research, case studies,
  producer descriptions) or province names.
