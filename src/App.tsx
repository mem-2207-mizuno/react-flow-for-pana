import { useState, useMemo, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { loadFlowDefinition } from '@/data/loader';
import { resolveFlow } from '@/utils/variantResolver';
import { transformFlowToReactFlow } from '@/utils/flowTransform';
import { FlowCanvas } from '@/components/FlowCanvas';
import { FlowHeader } from '@/components/controls/FlowHeader';
import { PreconditionSelector } from '@/components/controls/PreconditionSelector';
import { DetailPanel } from '@/components/panels/DetailPanel';
import exampleFlowYaml from '@/data/example-flow.yaml?raw';
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

  const resolved = useMemo(
    () => resolveFlow(
      { steps: flowDef.steps, connections: flowDef.connections },
      flowDef.variants,
      selectedConditions,
    ),
    [selectedConditions],
  );

  const { nodes, edges } = useMemo(
    () => transformFlowToReactFlow(resolved.steps, resolved.connections, flowDef.layout),
    [resolved],
  );

  const selectedStep = useMemo(
    () => resolved.steps.find((s) => s.id === selectedNodeId) ?? null,
    [resolved.steps, selectedNodeId],
  );

  const handleConditionChange = useCallback((key: string, value: string) => {
    setSelectedConditions((prev) => ({ ...prev, [key]: value }));
    setSelectedNodeId(null);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
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
              edges={edges}
              onNodeClick={handleNodeClick}
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
