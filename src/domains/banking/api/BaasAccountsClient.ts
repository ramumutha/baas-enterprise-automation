import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Logger } from '../../../core/observability/Logger';

export class BaasAccountsClient {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, apiBaseUrl: string) {
    this.request = request;
    this.baseUrl = apiBaseUrl;
  }

  async fetchCustomerAccounts(customerId: string): Promise<APIResponse> {
    const endpoint = `${this.baseUrl}/customers/${customerId}/accounts`;
    Logger.info('BaasAccountsClient', 'Executing fetchCustomerAccounts', {
      operation: 'fetchCustomerAccounts',
      method: 'GET',
      customerId
    });
    
    const response = await this.request.get(endpoint);
    expect(response.status()).toBe(200);
    return response;
  }

  async createNewAccount(customerId: string, newAccountType: number, fromAccountId: string): Promise<APIResponse> {
    const endpoint = `${this.baseUrl}/createAccount`;
    Logger.info('BaasAccountsClient', 'Executing createNewAccount', {
      operation: 'createNewAccount',
      method: 'POST',
      customerId,
      fromAccountId
    });
    
    return await this.request.post(endpoint, {
      params: { customerId, newAccountType, fromAccountId }
    });
  }
}