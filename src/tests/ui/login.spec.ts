import { test, expect } from '../../fixtures/baasFixtures';

test.describe('@UI - Login Journey', () => {
  test('TC_UI_01: Verify customer login page is reachable', { tag: ['@ui', '@smoke'] }, async ({ loginPage, page }) => {
    await loginPage.navigateTo('/parabank/index.htm');
    await expect(page.locator('body')).toContainText('Customer Login');
    await expect(page.locator('body')).toContainText('Username');
    await expect(page.locator('body')).toContainText('Password');
  });
});
