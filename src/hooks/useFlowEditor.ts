import { useState, useCallback } from 'react';
import type {
  FlowDefinition,
  StepDefinition,
  ConnectionDefinition,
} from '@/types/flow';
import { generateId } from '@/utils/idGenerator';

export function useFlowEditor(initialFlow: FlowDefinition) {
  const [flow, setFlow] = useState<FlowDefinition>(initialFlow);
  const [isDirty, setIsDirty] = useState(false);

  const updateStep = useCallback(
    (id: string, updates: Partial<StepDefinition>) => {
      setFlow((prev) => ({
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === id ? { ...s, ...updates } : s,
        ),
      }));
      setIsDirty(true);
    },
    [],
  );

  const addStep = useCallback((step: StepDefinition) => {
    setFlow((prev) => ({
      ...prev,
      steps: [...prev.steps, step],
    }));
    setIsDirty(true);
  }, []);

  const deleteStep = useCallback((id: string) => {
    setFlow((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id),
      // Cascade-delete connections referencing this step
      connections: prev.connections.filter(
        (c) => c.sourceNodeId !== id && c.targetNodeId !== id,
      ),
    }));
    setIsDirty(true);
  }, []);

  const addConnection = useCallback(
    (conn: Omit<ConnectionDefinition, 'id'>) => {
      const newConn: ConnectionDefinition = {
        ...conn,
        id: generateId('conn'),
      };
      setFlow((prev) => ({
        ...prev,
        connections: [...prev.connections, newConn],
      }));
      setIsDirty(true);
    },
    [],
  );

  const deleteConnection = useCallback((id: string) => {
    setFlow((prev) => ({
      ...prev,
      connections: prev.connections.filter((c) => c.id !== id),
    }));
    setIsDirty(true);
  }, []);

  const updateMeta = useCallback(
    (updates: Partial<FlowDefinition['meta']>) => {
      setFlow((prev) => ({
        ...prev,
        meta: { ...prev.meta, ...updates },
      }));
      setIsDirty(true);
    },
    [],
  );

  const importFlow = useCallback((newFlow: FlowDefinition) => {
    setFlow(newFlow);
    setIsDirty(false);
  }, []);

  const createNewFlow = useCallback(() => {
    const emptyFlow: FlowDefinition = {
      meta: {
        id: generateId('flow'),
        title: 'New Flow',
        description: '',
        version: '0.1.0',
      },
      preconditions: [],
      steps: [],
      connections: [],
      variants: [],
    };
    setFlow(emptyFlow);
    setIsDirty(false);
  }, []);

  const resetDirty = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    flow,
    isDirty,
    updateStep,
    addStep,
    deleteStep,
    addConnection,
    deleteConnection,
    updateMeta,
    importFlow,
    createNewFlow,
    resetDirty,
  };
}
