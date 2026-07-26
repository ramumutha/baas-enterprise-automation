import { test, expect } from '../../fixtures/baasFixtures';

test.describe('@API - Customer Account Regression', () => {
  test('TC_API_02: Validate account summary response shape', { tag: ['@api', '@regression'] }, async ({ accountsApi, customerProfile }) => {
    const response = await accountsApi.fetchCustomerAccounts(customerProfile.customerId);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const firstAccount = body[0];
    expect(firstAccount).toHaveProperty('id');
    expect(firstAccount).toHaveProperty('balance');
    expect(firstAccount).toHaveProperty('type');
  });
});
