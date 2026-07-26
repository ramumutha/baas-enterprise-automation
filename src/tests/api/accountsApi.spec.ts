import { test, expect } from '../../fixtures/baasFixtures';

test.describe('@API - BaaS Core Banking Microservices', () => {
  test('TC_API_01: Validate fetching customer account details', { tag: ['@api', '@regression'] }, async ({ accountsApi, customerProfile }) => {
    const response = await accountsApi.fetchCustomerAccounts(customerProfile.customerId);

    // Assert HTTP status 200 OK
    expect(response.status()).toBe(200);

    // ParaBank returns a JSON array of account objects
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('customerId');
    expect(body[0]).toHaveProperty('type');
    expect(body[0]).toHaveProperty('balance');
  });
});