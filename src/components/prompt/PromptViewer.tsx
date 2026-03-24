import type { PromptTemplate, StepDefinition } from '@/types/flow';
import { getPortColor } from '@/constants/colors';
import './PromptViewer.css';

interface Props {
  prompt: PromptTemplate;
  allSteps: StepDefinition[];
  onVariableClick?: (nodeId: string) => void;
}

interface Segment {
  type: 'text' | 'variable';
  content: string;
  source?: string;
  description?: string;
  color?: string;
}

function parseTemplate(
  template: string,
  prompt: PromptTemplate,
  allSteps: StepDefinition[],
): Segment[] {
  const regex = /\{\{(\w+)\}\}/g;
  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of template.matchAll(regex)) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: template.slice(lastIndex, match.index) });
    }
    const varName = match[1];
    const variable = prompt.variables.find((v) => v.name === varName);
    let color = '#94a3b8';
    if (variable) {
      const [nodeId, portId] = variable.source.split('.');
      const sourceStep = allSteps.find((s) => s.id === nodeId);
      const sourcePort = sourceStep?.outputs.find((p) => p.id === portId);
      if (sourcePort) {
        color = getPortColor(sourcePort.dataType);
      }
    }
    segments.push({
      type: 'variable',
      content: varName,
      source: variable?.source,
      description: variable?.description,
      color,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < template.length) {
    segments.push({ type: 'text', content: template.slice(lastIndex) });
  }

  return segments;
}

export function PromptViewer({ prompt, allSteps, onVariableClick }: Props) {
  const templateSegments = parseTemplate(prompt.template, prompt, allSteps);

  return (
    <div className="prompt-viewer">
      {prompt.systemPrompt && (
        <div className="prompt-viewer__section">
          <div className="prompt-viewer__label">System Prompt</div>
          <pre className="prompt-viewer__pre">{prompt.systemPrompt}</pre>
        </div>
      )}
      <div className="prompt-viewer__section">
        <div className="prompt-viewer__label">User Prompt Template</div>
        <pre className="prompt-viewer__pre prompt-viewer__template">
          {templateSegments.map((seg, i) =>
            seg.type === 'text' ? (
              <span key={i}>{seg.content}</span>
            ) : (
              <span
                key={i}
                className="prompt-viewer__variable"
                style={{
                  backgroundColor: `${seg.color}18`,
                  borderColor: seg.color,
                  color: seg.color,
                }}
                title={`Source: ${seg.source ?? 'unknown'}${seg.description ? '\n' + seg.description : ''}`}
                onClick={() => {
                  if (seg.source && onVariableClick) {
                    const nodeId = seg.source.split('.')[0];
                    onVariableClick(nodeId);
                  }
                }}
              >
                {'{{'}
                {seg.content}
                {'}}'}
              </span>
            ),
          )}
        </pre>
      </div>
    </div>
  );
}
