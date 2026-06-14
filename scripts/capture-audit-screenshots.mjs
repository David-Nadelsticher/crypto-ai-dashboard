import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "audit-screenshots", "post-fix");
const BASE = "http://localhost:5173";

const sizes = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

async function capture(page, fileName, fullPage = false) {
  await page.screenshot({ path: path.join(OUT, fileName), fullPage });
}

async function loginSeed(page) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.locator("#section-insight").waitFor({ timeout: 30000 });
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login screens
  for (const s of sizes) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto(`${BASE}/login`);
    await page.waitForTimeout(300);
    await capture(page, `login-${s.name}.png`);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Email").fill("bad@example.com");
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForTimeout(800);
  await capture(page, "login-error-desktop.png");

  // Signup
  for (const s of sizes) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto(`${BASE}/signup`);
    await page.waitForTimeout(300);
    await capture(page, `signup-${s.name}.png`);
  }

  // Onboarding (new user)
  const uniqueEmail = `audit-${Date.now()}@example.com`;
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/signup`);
  await page.getByLabel("Name").fill("Audit User");
  await page.getByLabel("Email").fill(uniqueEmail);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.waitForURL("**/login", { timeout: 15000 });
  await page.getByLabel("Email").fill(uniqueEmail);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("**/onboarding", { timeout: 15000 });

  for (const s of sizes) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.waitForTimeout(300);
    await capture(page, `onboarding-${s.name}.png`, s.name === "mobile");
  }

  // Dashboard (seed user)
  await loginSeed(page);
  for (const s of sizes) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.waitForTimeout(500);
    await capture(page, `dashboard-${s.name}.png`, s.name === "mobile");
  }

  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(400);
  await capture(page, "dashboard-mobile-menu.png");
  await page.keyboard.press("Escape");

  await page.setViewportSize({ width: 1280, height: 800 });
  const helpful = page.locator("#section-insight").getByRole("button", { name: "Helpful" });
  await helpful.waitFor({ state: "visible", timeout: 30000 });
  await helpful.click();
  await page.getByText("Thanks — Piggy will tune future briefs.").waitFor({ timeout: 10000 });
  await capture(page, "dashboard-vote-success-desktop.png");

  await page.getByRole("button", { name: "Refresh" }).click();
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 375, height: 812 });
  await capture(page, "dashboard-refresh-mobile.png");

  // Loading screen snapshot via a11y tree export
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto(`${BASE}/dashboard`);
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1280, height: 800 });
  await capture(page, "loading-screen-desktop.png");

  // a11y snapshots
  await page.goto(`${BASE}/login`);
  const loginA11y = await page.accessibility.snapshot();
  await import("node:fs/promises").then((fs) =>
    fs.writeFile(
      path.join(OUT, "a11y-login-snapshot.md"),
      `# Login a11y snapshot (post-fix)\n\n\`\`\`yaml\n${JSON.stringify(loginA11y, null, 2)}\n\`\`\`\n`,
    ),
  );

  await loginSeed(page);
  const dashA11y = await page.accessibility.snapshot();
  await import("node:fs/promises").then((fs) =>
    fs.writeFile(
      path.join(OUT, "a11y-dashboard-snapshot.md"),
      `# Dashboard a11y snapshot (post-fix)\n\n\`\`\`yaml\n${JSON.stringify(dashA11y, null, 2)}\n\`\`\`\n`,
    ),
  );

  await browser.close();
  console.log(`Screenshots saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
