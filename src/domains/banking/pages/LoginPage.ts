import { errors, Page, Locator } from '@playwright/test';
import {
  isRetryableFailure,
  PermanentFailureError,
  TransientFailureError
} from '../../../core/resilience/failureClassification';
import { BasePage } from '../../../core/ui/BasePage';
import { retry } from '../../../core/resilience/retry';

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
      try {
        await this.page.goto('/parabank/index.htm');
        await this.fillInput(this.usernameInput, username, 'Username');
        await this.fillInput(this.passwordInput, pass, 'Password');
        await this.clickElement(this.loginButton, 'Log In Button');
      } catch (error) {
        throw new TransientFailureError('Login technical interaction failed', error);
      }

      try {
        await this.page.waitForURL(/\/overview\.htm/, { timeout: 10000 });
        return true;
      } catch (error) {
        if (!(error instanceof errors.TimeoutError)) {
          throw new TransientFailureError('Login technical interaction failed', error);
        }
      }

      try {
        const bodyText = await this.page.locator('body').innerText();
        if (bodyText.includes('Accounts Overview') || bodyText.includes('Welcome')) {
          return true;
        }
      } catch (error) {
        throw new TransientFailureError('Login technical interaction failed', error);
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
  }
}