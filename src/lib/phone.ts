import {
  formatIncompletePhoneNumber,
  parseIncompletePhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/max';
import type { CountryCode } from 'libphonenumber-js/max';

/*
 * Phone numbers, via libphonenumber (Google's dataset). The `max` metadata is
 * deliberate: the default `min` set only checks a number's length, so it would
 * accept 555 000 0000. `max` checks the digits against each country's real
 * numbering plan.
 */

/** Numbers typed without a + are read as US/Canada, which share +1. */
const DEFAULT_COUNTRY: CountryCode = 'US';

/**
 * Past these, extra digits are dropped rather than letting the formatting fall
 * apart: 10 for US/Canada (11 with the leading 1), and for international a +
 * and 15 digits, the longest number E.164 allows.
 */
function maxLength(digits: string): number {
  if (digits.startsWith('+')) return 16;
  return digits.startsWith('1') ? 11 : 10;
}

export const PHONE_INVALID =
  'Enter a valid phone number. Outside the US and Canada, start with + and the country code.';

/** Just the leading + and digits — everything the formatter and caret care about. */
export const phoneDigits = parseIncompletePhoneNumber;

/**
 * Formats a partly typed number: `4155550` → `(415) 555-0`, and a leading +
 * switches to international (`+44 20 7946`). Anything other than digits and
 * a leading + is dropped.
 */
export function formatPhoneInput(value: string): string {
  const digits = phoneDigits(value);
  return formatIncompletePhoneNumber(digits.slice(0, maxLength(digits)), DEFAULT_COUNTRY);
}

/**
 * The number in E.164 (`+14155550132`) — one dialable format for every lead in
 * HubSpot — or null when it isn't a real, complete number.
 */
export function normalizePhone(value: string): string | null {
  const phone = parsePhoneNumberFromString(value, DEFAULT_COUNTRY);
  return phone?.isValid() ? phone.number : null;
}
