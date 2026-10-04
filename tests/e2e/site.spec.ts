import { expect, test } from "@playwright/test";
import { allRoutes, serviceRoutes } from "./routes";

test.describe("Home", () => {
  test("loads with the core message and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/Domiutra/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Build. Modernize. Operate.");
    await expect(page.getByRole("main").getByRole("link", { name: "Talk to Domiutra" }).first()).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "Explore services" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("primary navigation stays short", async ({ page }) => {
    await page.goto("/");
    const items = page.getByRole("navigation", { name: "Primary" }).locator("ul > li");
    await expect(items).toHaveCount(5);
  });

  test("has a single h1 and labelled landmarks", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("primary links navigate and mark the active page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "Industries" }).click();
    await expect(page).toHaveURL(/\/industries$/);
    await expect(nav.getByRole("link", { name: "Industries" })).toHaveAttribute("aria-current", "page");
  });

  test("services mega-menu opens, closes with Escape, and links work", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Services" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator(`#${await trigger.getAttribute("aria-controls")}`);
    await expect(menu.getByRole("link", { name: /Cloud & DevOps/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await menu.getByRole("link", { name: /Application Modernization/ }).click();
    await expect(page).toHaveURL(/\/services\/application-modernization$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("Keyboard", () => {
  test("skip link is the first focusable element and moves focus to main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("interactive controls are reachable and show a visible focus ring", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab"); // skip link
    await page.keyboard.press("Tab"); // logo
    await expect(page.getByRole("link", { name: "Domiutra home" }).first()).toBeFocused();
    await page.keyboard.press("Tab");
    const services = page.getByRole("button", { name: "Services" });
    await expect(services).toBeFocused();
    const outline = await services.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
  });

  test("delivery model tabs support arrow keys", async ({ page }) => {
    await page.goto("/delivery-model");
    const tablist = page.getByRole("tablist", { name: "Engagement model" });
    await tablist.scrollIntoViewIfNeeded();
    const first = tablist.getByRole("tab", { name: "Project" });
    await first.focus();
    await page.keyboard.press("ArrowRight");
    const second = tablist.getByRole("tab", { name: "Dedicated Team" });
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("Delivery estimator", () => {
  test("recalculates team composition from inputs", async ({ page }) => {
    await page.goto("/engagement-models#estimator");
    await page.waitForLoadState("networkidle"); // let hydration finish under parallel load
    const estimator = page.getByTestId("estimator");
    await estimator.scrollIntoViewIfNeeded();
    const roles = page.getByTestId("estimator-roles");
    await expect(roles).not.toContainText("Support engineers");

    await expect(async () => {
      await estimator.getByText("Managed service", { exact: true }).click();
      await expect(roles).toContainText("Support engineers", { timeout: 1000 });
    }).toPass();
    await expect(estimator).toContainText("Service owner");

    const slider = estimator.getByLabel("Delivery team size");
    await slider.fill("20");
    await expect(estimator.locator("output").first()).toHaveText("20 people");
    await expect(page.getByTestId("estimator-total")).toContainText(/2[0-9]|3[0-9]/);
    await expect(estimator).toContainText("Illustrative planning tool");
  });
});

test.describe("Routes", () => {
  for (const route of allRoutes) {
    test(`${route} responds 200 with one h1`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${route === "/" ? "/?" : route}$`));
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    });
  }

  test("service pages include FAQ and service structured data", async ({ page }) => {
    for (const route of serviceRoutes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: "Straight answers." })).toBeVisible();
      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(ld.join(" ")).toContain('"@type":"Service"');
      expect(ld.join(" ")).toContain('"@type":"BreadcrumbList"');
    }
  });

  test("insights articles render MDX with Article schema", async ({ page }) => {
    await page.goto("/insights");
    await page.getByRole("link", { name: /staff augmentation and managed services/i }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("staff augmentation");
    await expect(page.getByRole("complementary", { name: "Key takeaways" })).toBeVisible();
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.join(" ")).toContain('"@type":"Article"');
  });

  test("insights filter shows an empty state for categories without articles", async ({ page }) => {
    await page.goto("/insights");
    await page.getByRole("button", { name: /^Engineering/ }).click();
    await expect(page.getByText("Nothing in Engineering yet.")).toBeVisible();
  });

  test("unknown routes render the designed 404", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This path doesn’t lead anywhere." })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("careers shows the empty state instead of fake jobs", async ({ page }) => {
    await page.goto("/careers");
    await expect(page.getByTestId("jobs-empty")).toContainText("Open roles will be posted here.");
    await expect(page.getByTestId("job-list")).toHaveCount(0);
  });
});

test.describe("SEO files", () => {
  test("robots.txt and sitemap.xml are valid", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    const xml = await sitemap.text();
    for (const route of serviceRoutes) expect(xml).toContain(route);
    expect(xml).toContain("/insights/");
  });

  test("Open Graph image renders as PNG", async ({ request }) => {
    const res = await request.get("/og?title=Test%20title&eyebrow=Services");
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("organization and website JSON-LD are present on every page", async ({ page }) => {
    await page.goto("/about");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).toContain('"@type":"Organization"');
    expect(ld).toContain('"@type":"WebSite"');
    expect(ld).not.toContain("LocalBusiness");
  });
});

test.describe("Without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of ["/", "/services/application-modernization", "/delivery-model", "/engagement-models"]) {
    test(`${route} shows all content when scripts never run`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll("main *")].filter((el) => {
          const cs = getComputedStyle(el);
          return el.textContent?.trim() && cs.opacity === "0" && !el.closest("[aria-hidden=true]") && !el.closest(".animate-rise,.animate-fade");
        }).length,
      );
      expect(hidden).toBe(0);
    });
  }
});
