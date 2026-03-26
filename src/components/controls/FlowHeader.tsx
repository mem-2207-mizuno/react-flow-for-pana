import { useRef } from 'react';
import type { FlowDefinition } from '@/types/flow';
import './FlowHeader.css';

interface Props {
  meta: FlowDefinition['meta'];
  mode?: 'view' | 'edit';
  isDirty?: boolean;
  onToggleMode?: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onNewFlow?: () => void;
}

export function FlowHeader({
  meta,
  mode = 'view',
  isDirty = false,
  onToggleMode,
  onExport,
  onImport,
  onNewFlow,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <header className="flow-header">
      <div className="flow-header__left">
        <h1 className="flow-header__title">
          {meta.title}
          {isDirty && <span className="flow-header__dirty"> *</span>}
        </h1>
        <p className="flow-header__description">{meta.description}</p>
      </div>
      <div className="flow-header__right">
        <span className="flow-header__version">v{meta.version}</span>
        {mode === 'edit' && (
          <div className="flow-header__actions">
            {onNewFlow && (
              <button className="flow-header__btn" onClick={onNewFlow}>
                New
              </button>
            )}
            {onImport && (
              <>
                <button
                  className="flow-header__btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.yaml,.yml"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </>
            )}
            {onExport && (
              <button className="flow-header__btn" onClick={onExport}>
                Export
              </button>
            )}
          </div>
        )}
        {onToggleMode && (
          <button
            className={`flow-header__mode-toggle ${mode === 'edit' ? 'flow-header__mode-toggle--active' : ''}`}
            onClick={onToggleMode}
          >
            {mode === 'view' ? 'Edit' : 'View'}
          </button>
        )}
      </div>
    </header>
  );
}
