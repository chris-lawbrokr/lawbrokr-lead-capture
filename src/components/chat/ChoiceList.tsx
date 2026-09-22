import { useState } from 'react';
import { Button } from '../ui/Button';
import { OtherInput } from './OtherInput';

interface ChoiceListProps {
  options: readonly string[];
  onPick: (value: string) => void;
  /** Picking "Other" swaps the options for a free-text input. */
  freeTextOnOther?: boolean;
}

const OTHER = 'Other';

/**
 * The answer options: outline buttons that wrap on desktop and stack full-width
 * on a phone, where the tap target also grows to the 44px minimum.
 *
 * There is no "chosen" styling because there is nothing to show it on — picking
 * advances the stage, which remounts this list, and the answer reappears
 * immediately as the visitor's own bubble. `picked` only guards a double tap in
 * the frame before that happens.
 */
export function ChoiceList({ options, onPick, freeTextOnOther = false }: ChoiceListProps) {
  const [picked, setPicked] = useState(false);
  const [askingOther, setAskingOther] = useState(false);

  if (askingOther) {
    return <OtherInput onSubmit={onPick} />;
  }

  const handlePick = (option: string) => {
    if (picked) return;
    if (option === OTHER && freeTextOnOther) {
      setAskingOther(true);
      return;
    }
    setPicked(true);
    onPick(option);
  };

  return (
    <div className="mt-5 mb-5 flex animate-fade-in flex-col gap-2 sm:flex-row sm:flex-wrap">
      {options.map((option) => (
        <Button
          key={option}
          variant="outline"
          onClick={() => handlePick(option)}
          className="h-auto min-h-11 justify-start px-4 py-2.5 text-left whitespace-normal sm:min-h-9"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
