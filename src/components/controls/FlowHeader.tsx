import type { FlowDefinition } from '@/types/flow';
import './FlowHeader.css';

interface Props {
  meta: FlowDefinition['meta'];
}

export function FlowHeader({ meta }: Props) {
  return (
    <header className="flow-header">
      <div className="flow-header__left">
        <h1 className="flow-header__title">{meta.title}</h1>
        <p className="flow-header__description">{meta.description}</p>
      </div>
      <div className="flow-header__right">
        <span className="flow-header__version">v{meta.version}</span>
      </div>
    </header>
  );
}
