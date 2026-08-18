import fs from 'fs';
import path from 'path';

export type ClientConfig = {
  name: string;
  environment: string;
  customerId: string;
  username: string;
  password: string;
};

export function loadClients(): ClientConfig[] {
  const filePath = path.resolve(__dirname, '../domains/banking/testdata/clients.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  return parsed.clients as ClientConfig[];
}

export function getClientsForEnvironment(environment: string): ClientConfig[] {
  return loadClients().filter((client) => client.environment.toLowerCase() === environment.toLowerCase());
}

export function resolveClientConfig(environment: string, clientName: string): ClientConfig | undefined {
  return getClientsForEnvironment(environment).find((client) => client.name === clientName);
}
