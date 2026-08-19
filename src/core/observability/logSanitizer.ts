const REDACTED_VALUE = '[REDACTED]';

const SENSITIVE_KEYS = new Set([
  'password',
  'pass',
  'username',
  'customerid',
  'accountid',
  'fromaccountid',
  'token',
  'authorization',
  'secret',
  'credential',
  'apikey',
  'clientsecret'
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (isPlainObject(value)) {
    return sanitizeMetadata(value);
  }

  return value;
}

export function sanitizeMetadata<T>(metadata: T): T {
  if (Array.isArray(metadata)) {
    return metadata.map((item) => sanitizeValue(item)) as T;
  }

  if (!isPlainObject(metadata)) {
    return metadata;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = REDACTED_VALUE;
      continue;
    }

    sanitized[key] = sanitizeValue(value);
  }

  return sanitized as T;
}

export { REDACTED_VALUE };
