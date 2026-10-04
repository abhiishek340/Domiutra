import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/services",
  "/services/application-modernization",
  "/services/managed-services",
  "/industries/healthcare",
  "/engagement-models",
  "/delivery-model",
  "/work",
  "/work/modernizing-a-policy-administration-platform",
  "/insights",
  "/insights/when-application-modernization-makes-financial-sense",
  "/about",
  "/careers",
  "/contact",
  "/brief",
  "/security",
  "/privacy",
];

// Reduced motion renders reveal-on-scroll content immediately, so axe checks
// final colors rather than mid-fade opacity.
test.use({ reducedMotion: "reduce" });

for (const path of pages) {
  test(`${path} has no WCAG 2.2 A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));
    expect(summary).toEqual([]);
  });
}

test("contact form errors are announced and associated", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Start the conversation" }).click();
  const results = await new AxeBuilder({ page }).include("form").withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("reduced motion stops decorative loops", async ({ page }) => {
  await page.goto("/");
  // Title letters render statically, with no entrance or color-wave animation.
  const animation = await page.locator(".hero-letter").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe("none");
  // The ticker stops scrolling.
  const ticker = await page.locator(".marquee").evaluate((el) => getComputedStyle(el).animationName);
  expect(ticker).toBe("none");
});
