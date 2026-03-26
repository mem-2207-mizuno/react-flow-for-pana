import { useState } from 'react';

interface Props {
  metadata: Record<string, string | number | boolean> | undefined;
  onChange: (metadata: Record<string, string | number | boolean> | undefined) => void;
}

export function MetadataEditor({ metadata, onChange }: Props) {
  const [newKey, setNewKey] = useState('');

  const entries = metadata ? Object.entries(metadata) : [];

  const handleValueChange = (key: string, value: string) => {
    onChange({ ...metadata, [key]: value });
  };

  const handleDeleteKey = (key: string) => {
    if (!metadata) return;
    const next = { ...metadata };
    delete next[key];
    onChange(Object.keys(next).length > 0 ? next : undefined);
  };

  const handleAddKey = () => {
    const trimmed = newKey.trim();
    if (!trimmed) return;
    onChange({ ...metadata, [trimmed]: '' });
    setNewKey('');
  };

  return (
    <div className="editor-section">
      <div className="metadata-editor">
        {entries.map(([key, value]) => (
          <div key={key} className="metadata-editor__row">
            <span className="metadata-editor__key">{key}</span>
            <input
              className="metadata-editor__value"
              value={String(value)}
              onChange={(e) => handleValueChange(key, e.target.value)}
            />
            <button
              className="metadata-editor__delete"
              onClick={() => handleDeleteKey(key)}
            >
              &times;
            </button>
          </div>
        ))}
        <div className="metadata-editor__add-row">
          <input
            className="metadata-editor__new-key"
            value={newKey}
            placeholder="New key..."
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddKey();
            }}
          />
          <button
            className="editor-section__add-btn"
            onClick={handleAddKey}
            disabled={!newKey.trim()}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
