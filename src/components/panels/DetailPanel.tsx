import type { StepDefinition } from '@/types/flow';
import { CATEGORY_STYLES, getPortColor } from '@/constants/colors';
import { PromptViewer } from '@/components/prompt/PromptViewer';
import './DetailPanel.css';

interface Props {
  step: StepDefinition;
  allSteps: StepDefinition[];
  onClose: () => void;
}

export function DetailPanel({ step, allSteps, onClose }: Props) {
  const styles = CATEGORY_STYLES[step.category];

  return (
    <aside className="detail-panel">
      <div className="detail-panel__header">
        <div>
          <span
            className="detail-panel__category"
            style={{ color: styles.headerBg }}
          >
            {step.category.toUpperCase()}
          </span>
          <h2 className="detail-panel__title">{step.name}</h2>
        </div>
        <button className="detail-panel__close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="detail-panel__body">
        {/* Description */}
        <section className="detail-panel__section">
          <h3 className="detail-panel__section-title">Description</h3>
          <p className="detail-panel__text">{step.description}</p>
        </section>

        {/* Inputs */}
        {step.inputs.length > 0 && (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">Inputs</h3>
            <div className="detail-panel__ports">
              {step.inputs.map((port) => (
                <div key={port.id} className="detail-panel__port">
                  <div className="detail-panel__port-header">
                    <span
                      className="detail-panel__port-dot"
                      style={{ backgroundColor: getPortColor(port.dataType) }}
                    />
                    <span className="detail-panel__port-name">{port.label}</span>
                    <span
                      className="detail-panel__port-type"
                      style={{ color: getPortColor(port.dataType) }}
                    >
                      {port.dataType}
                    </span>
                    {port.required && (
                      <span className="detail-panel__port-required">required</span>
                    )}
                  </div>
                  <p className="detail-panel__port-desc">{port.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Outputs */}
        {step.outputs.length > 0 && (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">Outputs</h3>
            <div className="detail-panel__ports">
              {step.outputs.map((port) => (
                <div key={port.id} className="detail-panel__port">
                  <div className="detail-panel__port-header">
                    <span
                      className="detail-panel__port-dot"
                      style={{ backgroundColor: getPortColor(port.dataType) }}
                    />
                    <span className="detail-panel__port-name">{port.label}</span>
                    <span
                      className="detail-panel__port-type"
                      style={{ color: getPortColor(port.dataType) }}
                    >
                      {port.dataType}
                    </span>
                  </div>
                  <p className="detail-panel__port-desc">{port.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Prompt */}
        {step.prompt && (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">Prompt</h3>
            <PromptViewer prompt={step.prompt} allSteps={allSteps} />
          </section>
        )}

        {/* Metadata */}
        {step.metadata && Object.keys(step.metadata).length > 0 && (
          <section className="detail-panel__section">
            <h3 className="detail-panel__section-title">Metadata</h3>
            <table className="detail-panel__metadata">
              <tbody>
                {Object.entries(step.metadata).map(([key, value]) => (
                  <tr key={key}>
                    <td className="detail-panel__meta-key">{key}</td>
                    <td className="detail-panel__meta-value">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </aside>
  );
}
