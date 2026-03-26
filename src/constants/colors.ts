import type { NodeCategory, PortDataType } from '@/types/flow';

export const CATEGORY_STYLES: Record<NodeCategory, { bg: string; border: string; headerBg: string; text: string }> = {
  input:     { bg: '#f0f7ff', border: '#3b82f6', headerBg: '#3b82f6', text: '#ffffff' },
  llm:       { bg: '#fef2f2', border: '#ef4444', headerBg: '#ef4444', text: '#ffffff' },
  transform: { bg: '#f0fdf4', border: '#22c55e', headerBg: '#22c55e', text: '#ffffff' },
  condition: { bg: '#fffbeb', border: '#f59e0b', headerBg: '#f59e0b', text: '#ffffff' },
  output:    { bg: '#faf5ff', border: '#a855f7', headerBg: '#a855f7', text: '#ffffff' },
  tool:      { bg: '#f0fdfa', border: '#14b8a6', headerBg: '#14b8a6', text: '#ffffff' },
  retrieval: { bg: '#eef2ff', border: '#6366f1', headerBg: '#6366f1', text: '#ffffff' },
};

export const PORT_COLORS: Record<PortDataType, string> = {
  string:         '#3b82f6',
  number:         '#22c55e',
  boolean:        '#f59e0b',
  json:           '#a855f7',
  html:           '#ec4899',
  image:          '#ef4444',
  embedding:      '#06b6d4',
  prompt:         '#f97316',
  'message-list': '#84cc16',
  'tool-result':  '#78716c',
};

export function getPortColor(dataType: PortDataType): string {
  return PORT_COLORS[dataType] ?? '#94a3b8';
}
