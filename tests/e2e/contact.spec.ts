import { expect, test, type Page } from "@playwright/test";

async function fillValidForm(page: Page) {
  await page.getByLabel("First name").fill("Jordan");
  await page.getByLabel("Last name").fill("Lee");
  await page.getByLabel("Work email").fill("jordan@example.com");
  await page.getByRole("textbox", { name: "Company", exact: true }).fill("Example Co");
  await page.getByLabel("What are you looking for?").selectOption("cloud-devops");
  await page.getByLabel("Message").fill("We need help migrating three services to AWS this quarter.");
}

test.describe("Contact form", () => {
  test("shows accessible validation errors when submitted empty", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Start the conversation" }).click();

    const summary = page.getByRole("alert").filter({ hasText: "Please check" });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();

    const firstName = page.getByLabel("First name");
    await expect(firstName).toHaveAttribute("aria-invalid", "true");
    await expect(firstName).toHaveAttribute("aria-describedby", "firstName-error");
    await expect(page.locator("#firstName-error")).toHaveText("Enter your first name.");
    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#message-error")).toBeVisible();
  });

  test("validates email format inline", async ({ page }) => {
    await page.goto("/contact");
    const email = page.getByLabel("Work email");
    await email.fill("not-an-email");
    await email.blur();
    await expect(page.locator("#email-error")).toContainText("valid email");
  });

  test("shows the success state when the API accepts the message", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
    );
    await page.goto("/contact");
    await fillValidForm(page);
    await page.waitForTimeout(2600); // respect the minimum fill time
    await page.getByRole("button", { name: "Start the conversation" }).click();
    await expect(page.getByTestId("contact-success")).toContainText("your message is on its way");
  });

  test("tells the truth when email delivery isn't configured", async ({ page }) => {
    await page.goto("/contact");
    await fillValidForm(page);
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: "Start the conversation" }).click();
    const error = page.getByTestId("contact-error");
    await expect(error).toContainText("Your message has not been sent.");
    await expect(page.getByTestId("contact-success")).toHaveCount(0);
  });

  test("pre-selects the service from the query string", async ({ page }) => {
    await page.goto("/contact?service=ai-data");
    await expect(page.getByLabel("What are you looking for?")).toHaveValue("ai-data");
  });
});

test.describe("Contact API", () => {
  test("rejects invalid payloads with field errors", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { firstName: "", email: "nope", interest: "x", message: "short" },
      headers: { "x-forwarded-for": "10.0.0.1" },
    });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.fieldErrors).toHaveProperty("email");
  });

  test("silently drops honeypot submissions", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { website: "http://spam.example" },
      headers: { "x-forwarded-for": "10.0.0.2" },
    });
    expect(res.status()).toBe(200);
  });

  test("returns 503 instead of success when email is not configured", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        firstName: "Jordan",
        lastName: "Lee",
        email: "jordan@example.com",
        company: "Example Co",
        interest: "other",
        message: "A sufficiently long message for validation.",
        startedAt: Date.now() - 10_000,
      },
      headers: { "x-forwarded-for": "10.0.0.3" },
    });
    expect(res.status()).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, error: "not_configured" });
  });

  test("rate limits repeated submissions", async ({ request }) => {
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await request.post("/api/contact", { data: {}, headers: { "x-forwarded-for": "10.0.0.99" } });
      statuses.push(res.status());
    }
    expect(statuses).toContain(429);
  });

  test("accepts same-host posts from any hostname (e.g. a LAN IP)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {},
      headers: { origin: "http://10.0.0.5:3000", host: "10.0.0.5:3000", "x-forwarded-for": "10.0.0.5" },
    });
    expect(res.status()).not.toBe(403);
  });

  test("rejects cross-origin posts", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {},
      headers: { origin: "https://evil.example", "x-forwarded-for": "10.0.0.4" },
    });
    expect(res.status()).toBe(403);
  });
});
