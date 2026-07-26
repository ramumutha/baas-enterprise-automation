export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sanitizeValue(value: string | undefined) {
  return (value || '').trim();
}
