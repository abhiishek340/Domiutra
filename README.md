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
| `npm run test:e2e` | Run end-to-end and accessibility tests (Playwright) |
| `npm run check` | Lint, typecheck, test, and build |

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

## Notes

- **Accessibility:** targets WCAG 2.2 AA. Content stays visible without JavaScript, and animations respect `prefers-reduced-motion`.
- **Local network testing:** to open the dev server from another device (e.g. `http://10.0.0.x:3000`), the address must be allowed by `allowedDevOrigins` in `next.config.ts`. Common private ranges are already included.
- **Legal pages** are starter templates and need review by counsel before launch.
- Design rationale lives in [`docs/design-notes.md`](docs/design-notes.md).
