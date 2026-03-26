import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlowProvider,
  applyNodeChanges,
  type Node,
  type NodeChange,
  type Connection,
  useReactFlow,
} from '@xyflow/react';
import { loadFlowDefinition } from '@/data/loader';
import { resolveFlow } from '@/utils/variantResolver';
import { transformFlowToReactFlow } from '@/utils/flowTransform';
import { useFlowEditor } from '@/hooks/useFlowEditor';
import { exportFlowAsJson, importFlowFromJson, importFlowFromYaml } from '@/utils/flowSerializer';
import { generateId } from '@/utils/idGenerator';
import { FlowCanvas } from '@/components/FlowCanvas';
import { FlowHeader } from '@/components/controls/FlowHeader';
import { PreconditionSelector } from '@/components/controls/PreconditionSelector';
import { DetailPanel } from '@/components/panels/DetailPanel';
import { EditorPanel } from '@/components/panels/EditorPanel';
import { EditorToolbar } from '@/components/controls/EditorToolbar';
import { NodeCreationDialog } from '@/components/controls/NodeCreationDialog';
import type { StepNodeData, StepDefinition, LayoutPosition } from '@/types/flow';
import exampleFlowYaml from '@/data/product-sku-pre-launch.yaml?raw';
import './App.css';

const initialFlowDef = loadFlowDefinition(exampleFlowYaml);

function AppContent() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const editor = useFlowEditor(initialFlowDef);
  const [showCreationDialog, setShowCreationDialog] = useState(false);

  const flowDef = mode === 'edit' ? editor.flow : initialFlowDef;

  const [selectedConditions, setSelectedConditions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    for (const axis of initialFlowDef.preconditions) {
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
    [flowDef.steps, flowDef.connections, flowDef.variants, selectedConditions],
  );

  const { nodes: initialNodes, edges } = useMemo(
    () => transformFlowToReactFlow(resolved.steps, resolved.connections, flowDef.layout),
    [resolved, flowDef.layout],
  );

  const [nodes, setNodes] = useState<Node<StepNodeData>[]>(initialNodes);

  // Preserve node positions when flow data changes (only use dagre for new nodes)
  useEffect(() => {
    setNodes((prev) => {
      const posMap = new Map(prev.map((n) => [n.id, n.position]));
      return initialNodes.map((n) => ({
        ...n,
        position: posMap.get(n.id) ?? n.position,
      }));
    });
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

  const activeNodeId = selectedNodeId ?? hoveredNodeId;

  const highlightedEdgeIds = useMemo(() => {
    if (!activeNodeId) return null;
    return new Set(
      edges
        .filter((e) => e.source === activeNodeId || e.target === activeNodeId)
        .map((e) => e.id),
    );
  }, [edges, activeNodeId]);

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

  // --- Edit mode handlers ---

  const handleToggleMode = useCallback(() => {
    setMode((prev) => {
      if (prev === 'edit' && editor.isDirty) {
        if (!window.confirm('Unsaved changes will be lost. Switch to View mode?')) {
          return prev;
        }
      }
      setSelectedNodeId(null);
      return prev === 'view' ? 'edit' : 'view';
    });
  }, [editor.isDirty]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      editor.addConnection({
        sourceNodeId: connection.source,
        sourcePortId: connection.sourceHandle ?? '',
        targetNodeId: connection.target,
        targetPortId: connection.targetHandle ?? '',
      });
    },
    [editor],
  );

  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      editor.deleteConnection(edgeId);
    },
    [editor],
  );

  const handleDeleteStep = useCallback(
    (id: string) => {
      editor.deleteStep(id);
      setSelectedNodeId(null);
    },
    [editor],
  );

  const reactFlow = useReactFlow();

  const handleAddNode = useCallback(
    (step: StepDefinition) => {
      // Place at center of current viewport
      const { x, y, zoom } = reactFlow.getViewport();
      const centerX = (-x + window.innerWidth / 2) / zoom;
      const centerY = (-y + window.innerHeight / 2) / zoom;
      step.id = generateId('step');
      editor.addStep(step);
      // Set initial position for the new node after render
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === step.id
              ? { ...n, position: { x: centerX, y: centerY } }
              : n,
          ),
        );
      }, 0);
      setSelectedNodeId(step.id);
      setShowCreationDialog(false);
    },
    [editor, reactFlow],
  );

  const handleAutoLayout = useCallback(() => {
    // Clear layout to force dagre recalculation
    editor.importFlow({
      ...editor.flow,
      layout: undefined,
    });
  }, [editor]);

  const handleExport = useCallback(() => {
    // Capture current node positions into layout
    const layout: LayoutPosition[] = nodes.map((n) => ({
      nodeId: n.id,
      x: n.position.x,
      y: n.position.y,
    }));
    exportFlowAsJson({ ...editor.flow, layout });
    editor.resetDirty();
  }, [editor, nodes]);

  const handleImport = useCallback(
    async (file: File) => {
      try {
        let flow;
        if (file.name.endsWith('.json')) {
          flow = await importFlowFromJson(file);
        } else {
          flow = await importFlowFromYaml(file);
        }
        editor.importFlow(flow);
        setSelectedNodeId(null);
      } catch (err) {
        alert(`Import failed: ${err instanceof Error ? err.message : err}`);
      }
    },
    [editor],
  );

  const handleNewFlow = useCallback(() => {
    if (editor.isDirty) {
      if (!window.confirm('Unsaved changes will be lost. Create new flow?')) return;
    }
    editor.createNewFlow();
    setSelectedNodeId(null);
  }, [editor]);

  // Unsaved changes warning on page unload
  useEffect(() => {
    if (!editor.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [editor.isDirty]);

  // Inject edit mode flag into node data for StepNode to use
  const nodesForCanvas = useMemo(() => {
    if (mode !== 'edit') return nodes;
    return nodes.map((n) => ({
      ...n,
      data: { ...n.data, isEditMode: true },
    }));
  }, [nodes, mode]);

  // Inject edit mode into edges for DataFlowEdge delete button
  const edgesForCanvas = useMemo(() => {
    if (mode !== 'edit') return edgesWithHighlight;
    return edgesWithHighlight.map((e) => ({
      ...e,
      data: { ...e.data, isEditMode: true, onDelete: handleEdgeDelete },
    }));
  }, [edgesWithHighlight, mode, handleEdgeDelete]);

  return (
    <div className="app">
      <FlowHeader
        meta={flowDef.meta}
        mode={mode}
        isDirty={editor.isDirty}
        onToggleMode={handleToggleMode}
        onExport={handleExport}
        onImport={handleImport}
        onNewFlow={handleNewFlow}
      />
      {mode === 'view' && flowDef.preconditions.length > 0 && (
        <PreconditionSelector
          preconditions={flowDef.preconditions}
          selectedConditions={selectedConditions}
          onConditionChange={handleConditionChange}
        />
      )}
      {mode === 'edit' && (
        <EditorToolbar
          onAddNode={() => setShowCreationDialog(true)}
          onAutoLayout={handleAutoLayout}
        />
      )}
      <div className="app__content">
        <div className="app__canvas">
          <FlowCanvas
            nodes={nodesForCanvas}
            edges={edgesForCanvas}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onNodesChange={handleNodesChange}
            onPaneClick={handleClosePanel}
            isEditMode={mode === 'edit'}
            onConnect={handleConnect}
            onEdgeClick={mode === 'edit' ? handleEdgeDelete : undefined}
          />
        </div>
        {mode === 'view' && selectedStep && (
          <DetailPanel
            step={selectedStep}
            allSteps={resolved.steps}
            onClose={handleClosePanel}
          />
        )}
        {mode === 'edit' && selectedStep && (
          <EditorPanel
            step={selectedStep}
            onUpdateStep={editor.updateStep}
            onDeleteStep={handleDeleteStep}
            onClose={handleClosePanel}
          />
        )}
      </div>
      {showCreationDialog && (
        <NodeCreationDialog
          onConfirm={handleAddNode}
          onCancel={() => setShowCreationDialog(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
