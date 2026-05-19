const { test } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const ADMIN_USER = process.env.DISCOURSE_ADMIN_USER || "pwadmin";
const ADMIN_PASS = process.env.DISCOURSE_ADMIN_PASS || "playwright-pass-123";

async function shot(page, name) {
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
}

async function login(page) {
  await page.goto("/");
  await page.click(".login-button");
  await page.fill("#login-account-name", ADMIN_USER);
  await page.fill("#login-account-password", ADMIN_PASS);
  await page.click("#login-button");
  await page.waitForSelector("#current-user", { timeout: 30_000 });
}

test("latest page", async ({ page }) => {
  await page.goto("/latest");
  await shot(page, "01-latest");
});

test("first topic", async ({ page }) => {
  await page.goto("/latest");
  await page.waitForSelector("a.title");
  await page.locator("a.title").first().click();
  await page.waitForSelector(".topic-post");
  await shot(page, "02-topic");
});

test("translator site settings", async ({ page }) => {
  await login(page);
  await page.goto("/admin/site_settings/category/all_results?filter=translator");
  await page.waitForSelector(".admin-detail");
  await shot(page, "03-translator-settings");
});
