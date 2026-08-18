import { test, expect } from '@playwright/test';
import { requireSecret } from './secrets';

test.describe('Core secret resolution', () => {
  test('returns an existing environment secret', () => {
    const originalSecret = process.env.TEST_SECRET_SAMPLE;

    try {
      process.env.TEST_SECRET_SAMPLE = 'secret-value';

      expect(requireSecret('TEST_SECRET_SAMPLE')).toBe('secret-value');
    } finally {
      if (originalSecret === undefined) {
        delete process.env.TEST_SECRET_SAMPLE;
      } else {
        process.env.TEST_SECRET_SAMPLE = originalSecret;
      }
    }
  });

  test('fails fast when the secret is missing', () => {
    const originalSecret = process.env.TEST_SECRET_SAMPLE;

    try {
      delete process.env.TEST_SECRET_SAMPLE;

      expect(() => requireSecret('TEST_SECRET_SAMPLE')).toThrow(
        'Missing required secret: TEST_SECRET_SAMPLE'
      );
    } finally {
      if (originalSecret === undefined) {
        delete process.env.TEST_SECRET_SAMPLE;
      } else {
        process.env.TEST_SECRET_SAMPLE = originalSecret;
      }
    }
  });

  test('fails fast when the secret is blank', () => {
    const originalSecret = process.env.TEST_SECRET_SAMPLE;

    try {
      process.env.TEST_SECRET_SAMPLE = '   ';

      expect(() => requireSecret('TEST_SECRET_SAMPLE')).toThrow(
        'Missing required secret: TEST_SECRET_SAMPLE'
      );
    } finally {
      if (originalSecret === undefined) {
        delete process.env.TEST_SECRET_SAMPLE;
      } else {
        process.env.TEST_SECRET_SAMPLE = originalSecret;
      }
    }
  });
});