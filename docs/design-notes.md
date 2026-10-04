# Domiutra: design & positioning notes

Internal reference for designers and engineers working on the site.

## Positioning

**U.S.-managed. Globally delivered. Built for outcomes.** Primary line: **Build. Modernize. Operate.**

Domiutra sells *engineering capability and delivery responsibility*, not individual developers. Every page should reinforce four things quickly: what we do, who it's for, why the model is different (U.S. accountability + global capacity + operations after launch), and how to start a conversation.

## Competitive research: principles extracted (not copied)

Reviewed in October 2026: Accenture, Cognizant, Capgemini (homepage and a services page each), Thoughtworks, thoughtbot, and Slalom. TCS, EPAM, and Globant blocked automated fetching, so only their service taxonomies were checked, through search results.

What we took:

1. **Problem/outcome first, capability second.** Large firms phrase services as results. Our service pages open with the business situation ("Signs you need this").
2. **A short taxonomy reads as focus.** EPAM and Capgemini each use about 7 top-level services; Accenture's 18 reads as sprawl. We keep six, grouped Build / Modernize / Operate.
3. **One consistent service-page structure:** hero → signals → process diagram → capabilities → deliverables by phase → engagement models + technologies → security note → FAQ → related → CTA.
4. **Transparency instead of proof we don't have.** Without logos or analyst rankings, we show how we work: process, cadence, responsibilities, deliverables. thoughtbot's "how it works" approach is the model.
5. **Governance is visible:** a dedicated `/security` page, plus a security note on every service page.
6. **FAQs on service pages**, answering commercial and operational questions directly.
7. **Specific CTAs** ("Request a modernization assessment") instead of "Learn more".
8. **Quiet motion; no auto-rotating carousels.** Carousels hide content, and the competitors overuse them.

Anti-patterns we avoid: invented statistics, logo walls, abstract slogan-only heroes, sprawling taxonomies, award and analyst sections, named "proprietary AI platforms", and putting AI in every sentence.

## Visual system

- **Dark "ink" surfaces carry the narrative**; light "paper" surfaces carry dense reading (capabilities, industries, articles, legal). Alternating them sets the page rhythm.
- **Two accents only:** mint `#7AF0C3` (signal / action) and cool blue `#8DB4FF` (global delivery, secondary). Mint on light surfaces uses `--color-mint-deep` for AA contrast.
- **Type:** Geist (UI, display) + Geist Mono (technical labels, numbering). Display headlines are tight (-0.045em); labels are mono, uppercase, and tracked.
- **Tight radii (2–14px), hairline borders, almost no shadows.** Depth comes from layering and contrast, not glass.
- **Grid:** 12 columns, max width 84rem, with deliberate asymmetry (7/5 splits, editorial split headings, bento grids with varied proportions).
- **Imagery:** none. Diagrams are original SVG systems: hero architecture, delivery layers, service glyphs, industry motifs, the lifecycle loop.

## Logo

A "D" split into a stem and an open bowl, joined by a mint node. The stem stands for accountable U.S. leadership, the bowl for the delivery system around it, and the node for where both meet the customer's outcome. The gap between them is the handoff Domiutra manages. It's built as SVG in `components/ui/Logo.tsx`, `app/icon.svg`, `app/apple-icon.tsx`, and the OG route.

## Motion principles

- Every animation explains something: data flowing between systems, stage progression, how responsibility shifts between engagement models.
- Hero and page-hero typography animate with **CSS**, so they paint before hydration and LCP isn't delayed.
- Scroll reveals use Motion `whileInView`, play once, and offset by 16–18px.
- Continuous loops (hero signals, dashed connectors) **pause off-screen** and **stop under reduced motion**.
- Pointer parallax applies only to fine pointers and is off under reduced motion.

## Honesty rules (content)

- No fabricated clients, testimonials, metrics, certifications, locations, or contact details.
- Representative engagements are always labeled, and their "outcomes" are things we would *measure*, never results.
- Certifications list is empty until real (`lib/data/trust.ts`). Leadership list is empty until real (`lib/data/leadership.ts`).
- "24/7" is never promised; coverage is "designed around your required coverage".
- Legal pages are starter templates and carry visible "requires review" notes.
