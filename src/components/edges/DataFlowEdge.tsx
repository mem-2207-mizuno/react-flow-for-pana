import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import './DataFlowEdge.css';

interface DataFlowEdgeData extends Record<string, unknown> {
  label?: string;
  dataType?: string;
  color?: string;
  siblingIndex?: number;
  siblingCount?: number;
  highlighted?: boolean;
  dimmed?: boolean;
}

type Props = EdgeProps & { data?: DataFlowEdgeData };

export function DataFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
  markerEnd,
}: Props) {
  const siblingIndex = data?.siblingIndex ?? 0;
  const siblingCount = data?.siblingCount ?? 1;
  const highlighted = data?.highlighted ?? false;
  const dimmed = data?.dimmed ?? false;

  // Vary curvature for sibling edges so they visually separate
  const curvature =
    siblingCount > 1
      ? 0.15 + (siblingIndex / (siblingCount - 1)) * 0.4
      : 0.25;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature,
  });

  const color = data?.color ?? '#94a3b8';

  const computedOpacity = highlighted ? 1.0 : dimmed ? 0.08 : 0.5;
  const computedStrokeWidth = highlighted ? 3 : 2;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: color,
          strokeWidth: computedStrokeWidth,
          opacity: computedOpacity,
        }}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className={`data-flow-edge__label ${highlighted ? 'data-flow-edge__label--visible' : ''}`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              color,
              borderColor: color,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
