import fs from 'fs';
import PDFDocument from 'pdfkit';

const outPath = 'ProjectDesignDoc.pdf';

const doc = new PDFDocument({ size: 'A4', margin: 50 });
doc.pipe(fs.createWriteStream(outPath));

const title = 'Project Design Document — Enterprise QA Automation';
doc.fontSize(18).font('Times-Bold').text(title, { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(10).font('Times-Roman').fillColor('gray').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
doc.moveDown(1.2);

function heading(text) {
  doc.moveDown(0.5);
  doc.fontSize(12).font('Times-Bold').fillColor('black').text(text);
  doc.moveDown(0.25);
}

function para(text) {
  doc.fontSize(11).font('Times-Roman').fillColor('black').text(text, { align: 'left', paragraphGap: 6 });
}

heading('Executive Summary');
para('This document describes the architecture, key components, and operational guidance for the Enterprise QA Automation framework used to validate banking workflows. It is intended for engineering interview discussions and operational handoffs.');

heading('Scope & Objectives');
para('• Automate critical banking end-to-end workflows (login, account view, transfers, reconciliation).\n• Support tag-based test selection (smoke, regression, api, ui).\n• Enable multi-client matrix execution for cross-client compatibility.\n• Produce reliable reports and CI integration.');

heading('Architecture Overview');
para('The framework uses Playwright Test with TypeScript, organized around Page Objects, shared fixtures, and environment-driven configuration. Tests live under src/tests and are tagged to allow focused runs. Reporting uses Allure and a custom summary generator.');

heading('Key Components');
para('• `playwright.config.ts`: Central runner configuration and environment loader.\n• `src/pages`: Page Object Model implementations for UI stability.\n• `src/fixtures`: Shared Playwright fixtures (runtime config, clients, APIs).\n• `src/testdata`: Customer profiles and client matrix for multi-client runs.\n• `scripts/generate-report-summary.mjs`: Aggregates Allure results into human-readable summaries.');

heading('Tagging & Suites');
para('Tests use tags such as @smoke, @regression, @api, and @ui. NPM scripts provide convenient entry points (e.g., `npm run test:smoke`, `npm run test:matrix`). CI triggers accept inputs for environment and suite selection.');

heading('Multi-Client Matrix');
para('A client configuration file drives matrix runs. Regression suites iterate the configured clients to validate behavior across banks/environments. The fixtures expose resolved client config to test code for per-client parametrization.');

heading('Reporting & CI');
para('Allure provides detailed test reports; a small summary script converts `allure-results` into Markdown and JSON for quick review and CI step summaries. CI workflow uploads artifacts and supports manual dispatch with environment and suite inputs.');

heading('How to Run Locally');
para('1) Install dependencies: `npm install`.\n2) Run a suite: `npm run test:smoke` or `npm run test:matrix`.\n3) Generate report summary: `npm run report:summary`.');

heading('Operational Notes');
para('• Ensure `.env.{environment}` files exist for the target environment.\n• Keep POM locators and API client contracts stable; prefer selectors with data-test attributes.\n• Use tag expressions for selective runs to shorten feedback loops.');

heading('Next Steps & Recommendations');
para('• Produce a `docx` export if Word-native editing is required; this can be generated from the PDF or by a small script using `python-docx`.\n• Add nightly matrix runs in CI to surface client-specific regressions early.\n• Store generated reports in a centralized artifacts bucket for auditability.');

heading('Contact & Ownership');
para('Owner: QA Automation Team. For questions or updates, open a PR or raise an issue in the repository.');

doc.end();

doc.on('finish', () => {
  const stats = fs.statSync(outPath);
  console.log(`${outPath} written — ${stats.size} bytes`);
});
