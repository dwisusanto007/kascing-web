# Known Issues

## Flaky client-side `<Link>` navigation (site-wide)

**Status:** Open, accepted as a known issue. Re-check after upgrading Next.js.

**Symptom:** Clicking a `next-intl`/`next/link` `<Link>` sometimes does nothing —
no navigation, no URL change, no console error. It is intermittent: the same
link, same page, same browser session can succeed on one attempt and silently
fail on the next.

**Scope:** Confirmed site-wide, not specific to any one page or component.
Reproduced on:
- The "Read More" CTA and "Find Producers" CTA on `belajar-kascing/[slug]`
- Related-article cards on the same page
- Article cards on the `belajar-kascing` listing page

Reproduced both on a local `next start` and on the production deployment
(`vermicompost-id.vercel.app`), so it is not a sandbox-only artifact.

**Investigated and ruled out (2026-10-26):**
- Not a duplicate-card or wrong-href bug — hrefs are correct, and a
  `document.elementFromPoint()` check confirms the click lands on the right
  `<a>` element.
- Not caused by `middleware.ts` being the deprecated Next 16 convention —
  migrated to `proxy.ts` (see commit `d6007e3`), navigation still flaky.
- Not fixed by `prefetch={false}` on the affected `<Link>` — tried and
  reverted, no measurable improvement.
- Not fixed by upgrading `next` 16.3.3 → 16.4.3 (latest stable at the time)
  — tried locally, still flaky, reverted to keep the pinned version stable
  until there's a confirmed fix.
- No console error, no uncaught `pageerror`, no failed request at the
  moment of the failed click — the prefetched RSC payload is already
  cached client-side and the click handler appears to run, but
  `history`/router state never updates.

**Working theory:** An upstream Next.js 16.3.x App Router bug in router-cache
handling for prefetched `<Link>` navigations, rather than anything in this
app's code. Next 16 is a very recent major version with substantial
App Router/Proxy internals changes (see `node_modules/next/AGENTS.md` when
installed), which fits the profile of a not-yet-patched framework bug more
than an application bug.

**Next steps when revisiting:**
1. Check `npm view next versions` for a newer 16.x patch beyond what's
   pinned in `package.json`, and re-run the repro below after upgrading.
2. If still broken on the latest 16.x, consider pinning back to Next 15
   (more mature App Router) as a deliberate, reviewed migration — not a
   quick patch, since it's a major-version change.
3. Search/file an upstream Next.js issue if none exists yet for "Link
   navigation silently no-ops despite cached prefetch, Next 16 App Router".

**Repro script** (Playwright, run against either `http://localhost:PORT` or
the production URL):

```python
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for i in range(8):
        page = browser.new_page()
        page.goto("<URL>/en/belajar-kascing/perbedaan-kascing-dan-kasgot", wait_until="networkidle")
        link = page.locator("a:has-text('Read More')")
        link.click(timeout=5000)
        navigated = False
        for _ in range(60):
            if "perbedaan-kascing-dan-kompos-biasa" in page.url:
                navigated = True
                break
            time.sleep(0.1)
        print(i, navigated, page.url)
        page.close()
    browser.close()
```

A healthy fix should show `True` on 8/8 runs, both locally and against
production.
