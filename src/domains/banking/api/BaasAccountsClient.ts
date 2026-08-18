import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Logger } from '../../../utils/Logger';

export class BaasAccountsClient {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = process.env.API_BASE_URL || '';
  }

  async fetchCustomerAccounts(customerId: string): Promise<APIResponse> {
    const endpoint = `${this.baseUrl}/customers/${customerId}/accounts`;
    Logger.info(`[API GET Request] Target: ${endpoint}`);
    
    const response = await this.request.get(endpoint);
    expect(response.status()).toBe(200);
    return response;
  }

  async createNewAccount(customerId: string, newAccountType: number, fromAccountId: string): Promise<APIResponse> {
    const endpoint = `${this.baseUrl}/createAccount`;
    Logger.info(`[API POST Request] Creating account for Customer ID: ${customerId}`);
    
    return await this.request.post(endpoint, {
      params: { customerId, newAccountType, fromAccountId }
    });
  }
}