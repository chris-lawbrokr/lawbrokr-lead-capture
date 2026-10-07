import { CONFIG, isHubspotConfigured, isZapierConfigured } from '../config';
import type { HubspotField, Lead, SubmissionStage } from '../types';
import { sendToZapier } from './zapier';

/*
 * Auto-filling HubSpot data:
 * every submission sends a `context` object carrying the visitor's hubspotutk
 * cookie plus the current page URL and title. That is what lets HubSpot
 * attribute the submission to the right contact and page — original source,
 * first page seen, campaign — without mapping anything by hand. If the audit
 * sits on a page without the HubSpot tracking code, we load it on mount so the
 * cookie exists before anyone submits.
 */

function getHubspotCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? match[1] : undefined;
}

/** Loads HubSpot's tracking code once, when a portal is configured and the page doesn't have it. */
export function loadHubspotTracking(): void {
  if (!isHubspotConfigured()) return;
  if (window._hsq || document.getElementById('hs-script-loader')) return;
  window._hsq = [];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'hs-script-loader';
  script.async = true;
  script.defer = true;
  script.src = `//js.hs-scripts.com/${CONFIG.hubspotPortalId}.js`;
  document.head.appendChild(script);
}

/**
 * The scheduler link, with the meeting form's name and email pre-filled from
 * the gate. HubSpot reads first name, last name and email by name
 * (case-insensitively). `forcePropertyForm=false` skips the scheduling page's
 * form when every required field arrives filled; if the meeting form asks for
 * more than this, it shows with these filled in.
 */
export function meetingLink(lead: Lead | null): string {
  const url = new URL(CONFIG.hubspotMeetingLink);
  const prefill = { firstName: lead?.firstName, lastName: lead?.lastName, email: lead?.email };

  for (const [key, value] of Object.entries(prefill)) {
    if (value) url.searchParams.set(key, value);
  }
  url.searchParams.set('forcePropertyForm', 'false');

  return url.toString();
}

/**
 * Sends a submission on to HubSpot. With a Zapier webhook configured it goes
 * there, and the Zap creates or updates the contact; otherwise it posts to the
 * Forms API. Deliberately never throws: a config or network problem must not
 * stop someone getting to their report.
 */
export async function submitToHubSpot(stage: SubmissionStage, fields: HubspotField[]): Promise<void> {
  if (isZapierConfigured()) return sendToZapier(stage, fields);

  if (!isHubspotConfigured()) {
    if (import.meta.env.DEV) {
      console.info('[lawbrokr] HubSpot not configured — would have sent:', fields);
    }
    return;
  }

  try {
    const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${CONFIG.hubspotPortalId}/${CONFIG.hubspotFormGuid}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields,
        context: {
          hutk: getHubspotCookie(),
          pageUri: window.location.href,
          pageName: document.title,
        },
      }),
    });

    // fetch only rejects on network failure. A misconfigured form — missing
    // property, bad dropdown value — comes back as a 400 that says which field.
    if (!response.ok) {
      console.error('HubSpot rejected the form submission:', response.status, await response.text());
    }
  } catch (error) {
    console.error('HubSpot form submission failed:', error);
  }
}
