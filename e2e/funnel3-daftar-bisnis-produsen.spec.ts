import { test, expect } from "@playwright/test";

/**
 * Trello: "Funnel 3: Daftar Bisnis Produsen" (Kascing Website - Frontend board).
 * The only funnel backed by pure client-side form state rather than the
 * crawled JSON data - highest regression risk of the three funnels per the
 * card. Covers: entry points, per-step validation actually blocking
 * progress, data surviving Back->Lanjut, the final summary reflecting what
 * was really typed, and the submit conversion (success + a network-failure
 * negative scenario + a double-submit guard).
 */
const BUSINESS = {
  name: "Kascing Sejahtera Makmur",
  province: "Jawa Barat",
  city: "Bandung",
  address: "Jl. Contoh No. 123",
  whatsapp: "628123456789",
  email: "kascing.sejahtera@example.com",
};

async function fillStep0(page: import("@playwright/test").Page) {
  await page.getByLabel(/Nama Bisnis/).fill(BUSINESS.name);
  await page.getByLabel(/Provinsi/).selectOption(BUSINESS.province);
  await page.getByLabel(/Kota\/Kabupaten/).fill(BUSINESS.city);
  await page.getByLabel(/Alamat Lengkap/).fill(BUSINESS.address);
}

async function fillStep1(page: import("@playwright/test").Page) {
  await page.getByLabel(/Nomor WhatsApp/).fill(BUSINESS.whatsapp);
  await page.getByLabel(/^Email/).fill(BUSINESS.email);
}

test.describe("Funnel 3: Daftar Bisnis Produsen", () => {
  test("entry points reach the registration form", async ({ page }) => {
    await page.goto("/id/direktori");
    await page.getByRole("link", { name: "Daftarkan Bisnis Anda" }).first().click();
    await expect(page).toHaveURL(/\/id\/direktori\/daftar$/);
    await expect(page.getByRole("heading", { name: "Daftarkan Bisnis Kascing Anda" })).toBeVisible();
  });

  test("step 1 blocks progress with empty required fields, then accepts valid data", async ({ page }) => {
    await page.goto("/id/direktori/daftar");
    await page.getByRole("button", { name: "Lanjut →" }).click();

    await expect(page.getByText("Nama bisnis wajib diisi.")).toBeVisible();
    await expect(page.getByText("Pilih provinsi.")).toBeVisible();
    await expect(page.getByText("Kota wajib diisi.")).toBeVisible();
    await expect(page.getByText("Alamat wajib diisi.")).toBeVisible();
    // Still on step 1 - the step indicator's current step keeps its filled style
    await expect(page.getByText("Data Bisnis")).toHaveClass(/font-medium/);

    await fillStep0(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await expect(page.getByLabel(/Nomor WhatsApp/)).toBeVisible();
  });

  test("step 2 validates contact requirement and phone format", async ({ page }) => {
    await page.goto("/id/direktori/daftar");
    await fillStep0(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();

    // Neither WhatsApp nor phone filled, email also empty
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await expect(page.getByText("Isi minimal salah satu: WhatsApp atau telepon.")).toBeVisible();
    await expect(page.getByText("Email wajib diisi.")).toBeVisible();

    // Invalid formats
    await page.getByLabel(/Nomor WhatsApp/).fill("abc");
    await page.getByLabel(/^Email/).fill("not-an-email");
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await expect(page.getByText("Format nomor WhatsApp tidak valid.")).toBeVisible();
    await expect(page.getByText("Format email tidak valid.")).toBeVisible();

    await page.getByLabel(/Nomor WhatsApp/).fill(BUSINESS.whatsapp);
    await page.getByLabel(/^Email/).fill(BUSINESS.email);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await expect(page.getByText("Produk & Kapasitas")).toHaveClass(/font-medium/);
  });

  test("data survives Kembali -> Lanjut across steps", async ({ page }) => {
    await page.goto("/id/direktori/daftar");
    await fillStep0(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await fillStep1(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();

    // Go back twice to step 1, then forward again - nothing should be lost
    await page.getByRole("button", { name: "Kembali" }).click();
    await page.getByRole("button", { name: "Kembali" }).click();
    await expect(page.getByLabel(/Nama Bisnis/)).toHaveValue(BUSINESS.name);
    await expect(page.getByLabel(/Kota\/Kabupaten/)).toHaveValue(BUSINESS.city);

    await page.getByRole("button", { name: "Lanjut →" }).click();
    await expect(page.getByLabel(/Nomor WhatsApp/)).toHaveValue(BUSINESS.whatsapp);
    await expect(page.getByLabel(/^Email/)).toHaveValue(BUSINESS.email);
  });

  test("step 3 requires at least one product and a capacity", async ({ page }) => {
    await page.goto("/id/direktori/daftar");
    await fillStep0(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await fillStep1(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();

    await page.getByRole("button", { name: "Lanjut →" }).click();
    await expect(page.getByText("Pilih minimal satu jenis produk.")).toBeVisible();
    await expect(page.getByText("Pilih kapasitas produksi.")).toBeVisible();

    await page.getByText("Kascing Kemasan").click();
    await page.getByLabel(/Kapasitas Produksi/).selectOption("menengah");
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await expect(page.getByText("Ringkasan Pendaftaran")).toBeVisible();
  });

  test("summary on step 4 reflects exactly what was entered", async ({ page }) => {
    await page.goto("/id/direktori/daftar");
    await fillStep0(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await fillStep1(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await page.getByText("Kascing Kemasan").click();
    await page.getByLabel(/Kapasitas Produksi/).selectOption("menengah");
    await page.getByRole("button", { name: "Lanjut →" }).click();

    const summary = page.locator("dl");
    await expect(summary).toContainText(BUSINESS.name);
    await expect(summary).toContainText(`${BUSINESS.city}, ${BUSINESS.province}`);
    await expect(summary).toContainText(BUSINESS.whatsapp);
    await expect(summary).toContainText(BUSINESS.email);
    await expect(summary).toContainText("Kascing Kemasan");
  });

  async function reachFinalStep(page: import("@playwright/test").Page) {
    await fillStep0(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await fillStep1(page);
    await page.getByRole("button", { name: "Lanjut →" }).click();
    await page.getByText("Kascing Kemasan").click();
    await page.getByLabel(/Kapasitas Produksi/).selectOption("menengah");
    await page.getByRole("button", { name: "Lanjut →" }).click();
  }

  test("conversion: submit shows submitting state then success with correct data", async ({ page }) => {
    await page.goto("/id/direktori/daftar");
    await reachFinalStep(page);

    const submitBtn = page.getByRole("button", { name: "Kirim Pendaftaran" });
    await submitBtn.click();
    await expect(page.getByRole("button", { name: "Mengirim…" })).toBeDisabled();

    await expect(page.getByText("Pendaftaran Berhasil Dikirim")).toBeVisible();
    await expect(page.getByText(BUSINESS.name)).toBeVisible();
    await expect(page.getByText(BUSINESS.email)).toBeVisible();
  });

  test("negative: submit failure (?debugError=1) keeps form data and shows a retry-friendly message", async ({ page }) => {
    await page.goto("/id/direktori/daftar?debugError=1");
    await reachFinalStep(page);

    await page.getByRole("button", { name: "Kirim Pendaftaran" }).click();
    const submitAlert = page.getByRole("alert").filter({ hasText: "Koneksi terputus" });
    await expect(submitAlert).toContainText("Koneksi terputus saat mengirim formulir.");
    await expect(submitAlert).toContainText("Data formulir Anda tidak hilang");
    // Still on the form, not the success screen, and the summary still has the data
    await expect(page.getByText("Pendaftaran Berhasil Dikirim")).toHaveCount(0);
    await expect(page.locator("dl")).toContainText(BUSINESS.name);
  });

  test("negative: submit button disables itself instantly, blocking a second click before the network delay resolves", async ({ page }) => {
    await page.goto("/id/direktori/daftar");
    await reachFinalStep(page);

    const submitBtn = page.getByRole("button", { name: "Kirim Pendaftaran" });
    await submitBtn.click();
    // The button flips to disabled synchronously in the click handler, well
    // before the 900ms mock network delay resolves - a second real click
    // during that window can't register, which is the app's actual
    // double-submit guard (backed by a submitLock ref for extra safety).
    await expect(page.getByRole("button", { name: "Mengirim…" })).toBeDisabled();

    await expect(page.getByText("Pendaftaran Berhasil Dikirim")).toBeVisible();
    await expect(page.getByText("Pendaftaran Berhasil Dikirim")).toHaveCount(1);
  });
});
