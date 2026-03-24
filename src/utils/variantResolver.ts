import type {
  StepDefinition,
  ConnectionDefinition,
  FlowVariant,
} from '@/types/flow';

interface ResolvedFlow {
  steps: StepDefinition[];
  connections: ConnectionDefinition[];
}

export function resolveFlow(
  base: ResolvedFlow,
  variants: FlowVariant[],
  selectedConditions: Record<string, string>,
): ResolvedFlow {
  // Find the matching variant
  const activeVariant = variants.find((v) =>
    Object.entries(v.conditions).every(
      ([key, value]) => selectedConditions[key] === value,
    ),
  );

  if (!activeVariant) {
    return base;
  }

  let steps = [...base.steps];
  let connections = [...base.connections];

  // Remove steps
  if (activeVariant.removeStepIds) {
    const removeSet = new Set(activeVariant.removeStepIds);
    steps = steps.filter((s) => !removeSet.has(s.id));
  }

  // Remove connections
  if (activeVariant.removeConnectionIds) {
    const removeSet = new Set(activeVariant.removeConnectionIds);
    connections = connections.filter((c) => !removeSet.has(c.id));
  }

  // Override steps (merge partial updates)
  if (activeVariant.overrideSteps) {
    for (const override of activeVariant.overrideSteps) {
      const index = steps.findIndex((s) => s.id === override.id);
      if (index !== -1) {
        steps[index] = { ...steps[index], ...override };
      }
    }
  }

  // Override connections
  if (activeVariant.overrideConnections) {
    for (const override of activeVariant.overrideConnections) {
      const index = connections.findIndex((c) => c.id === override.id);
      if (index !== -1) {
        connections[index] = override;
      } else {
        connections.push(override);
      }
    }
  }

  // Add new steps and connections
  if (activeVariant.addSteps) {
    steps = [...steps, ...activeVariant.addSteps];
  }
  if (activeVariant.addConnections) {
    connections = [...connections, ...activeVariant.addConnections];
  }

  return { steps, connections };
}
