# Lawbrokr — Lead Capture

A guided "Request a Demo" experience: a brand panel on the left, a short chat-style
qualifying flow on the right. Built with React 19, TypeScript, Vite and Tailwind CSS v4.

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

## Configuration

Everything external is driven by env vars (see `.env.example`) and read in `src/config.ts`:

| Variable | Purpose |
| --- | --- |
| `VITE_HUBSPOT_PORTAL_ID` | HubSpot account ID — Settings > Account Setup > Account Defaults |
| `VITE_HUBSPOT_FORM_GUID` | GUID of the form receiving submissions |
| `VITE_HUBSPOT_MEETING_LINK` | Scheduler embedded on the final step |
| `VITE_HUBSPOT_ENGAGEMENT_EVENT` | Internal name of the custom behavioural event |
| `VITE_LEAD_STARTED_ENDPOINT` | Serverless relay that posts the Slack "lead started" alert |

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
  data/                  question steps, firm sizes, brand copy
  lib/hubspot.ts         Forms API, tracking cookie, Slack relay
  hooks/useChatFlow.ts   the conversation state machine
  components/
    BrandPanel.tsx       left column
    ChatPanel.tsx        right column — renders transcript + current control
    chat/                bubbles, typing indicator, choices, forms, booking
    ui/                  Button, TextField, SelectField, FormGrid
```

`useChatFlow` holds an append-only transcript plus a single `stage` describing what is being
asked for right now. Each stage change schedules its bot line behind a typing delay; the
"typing" and "ready" states are both derived from which stage has actually spoken, so the
indicator and the interactive control can never disagree.

Adding or reordering questions is a data change in `src/data/steps.ts` — the progress label
and the HubSpot payload follow automatically.
