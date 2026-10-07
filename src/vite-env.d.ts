/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HUBSPOT_PORTAL_ID?: string;
  readonly VITE_HUBSPOT_FORM_GUID?: string;
  readonly VITE_HUBSPOT_MEETING_LINK?: string;
  readonly VITE_HUBSPOT_ENGAGEMENT_EVENT?: string;
  readonly VITE_LEAD_STARTED_ENDPOINT?: string;
  readonly VITE_ZAPIER_WEBHOOK_URL?: string;
  /** The web audit's own form and Zap; see `src/audit/config.ts`. */
  readonly VITE_AUDIT_HUBSPOT_FORM_GUID?: string;
  readonly VITE_AUDIT_ZAPIER_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  _hsq?: unknown[][];
}
