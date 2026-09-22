export function TypingIndicator() {
  return (
    <div className="mb-3 flex justify-start">
      <div
        role="status"
        aria-label="Lawbrokr is typing"
        className="inline-flex gap-1 rounded-lg rounded-tl-none border border-border bg-muted px-4 py-4"
      >
        <span className="size-1.5 animate-blink rounded-full bg-muted-foreground" />
        <span className="size-1.5 animate-blink rounded-full bg-muted-foreground [animation-delay:0.18s]" />
        <span className="size-1.5 animate-blink rounded-full bg-muted-foreground [animation-delay:0.36s]" />
      </div>
    </div>
  );
}
