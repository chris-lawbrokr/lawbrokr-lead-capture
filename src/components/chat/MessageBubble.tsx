import { cn } from '../../lib/cn';
import type { ChatMessage } from '../../types';

/**
 * One line of the transcript. Lawbrokr speaks on a muted card with a border;
 * the visitor's own words come back in brand purple. Radius-lg, squared off on
 * the corner nearest its speaker.
 */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const fromBot = message.author === 'bot';

  return (
    <div className={cn('mb-3 flex animate-rise', fromBot ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[78%] rounded-lg px-4 py-2.5 text-base',
          fromBot
            ? 'rounded-tl-none border border-border bg-muted text-foreground'
            : 'rounded-tr-none bg-primary text-primary-foreground',
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
