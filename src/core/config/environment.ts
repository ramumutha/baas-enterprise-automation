import * as dotenv from 'dotenv';
import path from 'path';

export type EnvironmentName = 'qa' | 'regression' | 'preprod' | 'prod';

export type RuntimeConfig = {
  environment: EnvironmentName;
  baseUrl: string;
  apiBaseUrl: string;
  logLevel: string;
};

const SUPPORTED_ENVIRONMENTS: EnvironmentName[] = [
  'qa',
  'regression',
  'preprod',
  'prod'
];

function requireConfigValue(
  key: string,
  value: string | undefined
): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required configuration value: ${key}`);
  }

  return value;
}

function resolveEnvironment(
  environmentOverride?: string
): EnvironmentName {
  const requestedEnvironment = (
    environmentOverride ||
    process.env.ENV ||
    'qa'
  ).toLowerCase();

  if (
    !SUPPORTED_ENVIRONMENTS.includes(
      requestedEnvironment as EnvironmentName
    )
  ) {
    throw new Error(
      `Unsupported environment: ${requestedEnvironment}. ` +
      `Supported environments: ${SUPPORTED_ENVIRONMENTS.join(', ')}`
    );
  }

  return requestedEnvironment as EnvironmentName;
}

export function loadConfig(
  environmentOverride?: string
): RuntimeConfig {
  const requestedEnvironment = resolveEnvironment(environmentOverride);

  const envFilePath = path.resolve(
    process.cwd(),
    `.env.${requestedEnvironment}`
  );

  dotenv.config({ path: envFilePath });
  dotenv.config();

  const baseUrl = requireConfigValue(
    'BASE_URL',
    process.env.BASE_URL
  );

  const apiBaseUrl = requireConfigValue(
    'API_BASE_URL',
    process.env.API_BASE_URL
  );

  const logLevel = process.env.LOG_LEVEL || 'info';

  return {
    environment: requestedEnvironment,
    baseUrl,
    apiBaseUrl,
    logLevel
  };
}