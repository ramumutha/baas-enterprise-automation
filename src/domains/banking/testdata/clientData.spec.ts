import { test, expect } from '@playwright/test';
import { getClientsForEnvironment, resolveClientConfig } from './clientData';

test('loads QA clients from the shared client matrix', () => {
  const clients = getClientsForEnvironment('qa');

  expect(clients.length).toBeGreaterThan(0);
  expect(clients[0].name).toBe('demo-bank');
});

test('resolves a client config by environment and name', () => {
  const client = resolveClientConfig('qa', 'demo-bank');

  expect(client.username).toBe('john');
  expect(client.password).toBe('demo');
});

test('throws when no banking profiles exist for an environment', () => {
  expect(() => getClientsForEnvironment('unknown')).toThrow('No banking client profiles found for environment: unknown');
});

test('throws when a requested banking client is not found in the selected environment', () => {
  expect(() => resolveClientConfig('qa', 'missing-client')).toThrow('No banking client profile named "missing-client" found for environment "qa"');
});
