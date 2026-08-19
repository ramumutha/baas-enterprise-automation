import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const artifactDirectories = [
  'allure-results',
  'allure-report',
  'playwright-report',
  'test-results',
  'reports'
];

for (const directory of artifactDirectories) {
  const directoryPath = path.join(repoRoot, directory);

  if (!fs.existsSync(directoryPath)) {
    continue;
  }

  fs.rmSync(directoryPath, { recursive: true, force: true });
  console.log(`Removed ${directory}`);
}