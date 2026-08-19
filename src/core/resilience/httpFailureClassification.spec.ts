import { expect, test } from '@playwright/test';
import {
  classifyHttpStatus,
  classifyTransportFailure,
  isTransientHttpStatus
} from './httpFailureClassification';
import {
  PermanentFailureError,
  TransientFailureError
} from './failureClassification';

test('recognizes approved transient HTTP status codes', () => {
  for (const status of [408, 429, 500, 502, 503, 504]) {
    expect(isTransientHttpStatus(status)).toBe(true);
  }
});

test('does not classify ordinary client errors as transient', () => {
  for (const status of [400, 401, 403, 404, 409, 422]) {
    expect(isTransientHttpStatus(status)).toBe(false);
  }
});

test('does not classify unapproved server errors as transient', () => {
  expect(isTransientHttpStatus(501)).toBe(false);
  expect(isTransientHttpStatus(505)).toBe(false);
});

test('accepts successful 2xx HTTP responses', () => {
  expect(() => classifyHttpStatus(200, 'fetchAccounts')).not.toThrow();
  expect(() => classifyHttpStatus(201, 'createAccount')).not.toThrow();
  expect(() => classifyHttpStatus(204, 'deleteAccount')).not.toThrow();
});

test('classifies approved transient HTTP failures as transient', () => {
  expect(() => classifyHttpStatus(503, 'fetchAccounts'))
    .toThrow(TransientFailureError);
});

test('classifies non-retryable HTTP failures as permanent', () => {
  expect(() => classifyHttpStatus(401, 'fetchAccounts'))
    .toThrow(PermanentFailureError);

  expect(() => classifyHttpStatus(404, 'fetchAccounts'))
    .toThrow(PermanentFailureError);
});

test('classifies transport failures as transient and preserves cause', () => {
  const cause = new Error('socket failure');
  const error = classifyTransportFailure('fetchAccounts', cause);

  expect(error).toBeInstanceOf(TransientFailureError);
  expect(error.cause).toBe(cause);
  expect(error.message).not.toContain(cause.message);
});
