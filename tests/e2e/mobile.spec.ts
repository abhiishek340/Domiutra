import { expect, test } from "@playwright/test";
import { allRoutes } from "./routes";

test.describe("Mobile navigation", () => {
  test("opens a modal menu, traps focus, closes with Escape, and navigates", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    await expect(open).toBeVisible();
    await open.click();

    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(page.locator("#main")).toHaveAttribute("inert", "");

    // Focus starts inside and stays inside when tabbing backwards past the start.
    await expect(dialog.locator(":focus")).toHaveCount(1);
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();

    await open.click();
    await dialog.getByRole("link", { name: "How we work" }).click();
    await expect(page).toHaveURL(/\/delivery-model$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("Responsive layout", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const route of allRoutes) {
    test(`${route} has no horizontal overflow at 375px`, async ({ page }) => {
      await page.goto(route);
      const { scrollWidth, clientWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      // A wider layout viewport means content forced the page to zoom out.
      expect(innerWidth).toBe(clientWidth);
    });
  }
});
