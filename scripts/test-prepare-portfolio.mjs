import assert from 'node:assert/strict';
import { findPython, runSteps, steps } from './prepare-portfolio.mjs';

const success = () => ({ status: 0 });
const python = { command: 'test-python', prefix: ['-3'] };
const calls = [];
runSteps(python, (command, args, options) => {
  calls.push({ command, args, options });
  return success();
}, () => {});
assert.equal(calls.length, 8);
assert.deepEqual(calls.map((c) => c.args.at(-1)), steps.map((s) => s[2]));
assert.equal(calls[0].command, process.execPath);
assert.equal(calls[2].command, python.command);
assert.deepEqual(calls[2].args, ['-3', 'scripts/prepare-site.py']);
assert(calls.every((c) => c.options.cwd === calls[0].options.cwd));
assert(calls.every((c) => !c.options.shell));

for (const failed of [{ status: 1 }, { status: null, signal: 'SIGTERM' },
  { status: null, error: new Error('spawn failed') }]) {
  let count = 0;
  assert.throws(() => runSteps(python, () => ++count === 2 ? failed : success(), () => {}),
    /Generate translations failed/);
  assert.equal(count, 2, 'Stop immediately after a failed command');
}

const probes = [];
assert.deepEqual(findPython((command, args) => {
  probes.push({ command, args });
  return command === 'python3' ? success() : { status: 1 };
}, {}), { command: 'python3', prefix: [] });
assert.deepEqual(probes.map((p) => p.command), ['py', 'python3']);
assert(probes.every((p) => p.args.at(-1).includes('import lxml.html')));
assert.deepEqual(findPython(success, { PORTFOLIO_PYTHON: 'C:/Python/python.exe' }),
  { command: 'C:/Python/python.exe', prefix: [] });
assert.throws(() => findPython(() => ({ error: new Error('not found') }), {}), /lxml was not found/);
console.log('PASS: eight ordered steps, Python detection, executable paths and fail-fast behavior (no site scripts run).');
