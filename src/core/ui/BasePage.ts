import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../observability/Logger';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string) {
    Logger.info('BasePage', `Navigating to URL path: ${path}`);
    await this.page.goto(path);
  }

  async clickElement(locator: Locator, description: string) {
    Logger.info('BasePage', `Clicking: ${description}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fillInput(locator: Locator, value: string, description: string) {
    Logger.info('BasePage', `Filling ${description} with value: ****`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async verifyElementText(locator: Locator, expectedText: string) {
    Logger.info('BasePage', `Asserting element contains text: "${expectedText}"`);
    await expect(locator).toContainText(expectedText);
  }

  async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => undefined);
  }
}