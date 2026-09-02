# Deployment (Vercel)

Status: the app is ready to deploy with **zero extra config** — this doc is the checklist for connecting it to
Vercel. The account-level steps (import repo, domain, env vars) need to be done from your own Vercel account;
they can't be done from this environment.

## Why no `vercel.json` / rewrites are needed

This is a standard Next.js **App Router** project (no `output: "export"` in `next.config.ts`), so Vercel runs it
with its native Next.js runtime rather than serving a static SPA bundle. That means:

- Every route — including dynamic ones like `/direktori/[slug]`, `/belajar-kascing/[slug]`, etc. — is served
  correctly on a direct visit or a hard refresh. There is no "refresh on a sub-page → 404" problem to work around
  with rewrites (that's a classic static-SPA issue that doesn't apply here).
- The custom 404 page (`src/app/not-found.tsx`) is picked up automatically and deploys as-is — no routing config
  needed to make it show instead of Vercel's default 404.

So `vercel.json` is deliberately not included. Add one later only if you need something Next.js doesn't already
handle (custom response headers, non-trivial redirects, etc.).

## 1. Import the project

1. In the Vercel dashboard: **Add New → Project → Import Git Repository**, pick `dwisusanto007/kascing-web`.
2. Framework Preset: Vercel auto-detects **Next.js** — leave it as-is.
3. Build settings — all defaults, nothing to change:
   - Install Command: `npm install`
   - Build Command: `next build` (`npm run build`)
   - Output: managed automatically by the Next.js runtime (not a static `out/` folder)
4. Root Directory: repo root (this project isn't in a monorepo subfolder).
5. Pick the branch to deploy to Production — typically your default branch (`main`) once this work is merged.

## 2. Environment variables

The app currently runs entirely on local mock data (`src/lib/mock-data.ts`) — **no environment variables are
required** for it to build or run today. `.env.example` in the repo root documents the pattern to follow once a
real backend/API or third-party service (analytics, email delivery for the newsletter/registration forms, a real
map provider, etc.) is added:

1. Project Settings → Environment Variables.
2. Add each variable once, then tick which environments it applies to: **Production**, **Preview**,
   **Development** — use different values per environment where relevant (e.g. a staging API URL for
   Preview vs. the real one for Production).
3. Redeploy for the variable to take effect on existing deployments.

If a variable a page depends on is ever missing, that page's data-loading logic should fail gracefully into the
existing Error Boundary / Empty State components (see `src/components/ui/SectionErrorBoundary.tsx` and
`EmptyState.tsx`) rather than crashing the whole app — keep that in mind when a real API integration lands.

## 3. Custom domain

1. Project Settings → Domains → add your domain (e.g. `kascing.id`).
2. Point your DNS at Vercel per the records it shows you (an `A`/`ALIAS` record for the apex domain, or a
   `CNAME` for a subdomain like `www`).
3. Vercel provisions and auto-renews the HTTPS certificate once DNS resolves — no manual certificate work.

## 4. Preview deployments per branch/PR

This is automatic once the GitHub repo is connected — no configuration needed:

- Every push to a non-production branch, and every PR, gets its own preview URL.
- Vercel posts the preview link as a check/comment on the PR.
- Production is only updated by pushes to the branch configured as Production above — a broken PR branch never
  touches it.

## 5. What happens on a failed build

Vercel builds each deployment in isolation and only promotes it to Production if the build succeeds (`next
build`, which also runs typecheck). A failing build (lint/typecheck/compile error) is left as a **Failed**
deployment — the currently live Production deployment is untouched. This is Vercel's default behavior, nothing
to configure.

## QA checklist once deployed

Mirrors this ticket's test scenarios — run these against the actual Vercel URL:

- [ ] Push to the Production branch → build succeeds → site updates at the production URL.
- [ ] Open a deep link directly (e.g. `/direktori/tani-subur-kascing`) and hard-refresh → loads correctly, not a 404.
- [ ] Open a PR → a unique preview URL is generated and commented on the PR, production is untouched.
- [ ] Once a custom domain is attached → resolves with valid, auto-renewing HTTPS.
- [ ] Visit a route that doesn't exist (typo'd URL) → the custom 404 page renders, not Vercel's default one.
- [ ] Push a change that fails `next build` (e.g. a type error) → deployment is marked Failed, Production stays on
      the last good version.
- [ ] Images/fonts load correctly off Vercel's edge network (nothing broken relative to local `npm run dev`).
