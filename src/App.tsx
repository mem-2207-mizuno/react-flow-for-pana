import { useState, useMemo, useCallback, useEffect } from 'react';
import { ReactFlowProvider, applyNodeChanges, type Node, type NodeChange } from '@xyflow/react';
import { loadFlowDefinition } from '@/data/loader';
import { resolveFlow } from '@/utils/variantResolver';
import { transformFlowToReactFlow } from '@/utils/flowTransform';
import { FlowCanvas } from '@/components/FlowCanvas';
import { FlowHeader } from '@/components/controls/FlowHeader';
import { PreconditionSelector } from '@/components/controls/PreconditionSelector';
import { DetailPanel } from '@/components/panels/DetailPanel';
import type { StepNodeData } from '@/types/flow';
import exampleFlowYaml from '@/data/product-sku-pre-launch.yaml?raw';
import './App.css';

const flowDef = loadFlowDefinition(exampleFlowYaml);

export default function App() {
  const [selectedConditions, setSelectedConditions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    for (const axis of flowDef.preconditions) {
      if (axis.options.length > 0) {
        defaults[axis.key] = axis.options[0].label;
      }
    }
    return defaults;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const resolved = useMemo(
    () => resolveFlow(
      { steps: flowDef.steps, connections: flowDef.connections },
      flowDef.variants,
      selectedConditions,
    ),
    [selectedConditions],
  );

  // Compute initial layout from dagre
  const { nodes: initialNodes, edges } = useMemo(
    () => transformFlowToReactFlow(resolved.steps, resolved.connections, flowDef.layout),
    [resolved],
  );

  // Manage nodes as state so drag positions are preserved
  const [nodes, setNodes] = useState<Node<StepNodeData>[]>(initialNodes);

  // Reset node positions when the flow changes (e.g. precondition switch)
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const handleNodesChange = useCallback(
    (changes: NodeChange<Node<StepNodeData>>[]) => {
      setNodes((prev) => applyNodeChanges(changes, prev));
    },
    [],
  );

  const selectedStep = useMemo(
    () => resolved.steps.find((s) => s.id === selectedNodeId) ?? null,
    [resolved.steps, selectedNodeId],
  );

  // Compute which node to highlight edges for (click takes priority over hover)
  const activeNodeId = selectedNodeId ?? hoveredNodeId;

  // Compute highlighted edge IDs based on active node
  const highlightedEdgeIds = useMemo(() => {
    if (!activeNodeId) return null;
    return new Set(
      edges
        .filter((e) => e.source === activeNodeId || e.target === activeNodeId)
        .map((e) => e.id),
    );
  }, [edges, activeNodeId]);

  // Inject highlight/dim state into edges
  const edgesWithHighlight = useMemo(() => {
    if (!highlightedEdgeIds) return edges;
    return edges.map((e) => ({
      ...e,
      zIndex: highlightedEdgeIds.has(e.id) ? 1000 : -1,
      data: {
        ...e.data,
        highlighted: highlightedEdgeIds.has(e.id),
        dimmed: !highlightedEdgeIds.has(e.id),
      },
    }));
  }, [edges, highlightedEdgeIds]);

  const handleConditionChange = useCallback((key: string, value: string) => {
    setSelectedConditions((prev) => ({ ...prev, [key]: value }));
    setSelectedNodeId(null);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="app">
        <FlowHeader meta={flowDef.meta} />
        {flowDef.preconditions.length > 0 && (
          <PreconditionSelector
            preconditions={flowDef.preconditions}
            selectedConditions={selectedConditions}
            onConditionChange={handleConditionChange}
          />
        )}
        <div className="app__content">
          <div className="app__canvas">
            <FlowCanvas
              nodes={nodes}
              edges={edgesWithHighlight}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
              onNodesChange={handleNodesChange}
              onPaneClick={handleClosePanel}
            />
          </div>
          {selectedStep && (
            <DetailPanel
              step={selectedStep}
              allSteps={resolved.steps}
              onClose={handleClosePanel}
            />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
