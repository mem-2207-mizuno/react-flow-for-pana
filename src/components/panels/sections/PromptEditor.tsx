import type { PromptTemplate, PromptVariable } from '@/types/flow';
import { generateId } from '@/utils/idGenerator';

interface Props {
  prompt: PromptTemplate | undefined;
  onChange: (prompt: PromptTemplate | undefined) => void;
}

export function PromptEditor({ prompt, onChange }: Props) {
  if (!prompt) {
    return (
      <div className="editor-section">
        <button
          className="editor-section__add-btn"
          onClick={() =>
            onChange({ template: '', variables: [] })
          }
        >
          + Add Prompt
        </button>
      </div>
    );
  }

  const handleVariableChange = (
    index: number,
    updates: Partial<PromptVariable>,
  ) => {
    const next = prompt.variables.map((v, i) =>
      i === index ? { ...v, ...updates } : v,
    );
    onChange({ ...prompt, variables: next });
  };

  const handleVariableDelete = (index: number) => {
    onChange({
      ...prompt,
      variables: prompt.variables.filter((_, i) => i !== index),
    });
  };

  const handleAddVariable = () => {
    const newVar: PromptVariable = {
      name: `var_${generateId('v').slice(0, 6)}`,
      source: '',
    };
    onChange({ ...prompt, variables: [...prompt.variables, newVar] });
  };

  return (
    <div className="editor-section">
      <div className="editor-section__field">
        <label className="editor-section__label">System Prompt</label>
        <textarea
          className="editor-section__textarea editor-section__textarea--mono"
          value={prompt.systemPrompt ?? ''}
          rows={3}
          placeholder="Optional system prompt..."
          onChange={(e) =>
            onChange({
              ...prompt,
              systemPrompt: e.target.value || undefined,
            })
          }
        />
      </div>
      <div className="editor-section__field">
        <label className="editor-section__label">Template</label>
        <textarea
          className="editor-section__textarea editor-section__textarea--mono"
          value={prompt.template}
          rows={6}
          placeholder="Use {{variableName}} for variable references..."
          onChange={(e) =>
            onChange({ ...prompt, template: e.target.value })
          }
        />
      </div>
      <div className="editor-section__field">
        <label className="editor-section__label">Variables</label>
        <div className="prompt-vars">
          {prompt.variables.map((v, i) => (
            <div key={i} className="prompt-vars__row">
              <input
                className="prompt-vars__input"
                value={v.name}
                placeholder="name"
                onChange={(e) =>
                  handleVariableChange(i, { name: e.target.value })
                }
              />
              <input
                className="prompt-vars__input prompt-vars__input--source"
                value={v.source}
                placeholder="nodeId.portId"
                onChange={(e) =>
                  handleVariableChange(i, { source: e.target.value })
                }
              />
              <button
                className="prompt-vars__delete"
                onClick={() => handleVariableDelete(i)}
              >
                &times;
              </button>
            </div>
          ))}
          <button
            className="editor-section__add-btn"
            onClick={handleAddVariable}
          >
            + Add Variable
          </button>
        </div>
      </div>
      <button
        className="editor-section__remove-btn"
        onClick={() => onChange(undefined)}
      >
        Remove Prompt
      </button>
    </div>
  );
}
