import { test, expect } from '../../fixtures/baasFixtures';

test.describe('@Smoke - Critical path', () => {
  test('TC_SMOKE_01: Verify landing page is reachable', { tag: ['@smoke', '@critical'] }, async ({ loginPage, page }) => {
    await loginPage.navigateTo('/parabank/index.htm');
    await expect(page.locator('body')).toContainText('Customer Login');
  });
});
