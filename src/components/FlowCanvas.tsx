import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StepNode } from './nodes/StepNode';
import { DataFlowEdge } from './edges/DataFlowEdge';
import { CATEGORY_STYLES } from '@/constants/colors';
import type { StepNodeData } from '@/types/flow';

const nodeTypes = { stepNode: StepNode };
const edgeTypes = { dataFlow: DataFlowEdge };

interface Props {
  nodes: Node<StepNodeData>[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
}

export function FlowCanvas({ nodes, edges, onNodeClick }: Props) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_event, node) => onNodeClick?.(node.id)}
        nodesDraggable={false}
        nodesConnectable={false}
        connectOnClick={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        fitView
        fitViewOptions={{ padding: 0.2, duration: 400 }}
        defaultEdgeOptions={{
          type: 'dataFlow',
          animated: false,
        }}
      >
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as StepNodeData | undefined;
            if (data?.step) {
              return CATEGORY_STYLES[data.step.category]?.border ?? '#94a3b8';
            }
            return '#94a3b8';
          }}
          maskColor="rgba(0, 0, 0, 0.08)"
          pannable
          zoomable
        />
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
      </ReactFlow>
    </div>
  );
}
