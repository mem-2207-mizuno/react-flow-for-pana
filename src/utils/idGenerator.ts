let counter = 0;

export function generateId(prefix: string = 'item'): string {
  counter++;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}
