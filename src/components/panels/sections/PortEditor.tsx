import type { PortDataType, PortDefinition } from '@/types/flow';
import { getPortColor } from '@/constants/colors';

const DATA_TYPES: PortDataType[] = [
  'string',
  'number',
  'boolean',
  'json',
  'html',
  'image',
  'embedding',
  'prompt',
  'message-list',
  'tool-result',
];

interface Props {
  port: PortDefinition;
  onChange: (updates: Partial<PortDefinition>) => void;
  onDelete: () => void;
}

export function PortEditor({ port, onChange, onDelete }: Props) {
  const color = getPortColor(port.dataType);

  return (
    <div className="port-editor">
      <div className="port-editor__header">
        <span
          className="port-editor__dot"
          style={{ backgroundColor: color }}
        />
        <input
          className="port-editor__label-input"
          value={port.label}
          placeholder="Label"
          onChange={(e) => onChange({ label: e.target.value })}
        />
        <select
          className="port-editor__type-select"
          value={port.dataType}
          style={{ color }}
          onChange={(e) =>
            onChange({ dataType: e.target.value as PortDataType })
          }
        >
          {DATA_TYPES.map((dt) => (
            <option key={dt} value={dt}>
              {dt}
            </option>
          ))}
        </select>
        <label className="port-editor__required-label">
          <input
            type="checkbox"
            checked={port.required ?? false}
            onChange={(e) => onChange({ required: e.target.checked })}
          />
          <span>Req</span>
        </label>
        <button
          className="port-editor__delete"
          onClick={onDelete}
          title="Delete port"
        >
          &times;
        </button>
      </div>
      <input
        className="port-editor__desc-input"
        value={port.description}
        placeholder="Description"
        onChange={(e) => onChange({ description: e.target.value })}
      />
    </div>
  );
}
