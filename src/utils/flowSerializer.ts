import { loadFlowDefinition } from '@/data/loader';
import type { FlowDefinition } from '@/types/flow';

export function exportFlowAsJson(flow: FlowDefinition): void {
  const json = JSON.stringify(flow, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${flow.meta.id || 'flow'}-${flow.meta.version || 'draft'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFlowFromJson(file: File): Promise<FlowDefinition> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target!.result as string) as FlowDefinition;
        if (!parsed.meta || !parsed.steps) {
          throw new Error('Invalid flow definition: missing meta or steps');
        }
        parsed.preconditions ??= [];
        parsed.steps ??= [];
        parsed.connections ??= [];
        parsed.variants ??= [];
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function importFlowFromYaml(file: File): Promise<FlowDefinition> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flow = loadFlowDefinition(e.target!.result as string);
        resolve(flow);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
