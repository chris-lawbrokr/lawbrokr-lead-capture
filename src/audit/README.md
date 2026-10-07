# Lawbrokr — Marketing Web Audit

A free "how does your firm's website stack up" audit: the visitor enters their URL, watches a
short scan (answering a few optional questions while they wait), unlocks a blurred health score
with their name and email, and gets a full report against the firms near them.

It is the second page of this project, served at **`/audit/`** alongside the demo request at `/`.
It was built as its own app (`lawbrokr-web-audit`) and moved in whole: everything it owns lives
under `src/audit/`, its page is `audit/index.html`, and both are registered as build inputs in
`vite.config.ts`. It has its own stylesheet and components, so neither page can restyle the other.
Paths below are from the repository root.

The flow is four steps:

1. **Start** — the pitch, the URL field and the five checks. Anything that reduces to a domain is
   accepted, so `https://www.firm.com/contact` works as well as `firm.com`.
2. **Scan** — a 14-second presentation. The checklist ticks itself off, findings appear in a
   feed, and a four-question quiz fills the wait: a score guess, a goal, lead-reply speed and
   client source. Every question can be skipped.
3. **Gate** — the score counts up behind a blur, with a lead form over it. Submitting sends the
   lead to HubSpot (or Zapier) and opens the report.
4. **Report** — the overall score, "Fix these first" (the quiz goal's category leads, then the
   lowest scores), a card per category with comparison bars, and two routes to the scheduler,
   pre-filled with the visitor's name and email. "Download PDF" is the browser's print dialog;
   the actions hide on paper.

The original Claude Design export is kept at `references/web-audit.html` for comparison.

## The audit data is a placeholder

**Nothing is measured yet.** Every audit is scored from the `mid` sample in `src/audit/data/sample.ts`,
with the same three competitors, whatever URL is entered. These are the design export's demo
numbers, kept so the flow runs end to end. Before this goes in front of real firms, `auditFor` in
`src/audit/lib/audit.ts` needs replacing with real sources:

| Category             | Needs                                                        |
| -------------------- | ------------------------------------------------------------ |
| Google reviews       | Google Places: the firm's profile and nearby competitors     |
| Load speed           | PageSpeed Insights, mobile and desktop                       |
| Bounce rate, traffic | A traffic panel (Similarweb, Semrush or similar)             |
| SEO & GEO visibility | A rank tracker plus an AI-answer tracker                      |

The scoring curves, bands, comparison rows and recommendations in `src/audit/lib/scoring.ts` take raw
`AuditMetrics` and are independent of where they come from. Once `auditFor` is async, the scan's
progress should follow it rather than a fixed 14 seconds.

The gate also promises "We'll email you a copy too." That email needs a HubSpot workflow on the
form submission; this app doesn't send one.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in your HubSpot IDs
pnpm dev                     # then open /audit/
```

`pnpm build` type-checks and builds both pages, the audit to `dist/audit/index.html`; `pnpm lint`
runs Oxlint; `pnpm preview` serves the build. The dev and preview servers redirect `/audit` to
`/audit/`, as most hosting providers do; without that they would serve the demo page for it.

**Previewing a step.** In dev only, `?step=scan|gate|report` opens that step with a sample
domain, and `?scenario=low|mid|high` switches the sample results — for example
`/audit/?step=report&scenario=low`. Production builds ignore both, so the gate can't be skipped.

## Design system

The UI is built on the **Lawbrokr 2.0 Design System** (`lawbrokr-design/design-system`). It shares
lead-capture's three vendored token files in `src/styles/`, wired into Tailwind v4 by its own
`@theme inline` block in `src/audit/index.css` — every colour, radius, type step and duration in
this app resolves to a token, and no component contains a literal hex or font name.

|             |                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| Colour      | One brand colour, Lawbrokr Purple `#250D53` = `--primary`. Indigo `--violet-*` for overlines and findings.    |
| Charts      | The firm's own bars in `--chart-1`, everyone else's in `--chart-5`. Bands use the subtle status badges.      |
| Type        | Instrument Sans for UI, Host Grotesk 600 for headings, scores and metrics (`--font-serif`).                  |
| Radius      | 6 buttons/inputs/badges · 8 cards · 12 the gate card. Full only for the progress track and avatars.          |
| Interaction | Hover on the dark primary goes **lighter** (primary-800), press one step further (primary-700).              |
| Focus       | 2px `--ring` outline at offset 2 on every control; inputs additionally take a 3px primary-200 halo.          |
| Icons       | lucide-react only, never emoji or unicode glyphs.                                                            |
| Motion      | 120ms colour, 180ms layout, 300ms progress and arrivals, ease-out; `prefers-reduced-motion` disables all.    |

Copy follows the design system's content rules: sentence case throughout, verb-first buttons that name
their object, typographic apostrophes, and no exclamation marks or emoji.

**Tokens.** The token files are lead-capture's and are re-synced as described in the main README.
The audit's own export had a newer `tokens.css` whose `--overlay` is neutral rather than purple;
nothing in the audit uses `--overlay`, so it renders the same on either. The fonts load from a
`<link>` in `audit/index.html`.

Two wiring differences from lead-capture, both in `src/audit/index.css`:

- `typography.css` is imported into the `base` layer. It styles `html`, `body` and `a`, and left
  unlayered its `a { color }` beats every Tailwind utility, so the report's button-styled scheduler
  links would render brand ink on a brand-purple fill.
- Tailwind scans only `src/audit/` for classes (`source(".")`), and lead-capture's `src/index.css`
  excludes it in turn, so each page's CSS holds only its own utilities.

## Configuration

Everything external is driven by env vars (see `.env.example`) and read in `src/audit/config.ts`.
The portal and scheduler are shared with lead-capture; the form and Zap are the audit's own, because
the audit sends `audit_*` fields the demo form doesn't have.

| Variable                        | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `VITE_HUBSPOT_PORTAL_ID`        | Shared. HubSpot account ID                                       |
| `VITE_HUBSPOT_MEETING_LINK`     | Shared. Scheduler linked from the report, pre-filled             |
| `VITE_AUDIT_HUBSPOT_FORM_GUID`  | GUID of the form receiving audit leads                           |
| `VITE_AUDIT_ZAPIER_WEBHOOK_URL` | Zapier Catch Hook for audit leads; when set, replaces the Forms API |

Lead-capture's `VITE_HUBSPOT_FORM_GUID` and `VITE_ZAPIER_WEBHOOK_URL` are never used here, so audit
leads can't land in the demo-request form or Zap by accident.

Until a Zapier webhook, or a real portal ID and form GUID, is set, the submission is logged to the
console in dev instead of being sent — the flow still runs end to end. With a portal configured,
the HubSpot tracking code is loaded on mount (if the page doesn't already have it) so the
submission carries the `hubspotutk` cookie for attribution.

Product knobs live as constants in `src/audit/config.ts`: `SCAN_SECONDS` (14), `PHONE_REQUIRED` (off),
and the scan, quiz and count-up timings.

## Lead fields

One submission is sent, when the gate is unlocked. Fields are named after their HubSpot properties,
and empty answers are left out rather than sent blank. Through Zapier the request also carries
`stage=audit` and `page_url`.

| Field                 | Notes                                                          |
| --------------------- | -------------------------------------------------------------- |
| `email`               | Match the contact on this                                      |
| `firstname`           | First word of "Full name"                                      |
| `lastname`            | The rest of "Full name"                                        |
| `phone`               | Optional unless `PHONE_REQUIRED`                               |
| `practice_area`       | Same options as lead-capture                                   |
| `firm_website`        | `https://` + the audited domain                                |
| `firm_domain`         | The audited domain, like `harborlaw.com`, for company matching |
| `lead_heat`           | `hot` when "Walk me through it" is ticked, else `cool`         |
| `audit_score`         | Overall score, 0–100                                           |
| `audit_wants_call`    | `true` or `false`                                              |
| `audit_goal`          | Quiz: what they want more of                                   |
| `audit_reply_speed`   | Quiz: how fast they reply to a web lead                        |
| `audit_client_source` | Quiz: where most new clients find them                         |

`email`, `firstname`, `lastname` and `phone` are standard properties; `firm_website`, `firm_domain`,
`practice_area` and `lead_heat` already exist for lead-capture. The five `audit_*` properties are
new. As with lead-capture, create them and add them to the form in the same sitting: HubSpot ignores
a field that is not a property yet, but rejects the whole submission once it is a property that is
missing from the form.

## Structure

```
audit/index.html         the page, served at /audit/
src/audit/
  main.tsx               entry point
  index.css              Tailwind wiring and theme for this page
  config.ts              env-driven configuration, flow timings, dev preview params
  types.ts               shared domain types
  data/
    checks.ts            the five checks and the scan's findings feed
    quiz.ts              the while-you-wait questions and how goals map to categories
    sample.ts            PLACEHOLDER audit results, competitors and benchmarks
    practiceAreas.ts     gate options, shared with lead-capture
  lib/
    audit.ts             the audit for a domain — where real data plugs in
    scoring.ts           metrics → scores, bands, comparison rows, fixes, priorities
    hubspot.ts           Forms API, tracking code, scheduler link
    zapier.ts            Catch Hook submissions, used instead of the Forms API when set
    domain.ts            URL → bare domain
  hooks/
    useAuditFlow.ts      the step machine: scan timer, quiz answers, lead submission
    useCountUp.ts        the gate's eased count-up
  components/
    AppHeader.tsx        top bar
    ScoreRing.tsx        the score ring, shared by gate and report
    start/               step 1
    scan/                step 2 — checklist, quiz, findings feed
    gate/                step 3 — blurred preview and lead form
    report/              step 4 — summary, category cards, closing banner
    ui/                  Button, Field, Badge, Card, Progress, Spinner, Avatar, Overline, IconTile
```

From lead-capture it uses `src/styles/` (the tokens), `src/lib/cn.ts` and `src/lib/motion.ts`, which
were identical in both. Its `Button`, `Field` and `Progress` had diverged from lead-capture's (sizes,
a checkbox, required markers, a success fill), so it keeps its own `ui/`.
