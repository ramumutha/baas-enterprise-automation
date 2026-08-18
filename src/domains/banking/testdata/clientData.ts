import fs from 'fs';
import path from 'path';
import { requireSecret } from '../../../core/security/secrets';

export type BankingClientProfile = {
  name: string;
  environment: string;
  customerId: string;
  credentialRef: string;
};

export type BankingCredentials = {
  username: string;
  password: string;
};

export type ClientConfig = BankingClientProfile;

export function loadClients(): BankingClientProfile[] {
  const filePath = path.resolve(__dirname, 'clients.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  return parsed.clients as BankingClientProfile[];
}

export function getClientsForEnvironment(environment: string): BankingClientProfile[] {
  const clients = loadClients().filter((client) => client.environment.toLowerCase() === environment.toLowerCase());

  if (clients.length === 0) {
    throw new Error(`No banking client profiles found for environment: ${environment}`);
  }

  return clients;
}

export function resolveClientConfig(environment: string, clientName: string): BankingClientProfile {
  const clients = getClientsForEnvironment(environment);
  const client = clients.find((profile) => profile.name === clientName);

  if (!client) {
    throw new Error(`No banking client profile named "${clientName}" found for environment "${environment}"`);
  }

  return client;
}

export function resolveBankingCredentials(profile: BankingClientProfile): BankingCredentials {
  const usernameKey = `${profile.credentialRef}_USERNAME`;
  const passwordKey = `${profile.credentialRef}_PASSWORD`;

  return {
    username: requireSecret(usernameKey),
    password: requireSecret(passwordKey)
  };
}
