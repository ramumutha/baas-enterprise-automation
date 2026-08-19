import { test, expect } from '@playwright/test';
import { REDACTED_VALUE, sanitizeMetadata } from './logSanitizer';

test('non-sensitive metadata remains unchanged', () => {
  const metadata = { operation: 'fetchCustomerAccounts', retries: 2, active: true };

  const sanitized = sanitizeMetadata(metadata);

  expect(sanitized).toEqual(metadata);
});

test('password is redacted', () => {
  const sanitized = sanitizeMetadata({ password: 'super-secret' });
  expect(sanitized).toEqual({ password: REDACTED_VALUE });
});

test('username is redacted', () => {
  const sanitized = sanitizeMetadata({ username: 'user-1' });
  expect(sanitized).toEqual({ username: REDACTED_VALUE });
});

test('customerId is redacted', () => {
  const sanitized = sanitizeMetadata({ customerId: 'cust-123' });
  expect(sanitized).toEqual({ customerId: REDACTED_VALUE });
});

test('accountId and fromAccountId are redacted', () => {
  const sanitized = sanitizeMetadata({ accountId: 'acc-1', fromAccountId: 'acc-2' });
  expect(sanitized).toEqual({ accountId: REDACTED_VALUE, fromAccountId: REDACTED_VALUE });
});

test('token and authorization are redacted', () => {
  const sanitized = sanitizeMetadata({ token: 'abc', authorization: 'Bearer abc' });
  expect(sanitized).toEqual({ token: REDACTED_VALUE, authorization: REDACTED_VALUE });
});

test('nested object fields are redacted', () => {
  const sanitized = sanitizeMetadata({
    request: {
      credentials: {
        password: 'pw-1',
        clientSecret: 'secret-1'
      },
      payload: {
        accountId: 'acc-4'
      }
    }
  });

  expect(sanitized).toEqual({
    request: {
      credentials: {
        password: REDACTED_VALUE,
        clientSecret: REDACTED_VALUE
      },
      payload: {
        accountId: REDACTED_VALUE
      }
    }
  });
});

test('array-contained objects are redacted', () => {
  const sanitized = sanitizeMetadata({
    items: [
      { customerId: 'cust-1' },
      { fromAccountId: 'acc-3' },
      { note: 'safe' }
    ]
  });

  expect(sanitized).toEqual({
    items: [
      { customerId: REDACTED_VALUE },
      { fromAccountId: REDACTED_VALUE },
      { note: 'safe' }
    ]
  });
});

test('source object is not mutated', () => {
  const source = {
    customerId: 'cust-99',
    nested: {
      password: 'pw-99'
    },
    entries: [
      { accountId: 'acc-99' }
    ]
  };

  const snapshot = JSON.parse(JSON.stringify(source));
  const sanitized = sanitizeMetadata(source);

  expect(source).toEqual(snapshot);
  expect(sanitized).toEqual({
    customerId: REDACTED_VALUE,
    nested: {
      password: REDACTED_VALUE
    },
    entries: [
      { accountId: REDACTED_VALUE }
    ]
  });
});
