import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEV_PREVIEW, SCAN_SECONDS, SCAN_TICK_MS } from '../config';
import { SAMPLE_DOMAIN } from '../data/sample';
import { auditFor } from '../lib/audit';
import { loadHubspotTracking, submitToHubSpot } from '../lib/hubspot';
import type { AuditStep, Lead, QuizAnswers } from '../types';

/**
 * Drives the whole audit: start → scan → gate → report.
 *
 * The scan is a timed presentation. Progress climbs in jittered steps so it
 * reads as work being done rather than a clock, and at 100% it stops there:
 * the visitor moves on to the gate themselves with `showScore`, so a quiz
 * answer or a finding they're reading isn't pulled out from under them. Quiz
 * answers given while waiting carry
 * through to the report, where they reorder the priorities and check the guess.
 */
export function useAuditFlow() {
  const preview = DEV_PREVIEW.step;
  const [step, setStep] = useState<AuditStep>(preview ?? 'start');
  const [domain, setDomain] = useState(preview ? SAMPLE_DOMAIN : '');
  const [progress, setProgress] = useState(preview && preview !== 'scan' ? 100 : 0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [lead, setLead] = useState<Lead | null>(null);
  const [ranAt, setRanAt] = useState(() => new Date());

  const report = useMemo(() => auditFor(domain), [domain]);

  useEffect(() => {
    loadHubspotTracking();
  }, []);

  // Every step starts at the top of the page. A block body, not an expression:
  // Chrome's scrollTo now returns a promise, and an effect must return nothing
  // but a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const scanning = step === 'scan' && progress < 100;

  useEffect(() => {
    if (!scanning) return;
    const increment = 100 / ((SCAN_SECONDS * 1000) / SCAN_TICK_MS);
    const timer = setInterval(() => {
      setProgress((current) => Math.min(100, current + increment * (0.6 + Math.random() * 0.8)));
    }, SCAN_TICK_MS);
    return () => clearInterval(timer);
  }, [scanning]);

  const start = useCallback((nextDomain: string) => {
    setDomain(nextDomain);
    setProgress(0);
    setRanAt(new Date());
    setStep('scan');
  }, []);

  const showScore = useCallback(() => setStep('gate'), []);

  const answer = useCallback((key: keyof QuizAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  }, []);

  const resetAnswers = useCallback(() => setAnswers({}), []);

  const unlock = useCallback(
    async (details: Lead) => {
      const fields = [
        { name: 'email', value: details.email },
        { name: 'firstname', value: details.firstName },
        { name: 'lastname', value: details.lastName },
        { name: 'phone', value: details.phone },
        { name: 'practice_area', value: details.practiceArea },
        { name: 'firm_website', value: `https://${domain}` },
        { name: 'firm_domain', value: domain },
        // Asking for the walkthrough is the audit's version of a hot lead.
        { name: 'lead_heat', value: details.wantsCall ? 'hot' : 'cool' },
        { name: 'audit_score', value: String(report.overall) },
        { name: 'audit_wants_call', value: String(details.wantsCall) },
        { name: 'audit_goal', value: answers.goal ?? '' },
        { name: 'audit_reply_speed', value: answers.reply ?? '' },
        { name: 'audit_client_source', value: answers.source ?? '' },
      ];

      // Unanswered fields are left out rather than sent blank.
      await submitToHubSpot('audit', fields.filter((field) => field.value));

      setLead(details);
      setStep('report');
    },
    [domain, report.overall, answers],
  );

  const restart = useCallback(() => {
    setStep('start');
    setDomain('');
    setProgress(0);
    setAnswers({});
    setLead(null);
  }, []);

  return {
    step,
    domain,
    progress,
    answers,
    lead,
    ranAt,
    report,
    start,
    showScore,
    answer,
    resetAnswers,
    unlock,
    restart,
  };
}
