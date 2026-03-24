/** Supported data types for ports - used for color coding */
export type PortDataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'json'
  | 'image'
  | 'embedding'
  | 'prompt'
  | 'message-list'
  | 'tool-result';

/** A single input or output port on a node */
export interface PortDefinition {
  id: string;
  label: string;
  dataType: PortDataType;
  description: string;
  required?: boolean;
}

/** A variable reference inside a prompt template */
export interface PromptVariable {
  name: string;
  /** Source reference: "nodeId.portId" */
  source: string;
  description?: string;
}

/** A prompt template with variable references */
export interface PromptTemplate {
  template: string;
  variables: PromptVariable[];
  systemPrompt?: string;
}

/** Node categories for visual differentiation */
export type NodeCategory =
  | 'input'
  | 'llm'
  | 'transform'
  | 'condition'
  | 'output'
  | 'tool'
  | 'retrieval';

/** Definition of a single step/node in the flow */
export interface StepDefinition {
  id: string;
  name: string;
  category: NodeCategory;
  summary: string;
  description: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  prompt?: PromptTemplate;
  metadata?: Record<string, string | number | boolean>;
}

/** A connection (edge) between two ports */
export interface ConnectionDefinition {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  label?: string;
}

/** A precondition option */
export interface PreconditionValue {
  label: string;
  description?: string;
}

/** A precondition axis (e.g., "user_type" with options "free" | "premium") */
export interface PreconditionAxis {
  key: string;
  label: string;
  options: PreconditionValue[];
}

/** Override for a specific precondition combination */
export interface FlowVariant {
  id: string;
  name: string;
  conditions: Record<string, string>;
  addSteps?: StepDefinition[];
  removeStepIds?: string[];
  overrideSteps?: (Partial<StepDefinition> & { id: string })[];
  addConnections?: ConnectionDefinition[];
  removeConnectionIds?: string[];
  overrideConnections?: ConnectionDefinition[];
}

/** Layout hint for a node */
export interface LayoutPosition {
  nodeId: string;
  x: number;
  y: number;
}

/** Data shape for React Flow custom node */
export interface StepNodeData extends Record<string, unknown> {
  step: StepDefinition;
}

/** Complete flow definition - the root of a YAML file */
export interface FlowDefinition {
  meta: {
    id: string;
    title: string;
    description: string;
    version: string;
  };
  preconditions: PreconditionAxis[];
  steps: StepDefinition[];
  connections: ConnectionDefinition[];
  variants: FlowVariant[];
  layout?: LayoutPosition[];
}
