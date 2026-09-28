/*
 * Email format check. HubSpot stores whatever it is sent — it accepted
 * `not-an-email` without complaint — so this is the only thing standing between
 * a typo and an unreachable contact.
 */

/** Something@domain.tld: no spaces, one @, and a domain with a real TLD. */
const EMAIL_PATTERN = /^[^\s@]+@([a-z0-9-]+\.)+[a-z]{2,}$/i;

export const FIRST_NAME_REQUIRED = 'Enter your first name.';
export const LAST_NAME_REQUIRED = 'Enter your last name.';
export const EMAIL_REQUIRED = 'Enter your work email.';
export const EMAIL_INVALID = 'Enter a valid email, like you@yourfirm.com.';

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}
