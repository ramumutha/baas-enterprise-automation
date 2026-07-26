export type CustomerProfile = {
  customerId: string;
  username: string;
  password: string;
  fullName: string;
};

export const customerProfiles: Record<string, CustomerProfile> = {
  qa: {
    customerId: '12212',
    username: 'john',
    password: 'demo',
    fullName: 'John Smith'
  },
  regression: {
    customerId: '12212',
    username: 'john',
    password: 'demo',
    fullName: 'John Smith'
  }
};

export function getCustomerProfile(environment: string): CustomerProfile {
  return customerProfiles[environment] || customerProfiles.qa;
}
