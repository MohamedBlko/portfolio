import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const steps = [
  ['Generate case studies', 'node', 'scripts/build-case-studies.mjs'],
  ['Generate translations', 'node', 'scripts/build-translations.mjs'],
  ['Prepare navigation and asset versions', 'python', 'scripts/prepare-site.py'],
  ['Check case studies', 'node', 'scripts/check-case-studies.mjs'],
  ['Test bilingual portfolio', 'node', 'scripts/test-portfolio.mjs'],
  ['Test project models', 'node', 'scripts/test-project-models.mjs'],
  ['Test chess controller', 'node', 'scripts/test-chess-controller.mjs'],
  ['Audit pages and translations', 'python', 'scripts/audit-portfolio.py'],
];

export function findPython(probe = spawnSync, env = process.env) {
  const candidates = env.PORTFOLIO_PYTHON
    ? [[env.PORTFOLIO_PYTHON]]
    : [['py', '-3'], ['python3'], ['python']];
  for (const [command, ...prefix] of candidates) {
    const result = probe(command, [...prefix, '-c',
      'import sys; assert sys.version_info >= (3, 8); import lxml.html'],
    { cwd: root, encoding: 'utf8', timeout: 10000 });
    if (!result.error && result.status === 0) return { command, prefix };
  }
  throw new Error(
    'Python 3 with lxml was not found. Install Python 3, then run:\n' +
    '  py -3 -m pip install --user lxml\n' +
    'Or use python3/python instead of py -3. For a custom installation, set\n' +
    'PORTFOLIO_PYTHON to the Python executable path (without extra arguments).',
  );
}

export function runSteps(python, execute = spawnSync, log = console.log) {
  for (const [index, [label, runtime, script]] of steps.entries()) {
    log(`\n[${index + 1}/${steps.length}] ${label}`);
    const command = runtime === 'node' ? process.execPath : python.command;
    const args = runtime === 'node' ? [script] : [...python.prefix, script];
    const result = execute(command, args, { cwd: root, stdio: 'inherit' });
    if (result.error || result.status !== 0) {
      const reason = result.error?.message || result.signal || `exit code ${result.status}`;
      throw new Error(`${label} failed (${reason}). Remaining steps were not run.`);
    }
  }
  log('\nReady for review. No pull, commit or push was performed.');
}

function main(args) {
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: node scripts/prepare-portfolio.mjs\n' +
      'Generates the site and runs all checks, stopping on the first failure.\n' +
      'Requires Node.js and Python 3 with lxml. Does not run Git commands.');
    return;
  }
  if (args.length) throw new Error('Unknown option. Use --help for usage.');
  // Check dependencies before any generated files are changed.
  const python = findPython();
  console.log(`Using Python: ${python.command} ${python.prefix.join(' ')}`.trim());
  runSteps(python);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`\nERROR: ${error.message}`);
    process.exitCode = 1;
  }
}
