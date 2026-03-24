import type { Node, Edge } from '@xyflow/react';
import type {
  StepDefinition,
  ConnectionDefinition,
  LayoutPosition,
  StepNodeData,
} from '@/types/flow';
import { getPortColor } from '@/constants/colors';
import { applyDagreLayout } from './layoutEngine';

/** Convert StepDefinitions to React Flow Nodes */
function stepsToNodes(
  steps: StepDefinition[],
  layout?: LayoutPosition[],
): Node<StepNodeData>[] {
  const layoutMap = new Map(layout?.map((l) => [l.nodeId, l]));

  return steps.map((step) => {
    const pos = layoutMap.get(step.id);
    return {
      id: step.id,
      type: 'stepNode',
      position: pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 },
      data: { step },
    };
  });
}

/** Convert ConnectionDefinitions to React Flow Edges */
function connectionsToEdges(
  connections: ConnectionDefinition[],
  steps: StepDefinition[],
): Edge[] {
  const stepMap = new Map(steps.map((s) => [s.id, s]));

  return connections.map((conn) => {
    const sourceStep = stepMap.get(conn.sourceNodeId);
    const sourcePort = sourceStep?.outputs.find(
      (p) => p.id === conn.sourcePortId,
    );
    const color = sourcePort ? getPortColor(sourcePort.dataType) : '#94a3b8';

    return {
      id: conn.id,
      source: conn.sourceNodeId,
      sourceHandle: conn.sourcePortId,
      target: conn.targetNodeId,
      targetHandle: conn.targetPortId,
      type: 'dataFlow',
      data: {
        label: conn.label ?? sourcePort?.label,
        dataType: sourcePort?.dataType,
        color,
      },
      style: { stroke: color, strokeWidth: 2 },
    };
  });
}

/** Transform flow data to React Flow nodes and edges */
export function transformFlowToReactFlow(
  steps: StepDefinition[],
  connections: ConnectionDefinition[],
  layout?: LayoutPosition[],
): { nodes: Node<StepNodeData>[]; edges: Edge[] } {
  let nodes = stepsToNodes(steps, layout);
  const edges = connectionsToEdges(connections, steps);

  // Apply dagre layout if no manual layout provided
  const hasLayout = layout && layout.length > 0;
  if (!hasLayout) {
    nodes = applyDagreLayout(nodes, edges, steps);
  }

  return { nodes, edges };
}
