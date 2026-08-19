import { expect, test } from '@playwright/test';
import { retry, RetryExhaustedError } from './retry';

test('returns on the first successful attempt', async () => {
  let operationCalls = 0;

  const result = await retry(() => {
    operationCalls += 1;
    return 'success';
  }, { delayMs: 0 });

  expect(result).toBe('success');
  expect(operationCalls).toBe(1);
});

test('retries a transient thrown error and eventually succeeds', async () => {
  let operationCalls = 0;

  const result = await retry(() => {
    operationCalls += 1;
    if (operationCalls < 3) {
      throw new Error('transient failure');
    }
    return 'success';
  }, { attempts: 3, delayMs: 0 });

  expect(result).toBe('success');
  expect(operationCalls).toBe(3);
});

test('stops immediately when shouldRetry returns false', async () => {
  const originalError = new Error('non-retryable failure');
  let operationCalls = 0;

  await expect(retry(() => {
    operationCalls += 1;
    throw originalError;
  }, {
    attempts: 3,
    delayMs: 0,
    shouldRetry: () => false
  })).rejects.toBe(originalError);

  expect(operationCalls).toBe(1);
});

test('awaits asynchronous onRetry before the next attempt', async () => {
  const events: string[] = [];
  let operationCalls = 0;

  const result = await retry(async () => {
    operationCalls += 1;
    events.push(`operation-${operationCalls}`);
    if (operationCalls === 1) {
      throw new Error('transient failure');
    }
    return 'success';
  }, {
    attempts: 2,
    delayMs: 0,
    onRetry: async () => {
      await Promise.resolve();
      events.push('retry-complete');
    }
  });

  expect(result).toBe('success');
  expect(events).toEqual(['operation-1', 'retry-complete', 'operation-2']);
});

test('invokes onRetry only between attempts', async () => {
  let retryCalls = 0;
  let operationCalls = 0;

  await expect(
    retry(
      () => {
        operationCalls += 1;
        throw new Error('persistent failure');
      },
      {
        attempts: 2,
        delayMs: 0,
        onRetry: () => {
          retryCalls += 1;
        }
      }
    )
  ).rejects.toBeInstanceOf(RetryExhaustedError);

  expect(operationCalls).toBe(2);
  expect(retryCalls).toBe(1);
});

test('throws RetryExhaustedError after exhaustion with the final error and attempt count', async () => {
  const finalError = new Error('final failure');
  let operationCalls = 0;

  await expect(retry(() => {
    operationCalls += 1;
    throw operationCalls === 2 ? finalError : new Error('first failure');
  }, {
    attempts: 2,
    delayMs: 0
  })).rejects.toMatchObject({
    name: 'RetryExhaustedError',
    attempts: 2,
    cause: finalError,
    message: 'Operation failed after 2 attempts'
  });
});

test('attempts of one performs exactly one operation', async () => {
  let operationCalls = 0;

  await expect(retry(() => {
    operationCalls += 1;
    throw new Error('failure');
  }, {
    attempts: 1,
    delayMs: 0
  })).rejects.toBeInstanceOf(RetryExhaustedError);

  expect(operationCalls).toBe(1);
});

test('invalid attempts fail before operation execution', async () => {
  let operationCalls = 0;

  await expect(retry(() => {
    operationCalls += 1;
    return 'success';
  }, {
    attempts: 0,
    delayMs: 0
  })).rejects.toThrow('Retry configuration error: attempts must be an integer greater than or equal to 1.');

  expect(operationCalls).toBe(0);
});

test('negative delay fails before operation execution', async () => {
  let operationCalls = 0;

  await expect(retry(() => {
    operationCalls += 1;
    return 'success';
  }, {
    delayMs: -1
  })).rejects.toThrow('Retry configuration error: delayMs must be greater than or equal to 0.');

  expect(operationCalls).toBe(0);
});