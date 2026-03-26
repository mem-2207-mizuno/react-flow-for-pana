import type { NodeCategory, StepDefinition } from '@/types/flow';

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
  draft: StepDefinition;
  onChange: (updates: Partial<StepDefinition>) => void;
}

export function StepBasicEditor({ draft, onChange }: Props) {
  return (
    <div className="editor-section">
      <div className="editor-section__field">
        <label className="editor-section__label">ID</label>
        <input
          className="editor-section__input editor-section__input--readonly"
          value={draft.id}
          readOnly
        />
      </div>
      <div className="editor-section__field">
        <label className="editor-section__label">Name</label>
        <input
          className="editor-section__input"
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div className="editor-section__field">
        <label className="editor-section__label">Category</label>
        <select
          className="editor-section__select"
          value={draft.category}
          onChange={(e) =>
            onChange({ category: e.target.value as NodeCategory })
          }
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="editor-section__field">
        <label className="editor-section__label">Summary</label>
        <input
          className="editor-section__input"
          value={draft.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
        />
      </div>
      <div className="editor-section__field">
        <label className="editor-section__label">Description</label>
        <textarea
          className="editor-section__textarea"
          value={draft.description}
          rows={4}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
    </div>
  );
}
