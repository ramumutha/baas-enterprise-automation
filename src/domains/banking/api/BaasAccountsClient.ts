import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from '../../../core/observability/Logger';
import {
  classifyHttpStatus,
  classifyTransportFailure
} from '../../../core/resilience/httpFailureClassification';
import { isRetryableFailure } from '../../../core/resilience/failureClassification';
import { retry } from '../../../core/resilience/retry';

const API_TIMEOUT_MS = 10000;
const API_RETRY_ATTEMPTS = 2;
const API_RETRY_DELAY_MS = 500;

export class BaasAccountsClient {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, apiBaseUrl: string) {
    this.request = request;
    this.baseUrl = apiBaseUrl;
  }

  async fetchCustomerAccounts(customerId: string): Promise<APIResponse> {
    const endpoint = `${this.baseUrl}/customers/${customerId}/accounts`;

    return retry(async () => {
      Logger.info('BaasAccountsClient', 'Executing fetchCustomerAccounts', {
        operation: 'fetchCustomerAccounts',
        method: 'GET',
        customerId
      });

      let response: APIResponse;

      try {
        response = await this.request.get(endpoint, {
          timeout: API_TIMEOUT_MS
        });
      } catch (error) {
        throw classifyTransportFailure('fetchCustomerAccounts', error);
      }

      classifyHttpStatus(response.status(), 'fetchCustomerAccounts');
      return response;
    }, {
      attempts: API_RETRY_ATTEMPTS,
      delayMs: API_RETRY_DELAY_MS,
      shouldRetry: isRetryableFailure
    });
  }

  async createNewAccount(
  customerId: string,
  newAccountType: number,
  fromAccountId: string
): Promise<APIResponse> {
  const endpoint = `${this.baseUrl}/createAccount`;

  Logger.info('BaasAccountsClient', 'Executing createNewAccount', {
    operation: 'createNewAccount',
    method: 'POST',
    customerId,
    fromAccountId
  });

  let response: APIResponse;

  try {
    response = await this.request.post(endpoint, {
      params: {
        customerId,
        newAccountType,
        fromAccountId
      },
      timeout: API_TIMEOUT_MS
    });
  } catch (error) {
    throw classifyTransportFailure('createNewAccount', error);
  }

  classifyHttpStatus(response.status(), 'createNewAccount');
  return response;
}
}
