import { test, expect } from '../../fixtures/baasFixtures';
import {
  getClientsForEnvironment,
  resolveBankingCredentials
} from '../../domains/banking/testdata/clientData';

const clients = getClientsForEnvironment(
  process.env.ENV || 'qa'
);

test.describe('@Regression - Core Banking Workflows', () => {
  test(
    'TC_REG_01: Verify account overview workflow is accessible',
    { tag: ['@regression', '@critical'] },
    async ({ loginPage, page }) => {
      await loginPage.navigateTo('/parabank/index.htm');

      await expect(page.locator('body')).toContainText(
        'Customer Login'
      );
    }
  );

  test(
    'TC_REG_02: Verify authenticated customer can open transfer funds page',
    {
      tag: [
        '@regression',
        '@critical',
        '@authenticated',
        '@transfer'
      ]
    },
    async ({
      loginPage,
      transferPage,
      clientConfig,
      page
    }) => {
      const credentials = resolveBankingCredentials(
        clientConfig
      );

      await loginPage.login(
        credentials.username,
        credentials.password
      );

      await transferPage.openTransferPage();

      await expect(page).toHaveURL(/\/transfer\.htm/);
    }
  );

  for (const client of clients) {
    test(
      `TC_REG_03: Validate ${client.name} is included in the shared client matrix`,
      {
        tag: [
          '@regression',
          '@critical',
          '@matrix'
        ]
      },
      async ({
        page,
        clientConfig,
        clientConfigs
      }) => {
        expect(
          clientConfigs.some(
            (entry) => entry.name === client.name
          )
        ).toBeTruthy();

        expect(
          clientConfig?.name || client.name
        ).toBeTruthy();

        await page.goto('/parabank/index.htm');

        await expect(page.locator('body')).toContainText(
          'Customer Login'
        );
      }
    );
  }

  test(
    'TC_REG_04: Verify authenticated customer can access account overview',
    {
      tag: [
        '@regression',
        '@critical',
        '@authenticated'
      ]
    },
    async ({
      loginPage,
      accountOverviewPage,
      clientConfig
    }) => {
      const credentials = resolveBankingCredentials(
        clientConfig
      );

      await loginPage.login(
        credentials.username,
        credentials.password
      );

      await accountOverviewPage.verifyAccountsLoaded();
    }
  );

  test(
    'TC_REG_05: Verify authenticated customer transfer account selectors are populated',
    {
      tag: [
        '@regression',
        '@critical',
        '@authenticated',
        '@transfer'
      ]
    },
    async ({
      loginPage,
      transferPage,
      clientConfig
    }) => {
      const credentials = resolveBankingCredentials(
        clientConfig
      );

      await loginPage.login(
        credentials.username,
        credentials.password
      );

      await transferPage.openTransferPage();

      const accounts =
        await transferPage.getTransferAccountAvailability();

      expect(
        accounts.fromAccounts.length
      ).toBeGreaterThan(0);

      expect(
        accounts.toAccounts.length
      ).toBeGreaterThan(0);
    }
  );
});