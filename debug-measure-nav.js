// debug-measure-nav.js — Measures page navigation timing for cart & wishlist
// Run: node debug-measure-nav.js

const puppeteer = require("puppeteer");

const BASE = "http://localhost:3000";

async function measureNav(label, fromUrl, linkSelector, waitForSelector) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to starting page
    await page.goto(fromUrl, { waitUntil: "networkidle0" });

    // Small pause to let React finish hydration
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

    // Click the link and measure
    const start = Date.now();

    // Use Promise.all to wait for both navigation and selector
    await Promise.all([
      page.waitForSelector(waitForSelector, { timeout: 15000 }),
      page.click(linkSelector),
    ]);

    const elapsed = Date.now() - start;

    console.log(
      JSON.stringify({
        label,
        timingMs: elapsed,
        success: true,
      })
    );
  } catch (err) {
    console.log(
      JSON.stringify({
        label,
        timingMs: -1,
        success: false,
        error: err.message,
      })
    );
  } finally {
    await browser.close();
  }
}

async function main() {
  const locale = "en";
  const homeUrl = `${BASE}/${locale}`;

  // Measure 3 runs each for cart and wishlist
  for (const [label, selector, waitFor] of [
    ["cart", `a[href="/${locale}/cart"]`, "h1"],
    ["wishlist", `a[href="/${locale}/wishlist"]`, "h1, [data-testid='wishlist-title']"],
  ]) {
    for (let i = 0; i < 3; i++) {
      await measureNav(`${label}-run-${i + 1}`, homeUrl, selector, waitFor);
    }
  }
}

main().catch(console.error);
