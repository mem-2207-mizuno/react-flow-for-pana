import type { NodeCategory } from '@/types/flow';

const CATEGORY_ICONS: Record<NodeCategory, string> = {
  input:     '\u2B95',
  llm:       '\u2728',
  transform: '\u2699\uFE0F',
  condition:  '\u2753',
  output:    '\uD83D\uDCE4',
  tool:      '\uD83D\uDD27',
  retrieval: '\uD83D\uDD0D',
};

const CATEGORY_LABELS: Record<NodeCategory, string> = {
  input:     'Input',
  llm:       'LLM',
  transform: 'Transform',
  condition: 'Condition',
  output:    'Output',
  tool:      'Tool',
  retrieval: 'Retrieval',
};

interface Props {
  category: NodeCategory;
}

export function NodeCategoryIcon({ category }: Props) {
  return (
    <span className="node-category-icon" title={CATEGORY_LABELS[category]}>
      {CATEGORY_ICONS[category]}
    </span>
  );
}
