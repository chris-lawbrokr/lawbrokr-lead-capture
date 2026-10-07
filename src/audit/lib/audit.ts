import { DEV_PREVIEW } from '../config';
import { DEFAULT_SCENARIO, SAMPLE_COMPETITORS, SAMPLE_SCENARIOS } from '../data/sample';
import type { AuditReport } from '../types';
import { buildReport } from './scoring';

/**
 * The audit for a domain. This is the seam where real measurement plugs in:
 * today it scores the placeholder sample (see `data/sample.ts`), the same for
 * every domain, so the scan screen's timing is a presentation and not a wait on
 * any network call. When real sources land, this becomes async and the scan
 * screen's progress should follow it.
 */
export function auditFor(domain: string): AuditReport {
  const scenario = DEV_PREVIEW.scenario ?? DEFAULT_SCENARIO;
  return buildReport(domain, SAMPLE_SCENARIOS[scenario], SAMPLE_COMPETITORS);
}
