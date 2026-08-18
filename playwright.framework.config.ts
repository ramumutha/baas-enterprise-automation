import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src',

  testMatch: [
    '**/core/security/*.spec.ts',
    '**/domains/banking/testdata/*.spec.ts'
  ],

  fullyParallel: false,

  workers: 1,

  reporter: [
    ['list']
  ],

  use: {
    trace: 'off',
    screenshot: 'off',
    video: 'off'
  }
});