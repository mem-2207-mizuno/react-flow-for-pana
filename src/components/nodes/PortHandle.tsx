import { Handle, Position } from '@xyflow/react';
import type { PortDefinition } from '@/types/flow';
import { getPortColor } from '@/constants/colors';

interface Props {
  port: PortDefinition;
  type: 'source' | 'target';
  position: Position;
  isConnectable?: boolean;
}

export function PortHandle({ port, type, position, isConnectable = false }: Props) {
  const color = getPortColor(port.dataType);

  return (
    <div
      className={`port-row port-row--${type}`}
      title={`${port.label} (${port.dataType})${port.description ? '\n' + port.description : ''}${port.required ? '\n[required]' : ''}`}
    >
      <Handle
        type={type}
        position={position}
        id={port.id}
        className={`port-handle port-handle--${type}`}
        style={{
          background: color,
          width: 12,
          height: 12,
          border: `2px solid ${color}`,
        }}
        isConnectable={isConnectable}
      />
      <span className="port-row__name">{port.label}</span>
      <span className="port-row__type" style={{ color }}>
        {port.dataType}
      </span>
    </div>
  );
}
