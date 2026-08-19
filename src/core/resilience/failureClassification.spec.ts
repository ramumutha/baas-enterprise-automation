import { expect, test } from '@playwright/test';
import {
  isRetryableFailure,
  PermanentFailureError,
  TransientFailureError
} from './failureClassification';

test('TransientFailureError is retryable', () => {
  expect(isRetryableFailure(new TransientFailureError('Technical interaction failed'))).toBe(true);
});

test('PermanentFailureError is not retryable', () => {
  expect(isRetryableFailure(new PermanentFailureError('Authentication state was not reached'))).toBe(false);
});

test('plain Error is not retryable', () => {
  expect(isRetryableFailure(new Error('unclassified failure'))).toBe(false);
});

test('unknown non-Error values are not retryable', () => {
  expect(isRetryableFailure('failure')).toBe(false);
  expect(isRetryableFailure({ failure: true })).toBe(false);
  expect(isRetryableFailure(null)).toBe(false);
});

test('TransientFailureError preserves its cause without including cause text in its message', () => {
  const cause = new Error('sensitive technical detail');
  const error = new TransientFailureError('Technical interaction failed', cause);

  expect(error.cause).toBe(cause);
  expect(error.message).toBe('Technical interaction failed');
  expect(error.message).not.toContain(cause.message);
});

test('PermanentFailureError preserves its cause without including cause text in its message', () => {
  const cause = new Error('sensitive authentication detail');
  const error = new PermanentFailureError('Login did not reach authenticated state', cause);

  expect(error.cause).toBe(cause);
  expect(error.message).toBe('Login did not reach authenticated state');
  expect(error.message).not.toContain(cause.message);
});