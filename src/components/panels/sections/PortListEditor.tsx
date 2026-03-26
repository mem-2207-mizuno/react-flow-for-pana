import type { PortDefinition } from '@/types/flow';
import { PortEditor } from './PortEditor';
import { generateId } from '@/utils/idGenerator';

interface Props {
  label: string;
  ports: PortDefinition[];
  onChange: (ports: PortDefinition[]) => void;
}

export function PortListEditor({ label, ports, onChange }: Props) {
  const handlePortChange = (
    index: number,
    updates: Partial<PortDefinition>,
  ) => {
    const next = ports.map((p, i) => (i === index ? { ...p, ...updates } : p));
    onChange(next);
  };

  const handlePortDelete = (index: number) => {
    onChange(ports.filter((_, i) => i !== index));
  };

  const handleAddPort = () => {
    const newPort: PortDefinition = {
      id: generateId('port'),
      label: 'new-port',
      dataType: 'string',
      description: '',
    };
    onChange([...ports, newPort]);
  };

  return (
    <div className="editor-section">
      <div className="editor-section__ports">
        {ports.map((port, i) => (
          <PortEditor
            key={port.id}
            port={port}
            onChange={(updates) => handlePortChange(i, updates)}
            onDelete={() => handlePortDelete(i)}
          />
        ))}
      </div>
      <button className="editor-section__add-btn" onClick={handleAddPort}>
        + Add {label}
      </button>
    </div>
  );
}
