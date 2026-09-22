/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HUBSPOT_PORTAL_ID?: string;
  readonly VITE_HUBSPOT_FORM_GUID?: string;
  readonly VITE_HUBSPOT_MEETING_LINK?: string;
  readonly VITE_HUBSPOT_ENGAGEMENT_EVENT?: string;
  readonly VITE_LEAD_STARTED_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  _hsq?: unknown[][];
}
