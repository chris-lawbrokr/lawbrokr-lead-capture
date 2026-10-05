import { CONFIG } from '../config';
import type { HubspotField, SubmissionStage } from '../types';

/**
 * Posts a submission to the Zapier "Catch Hook" that feeds the HubSpot "Create or
 * Update Contact" step. Each field arrives under its HubSpot internal name, plus
 * `stage` and `page_url`, ready to map in the Zap. Empty values are left out
 * rather than sent blank.
 *
 * Sent form-encoded with `no-cors`, which is what makes delivery certain from a
 * browser: a form-encoded body needs no CORS preflight, and `no-cors` stops a
 * response without CORS headers from failing a request that has already arrived.
 * The cost is an unreadable response, so a rejected submission shows up in the
 * Zap's history rather than here. Deliberately never throws.
 */
export async function sendToZapier(stage: SubmissionStage, fields: HubspotField[]): Promise<void> {
  const body = new URLSearchParams({ stage, page_url: window.location.href });
  for (const { name, value } of fields) {
    if (value) body.append(name, value);
  }

  try {
    await fetch(CONFIG.zapierWebhookUrl, { method: 'POST', mode: 'no-cors', keepalive: true, body });
  } catch (error) {
    console.error('Zapier submission failed:', error);
  }
}
