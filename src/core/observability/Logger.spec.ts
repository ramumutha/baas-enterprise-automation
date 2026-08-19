import { test, expect } from '@playwright/test';
import { Logger } from './Logger';

test.describe('Logger security', () => {
  test('redacts sensitive metadata before logging', () => {
    const originalLog = console.log;
    const calls: unknown[][] = [];

    console.log = (...args: unknown[]) => {
      calls.push(args);
    };

    try {
      Logger.info('TestComponent', 'Test message', {
        customerId: '12212',
        username: 'john',
        operation: 'test'
      });

      expect(calls).toHaveLength(1);

      const metadata = calls[0][1] as Record<string, unknown>;

      expect(metadata.customerId).toBe('[REDACTED]');
      expect(metadata.username).toBe('[REDACTED]');
      expect(metadata.operation).toBe('test');
    } finally {
      console.log = originalLog;
    }
  });
});