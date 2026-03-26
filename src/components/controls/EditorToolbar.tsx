import './EditorToolbar.css';

interface Props {
  onAddNode: () => void;
  onAutoLayout: () => void;
}

export function EditorToolbar({ onAddNode, onAutoLayout }: Props) {
  return (
    <div className="editor-toolbar">
      <button className="editor-toolbar__btn" onClick={onAddNode}>
        + Add Node
      </button>
      <button className="editor-toolbar__btn" onClick={onAutoLayout}>
        Auto Layout
      </button>
    </div>
  );
}
