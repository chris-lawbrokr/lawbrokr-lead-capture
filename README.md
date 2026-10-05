# Lawbrokr — Lead Capture

A guided "Request a demo" experience: a brand panel on the left, a short chat-style
qualifying flow on the right. Built with React 19, TypeScript, Vite and Tailwind CSS v4
on the Lawbrokr 2.0 Design System.

The flow is six steps — work email, three qualifying questions, contact details, then
an optional booking step. The name and email are submitted to HubSpot on their own before the
questions start, and the full details go in when the contact form is submitted, so a lead
is captured whether or not anyone books. "Book a time" then opens the embedded HubSpot
scheduler with the meeting form's fields — name, email, company and "Size of Firm" —
pre-filled from the query string, and `forcePropertyForm=false` skips that form entirely,
so choosing a slot books the call. If a required field is missing, the form shows with the
rest filled in. The prefill is matched by field name, so when the meeting's form changes
in HubSpot, update `meetingFormPrefill` in `src/lib/hubspot.ts` to match.

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
| `VITE_HUBSPOT_MEETING_LINK`     | Scheduler opened, pre-filled, from the final step                |
| `VITE_HUBSPOT_ENGAGEMENT_EVENT` | Internal name of the custom behavioural event                    |
| `VITE_LEAD_STARTED_ENDPOINT`    | Serverless relay that posts the Slack "lead started" alert       |
| `VITE_ZAPIER_WEBHOOK_URL`       | Zapier Catch Hook; when set, replaces the Forms API (see below)  |

Until a Zapier webhook, or a real portal ID and form GUID, is set, submissions are logged to
the console in dev instead of being sent — the flow still runs end to end.

## Sending leads through Zapier

With `VITE_ZAPIER_WEBHOOK_URL` set, both submissions go to that Catch Hook instead of the Forms
API, and the Zap's HubSpot "Create or Update Contact" step writes the contact. Each request is
form-encoded, with fields named after their HubSpot properties so the mapping is one to one:

| Field                | Sent on        | Notes                                             |
| -------------------- | -------------- | ------------------------------------------------- |
| `stage`              | both           | `intro` for name and email, `details` at the end  |
| `page_url`           | both           | Page the widget was on                            |
| `email`              | both           | Match the contact on this                         |
| `firstname`          | both           |                                                   |
| `lastname`           | both           |                                                   |
| `company`            | `details`      |                                                   |
| `firm_website`       | `details`      |                                                   |
| `firm_domain`        | `details`      | Website reduced to `harborlaw.com`, for matching  |
| `firm_size`          | `details`      |                                                   |
| `jobtitle`           | `details`      | The visitor's role at the firm                    |
| `practice_area`      | `details`      | Multi-select, semicolon-separated                 |
| `primary_pain_point` | `details`      |                                                   |
| `lead_heat`          | `details`      | `hot` or `cool`                                   |

Empty answers are left out rather than sent blank. The browser can't read Zapier's response,
so a submission the Zap rejects shows up in the Zap's history, not in the console.

Zapier submissions don't carry the HubSpot tracking cookie, so contacts arrive with an
"Integration" source rather than the page and campaign the visitor came from, and there is no
"Form submitted" event for HubSpot workflows to trigger on.

The HubSpot form needs custom properties for `firm_website`, `firm_size`,
`practice_area`, `primary_pain_point` and `lead_heat`, alongside the standard `email`,
`firstname`, `lastname`, `company` and `jobtitle`. Create the custom properties and add them to the form in the same sitting: HubSpot ignores a field that is not a property yet, but rejects the whole submission once it is a property that is missing from the form.

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
  lib/zapier.ts          Catch Hook submissions, used instead of the Forms API when set
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
