export interface RetryOptions {
  attempts?: number;
  delayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (attempt: number, error: unknown) => void | Promise<void>;
}

export class RetryExhaustedError extends Error {
  readonly attempts: number;
  readonly cause: unknown;

  constructor(attempts: number, cause: unknown) {
    super(`Operation failed after ${attempts} attempts`);
    this.name = 'RetryExhaustedError';
    this.attempts = attempts;
    this.cause = cause;
  }
}

function validateOptions(options: RetryOptions): Required<Pick<RetryOptions, 'attempts' | 'delayMs'>> {
  const attempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 1000;

  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error('Retry configuration error: attempts must be an integer greater than or equal to 1.');
  }

  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error('Retry configuration error: delayMs must be greater than or equal to 0.');
  }

  return { attempts, delayMs };
}

function delay(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function retry<T>(operation: () => Promise<T> | T, options: RetryOptions = {}): Promise<T> {
  const { attempts, delayMs } = validateOptions(options);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (options.shouldRetry && !options.shouldRetry(error, attempt)) {
        throw error;
      }

      if (attempt === attempts) {
        throw new RetryExhaustedError(attempts, error);
      }

      await options.onRetry?.(attempt, error);
      await delay(delayMs);
    }
  }

  throw new Error('Retry operation ended unexpectedly.');
}