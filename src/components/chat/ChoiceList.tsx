import { useState } from 'react';
import { Button } from '../ui/Button';
import { OtherInput } from './OtherInput';

interface ChoiceListProps {
  options: readonly string[];
  onPick: (value: string) => void;
  /** Picking "Other" swaps the chips for a free-text input. */
  freeTextOnOther?: boolean;
}

const OTHER = 'Other';

export function ChoiceList({ options, onPick, freeTextOnOther = false }: ChoiceListProps) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [askingOther, setAskingOther] = useState(false);

  if (askingOther) {
    return <OtherInput onSubmit={onPick} />;
  }

  const handlePick = (option: string) => {
    if (option === OTHER && freeTextOnOther) {
      setAskingOther(true);
      return;
    }
    setChosen(option);
    onPick(option);
  };

  return (
    <div className="mb-5 flex flex-wrap gap-2 animate-rise">
      {options.map((option) => (
        <Button
          key={option}
          variant="choice"
          selected={chosen === option}
          disabled={chosen !== null}
          onClick={() => handlePick(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
