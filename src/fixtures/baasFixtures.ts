import { test as base } from '@playwright/test';
import { LoginPage } from '../domains/banking/pages/LoginPage';
import { TransferFundsPage } from '../domains/banking/pages/TransferFundsPage';
import { BaasAccountsClient } from '../domains/banking/api/BaasAccountsClient';
import { loadConfig, RuntimeConfig } from '../core/config/environment';
import { getCustomerProfile } from '../domains/banking/testdata/testData';
import { ClientConfig, getClientsForEnvironment, resolveClientConfig } from '../utils/clientData';

type BaasFixtures = {
  loginPage: LoginPage;
  transferPage: TransferFundsPage;
  accountsApi: BaasAccountsClient;
  runtimeConfig: RuntimeConfig;
  customerProfile: ReturnType<typeof getCustomerProfile>;
  clientConfig: ClientConfig | undefined;
  clientConfigs: ClientConfig[];
};

export const test = base.extend<BaasFixtures>({
  runtimeConfig: async ({}, use) => {
    await use(loadConfig(process.env.ENV));
  },
  customerProfile: async ({ runtimeConfig }, use) => {
    await use(getCustomerProfile(runtimeConfig.environment));
  },
  clientConfig: async ({ runtimeConfig }, use) => {
    const selectedClientName = process.env.CLIENT_NAME;
    const client = selectedClientName
      ? resolveClientConfig(runtimeConfig.environment, selectedClientName)
      : getClientsForEnvironment(runtimeConfig.environment)[0];

    await use(client);
  },
  clientConfigs: async ({ runtimeConfig }, use) => {
    await use(getClientsForEnvironment(runtimeConfig.environment));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },
  accountsApi: async ({ request, runtimeConfig }, use) => {
    await use(new BaasAccountsClient(request, runtimeConfig.apiBaseUrl));
  }
});

export { expect } from '@playwright/test';