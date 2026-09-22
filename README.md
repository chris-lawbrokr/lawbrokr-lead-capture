# Lawbrokr — Lead Capture

A guided "Request a demo" experience: a brand panel on the left, a short chat-style
qualifying flow on the right. Built with React 19, TypeScript, Vite and Tailwind CSS v4
on the Lawbrokr 2.0 Design System.

The flow is six steps — work email, three qualifying questions, contact details, then
an embedded HubSpot scheduler. The email is submitted to HubSpot on its own before the
questions start, so a lead is captured even when someone drops out before booking.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in your HubSpot IDs
pnpm dev
```

`pnpm build` type-checks and builds; `pnpm lint` runs Oxlint; `pnpm preview` serves the build.

## Design system

The UI is built on the **Lawbrokr 2.0 Design System** (`lawbrokr-design/design-system`). Three token
files are vendored verbatim under `src/styles/` and wired into Tailwind v4 by the `@theme inline`
block in `src/index.css`, exactly as the porting note in the spec prescribes — every colour, radius,
type step and duration in this app resolves to a token, and no component contains a literal hex or
font name.

|             |                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| Colour      | One brand colour, Lawbrokr Purple `#250D53` = `--primary`. Page `--background` (#FAFAFD), panels `--card`. |
| Type        | Instrument Sans for UI, Host Grotesk 600 for the display hero and the stat (`--font-serif`).               |
| Radius      | 6 buttons/inputs/selects · 8 cards and bubbles · full for the progress track. No pills.                    |
| Interaction | Hover on the dark primary goes **lighter** (primary-800), press one step further (primary-700).            |
| Focus       | 2px `--ring` outline at offset 2 on every control; inputs additionally take a 3px primary-200 halo.        |
| Icons       | lucide-react only, never emoji or unicode glyphs.                                                          |
| Motion      | 120ms colour, 180ms layout, 300ms progress, ease-out; `prefers-reduced-motion` disables all.               |

Copy follows the design system's content rules: sentence case throughout, verb-first buttons that name
their object, typographic apostrophes, and no exclamation marks or emoji.

**Re-syncing.** `src/styles/{tokens,typography,spacing}.css` are copies, not edits. When a new Claude
Design export lands, re-copy all three. The one deliberate deviation is documented in the header of
`typography.css`: the export's leading Google Fonts `@import` is dropped, because once the file is
inlined after `tokens.css` an `@import` is no longer the first statement and the CSS is invalid. The
same two families load from a `<link>` in `index.html`.

## Configuration

Everything external is driven by env vars (see `.env.example`) and read in `src/config.ts`:

| Variable                        | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `VITE_HUBSPOT_PORTAL_ID`        | HubSpot account ID — Settings > Account Setup > Account Defaults |
| `VITE_HUBSPOT_FORM_GUID`        | GUID of the form receiving submissions                           |
| `VITE_HUBSPOT_MEETING_LINK`     | Scheduler embedded on the final step                             |
| `VITE_HUBSPOT_ENGAGEMENT_EVENT` | Internal name of the custom behavioural event                    |
| `VITE_LEAD_STARTED_ENDPOINT`    | Serverless relay that posts the Slack "lead started" alert       |

Until a real portal ID and form GUID are set, submissions are logged to the console in dev
instead of being sent — the flow still runs end to end.

The HubSpot form needs custom properties for `firm_website`, `firm_size`, `role`,
`practice_area`, `primary_pain_point` and `lead_heat`, alongside the standard `email`,
`firstname`, `phone` and `company`.

## Slack alerts

Three moments fire a signal:

1. **Someone starts** — `trackEngagement()` posts to `VITE_LEAD_STARTED_ENDPOINT` on mount.
   This is a serverless relay rather than a HubSpot workflow, because custom-behavioural-event
   triggers are Enterprise-only.
2. **They submit their email** — the first Forms API submission.
3. **They finish** — the second submission, with full details and `lead_heat`.

Two and three are the same form, so a single "Form submitted" workflow catches both; the
payload tells the rep which stage the visitor reached.

## Structure

```
src/
  config.ts              env-driven configuration
  types.ts               shared domain types
  styles/                design-system tokens, vendored verbatim
  data/                  question steps, firm sizes, brand copy
  lib/hubspot.ts         Forms API, tracking cookie, Slack relay
  hooks/useChatFlow.ts   the conversation state machine
  components/
    BrandPanel.tsx       left column
    ChatPanel.tsx        right column — renders transcript + current control
    chat/                bubbles, typing indicator, choices, forms, booking
    ui/                  Button, Field (TextField/SelectField/FormGrid), Progress
```

`useChatFlow` holds an append-only transcript plus a single `stage` describing what is being
asked for right now. Each stage change schedules its bot line behind a typing delay; the
"typing" and "ready" states are both derived from which stage has actually spoken, so the
indicator and the interactive control can never disagree.

Adding or reordering questions is a data change in `src/data/steps.ts` — the progress label
and the HubSpot payload follow automatically.
