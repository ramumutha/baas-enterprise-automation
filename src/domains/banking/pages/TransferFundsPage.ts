import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../core/ui/BasePage';

export class TransferFundsPage extends BasePage {
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly amountInput: Locator;
  readonly transferButton: Locator;

  constructor(page: Page) {
    super(page);
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.amountInput = page.locator('#amount');
    this.transferButton = page.locator('input[value="Transfer"]');
  }

  async openTransferPage() {
    await this.waitForPageReady();
    await this.clickElement(this.page.locator('a').filter({ hasText: 'Transfer Funds' }).first(), 'Transfer Funds Link');
  }

  async transferFunds(amount: string, fromAccount: string, toAccount: string) {
    await this.waitForPageReady();
    await this.fillInput(this.amountInput, amount, 'Transfer Amount');
    await this.waitForVisible(this.fromAccountSelect);
    await this.fromAccountSelect.selectOption(fromAccount);
    await this.waitForVisible(this.toAccountSelect);
    await this.toAccountSelect.selectOption(toAccount);
    await this.clickElement(this.transferButton, 'Transfer Button');
  }
}