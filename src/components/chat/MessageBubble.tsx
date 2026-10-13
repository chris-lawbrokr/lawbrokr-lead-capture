import { cn } from '../../lib/cn';
import type { ChatMessage } from '../../types';
import { AgentAvatar } from './AgentAvatar';

/**
 * One line of the transcript. Lawbrokr speaks on a muted card with a border,
 * beside the Lawbrokr mark; the visitor's own words come back in brand purple.
 * Radius-lg, squared off on the corner nearest its speaker.
 *
 * Lawbrokr's lines can run to the right edge, so a long one spans exactly the
 * width of the controls beneath it. The visitor's stop short at 78%, so their
 * replies read as replies rather than as another full-width block.
 */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const fromBot = message.author === 'bot';

  return (
    <div className={cn('mb-3 flex animate-fade-in items-start gap-3', fromBot ? 'justify-start' : 'justify-end')}>
      {fromBot && <AgentAvatar />}
      <div
        className={cn(
          'rounded-lg px-4 py-2.5 text-base',
          fromBot
            ? 'rounded-tl-none border border-border bg-muted text-foreground'
            : 'max-w-[78%] rounded-tr-none bg-primary text-primary-foreground',
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
