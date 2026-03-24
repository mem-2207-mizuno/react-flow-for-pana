import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';
import {
  NODE_WIDTH,
  NODE_MIN_HEIGHT,
  PORT_ROW_HEIGHT,
  GRAPH_DIRECTION,
  NODE_SEP,
  RANK_SEP,
} from '@/constants/layout';
import type { StepDefinition, StepNodeData } from '@/types/flow';

/** Estimate node height based on port count */
function estimateNodeHeight(step: StepDefinition): number {
  const portRows = Math.max(step.inputs.length, step.outputs.length);
  return NODE_MIN_HEIGHT + portRows * PORT_ROW_HEIGHT;
}

/** Apply dagre auto-layout to nodes and edges */
export function applyDagreLayout(
  nodes: Node<StepNodeData>[],
  edges: Edge[],
  steps: StepDefinition[],
): Node<StepNodeData>[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: GRAPH_DIRECTION,
    nodesep: NODE_SEP,
    ranksep: RANK_SEP,
  });

  const stepMap = new Map(steps.map((s) => [s.id, s]));

  for (const node of nodes) {
    const step = stepMap.get(node.id);
    const height = step ? estimateNodeHeight(step) : NODE_MIN_HEIGHT;
    g.setNode(node.id, { width: NODE_WIDTH, height });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - pos.height / 2,
      },
    };
  });
}
