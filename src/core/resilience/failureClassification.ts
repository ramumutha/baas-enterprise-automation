export class TransientFailureError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'TransientFailureError';
    this.cause = cause;
  }
}

export class PermanentFailureError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'PermanentFailureError';
    this.cause = cause;
  }
}

export function isRetryableFailure(error: unknown): boolean {
  return error instanceof TransientFailureError;
}