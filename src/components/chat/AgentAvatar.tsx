/**
 * The Lawbrokr mark in a brand-purple disc, beside each of the assistant's
 * lines. Decorative: the words carry the meaning, so it's hidden from assistive
 * tech. Sits on the bubble's squared-off corner, which is why it aligns to the
 * top.
 */
export function AgentAvatar() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary"
    >
      <img src="/brand/lb-icon-white.svg" alt="" className="h-4 w-auto" />
    </span>
  );
}
