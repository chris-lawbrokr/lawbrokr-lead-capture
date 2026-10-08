import type { AuditStep, Scenario } from './types';

/**
 * Runtime configuration.
 *
 * Values come from Vite env vars so the same bundle can be pointed at a
 * sandbox portal in dev and the real one in production. Copy `.env.example`
 * to `.env.local` and fill it in. Anything left unset or blank falls back to the
 * placeholder, and `isHubspotConfigured` below tells the app to skip the network
 * calls rather than firing requests at a bogus endpoint.
 *
 * The portal and scheduler are shared with lead-capture. The form and the Zap
 * are the audit's own, under `VITE_AUDIT_*`: the audit sends `audit_*` fields
 * the demo form doesn't have, and HubSpot rejects the whole submission once one
 * of them is a property missing from the form.
 */

const env = import.meta.env;

export const CONFIG = {
  /** HubSpot account ID. Settings > Account Setup > Account Defaults. */
  hubspotPortalId: env.VITE_HUBSPOT_PORTAL_ID || 'YOUR_HUBSPOT_PORTAL_ID',

  /** GUID of the HubSpot form receiving audit leads. See the README for its properties. */
  hubspotFormGuid: env.VITE_AUDIT_HUBSPOT_FORM_GUID || 'YOUR_HUBSPOT_FORM_GUID',

  /** Discovery-call scheduler linked from the report. */
  hubspotMeetingLink:
    env.VITE_HUBSPOT_MEETING_LINK ||
    'https://meetings.hubspot.com/jgutmann/discovery-call-website?uuid=c4373772-c271-4e0d-b28c-8020dbac4b26',

  /**
   * Zapier "Catch Hook" URL. When set, submissions go here instead of the Forms
   * API, and the Zap's HubSpot "Create or Update Contact" step writes them.
   */
  zapierWebhookUrl: env.VITE_AUDIT_ZAPIER_WEBHOOK_URL || '',
} as const;

const isPlaceholder = (value: string) => !value || value.startsWith('YOUR_');

/** True once a real portal ID and form GUID are present. */
export const isHubspotConfigured = () =>
  !isPlaceholder(CONFIG.hubspotPortalId) && !isPlaceholder(CONFIG.hubspotFormGuid);

/** True once a Zapier webhook URL is present. */
export const isZapierConfigured = () => !isPlaceholder(CONFIG.zapierWebhookUrl);

/** How long the scan takes from start to 100%. */
export const SCAN_SECONDS = 14;

/** How often the scan's progress moves. Each tick advances a jittered step. */
export const SCAN_TICK_MS = 80;

/** How long a quiz answer stays highlighted before the next question replaces it. */
export const QUIZ_ADVANCE_MS = 350;

/** How long the gate's score takes to count up from zero. */
export const COUNT_UP_MS = 1200;

/** When true, the gate won't unlock without a 10-digit phone number. */
export const PHONE_REQUIRED = false;

/**
 * Dev-only deep links for design review: `?step=report&scenario=low` opens the
 * report straight away with the low sample. Ignored in production builds, where
 * the gate must not be skippable.
 */
export const DEV_PREVIEW: { step?: AuditStep; scenario?: Scenario } = (() => {
  if (!import.meta.env.DEV) return {};
  const params = new URLSearchParams(window.location.search);
  const step = params.get('step');
  const scenario = params.get('scenario');
  return {
    step: step === 'scan' || step === 'gate' || step === 'report' ? step : undefined,
    scenario: scenario === 'low' || scenario === 'mid' || scenario === 'high' ? scenario : undefined,
  };
})();
