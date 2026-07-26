import { test, expect } from '../../fixtures/baasFixtures';

test.describe('@UI - BaaS Customer Portal Workflows', () => {
  test('TC01: Verify the login page is available for customer authentication', { tag: ['@ui', '@smoke'] }, async ({ loginPage, page }) => {
    await loginPage.navigateTo('/parabank/index.htm');
    await expect(page.locator('body')).toContainText('Customer Login');
    await expect(page.locator('body')).toContainText('Username');
    await expect(page.locator('body')).toContainText('Password');
  });
});