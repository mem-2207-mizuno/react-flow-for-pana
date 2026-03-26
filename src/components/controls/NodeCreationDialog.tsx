import { useState } from 'react';
import type { NodeCategory, StepDefinition } from '@/types/flow';
import { generateId } from '@/utils/idGenerator';
import './NodeCreationDialog.css';

const CATEGORIES: NodeCategory[] = [
  'input',
  'llm',
  'transform',
  'condition',
  'output',
  'tool',
  'retrieval',
];

interface Props {
  onConfirm: (step: StepDefinition) => void;
  onCancel: () => void;
}

export function NodeCreationDialog({ onConfirm, onCancel }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<NodeCategory>('transform');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const step: StepDefinition = {
      id: generateId('step'),
      name: trimmed,
      category,
      summary: '',
      description: '',
      inputs: [],
      outputs: [],
    };
    onConfirm(step);
  };

  return (
    <div className="node-dialog__overlay" onClick={onCancel}>
      <div className="node-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="node-dialog__title">Add New Node</h3>
        <form onSubmit={handleSubmit}>
          <div className="node-dialog__field">
            <label className="node-dialog__label">Name</label>
            <input
              className="node-dialog__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Node name..."
              autoFocus
            />
          </div>
          <div className="node-dialog__field">
            <label className="node-dialog__label">Category</label>
            <select
              className="node-dialog__select"
              value={category}
              onChange={(e) => setCategory(e.target.value as NodeCategory)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="node-dialog__actions">
            <button
              type="button"
              className="node-dialog__btn node-dialog__btn--cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="node-dialog__btn node-dialog__btn--confirm"
              disabled={!name.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
