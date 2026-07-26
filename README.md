# 🏦 BaaS Enterprise Automation Framework

This project is a ready-to-use test automation framework for banking workflows using Playwright and TypeScript. It is designed so a QA engineer, tester, or business user can run tests, add or update test cases, and review reports without needing deep programming support.

## ✅ What this project helps you do

- Run automated UI and API tests for banking scenarios
- Execute smoke, regression, and critical-path suites
- Review test reports in a browser-based format
- Extend the framework with new test cases using the existing structure

---

## 1. First-time setup

### Prerequisites

Make sure the following are installed on your machine:
- Node.js 20 or newer
- npm
- A browser environment supported by Playwright

### Install dependencies

Open the project folder in a terminal and run:

```bash
npm install
```

### Install Playwright browsers

Run:

```bash
npx playwright install
```

If you are using Linux CI or a fresh machine, you may also need:

```bash
npx playwright install --with-deps
```

---

## 2. How to run tests

The project includes several ready-made commands.

### Run the full QA suite

```bash
npm run test:qa
```

### Run smoke tests

```bash
npm run test:smoke
```

### Run regression tests

```bash
npm run test:regression-tags
```

### Run only critical-path tests

```bash
npm run test:critical
```

### Run UI tests

```bash
npm run test:ui
```

### Run API tests

```bash
npm run test:api
```

### Run the matrix-based regression coverage

```bash
npm run test:matrix
```

---

## 3. How to view reports

After a test run completes, you can view the HTML report with:

```bash
npm run report
```

This opens the Playwright report in your browser.

### Summary report

A simple summary file is also generated after each run:

```bash
npm run report:summary
```

You can open the generated files here:
- reports/test-summary.md
- reports/test-summary.json

---

## 4. How to create or update test cases

### Recommended folder structure

- src/tests/ui: UI scenarios
- src/tests/api: API scenarios
- src/tests/regression: regression workflow tests
- src/pages: page object classes for UI screens
- src/utils: reusable helpers and assertions
- src/fixtures: shared test fixtures
- src/testdata: test data and client configuration

### Simple rule for adding a new test

1. Decide whether the test is UI or API
2. Place it in the correct folder under src/tests
3. Reuse existing page objects or helpers when possible
4. Keep test names clear and business-friendly
5. Use existing tags such as @smoke, @regression, @ui, @api, or @critical

### Example

- For a new UI check, create a new test in src/tests/ui
- For a new API validation, create a new test in src/tests/api

---

## 5. How to work with test data

Test data is stored in the src/testdata folder.

If you need to add or modify customer data:
- update the relevant file in src/testdata
- keep usernames, passwords, and customer IDs aligned with the intended environment

If you need to add a new client profile, update the client list in src/testdata/clients.json.

---

## 6. How to run tests in CI/CD

The GitHub Actions workflow supports manual runs from the Actions tab.

You can choose:
- environment: qa, regression, preprod, prod
- suite: smoke, regression, critical, ui, api
- optional client name for client-based runs

This allows non-developers to trigger the right test set without editing files.

---

## 7. Tips for new QA users

- Start with smoke tests when you want a fast check
- Use regression tests for broader business flow validation
- If a test fails, review the HTML report and the summary output first
- Prefer reusing existing page objects and helpers rather than duplicating logic
- Keep test names descriptive so others can understand the purpose quickly

---

## 8. Quick reference

```bash
npm install
npx playwright install
npm run test:smoke
npm run test:regression-tags
npm run report
npm run report:summary
```

If you are unsure what to run, start with smoke tests for a fast validation of the main workflow.
