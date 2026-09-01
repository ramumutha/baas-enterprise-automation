import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../../core/ui/BasePage';

export type TransferAccountAvailability = {
  fromAccounts: string[];
  toAccounts: string[];
};

export type TransferAccountPair = {
  fromAccount: string;
  toAccount: string;
};

export class TransferFundsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly amountInput: Locator;
  readonly transferButton: Locator;
  readonly transferCompleteHeading: Locator;
  readonly transferResultPanel: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', {
      name: 'Transfer Funds',
      exact: true
    });

    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.amountInput = page.locator('#amount');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.transferCompleteHeading = page.getByRole('heading', {
      name: 'Transfer Complete!',
      exact: true
    });
    this.transferResultPanel = page.locator('#rightPanel');
  }

  async openTransferPage(): Promise<void> {
    await this.waitForPageReady();

    await this.clickElement(
      this.page.getByRole('link', {
        name: 'Transfer Funds',
        exact: true
      }),
      'Transfer Funds Link'
    );

    await expect(this.pageHeading).toBeVisible();
    await expect(this.fromAccountSelect).toBeVisible();
    await expect(this.toAccountSelect).toBeVisible();
  }

  async getTransferAccountAvailability(): Promise<TransferAccountAvailability> {
    await this.waitForVisible(this.fromAccountSelect);
    await this.waitForVisible(this.toAccountSelect);

    const readAccountValues = async (select: Locator): Promise<string[]> =>
      select.locator('option').evaluateAll((options) =>
        options
          .map((option) => (option as HTMLOptionElement).value)
          .filter((value) => value.trim() !== '')
      );

    await expect
      .poll(
        async () => {
          const fromAccounts = await readAccountValues(this.fromAccountSelect);
          const toAccounts = await readAccountValues(this.toAccountSelect);

          return fromAccounts.length > 0 && toAccounts.length > 0;
        },
        {
          message: 'Waiting for transfer account selectors to populate',
          timeout: 10000
        }
      )
      .toBe(true);

    return {
      fromAccounts: await readAccountValues(this.fromAccountSelect),
      toAccounts: await readAccountValues(this.toAccountSelect)
    };
  }

  async selectDistinctTransferAccounts(): Promise<TransferAccountPair> {
    const availability = await this.getTransferAccountAvailability();
    const eligibleAccounts = [
      ...new Set(
        availability.fromAccounts.filter((account) =>
          availability.toAccounts.includes(account)
        )
      )
    ];
    const [fromAccount, toAccount] = eligibleAccounts;

    if (!fromAccount || !toAccount || fromAccount === toAccount) {
      throw new Error(
        `Transfer precondition unavailable: expected at least two distinct accounts in both selectors, found ${eligibleAccounts.length}`
      );
    }

    await this.fromAccountSelect.selectOption(fromAccount);
    await this.toAccountSelect.selectOption(toAccount);

    return { fromAccount, toAccount };
  }

  async transferFunds(
    amount: string,
    fromAccount: string,
    toAccount: string
  ): Promise<void> {
    await this.waitForPageReady();

    await this.fillInput(
      this.amountInput,
      amount,
      'Transfer Amount'
    );

    await this.waitForVisible(this.fromAccountSelect);
    await this.fromAccountSelect.selectOption(fromAccount);

    await this.waitForVisible(this.toAccountSelect);
    await this.toAccountSelect.selectOption(toAccount);

    await this.clickElement(
      this.transferButton,
      'Transfer Button'
    );
  }

  async verifyTransferComplete(
    amount: string,
    fromAccount: string,
    toAccount: string
  ): Promise<void> {
    await expect(this.transferCompleteHeading).toBeVisible();
    await expect(this.transferResultPanel).toContainText(amount);
    await expect(this.transferResultPanel).toContainText(fromAccount);
    await expect(this.transferResultPanel).toContainText(toAccount);
  }
}