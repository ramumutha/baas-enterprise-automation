import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { BaasAccountsClient } from '../api/BaasAccountsClient';
import { loadConfig } from '../config/environment';
import { getCustomerProfile } from '../testdata/testData';
import { ClientConfig, getClientsForEnvironment, resolveClientConfig } from '../utils/clientData';

type BaasFixtures = {
  loginPage: LoginPage;
  transferPage: TransferFundsPage;
  accountsApi: BaasAccountsClient;
  runtimeConfig: ReturnType<typeof loadConfig>;
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
  accountsApi: async ({ request }, use) => {
    await use(new BaasAccountsClient(request));
  }
});

export { expect } from '@playwright/test';