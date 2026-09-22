import {
  CONFIG,
  isEngagementEventConfigured,
  isHubspotConfigured,
} from '../config';
import type { HubspotField } from '../types';

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
 * Posts to the HubSpot Forms API. Deliberately never throws: a config or
 * network problem must not stop someone getting to the calendar.
 */
export async function submitToHubSpot(fields: HubspotField[]): Promise<void> {
  if (!isHubspotConfigured()) {
    if (import.meta.env.DEV) {
      console.info('[lawbrokr] HubSpot not configured — would have sent:', fields);
    }
    return;
  }

  try {
    const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${CONFIG.hubspotPortalId}/${CONFIG.hubspotFormGuid}`;
    await fetch(endpoint, {
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
