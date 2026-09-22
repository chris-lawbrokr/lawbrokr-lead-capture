import { cn } from '../../lib/cn';
import type { ChatMessage } from '../../types';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const fromBot = message.author === 'bot';

  return (
    <div className={cn('mb-4 flex animate-rise', fromBot ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[78%] rounded-card px-4 py-3 text-[0.98rem]',
          fromBot
            ? 'rounded-tl-none border border-line bg-panel text-ink'
            : 'rounded-tr-none bg-brand-900 text-white',
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
