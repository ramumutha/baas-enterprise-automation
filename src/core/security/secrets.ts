export function requireSecret(key: string): string {
  const value = process.env[key];

  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required secret: ${key}`);
  }

  return value;
}
