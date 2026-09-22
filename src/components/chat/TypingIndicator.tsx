export function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start">
      <div
        className="inline-flex gap-1 rounded-card rounded-tl-none border border-line bg-panel px-4 py-[14px]"
        role="status"
        aria-label="Lawbrokr is typing"
      >
        <span className="size-1.5 animate-blink rounded-full bg-muted" />
        <span className="size-1.5 animate-blink rounded-full bg-muted [animation-delay:0.18s]" />
        <span className="size-1.5 animate-blink rounded-full bg-muted [animation-delay:0.36s]" />
      </div>
    </div>
  );
}
