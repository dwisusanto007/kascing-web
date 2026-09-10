import { test, expect } from "@playwright/test";

/**
 * Trello: "Funnel 2: Beli Produk via Marketplace" (Kascing Website - Frontend board).
 * Commerce funnel, separate from the producer-contact funnel: any entry point ->
 * Produk (category filter) -> Product Detail -> "Beli di {marketplace}" (external,
 * new tab). The card's stated regression risk is generic to funnels with many
 * similar entries: the wrong card must never open the wrong product/marketplace URL.
 *
 * Fixture products (src/data/affiliate-products/*.json):
 * - kascing-fermentasi-siap-pakai-1kg (category: Kascing Kemasan, Tokopedia)
 * - bibit-cacing-lumbricus-cacingtanah-id (category: Bibit Cacing Lumbricus)
 *
 * Data note: all 16 current affiliate products have producerSlug: null, so the
 * "cross-link back to Direktori" path (step 6) has no real fixture yet - this
 * suite instead asserts that omission renders cleanly (no broken/empty section),
 * matching the card's negative-scenario spirit rather than fabricating a link.
 */
const PRODUCT_A = {
  slug: "kascing-fermentasi-siap-pakai-1kg",
  name: "Kascing Pupuk Organik Cacing Fermentasi Siap Pakai untuk Media Tanam & Tanaman (1 KG)",
  category: "Kascing Kemasan",
  marketplace: "Tokopedia (Pupuk Alami Center)",
  buyUrlContains: "pupuk-alami-center",
};
const PRODUCT_B = {
  slug: "bibit-cacing-lumbricus-cacingtanah-id",
  category: "Bibit Cacing Lumbricus",
  buyUrlContains: "cacingtanah.id",
};

test.describe("Funnel 2: Beli Produk via Marketplace", () => {
  test("entry points all reach Produk", async ({ page }) => {
    // Homepage section 07 "Lihat semua"
    await page.goto("/id");
    const lihatSemua = page.locator("main a[href*='/produk']", { hasText: /lihat semua/i }).first();
    await lihatSemua.scrollIntoViewIfNeeded();
    await lihatSemua.click();
    await expect(page).toHaveURL(/\/id\/produk$/);

    // Header nav: Produk is tucked under the "Lainnya" (More) overflow menu
    await page.goto("/id");
    const nav = page.getByRole("navigation", { name: "Navigasi utama" });
    await nav.getByRole("link", { name: /^Lainnya/ }).hover();
    await nav.getByRole("link", { name: "Produk" }).click();
    await expect(page).toHaveURL(/\/id\/produk$/);
  });

  test("category filter narrows the list accurately", async ({ page }) => {
    await page.goto("/id/produk");
    const cards = page.locator("main a[href^='/id/produk/']");
    await expect(cards.first()).toBeVisible(); // wait past the client-side fetch/skeleton
    const totalCount = await cards.count();

    await page.getByRole("button", { name: "Kategori" }).click();
    await page.getByRole("checkbox", { name: PRODUCT_B.category }).click();

    const filteredCount = await page.locator("main a[href^='/id/produk/']").count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(totalCount);
    await expect(page.locator("main")).toContainText(PRODUCT_B.category);
  });

  test("clicking a card opens the matching product detail, no mixed-up data", async ({ page }) => {
    await page.goto("/id/produk");
    const card = page.locator(`main a[href='/id/produk/${PRODUCT_A.slug}']`).first();
    await expect(card).toBeVisible();
    await card.click();

    await expect(page).toHaveURL(new RegExp(`/id/produk/${PRODUCT_A.slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(PRODUCT_A.name);
    await expect(page.locator("main")).toContainText(PRODUCT_A.marketplace);
  });

  test("conversion: Beli button opens the correct marketplace URL in a new tab", async ({ page, context }) => {
    await page.goto(`/id/produk/${PRODUCT_A.slug}`);

    const buyLink = page.getByRole("link", { name: /^Beli di/i });
    await expect(buyLink).toHaveAttribute("target", "_blank");
    const href = await buyLink.getAttribute("href");
    expect(href).toContain(PRODUCT_A.buyUrlContains);

    // Egress to external marketplaces is blocked in this sandbox (same known
    // constraint as every other funnel's WA/marketplace links) - only the
    // popup's target URL is checked, not that it actually loads.
    const [popup] = await Promise.all([context.waitForEvent("page"), buyLink.click()]);
    // The original tab must stay on the product page, not get replaced
    await expect(page).toHaveURL(new RegExp(PRODUCT_A.slug));
    await popup.close();
  });

  test("regression check: two different products never share a buy URL", async ({ page }) => {
    await page.goto(`/id/produk/${PRODUCT_A.slug}`);
    const hrefA = await page.getByRole("link", { name: /^Beli di/i }).getAttribute("href");

    await page.goto(`/id/produk/${PRODUCT_B.slug}`);
    const hrefB = await page.getByRole("link", { name: /^Beli di/i }).getAttribute("href");

    expect(hrefA).not.toEqual(hrefB);
    expect(hrefB).toContain(PRODUCT_B.buyUrlContains);
  });

  test("no producerSlug: page renders cleanly with no dangling cross-link section", async ({ page }) => {
    // Every current product has producerSlug: null - confirms the conditional
    // "Produk dari produsen ini" block is correctly absent, not broken/empty.
    await page.goto(`/id/produk/${PRODUCT_A.slug}`);
    await expect(page.getByText("Produk ini berasal dari produsen")).toHaveCount(0);
    // No stray link to a non-existent /direktori/undefined or similar
    const direktoriLinks = page.locator("a[href*='/direktori/undefined'], a[href*='/direktori/null']");
    await expect(direktoriLinks).toHaveCount(0);
  });
});
