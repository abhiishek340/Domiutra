# Domiutra

Marketing website for **Domiutra**, a U.S.-managed technology services company.

> **Build. Modernize. Operate.** Engineering, cloud, AI, and managed services from U.S.-managed global teams.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Motion.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires **Node 20.9+**.

Every environment variable is optional, so the site runs without any configuration. To enable email, analytics, and other integrations:

```bash
cp .env.example .env.local
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler |
| `npm test` | Run unit and component tests (Vitest) |
| `npm run test:coverage` | Run unit tests with coverage thresholds |
| `npm run test:e2e` | Run end-to-end and accessibility tests (Playwright) |
| `npm run check` | Lint, typecheck, test with coverage, and build |

Before the first E2E run: `npx playwright install chromium`.

## Project structure

```text
app/              Routes, metadata, sitemap, robots, OG image, contact API
components/       UI, layout, navigation, sections, cards, diagrams, forms
content/          MDX articles (insights/) and legal pages (legal/)
lib/
  data/           Services, industries, case studies, navigation (typed content)
  seo/            Metadata and JSON-LD helpers
  contact/        Email delivery, CRM adapters, rate limiting
  estimator/      Delivery-planner logic
  site.ts         Business config read from environment variables
tests/            unit/ (Vitest) and e2e/ (Playwright)
docs/             Design and positioning notes
```

Pages are statically prerendered server components. Client components are used only where interaction requires them: navigation, forms, the planner, and interactive diagrams.

## Environment variables

See [`.env.example`](.env.example) for the full list with descriptions.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for SEO and the sitemap) |
| `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form email delivery |
| `HUBSPOT_ACCESS_TOKEN` | Optional CRM forwarding |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | AI brief assistant (Gemini) |
| `BRIEF_DEMO_MODE` | Local preview of the assistant without a key (`true`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public email shown on the site |
| `NEXT_PUBLIC_SCHEDULING_URL` | Booking link ("Schedule a conversation") |
| `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_X_URL` | Social links |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `NEXT_PUBLIC_ANALYTICS_ID` | Analytics (`plausible` or `ga4`) |
| `ATS_PROVIDER`, `ATS_BOARD_ID` | Job listings (`greenhouse`, `lever`, or `ashby`) |

Anything left unset is hidden or reported honestly. For example, the contact form never shows a success message unless email delivery is actually configured.

## Contact form

1. Create a [Resend](https://resend.com) account and verify your sending domain.
2. Set `RESEND_API_KEY`, `CONTACT_EMAIL`, and `CONTACT_FROM_EMAIL`.
3. Redeploy.

Submissions are validated with Zod on both client and server, and protected by a same-origin check, rate limiting, a honeypot field, and a minimum fill time.

## AI brief assistant

Visitors describe their situation and get a first-draft project brief: recommended services, engagement model, team shape, phases, risks, and open questions. It appears on the homepage, at `/brief`, and as a link on the contact page, and can hand the brief straight into the contact form.

1. Create a key in [Google AI Studio](https://aistudio.google.com).
2. Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`), then redeploy.

How it stays safe: the key never leaves the server; Gemini must return a strict JSON shape that is validated with Zod; it can only recommend the six real services; team numbers come from the site's own planner logic; visitor text is treated as data and never stored; requests are rate limited. Without a key the feature is hidden. For a local preview, set `BRIEF_DEMO_MODE=true`.

## Editing content

**Add an article:** create `content/insights/<slug>.mdx`:

```mdx
export const meta = {
  title: "Article title",
  excerpt: "One or two sentences.",
  category: "Engineering", // AI | Engineering | Cloud | Outsourcing | Modernization | Leadership
  publishedAt: "2026-11-01",
  readingTime: "6 min read",
}

Your article in Markdown…
```

The page, listing, sitemap entry, and structured data are generated automatically.

**Other content**

| To add or change… | Edit |
| --- | --- |
| A service | `lib/data/services.ts` (and `servicesMenu` in `lib/data/navigation.ts`) |
| An industry | `lib/data/industries.ts` |
| A case study | `lib/data/case-studies.ts` (use `kind: "client"` only for real, approved work) |
| Leadership bios | `lib/data/leadership.ts` |
| Certifications | `lib/data/trust.ts` (only once obtained) |
| Legal pages | `content/legal/*.mdx` |

## Deployment

The project deploys to [Vercel](https://vercel.com) with no extra configuration:

1. Import the repository in Vercel.
2. Add environment variables.
3. Deploy, then set `NEXT_PUBLIC_SITE_URL` to your production domain.

Preview deployments are automatically excluded from search indexing.

## Testing

| Layer | Tool | What it covers |
| --- | --- | --- |
| Unit and component | Vitest + Testing Library | Business logic, contact API, content loading, SEO, navigation, UI components |
| Page rendering | Vitest | Every page renders in React's development build with zero console errors |
| End-to-end | Playwright | Real browser journeys on desktop and mobile, forms, routing, SEO files |
| Accessibility | axe-core | WCAG 2.2 A/AA checks on key pages |

**Coverage** is enforced: the run fails if total coverage drops below 90% (statements and lines), or below 90% for `lib/` and the contact API. Open `coverage/index.html` after `npm run test:coverage` for the full report.

**CI** runs on every push and pull request (`.github/workflows/ci.yml`): lint, typecheck, unit tests with coverage, build, then E2E and accessibility tests.

Tests live in `tests/unit/` (`*.test.ts[x]`) and `tests/e2e/` (`*.spec.ts`).

## Notes

- **Accessibility:** targets WCAG 2.2 AA. Content stays visible without JavaScript, and animations respect `prefers-reduced-motion`.
- **Local network testing:** to open the dev server from another device (e.g. `http://10.0.0.x:3000`), the address must be allowed by `allowedDevOrigins` in `next.config.ts`. Common private ranges are already included.
- **Legal pages** are starter templates and need review by counsel before launch.
- Design rationale lives in [`docs/design-notes.md`](docs/design-notes.md).
