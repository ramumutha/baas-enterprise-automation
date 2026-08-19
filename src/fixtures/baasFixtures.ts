import { test as base } from '@playwright/test';
import { LoginPage } from '../domains/banking/pages/LoginPage';
import { AccountOverviewPage } from '../domains/banking/pages/AccountOverviewPage';
import { TransferFundsPage } from '../domains/banking/pages/TransferFundsPage';
import { BaasAccountsClient } from '../domains/banking/api/BaasAccountsClient';
import { loadConfig, RuntimeConfig } from '../core/config/environment';
import {
  BankingClientProfile,
  getClientsForEnvironment,
  resolveClientConfig
} from '../domains/banking/testdata/clientData';

type BaasFixtures = {
  loginPage: LoginPage;
  accountOverviewPage: AccountOverviewPage;
  transferPage: TransferFundsPage;
  accountsApi: BaasAccountsClient;
  runtimeConfig: RuntimeConfig;
  clientConfig: BankingClientProfile;
  clientConfigs: BankingClientProfile[];
};

export const test = base.extend<BaasFixtures>({
  runtimeConfig: async ({}, use) => {
    await use(loadConfig(process.env.ENV));
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

  accountOverviewPage: async ({ page }, use) => {
    await use(new AccountOverviewPage(page));
  },

  transferPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },

  accountsApi: async ({ request, runtimeConfig }, use) => {
    await use(new BaasAccountsClient(request, runtimeConfig.apiBaseUrl));
  }
});

export { expect } from '@playwright/test';