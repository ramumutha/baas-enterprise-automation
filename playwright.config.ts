import { defineConfig, devices } from '@playwright/test';
import { loadConfig } from './src/core/config/environment';

const runtimeConfig = loadConfig(process.env.ENV);

console.log(
  `[TARGET ENVIRONMENT]: Executing tests on ${runtimeConfig.environment.toUpperCase()} -> ${runtimeConfig.baseUrl}`
);

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
    testIgnore: '**/api/**/*.spec.ts'
  },
  {
    name: 'Firefox-UI',
    use: { ...devices['Desktop Firefox'] },
    testIgnore: '**/api/**/*.spec.ts'
  }
]
});