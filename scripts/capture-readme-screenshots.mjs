import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "readme-screenshots");
const BASE = "http://localhost:5173";

async function capture(page, fileName) {
  await page.screenshot({
    path: path.join(OUT, fileName),
    fullPage: false,
  });
}

async function loginSeed(page) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("**/dashboard", { timeout: 20000 });
  await page.locator("#section-insight").waitFor({ timeout: 30000 });
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto(`${BASE}/login`);
  await page.waitForTimeout(500);
  await capture(page, "login.png");

  await page.goto(`${BASE}/signup`);
  await page.waitForTimeout(500);
  await capture(page, "signup.png");

  const uniqueEmail = `readme-${Date.now()}@example.com`;
  await page.goto(`${BASE}/signup`);
  await page.getByLabel("Name").fill("Demo User");
  await page.getByLabel("Email").fill(uniqueEmail);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.waitForURL("**/login", { timeout: 20000 });
  await page.getByLabel("Email").fill(uniqueEmail);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("**/onboarding", { timeout: 20000 });
  await page.waitForTimeout(500);
  await capture(page, "onboarding.png");

  await loginSeed(page);
  await page.waitForTimeout(800);
  await capture(page, "dashboard.png");

  await page.goto(`${BASE}/settings`);
  await page.waitForTimeout(500);
  await capture(page, "settings.png");

  await browser.close();
  console.log(`README screenshots saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
