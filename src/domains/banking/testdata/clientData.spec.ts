import { test, expect } from '@playwright/test';
import {
  getClientsForEnvironment,
  resolveBankingCredentials,
  resolveClientConfig
} from './clientData';

test.describe('Banking client data resolution', () => {
  test('loads QA clients from the shared client matrix', () => {
    const clients = getClientsForEnvironment('qa');

    expect(clients.length).toBeGreaterThan(0);
    expect(clients[0].name).toBe('demo-bank');
    expect(clients[0].credentialRef).toBe('BANKING_DEMO_BANK');
  });

  test('resolves a client config by environment and name', () => {
    const client = resolveClientConfig('qa', 'demo-bank');

    expect(client.credentialRef).toBe('BANKING_DEMO_BANK');
  });

  test('resolves credentials when temporary environment variables are supplied', () => {
    const originalUsername = process.env.BANKING_DEMO_BANK_USERNAME;
    const originalPassword = process.env.BANKING_DEMO_BANK_PASSWORD;

    process.env.BANKING_DEMO_BANK_USERNAME = 'demo-user';
    process.env.BANKING_DEMO_BANK_PASSWORD = 'demo-pass';

    try {
      const profile = resolveClientConfig('qa', 'demo-bank');
      const credentials = resolveBankingCredentials(profile);

      expect(credentials.username).toBe('demo-user');
      expect(credentials.password).toBe('demo-pass');
    } finally {
      if (originalUsername === undefined) {
        delete process.env.BANKING_DEMO_BANK_USERNAME;
      } else {
        process.env.BANKING_DEMO_BANK_USERNAME = originalUsername;
      }

      if (originalPassword === undefined) {
        delete process.env.BANKING_DEMO_BANK_PASSWORD;
      } else {
        process.env.BANKING_DEMO_BANK_PASSWORD = originalPassword;
      }
    }
  });

  test('throws when no banking profiles exist for an environment', () => {
    expect(() => getClientsForEnvironment('unknown')).toThrow(
      'No banking client profiles found for environment: unknown'
    );
  });

  test('throws when a requested banking client is not found in the selected environment', () => {
    expect(() => resolveClientConfig('qa', 'missing-client')).toThrow(
      'No banking client profile named "missing-client" found for environment "qa"'
    );
  });

  test('throws when required banking credentials are missing', () => {
    const originalUsername =
      process.env.BANKING_REGRESSION_BANK_USERNAME;
    const originalPassword =
      process.env.BANKING_REGRESSION_BANK_PASSWORD;

    delete process.env.BANKING_REGRESSION_BANK_USERNAME;
    delete process.env.BANKING_REGRESSION_BANK_PASSWORD;

    try {
      const profile = resolveClientConfig(
        'regression',
        'regression-bank'
      );

      expect(() => resolveBankingCredentials(profile)).toThrow(
        'Missing required secret: BANKING_REGRESSION_BANK_USERNAME'
      );
    } finally {
      if (originalUsername === undefined) {
        delete process.env.BANKING_REGRESSION_BANK_USERNAME;
      } else {
        process.env.BANKING_REGRESSION_BANK_USERNAME =
          originalUsername;
      }

      if (originalPassword === undefined) {
        delete process.env.BANKING_REGRESSION_BANK_PASSWORD;
      } else {
        process.env.BANKING_REGRESSION_BANK_PASSWORD =
          originalPassword;
      }
    }
  });
});