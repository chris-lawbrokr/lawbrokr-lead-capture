import {
  CONFIG,
  DRY_RUN_DELAY_MS,
  isEngagementEventConfigured,
  isHubspotConfigured,
  isZapierConfigured,
} from '../config';
import type { HubspotField, Lead, SubmissionStage } from '../types';
import { sendToZapier } from './zapier';

/*
 * Auto-filling HubSpot data:
 * every submission sends a `context` object carrying the visitor's hubspotutk
 * cookie plus the current page URL and title. That is what lets HubSpot
 * attribute the submission to the right contact and page — original source,
 * first page seen, campaign — without mapping anything by hand. If this widget
 * sits on a page without the HubSpot tracking code, we load it here so the
 * cookie exists before anyone submits.
 */

function getHubspotCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? match[1] : undefined;
}

function loadHubspotTrackingIfNeeded(): void {
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
 * The scheduling page's own form fields, pre-filled from what the visitor has
 * already told us. HubSpot reads first name, last name and email by name
 * (case-insensitively), and matches every other parameter against a form field's
 * `name` exactly: a property's internal name, or a custom question's label as
 * typed. Every parameter is also sent along with the booking, so only fields
 * the meeting's form actually has belong here. If a field is added to or renamed
 * on the form in HubSpot, it needs adding or renaming here as well.
 */
function meetingFormPrefill(lead: Lead): Record<string, string | undefined> {
  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    company: lead.firm,
    'Size of Firm': lead.size,
  };
}

/**
 * The scheduler link, set up so booking comes down to picking a time.
 *
 * `forcePropertyForm=false` tells the scheduling page to skip its form whenever
 * every required field arrives pre-filled and valid, so choosing a slot books
 * the meeting straight away. It is what HubSpot's "Auto-submit form when all
 * fields are pre-populated" setting does, except that the setting is switched
 * off whenever guests are allowed and this isn't. It's undocumented, so if
 * HubSpot drops it, or a required field arrives empty, the form simply shows
 * with everything else filled in.
 *
 * `embed` adds what HubSpot's own embed script would: the compact embedded
 * layout, plus the tracking cookie and page URL, so the booking is attributed
 * to the same contact the form submission just created.
 */
export function meetingLink(lead: Lead, { embed = false } = {}): string {
  const url = new URL(CONFIG.hubspotMeetingLink);

  for (const [key, value] of Object.entries(meetingFormPrefill(lead))) {
    if (value) url.searchParams.set(key, value);
  }
  url.searchParams.set('forcePropertyForm', 'false');

  if (embed) {
    url.searchParams.set('embed', 'true');
    const utk = getHubspotCookie();
    if (utk) url.searchParams.set('parentHubspotUtk', utk);
    url.searchParams.set('parentPageUrl', window.location.origin + window.location.pathname);
  }

  return url.toString();
}

/**
 * The firm's domain the way HubSpot keys companies — `harborlaw.com`, without
 * the scheme, `www.` or path — so the Zap can find the company by exact match.
 * The website field always hands over an absolute URL, but a bad one yields ''
 * rather than throwing.
 */
export function companyDomain(site: string): string {
  try {
    return new URL(site).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Sends a submission on to HubSpot. With a Zapier webhook configured it goes
 * there, and the Zap creates or updates the contact; otherwise it posts to the
 * Forms API. Deliberately never throws: a config or network problem must not
 * stop someone getting to the calendar.
 */
export async function submitToHubSpot(stage: SubmissionStage, fields: HubspotField[]): Promise<void> {
  if (CONFIG.dryRun) {
    console.info(`[lawbrokr] Dry run — not sending the ${stage} submission:`, fields);
    await new Promise((resolve) => setTimeout(resolve, DRY_RUN_DELAY_MS));
    return;
  }

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

let leadStartedNotified = false;

/**
 * Slack "someone's in the room" alert, via a small serverless relay, fired
 * before the visitor has typed anything. Kept separate from HubSpot because
 * custom-behavioural-event workflow triggers are Enterprise-only.
 */
async function notifySlackLeadStarted(): Promise<void> {
  if (leadStartedNotified) return;
  leadStartedNotified = true;

  try {
    await fetch(CONFIG.leadStartedEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.href,
        referrer: document.referrer || undefined,
      }),
    });
  } catch (error) {
    console.error('Slack "lead started" notification failed:', error);
  }
}

/**
 * Called once on mount. Fires the Slack alert and, when configured, logs the
 * visit as a HubSpot behavioural event for reporting and segmentation.
 */
export function trackEngagement(): void {
  if (CONFIG.dryRun) {
    console.info('[lawbrokr] Dry run — not sending the Slack alert or HubSpot tracking.');
    return;
  }

  void notifySlackLeadStarted();

  if (!isHubspotConfigured()) return;
  loadHubspotTrackingIfNeeded();

  if (!isEngagementEventConfigured()) return;
  window._hsq?.push([
    'trackCustomBehavioralEvent',
    {
      name: CONFIG.engagementEventName,
      properties: { source: 'request-a-demo-widget' },
    },
  ]);
}
