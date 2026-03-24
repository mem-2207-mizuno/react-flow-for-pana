import { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { PortHandle } from './PortHandle';
import { NodeCategoryIcon } from './NodeCategoryIcon';
import { CATEGORY_STYLES } from '@/constants/colors';
import type { StepNodeData } from '@/types/flow';
import './StepNode.css';

type StepNodeProps = NodeProps & { data: StepNodeData };

export const StepNode = memo(({ data, selected }: StepNodeProps) => {
  const { step } = data;
  const styles = CATEGORY_STYLES[step.category];

  return (
    <div
      className={`step-node ${selected ? 'step-node--selected' : ''}`}
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border,
      }}
    >
      {/* Header */}
      <div
        className="step-node__header"
        style={{ backgroundColor: styles.headerBg, color: styles.text }}
      >
        <NodeCategoryIcon category={step.category} />
        <span className="step-node__name">{step.name}</span>
      </div>

      {/* Port area */}
      <div className="step-node__ports">
        {/* Left: Inputs */}
        <div className="step-node__port-column step-node__port-column--left">
          {step.inputs.map((port) => (
            <PortHandle
              key={port.id}
              port={port}
              type="target"
              position={Position.Left}
            />
          ))}
        </div>
        {/* Right: Outputs */}
        <div className="step-node__port-column step-node__port-column--right">
          {step.outputs.map((port) => (
            <PortHandle
              key={port.id}
              port={port}
              type="source"
              position={Position.Right}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="step-node__summary">{step.summary}</div>

      {/* Prompt badge */}
      {step.prompt && <div className="step-node__prompt-badge">Prompt</div>}
    </div>
  );
});

StepNode.displayName = 'StepNode';
