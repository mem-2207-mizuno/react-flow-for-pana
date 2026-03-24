import type { PreconditionAxis } from '@/types/flow';
import './PreconditionSelector.css';

interface Props {
  preconditions: PreconditionAxis[];
  selectedConditions: Record<string, string>;
  onConditionChange: (key: string, value: string) => void;
}

export function PreconditionSelector({
  preconditions,
  selectedConditions,
  onConditionChange,
}: Props) {
  return (
    <div className="precondition-selector">
      {preconditions.map((axis) => (
        <div key={axis.key} className="precondition-selector__axis">
          <label className="precondition-selector__label">{axis.label}</label>
          <div className="precondition-selector__options">
            {axis.options.map((option) => {
              const isActive = selectedConditions[axis.key] === option.label;
              return (
                <button
                  key={option.label}
                  className={`precondition-selector__btn ${isActive ? 'precondition-selector__btn--active' : ''}`}
                  onClick={() => onConditionChange(axis.key, option.label)}
                  title={option.description}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
