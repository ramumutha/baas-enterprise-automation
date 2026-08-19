import { Page, Locator } from '@playwright/test';
import {
  isRetryableFailure,
  PermanentFailureError,
  TransientFailureError
} from '../../../core/resilience/failureClassification';
import { BasePage } from '../../../core/ui/BasePage';
import { retry } from '../../../core/resilience/retry';
import { assertText, assertVisible } from '../../../utils/assertions';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
  }

  async login(username: string, pass: string) {
    await retry(async () => {
      let currentUrl: string;
      let bodyText: string;

      try {
        await this.page.goto('/parabank/index.htm');
        await this.fillInput(this.usernameInput, username, 'Username');
        await this.fillInput(this.passwordInput, pass, 'Password');
        await this.clickElement(this.loginButton, 'Log In Button');
        await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => undefined);
        await this.page.waitForTimeout(1000);

        currentUrl = this.page.url();
        bodyText = await this.page.locator('body').innerText().catch(() => '');
      } catch (error) {
        throw new TransientFailureError('Login technical interaction failed', error);
      }

      if (currentUrl.includes('/overview.htm') || bodyText.includes('Accounts Overview') || bodyText.includes('Welcome')) {
        return true;
      }

      throw new PermanentFailureError('Login did not reach authenticated state');
    }, {
      attempts: 2,
      delayMs: 1000,
      shouldRetry: isRetryableFailure,
      onRetry: async () => {
        await this.page.reload().catch(() => undefined);
      }
    });

    await assertVisible(this.usernameInput);
    await assertText(this.page.locator('body'), 'Customer Login');
  }
}