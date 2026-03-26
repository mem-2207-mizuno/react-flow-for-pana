import { useState, useEffect } from 'react';
import type { StepDefinition } from '@/types/flow';
import { CATEGORY_STYLES } from '@/constants/colors';
import { StepBasicEditor } from './sections/StepBasicEditor';
import { PortListEditor } from './sections/PortListEditor';
import { PromptEditor } from './sections/PromptEditor';
import { MetadataEditor } from './sections/MetadataEditor';
import './EditorPanel.css';

interface Props {
  step: StepDefinition;
  onUpdateStep: (id: string, updates: Partial<StepDefinition>) => void;
  onDeleteStep: (id: string) => void;
  onClose: () => void;
}

export function EditorPanel({
  step,
  onUpdateStep,
  onDeleteStep,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<StepDefinition>(step);

  // Sync when selected node changes
  useEffect(() => {
    setDraft(step);
  }, [step]);

  const commitChanges = (updates: Partial<StepDefinition>) => {
    const next = { ...draft, ...updates };
    setDraft(next);
    onUpdateStep(step.id, next);
  };

  const styles = CATEGORY_STYLES[draft.category];

  return (
    <aside className="editor-panel">
      <div className="editor-panel__header">
        <div className="editor-panel__header-info">
          <span
            className="editor-panel__category"
            style={{ color: styles.headerBg }}
          >
            {draft.category.toUpperCase()}
          </span>
          <h2 className="editor-panel__title">{draft.name || 'Untitled'}</h2>
        </div>
        <div className="editor-panel__header-actions">
          <button
            className="editor-panel__delete-btn"
            onClick={() => {
              if (window.confirm(`Delete "${step.name}"?`)) {
                onDeleteStep(step.id);
              }
            }}
            title="Delete node"
          >
            Delete
          </button>
          <button className="editor-panel__close" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>

      <div className="editor-panel__body">
        {/* Basic Info */}
        <section className="editor-panel__section">
          <h3 className="editor-panel__section-title">Basic Info</h3>
          <StepBasicEditor draft={draft} onChange={commitChanges} />
        </section>

        {/* Inputs */}
        <section className="editor-panel__section">
          <h3 className="editor-panel__section-title">Inputs</h3>
          <PortListEditor
            label="Input"
            ports={draft.inputs}
            onChange={(inputs) => commitChanges({ inputs })}
          />
        </section>

        {/* Outputs */}
        <section className="editor-panel__section">
          <h3 className="editor-panel__section-title">Outputs</h3>
          <PortListEditor
            label="Output"
            ports={draft.outputs}
            onChange={(outputs) => commitChanges({ outputs })}
          />
        </section>

        {/* Prompt */}
        <section className="editor-panel__section">
          <h3 className="editor-panel__section-title">Prompt</h3>
          <PromptEditor
            prompt={draft.prompt}
            onChange={(prompt) => commitChanges({ prompt })}
          />
        </section>

        {/* Metadata */}
        <section className="editor-panel__section">
          <h3 className="editor-panel__section-title">Metadata</h3>
          <MetadataEditor
            metadata={draft.metadata}
            onChange={(metadata) => commitChanges({ metadata })}
          />
        </section>
      </div>
    </aside>
  );
}
