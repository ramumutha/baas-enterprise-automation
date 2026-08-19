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
  const normalizedStatus = status?.toLowerCase();
  return ['passed', 'failed', 'broken', 'skipped', 'pending'].includes(normalizedStatus)
    ? normalizedStatus
    : 'unknown';
}

function getProject(result) {
  const parentSuite = result.labels?.find((label) => label.name === 'parentSuite')?.value;
  return parentSuite || 'Unassigned';
}

function getValidTimestamp(timestamp) {
  const value = Number(timestamp);
  return Number.isFinite(value) && value >= 0 ? value : null;
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
  const projects = new Map();
  const failedTests = [];
  const starts = [];
  const stops = [];

  for (const result of results) {
    const status = formatStatus(result.status);
    const project = getProject(result);
    const start = getValidTimestamp(result.start);
    const stop = getValidTimestamp(result.stop);

    counts[status] += 1;
    if (start !== null) {
      starts.push(start);
    }
    if (stop !== null) {
      stops.push(stop);
    }

    if (!projects.has(project)) {
      projects.set(project, {
        project,
        total: 0,
        passed: 0,
        failed: 0,
        broken: 0,
        skipped: 0,
        other: 0
      });
    }

    const projectCounts = projects.get(project);
    projectCounts.total += 1;
    if (status in projectCounts && status !== 'total') {
      projectCounts[status] += 1;
    } else {
      projectCounts.other += 1;
    }

    if (status === 'failed' || status === 'broken') {
      failedTests.push({
        name: result.name || 'Unnamed test',
        status,
        project
      });
    }
  }

  const executionStart = starts.length > 0 ? Math.min(...starts) : null;
  const executionStop = stops.length > 0 ? Math.max(...stops) : null;
  const durationMs = executionStart !== null && executionStop !== null && executionStop >= executionStart
    ? executionStop - executionStart
    : null;
  const total = results.length;
  const releaseGate = total === 0 || counts.failed > 0 || counts.broken > 0 ? 'FAIL' : 'PASS';

  return {
    generatedAt: new Date().toISOString(),
    environment: process.env.ENV || 'qa',
    executionStart,
    executionStop,
    durationMs,
    durationSeconds: durationMs === null ? null : durationMs / 1000,
    total,
    counts,
    passRate: total === 0 ? 0 : (counts.passed / total) * 100,
    releaseGate,
    projectSummary: [...projects.values()],
    failedTests
  };
}

function renderMarkdown(summary) {
  const lines = [];
  lines.push('# Enterprise Test Execution Summary');
  lines.push('');
  lines.push('## Execution Context');
  lines.push('');
  lines.push(`- Generated at: ${summary.generatedAt}`);
  lines.push(`- Environment: ${summary.environment.toUpperCase()}`);
lines.push(
  `- Execution start: ${
    summary.executionStart === null
      ? 'Unavailable'
      : new Date(summary.executionStart).toISOString()
  }`
);

lines.push(
  `- Execution stop: ${
    summary.executionStop === null
      ? 'Unavailable'
      : new Date(summary.executionStop).toISOString()
  }`
);
  lines.push(`- Duration: ${summary.durationMs ?? 'Unavailable'} ms${summary.durationSeconds === null ? '' : ` (${summary.durationSeconds.toFixed(2)} seconds)`}`);
  lines.push('');
  lines.push('## Quality Result');
  lines.push('');
  lines.push(`- Total: ${summary.total}`);
  lines.push(`- Passed: ${summary.counts.passed}`);
  lines.push(`- Failed: ${summary.counts.failed}`);
  lines.push(`- Broken: ${summary.counts.broken}`);
  lines.push(`- Skipped: ${summary.counts.skipped}`);
  lines.push(`- Pending: ${summary.counts.pending}`);
  lines.push(`- Unknown: ${summary.counts.unknown}`);
  lines.push(`- Pass rate: ${summary.passRate.toFixed(2)}%`);
  lines.push('');
  lines.push('## Project Summary');
  lines.push('');

  if (summary.projectSummary.length === 0) {
    lines.push('- No project results were found.');
  } else {
    lines.push('| Project | Total | Passed | Failed | Broken | Skipped | Other |');
    lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
    for (const project of summary.projectSummary) {
      lines.push(`| ${project.project} | ${project.total} | ${project.passed} | ${project.failed} | ${project.broken} | ${project.skipped} | ${project.other} |`);
    }
  }

  lines.push('');
  lines.push('## Failed Tests');
  lines.push('');

  if (summary.failedTests.length === 0) {
    lines.push('- No failed or broken tests detected.');
  } else {
    for (const failedTest of summary.failedTests) {
      lines.push(`- ${failedTest.name} | ${failedTest.status} | ${failedTest.project}`);
    }
  }

  lines.push('');
  lines.push('## Release Assessment');
  lines.push('');
  lines.push(`- Release gate: ${summary.releaseGate}`);
  lines.push(summary.releaseGate === 'PASS'
    ? 'PASS - no failed or broken tests detected.'
    : 'FAIL - execution contains failed/broken tests or no tests were executed.');

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
