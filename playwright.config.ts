import { defineConfig, devices } from '@playwright/test';
import { loadConfig } from './src/core/config/environment';

const runtimeConfig = loadConfig(process.env.ENV);

console.log(
  `[TARGET ENVIRONMENT]: Executing tests on ${runtimeConfig.environment.toUpperCase()} -> ${runtimeConfig.baseUrl}`
);

// Transactional (state-changing) tests require explicit opt-in; never enabled by default.
const runTransactional = process.env.RUN_TRANSACTIONAL === 'true';
const excludeTransactional = /@transactional/;

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list']
  ],
  use: {
  baseURL: runtimeConfig.baseUrl,
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
},
 projects: [
  {
    name: 'API-Suite',
    testMatch: '**/api/**/*.spec.ts',
    use: {
     extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
     }
    }
  },
  {
    name: 'Chromium-UI',
    use: { ...devices['Desktop Chrome'] },
    testIgnore: '**/api/**/*.spec.ts',
    // Only Chromium may opt in to @transactional tests, and only when explicitly requested.
    grepInvert: runTransactional ? undefined : excludeTransactional
  },
  {
    name: 'Firefox-UI',
    use: { ...devices['Desktop Firefox'] },
    testIgnore: '**/api/**/*.spec.ts',
    // Firefox never runs @transactional tests against the shared QA customer.
    grepInvert: excludeTransactional
  }
]
});