import * as dotenv from 'dotenv';
import path from 'path';

export type EnvironmentName = 'qa' | 'regression' | 'preprod' | 'prod';

export type RuntimeConfig = {
  environment: EnvironmentName;
  environmentName: string;
  baseUrl: string;
  apiBaseUrl: string;
  dbHost: string;
  logLevel: string;
};

export function loadConfig(environmentOverride?: string): RuntimeConfig {
  const requestedEnvironment = (environmentOverride || process.env.ENV || 'qa').toLowerCase() as EnvironmentName;
  const envFilePath = path.resolve(process.cwd(), `.env.${requestedEnvironment}`);

  dotenv.config({ path: envFilePath });
  dotenv.config();

  return {
    environment: requestedEnvironment,
    environmentName: process.env.ENV_NAME || requestedEnvironment.toUpperCase(),
    baseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com',
    apiBaseUrl: process.env.API_BASE_URL || 'https://parabank.parasoft.com/parabank/services/bank',
    dbHost: process.env.DB_HOST || 'local-db.internal.bank.com',
    logLevel: process.env.LOG_LEVEL || 'info'
  };
}
