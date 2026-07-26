import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountOverviewPage extends BasePage {
  readonly pageHeading: Locator;
  readonly accountsTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h1');
    this.accountsTable = page.locator('table');
  }

  async verifyAccountsLoaded() {
    await this.waitForPageReady();
    await this.verifyElementText(this.pageHeading, 'Accounts Overview');
    await this.verifyElementText(this.accountsTable, 'Account Balance');
  }
}
