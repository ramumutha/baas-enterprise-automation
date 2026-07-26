export const TAGS = {
  smoke: '@smoke',
  regression: '@regression',
  ui: '@ui',
  api: '@api',
  critical: '@critical'
} as const;

export function getTagExpression(tags: string[]) {
  return tags.join(' or ');
}
