import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(repoRoot, 'allure-results');
const reportsDir = path.join(repoRoot, 'reports');
const outputFile = path.join(reportsDir, 'test-summary.md');
const jsonOutputFile = path.join(reportsDir, 'test-summary.json');

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function parseResults() {
  if (!fs.existsSync(resultsDir)) {
    return [];
  }

  return fs
    .readdirSync(resultsDir)
    .filter((name) => name.endsWith('-result.json'))
    .map((name) => {
      const fullPath = path.join(resultsDir, name);
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    });
}

function formatStatus(status) {
  return status?.toLowerCase() || 'unknown';
}

function buildSummary(results) {
  const counts = {
    passed: 0,
    failed: 0,
    broken: 0,
    skipped: 0,
    pending: 0,
    unknown: 0
  };

  const entries = results.map((result) => {
    const status = formatStatus(result.status);
    if (status in counts) {
      counts[status] += 1;
    } else {
      counts.unknown += 1;
    }

    return {
      name: result.name || 'Unnamed test',
      status,
      uuid: result.uuid || 'n/a'
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    total: entries.length,
    counts,
    entries: entries.slice(0, 20)
  };
}

function renderMarkdown(summary) {
  const lines = [];
  lines.push('# Test Run Summary');
  lines.push('');
  lines.push(`- Generated: ${summary.generatedAt}`);
  lines.push(`- Total tests: ${summary.total}`);
  lines.push(`- Passed: ${summary.counts.passed}`);
  lines.push(`- Failed: ${summary.counts.failed}`);
  lines.push(`- Broken: ${summary.counts.broken}`);
  lines.push(`- Skipped: ${summary.counts.skipped}`);
  lines.push(`- Pending: ${summary.counts.pending}`);
  lines.push(`- Unknown: ${summary.counts.unknown}`);
  lines.push('');
  lines.push('## Recent test results');
  lines.push('');

  if (summary.entries.length === 0) {
    lines.push('- No test result files were found in allure-results.');
  } else {
    for (const entry of summary.entries) {
      lines.push(`- ${entry.name} — ${entry.status}`);
    }
  }

  return lines.join('\n') + '\n';
}

const results = parseResults();
const summary = buildSummary(results);
ensureDirectory(reportsDir);
fs.writeFileSync(outputFile, renderMarkdown(summary), 'utf8');
fs.writeFileSync(jsonOutputFile, JSON.stringify(summary, null, 2), 'utf8');

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, renderMarkdown(summary));
}

console.log(`Wrote ${outputFile}`);
console.log(`Wrote ${jsonOutputFile}`);
