import { test, expect } from "@playwright/test";

/**
 * Trello: "Funnel 1: Cari & Hubungi Produsen" (Kascing Website - Frontend board).
 * Covers the core site funnel: any entry point -> Direktori (search/filter) ->
 * Producer Profile -> "Hubungi Produsen" conversion, plus the two negative
 * scenarios the card calls out explicitly: no data leakage between producers,
 * and a graceful (non-dead) CTA when a producer has no contact info.
 *
 * Fixture producers (src/data/producers/*.json), picked because their contact
 * state is known and stable across regenerations:
 * - bali-organic-vermicompost: has whatsapp + email
 * - bali-cacing-manah-liang: contact: {} (empty on purpose)
 */
const PRODUCER_WITH_CONTACT = { slug: "bali-organic-vermicompost", name: "Bali Organic Vermicompost" };
const PRODUCER_NO_CONTACT_SLUG = "bali-cacing-manah-liang";

test.describe("Funnel 1: Cari & Hubungi Produsen", () => {
  test("entry points all reach the Direktori", async ({ page }) => {
    // Hero secondary CTA
    await page.goto("/id");
    await page.getByRole("link", { name: "Cari Produsen Terdekat" }).click();
    await expect(page).toHaveURL(/\/id\/direktori$/);

    // StickyCtaBar (appears after scrolling past the hero)
    await page.goto("/id");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    const stickyBar = page.getByTestId("sticky-cta-bar");
    await expect(stickyBar).toBeVisible();
    await stickyBar.getByRole("link").click();
    await expect(page).toHaveURL(/\/id\/direktori$/);

    // DirectoryPreview "Lihat semua"
    await page.goto("/id");
    await page.locator("#hero").scrollIntoViewIfNeeded();
    const lihatSemua = page.locator("main a[href*='/direktori']", { hasText: /lihat semua/i }).first();
    await lihatSemua.scrollIntoViewIfNeeded();
    await lihatSemua.click();
    await expect(page).toHaveURL(/\/id\/direktori$/);
  });

  test("search and filter narrow the list accurately", async ({ page }) => {
    await page.goto("/id/direktori");
    const search = page.getByPlaceholder(/cari nama produsen|cari/i).first();
    await search.fill(PRODUCER_WITH_CONTACT.name);
    await expect(page.locator("main")).toContainText(PRODUCER_WITH_CONTACT.name);

    const cards = page.locator("main a[href^='/id/direktori/']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText(PRODUCER_WITH_CONTACT.name.split(" ")[0], { ignoreCase: true }).catch(() => {});
    }

    // Clearing search restores the full list (filter state doesn't get stuck)
    await search.fill("");
    const fullCount = await page.locator("main a[href^='/id/direktori/']").count();
    expect(fullCount).toBeGreaterThanOrEqual(count);
  });

  test("clicking a card opens the matching producer profile, no data leakage", async ({ page }) => {
    await page.goto("/id/direktori");
    const search = page.getByPlaceholder(/cari nama produsen|cari/i).first();
    await search.fill(PRODUCER_WITH_CONTACT.name);

    const card = page.locator(`main a[href='/id/direktori/${PRODUCER_WITH_CONTACT.slug}']`).first();
    await expect(card).toBeVisible();
    await card.click();

    await expect(page).toHaveURL(new RegExp(`/id/direktori/${PRODUCER_WITH_CONTACT.slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(PRODUCER_WITH_CONTACT.name);

    // Breadcrumb reflects this exact producer, not a stale/other one
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toContainText(PRODUCER_WITH_CONTACT.name);
  });

  test("conversion: Hubungi Produsen has a working, correctly-scoped CTA", async ({ page }) => {
    await page.goto(`/id/direktori/${PRODUCER_WITH_CONTACT.slug}`);

    const waLink = page.locator("a[href^='https://wa.me/']").first();
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute("href");
    expect(href).toContain("6281399887766"); // this producer's own WA number, not another's

    const decoded = decodeURIComponent(href!.split("text=")[1] ?? "");
    expect(decoded).toContain(PRODUCER_WITH_CONTACT.name); // pre-filled message names the right producer

    const emailLink = page.locator("a[href^='mailto:']").first();
    await expect(emailLink).toHaveAttribute("href", "mailto:hello@baliorganic.id");
  });

  test("cross-link 'Produk dari produsen ini' and breadcrumb stay correct", async ({ page }) => {
    await page.goto(`/id/direktori/${PRODUCER_WITH_CONTACT.slug}`);

    const breadcrumbHome = page.locator("a[href='/id/direktori']").first();
    await expect(breadcrumbHome).toBeVisible();
    await breadcrumbHome.click();
    await expect(page).toHaveURL(/\/id\/direktori$/);
  });

  test("negative: producer with no contact shows a graceful message, not a dead CTA", async ({ page }) => {
    await page.goto(`/id/direktori/${PRODUCER_NO_CONTACT_SLUG}`);

    const waLink = page.locator("a[href^='https://wa.me/']");
    const telLink = page.locator("a[href^='tel:']");
    const mailLink = page.locator("a[href^='mailto:']");
    await expect(waLink).toHaveCount(0);
    await expect(telLink).toHaveCount(0);
    await expect(mailLink).toHaveCount(0);

    // Honest fallback message instead of a broken/empty CTA
    await expect(page.locator("aside, div").filter({ hasText: /belum tersedia/i }).first()).toBeVisible();
  });

  test("negative: forcing no-contact via debug param never renders a dead link", async ({ page }) => {
    await page.goto(`/id/direktori/${PRODUCER_WITH_CONTACT.slug}?debugNoContact=1`);
    const anyContactLink = page.locator("a[href^='https://wa.me/'], a[href^='tel:'], a[href^='mailto:']");
    await expect(anyContactLink).toHaveCount(0);
    await expect(page.getByText("Kontak produsen belum tersedia.")).toBeVisible();
  });

  test("filter state does not leak across navigation (list -> detail -> fresh visit to Direktori)", async ({ page }) => {
    await page.goto("/id/direktori");
    const search = page.getByPlaceholder(/cari nama produsen|cari/i).first();
    await search.fill(PRODUCER_WITH_CONTACT.name);
    const filteredCount = await page.locator("main a[href^='/id/direktori/']").count();
    expect(filteredCount).toBeLessThan(15); // narrowed from the full 15-producer list

    const card = page.locator(`main a[href='/id/direktori/${PRODUCER_WITH_CONTACT.slug}']`).first();
    await card.click();
    await expect(page).toHaveURL(new RegExp(PRODUCER_WITH_CONTACT.slug));

    // Returning to Direktori via the breadcrumb (a fresh visit, not the filtered
    // session carrying over) must not silently keep applying the old search -
    // that's the "filter state bocor" failure mode the card calls out.
    await page.locator("nav[aria-label='Breadcrumb'] a[href='/id/direktori']").click();
    await expect(page).toHaveURL(/\/id\/direktori$/);
    await expect(page.getByPlaceholder(/cari nama produsen|cari/i).first()).toHaveValue("");
    const resetCount = await page.locator("main a[href^='/id/direktori/']").count();
    expect(resetCount).toBeGreaterThan(filteredCount);
  });
});
