import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { OtherInput } from './OtherInput';

interface ChoiceListProps {
  options: readonly string[];
  onPick: (value: string | readonly string[]) => void;
  /** Picking "Other" swaps the options for a free-text input, which can be left empty. */
  freeTextOnOther?: boolean;
  /** Options toggle instead of advancing; a Continue button submits the set. */
  multiSelect?: boolean;
}

const OTHER = 'Other';

/**
 * The answer options: outline buttons that wrap on desktop and stack full-width
 * on a phone, where the tap target also grows to the 44px minimum.
 *
 * Single-select has no "chosen" styling because there is nothing to show it on —
 * picking advances the stage, which remounts this list, and the answer reappears
 * immediately as the visitor's own bubble. `picked` only guards a double tap in
 * the frame before that happens.
 *
 * Multi-select toggles options (aria-pressed) and submits on Continue. If "Other"
 * is among them, the free-text input takes over first and its answer replaces
 * "Other" in the submitted set. Left empty, the answer is just "Other".
 */
export function ChoiceList({
  options,
  onPick,
  freeTextOnOther = false,
  multiSelect = false,
}: ChoiceListProps) {
  const [picked, setPicked] = useState(false);
  const [askingOther, setAskingOther] = useState(false);
  const [selected, setSelected] = useState<readonly string[]>([]);

  if (askingOther) {
    return (
      <OtherInput
        fallback={OTHER}
        onSubmit={(text) =>
          onPick(multiSelect ? [...selected.filter((option) => option !== OTHER), text] : text)
        }
      />
    );
  }

  const handlePick = (option: string) => {
    if (picked) return;
    if (multiSelect) {
      setSelected((current) =>
        current.includes(option)
          ? current.filter((value) => value !== option)
          : options.filter((value) => value === option || current.includes(value)),
      );
      return;
    }
    if (option === OTHER && freeTextOnOther) {
      setAskingOther(true);
      return;
    }
    setPicked(true);
    onPick(option);
  };

  const handleContinue = () => {
    if (picked || selected.length === 0) return;
    if (selected.includes(OTHER) && freeTextOnOther) {
      setAskingOther(true);
      return;
    }
    setPicked(true);
    onPick(selected);
  };

  // A list too tall for the chat area scrolls inside itself rather than pushing
  // the question off the top. Its cap is the chat area's height (100cqh) less
  // room for the question's bubble, the gaps around the list and, when there is
  // one, Continue, so they all stay in view together. The -m-1 p-1 keeps the
  // buttons' focus rings from being clipped by the scroll edge.
  return (
    <div className="mt-5 mb-5 animate-fade-in">
      <div
        className={cn(
          '-m-1 flex flex-col gap-2 overflow-y-auto overscroll-contain p-1 sm:flex-row sm:flex-wrap',
          multiSelect ? 'max-h-[max(10rem,calc(100cqh-13.5rem))]' : 'max-h-[max(10rem,calc(100cqh-10rem))]',
        )}
      >
        {options.map((option) => {
          const isSelected = multiSelect && selected.includes(option);
          return (
            <Button
              key={option}
              variant={isSelected ? 'secondary' : 'outline'}
              aria-pressed={multiSelect ? isSelected : undefined}
              onClick={() => handlePick(option)}
              className="h-auto min-h-11 justify-start px-4 py-2.5 text-left whitespace-normal sm:min-h-9"
            >
              {isSelected && <Check aria-hidden="true" className="size-4 shrink-0" />}
              {option}
            </Button>
          );
        })}
      </div>
      {multiSelect && (
        <Button
          className="mt-4 min-h-11 w-full sm:min-h-9 sm:w-auto"
          disabled={selected.length === 0}
          onClick={handleContinue}
        >
          Continue
        </Button>
      )}
    </div>
  );
}
