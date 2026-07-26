import { test, expect } from '@playwright/test';
import { getClientsForEnvironment, resolveClientConfig } from './clientData';

test('loads QA clients from the shared client matrix', () => {
  const clients = getClientsForEnvironment('qa');

  expect(clients.length).toBeGreaterThan(0);
  expect(clients[0].name).toBe('demo-bank');
});

test('resolves a client config by environment and name', () => {
  const client = resolveClientConfig('qa', 'demo-bank');

  expect(client?.username).toBe('john');
  expect(client?.password).toBe('demo');
});
