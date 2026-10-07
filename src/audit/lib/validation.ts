/*
 * Field checks for the URL entry and the gate. HubSpot stores whatever it is
 * sent — it accepted `not-an-email` without complaint — so these are the only
 * thing standing between a typo and an unreachable contact.
 */

/** Something@domain.tld: no spaces, one @, and a domain with a real TLD. */
const EMAIL_PATTERN = /^[^\s@]+@([a-z0-9-]+\.)+[a-z]{2,}$/i;

export const URL_INVALID = 'Enter your firm’s website, like smithlaw.com.';
export const NAME_REQUIRED = 'Enter your name.';
export const EMAIL_REQUIRED = 'Enter your work email.';
export const EMAIL_INVALID = 'Enter a valid email, like you@yourfirm.com.';
export const PHONE_INVALID = 'Enter a 10-digit phone number.';

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

/** Ten digits or more, however they're punctuated. */
export function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, '').length >= 10;
}
