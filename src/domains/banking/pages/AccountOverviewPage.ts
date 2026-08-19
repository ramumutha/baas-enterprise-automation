import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../core/ui/BasePage';

export class AccountOverviewPage extends BasePage {
  readonly pageHeading: Locator;
  readonly accountsTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', {
      name: 'Accounts Overview',
      exact: true
    });
    this.accountsTable = page.locator('table').filter({
      hasText: 'Account Balance'
    });
  }

  async verifyAccountsLoaded() {
    await this.waitForPageReady();
    await this.verifyElementText(this.pageHeading, 'Accounts Overview');
    await this.verifyElementText(this.accountsTable, 'Account Balance');
  }
}
