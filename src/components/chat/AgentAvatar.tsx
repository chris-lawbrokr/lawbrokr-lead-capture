/**
 * Jake's photo, beside each of his lines. Decorative: the words carry the
 * meaning, so it's hidden from assistive tech. Sits on the bubble's squared-off
 * corner, which is why it aligns to the top.
 */
export function AgentAvatar() {
  return (
    <img
      src="/brand/jake.webp"
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      className="size-8 shrink-0 rounded-full object-cover"
    />
  );
}
