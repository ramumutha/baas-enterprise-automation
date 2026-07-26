import { expect, Locator } from '@playwright/test';

export async function assertText(locator: Locator, expectedText: string) {
  await expect(locator).toContainText(expectedText);
}

export async function assertVisible(locator: Locator) {
  await expect(locator).toBeVisible();
}
