// QA run: screenshots at many widths, axe accessibility scan, overflow check.
// Usage: node scripts/qa.mjs [baseUrl] [outDir]
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3] ?? "qa-output";
mkdirSync(out, { recursive: true });

const pages = ["/", "/library", "/library/getting-into-college", "/articles/moving-back-to-the-us-for-high-school", "/guides", "/guides/senior-to-college-freshman-route", "/the-solo-scholar", "/about", "/contact", "/privacy-policy", "/does-not-exist"];
const widths = [320, 375, 414, 768, 1024, 1280, 1536, 1920];

const browser = await chromium.launch();
const problems = [];

for (const path of pages) {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    if (overflow.sw > overflow.iw + 1) problems.push(`${path} @${width}: horizontal overflow ${overflow.sw} > ${overflow.iw}`);
    if (width === 375 || width === 1280) {
      const name = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "_");
      await page.screenshot({ path: join(out, `${name}-${width}.png`), fullPage: true });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      for (const v of results.violations) {
        problems.push(`${path} @${width}: [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes) e.g. ${v.nodes[0]?.target.join(" ")} :: ${v.nodes[0]?.failureSummary?.split("\n")[1] ?? ""}`);
      }
    }
    await ctx.close();
  }
  console.log("checked", path);
}

// Keyboard check on the home shelf tabs.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const h1s = await page.locator("h1").count();
  const mains = await page.locator("main").count();
  if (h1s !== 1) problems.push(`home: ${h1s} h1 elements`);
  if (mains !== 1) problems.push(`home: ${mains} main elements`);
  await page.locator('[role="tab"][aria-selected="true"]').focus();
  await page.keyboard.press("ArrowRight");
  const sel = await page.locator('[role="tab"][aria-selected="true"]').textContent();
  console.log("after ArrowRight, selected tab:", sel?.trim());
  const landmarksOutside = await page.evaluate(() => {
    const ok = new Set(["HEADER", "MAIN", "FOOTER", "NAV", "SCRIPT", "A", "DIV"]);
    return [...document.body.children].filter((el) => !ok.has(el.tagName) || (el.tagName === "DIV" && !el.classList.contains("intro"))).map((el) => el.tagName + "." + el.className);
  });
  if (landmarksOutside.length) problems.push("content outside landmarks: " + landmarksOutside.join(", "));
  await ctx.close();
}

await browser.close();
console.log("\n==== PROBLEMS (" + problems.length + ") ====");
for (const p of problems) console.log("-", p);
