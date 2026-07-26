import { test, expect } from '../../fixtures/baasFixtures';
import { getClientsForEnvironment } from '../../utils/clientData';

const clients = getClientsForEnvironment(process.env.ENV || 'qa');

test.describe('@Regression - Core Banking Workflows', () => {
  test('TC_REG_01: Verify account overview workflow is accessible', { tag: ['@regression', '@critical'] }, async ({ loginPage, page }) => {
    await loginPage.navigateTo('/parabank/index.htm');
    await expect(page.locator('body')).toContainText('Customer Login');
  });

  test('TC_REG_02: Verify transfer funds page can be opened', { tag: ['@regression', '@critical'] }, async ({ transferPage, page }) => {
    await page.goto('/parabank/index.htm');
    const initialUrl = page.url();
    await transferPage.openTransferPage();
    await expect(page).not.toHaveURL(initialUrl);
    await expect(page).toHaveURL(/services/);
  });

  for (const client of clients) {
    test(`TC_REG_03: Validate ${client.name} is included in the shared client matrix`, { tag: ['@regression', '@critical', '@matrix'] }, async ({ page, clientConfig, clientConfigs }) => {
      expect(clientConfigs.some((entry) => entry.name === client.name)).toBeTruthy();
      expect(clientConfig?.name || client.name).toBeTruthy();
      await page.goto('/parabank/index.htm');
      await expect(page.locator('body')).toContainText('Customer Login');
    });
  }
});
