import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const brief = {
  relevant: true,
  title: "Billing platform modernization",
  summary: "A legacy Java billing system is slow to change. The goal is an incremental move to AWS.",
  services: [
    { slug: "application-modernization", reason: "Incremental decomposition behind stable APIs." },
    { slug: "cloud-devops", reason: "Repeatable infrastructure and pipelines." },
  ],
  engagement: { model: "project", reason: "A defined first milestone." },
  team: { workType: "modernization", teamSize: 7, durationMonths: 9, usInvolvement: "standard", ongoingSupport: true },
  phases: [
    { name: "Assess", detail: "Map the system and risks." },
    { name: "Stabilize", detail: "Add tests and CI." },
    { name: "Migrate", detail: "Move the first domain to AWS." },
  ],
  risks: ["Undocumented pricing rules.", "Month-end cutover windows."],
  questions: ["What changes most often?", "Any audit controls?", "Who owns architecture decisions?"],
};

/** Every test mocks the API in the browser: Google is never called. */
async function mockBrief(page: Page, body: unknown, status = 200, delayMs = 400) {
  await page.route("**/api/brief", async (route) => {
    await new Promise((r) => setTimeout(r, delayMs));
    await route.fulfill({ status, json: body });
  });
}

test.describe("Brief assistant", () => {
  test("drafts a brief from an example prompt and hands it to the contact form", async ({ page }) => {
    await mockBrief(page, { ok: true, brief, demo: false }, 200, 1200);
    await page.goto("/brief");
    await page.getByRole("button", { name: /15-year-old Java billing/ }).click();
    await page.getByRole("button", { name: "Draft my brief" }).click();

    // Progress is visible while waiting, then the brief replaces it.
    await expect(page.getByRole("list", { name: "Drafting your brief" })).toBeVisible();
    const result = page.getByTestId("brief-result");
    await expect(result.getByRole("heading", { name: brief.title })).toBeVisible();
    await expect(result.getByRole("link", { name: /Cloud & DevOps/ })).toHaveAttribute("href", "/services/cloud-devops");
    await expect(page.getByText(/AI-generated first draft/)).toBeVisible();

    await page.getByRole("button", { name: /Send this brief to Domiutra/ }).click();
    await expect(page).toHaveURL(/\/contact\?from=brief$/);
    await expect(page.getByTestId("brief-included")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Message" })).toHaveValue(/^Project brief: Billing platform modernization/);
    await expect(page.getByRole("combobox", { name: "What are you looking for?" })).toHaveValue("application-modernization");
  });

  test("explains off-topic requests and allows starting over", async ({ page }) => {
    await mockBrief(page, { ok: false, error: "off_topic" }, 422);
    await page.goto("/brief");
    await page.getByRole("textbox", { name: "Describe your project" }).fill("Write me a poem about the ocean and the stars please.");
    await page.keyboard.press("ControlOrMeta+Enter");
    // Scope to the assistant: Next.js also renders a hidden route announcer with role="alert".
    await expect(page.getByTestId("brief-assistant").getByRole("alert")).toContainText("only help scope technology");
    await page.getByRole("button", { name: "Start a new brief" }).click();
    await expect(page.getByRole("textbox", { name: "Describe your project" })).toBeFocused();
  });

  test("appears on the homepage and is linked from the contact page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Describe it. Get a plan." })).toBeVisible();
    await expect(page.getByTestId("brief-assistant")).toBeVisible();
    await page.goto("/contact");
    await page.getByRole("link", { name: /Draft a project brief with our AI assistant/ }).click();
    await expect(page).toHaveURL(/\/brief$/);
  });

  test("the rendered brief passes WCAG 2.2 AA checks", async ({ page }) => {
    await mockBrief(page, { ok: true, brief, demo: false }, 200, 0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/brief");
    await page.getByRole("textbox", { name: "Describe your project" }).fill("Our billing platform is slow to change and we want to move to AWS.");
    await page.getByRole("button", { name: "Draft my brief" }).click();
    await expect(page.getByTestId("brief-result")).toBeVisible();
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page }).include('[data-testid="brief-assistant"]').withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("API rejects cross-origin and invalid requests without calling Gemini", async ({ request }) => {
    const cross = await request.post("/api/brief", { data: { prompt: "x".repeat(40) }, headers: { origin: "https://evil.example" } });
    expect(cross.status()).toBe(403);
    const short = await request.post("/api/brief", { data: { prompt: "hi" }, headers: { "x-forwarded-for": "10.9.9.9" } });
    expect(short.status()).toBe(422);
  });
});
