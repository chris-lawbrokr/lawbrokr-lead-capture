/**
 * Runtime configuration.
 *
 * Values come from Vite env vars so the same bundle can be pointed at a
 * sandbox portal in dev and the real one in production. Copy `.env.example`
 * to `.env.local` and fill it in. Anything left unset falls back to the
 * placeholder, and `isConfigured` below tells the app to skip the network
 * calls rather than firing requests at a bogus endpoint.
 */

const env = import.meta.env;

export const CONFIG = {
  /** HubSpot account ID. Settings > Account Setup > Account Defaults. */
  hubspotPortalId: env.VITE_HUBSPOT_PORTAL_ID ?? 'YOUR_HUBSPOT_PORTAL_ID',

  /**
   * GUID of the HubSpot form receiving this widget's fields. Needs custom
   * properties for: firm_website, firm_size, role, practice_area,
   * primary_pain_point, lead_heat.
   */
  hubspotFormGuid: env.VITE_HUBSPOT_FORM_GUID ?? 'YOUR_HUBSPOT_FORM_GUID',

  /** Discovery-call scheduler embedded at the end of the flow. */
  hubspotMeetingLink:
    env.VITE_HUBSPOT_MEETING_LINK ??
    'https://meetings.hubspot.com/jgutmann/discovery-call-website?uuid=c4373772-c271-4e0d-b28c-8020dbac4b26',

  /**
   * Internal name of a custom behavioural event created under
   * Reports > Events > Custom Events (looks like `pe1234567_demo_widget_engaged`).
   */
  engagementEventName: env.VITE_HUBSPOT_ENGAGEMENT_EVENT ?? '',

  /** Serverless relay that posts the "someone just started" Slack alert. */
  leadStartedEndpoint: env.VITE_LEAD_STARTED_ENDPOINT ?? '/api/lead-started',
} as const;

const isPlaceholder = (value: string) => !value || value.startsWith('YOUR_');

/** True once a real portal ID and form GUID are present. */
export const isHubspotConfigured = () =>
  !isPlaceholder(CONFIG.hubspotPortalId) && !isPlaceholder(CONFIG.hubspotFormGuid);

/** True once a real custom behavioural event name is present. */
export const isEngagementEventConfigured = () => !isPlaceholder(CONFIG.engagementEventName);

/** How long the "typing" indicator sits before a bot message lands. */
export const TYPING_DELAY_MS = 650;

/**
 * How long the centred intro takes to fade before the chat view replaces it.
 * Matches `--duration-base`, the design system's step for transitions.
 */
export const INTRO_EXIT_MS = 180;

/**
 * How long the greeting takes to travel from the centre of the column up to the
 * top of the transcript. Longer than `--duration-slow` (300ms, the top of the
 * design system's motion scale) because this one move covers most of the
 * column's height, and at 300ms it reads as a jump rather than a travel.
 */
export const INTRO_SLIDE_MS = 460;
