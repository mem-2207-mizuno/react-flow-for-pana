import { parse } from 'yaml';
import type { FlowDefinition } from '@/types/flow';

export function loadFlowDefinition(yamlString: string): FlowDefinition {
  const parsed = parse(yamlString) as FlowDefinition;

  // Ensure arrays are initialized
  parsed.preconditions ??= [];
  parsed.steps ??= [];
  parsed.connections ??= [];
  parsed.variants ??= [];

  return parsed;
}
