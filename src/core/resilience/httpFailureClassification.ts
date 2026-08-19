import {
  PermanentFailureError,
  TransientFailureError
} from './failureClassification';

const TRANSIENT_HTTP_STATUS_CODES = new Set([
  408,
  429,
  500,
  502,
  503,
  504
]);

export function isTransientHttpStatus(status: number): boolean {
  return TRANSIENT_HTTP_STATUS_CODES.has(status);
}

export function classifyHttpStatus(
  status: number,
  operation: string
): void {
  if (status >= 200 && status < 300) {
    return;
  }

  if (isTransientHttpStatus(status)) {
    throw new TransientFailureError(
      `${operation} failed with transient HTTP status ${status}`
    );
  }

  throw new PermanentFailureError(
    `${operation} failed with non-retryable HTTP status ${status}`
  );
}

export function classifyTransportFailure(
  operation: string,
  error: unknown
): TransientFailureError {
  return new TransientFailureError(
    `${operation} failed due to a transport-level error`,
    error
  );
}
