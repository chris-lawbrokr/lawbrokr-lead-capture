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

export const WEBSITE_REQUIRED = 'Enter your firm’s website.';
export const WEBSITE_INVALID = 'Enter a valid website, like harborlaw.com.';

/** A hostname with at least one dot and a real TLD. */
const HOSTNAME_PATTERN = /^([a-z0-9-]+\.)+[a-z]{2,}$/;

/**
 * Whatever was typed into the website field, as an absolute URL: `harborlaw.com`
 * and `www.harborlaw.com/about` get `https://` added, so nobody has to type it.
 * Anything that isn't a real web address comes back as ''.
 */
export function normalizeWebsite(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;
  try {
    const url = new URL(withScheme);
    // An `@` means an email or a login slipped in, not a website.
    if (!/^https?:$/.test(url.protocol) || url.username || !HOSTNAME_PATTERN.test(url.hostname)) return '';
    // A bare domain stays `https://harborlaw.com`, not `https://harborlaw.com/`.
    return url.pathname === '/' && !url.search && !url.hash ? url.origin : url.href;
  } catch {
    return '';
  }
}
