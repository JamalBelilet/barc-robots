import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { simulate } from './domain/simulate';
import { formatOutput } from './io/format';
import { parseInput } from './io/parse';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = join(projectRoot, 'src', 'cli.ts');
const sampleInput = readFileSync(join(projectRoot, 'examples', 'sample-input.txt'), 'utf8');
const expectedOutput = readFileSync(
  join(projectRoot, 'examples', 'sample-output.txt'),
  'utf8',
).trim();

describe('acceptance: the canonical sample', () => {
  it('produces the expected output through parse -> simulate -> format', () => {
    assert.equal(formatOutput(simulate(parseInput(sampleInput))), expectedOutput);
  });

  it('exits non-zero with a message on invalid input', () => {
    let threw = false;
    try {
      execFileSync(process.execPath, ['--import', 'tsx', cliPath], {
        encoding: 'utf8',
        input: '5 3\n1 1 Z\nF\n',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (error) {
      threw = true;
      const execError = error as { status?: number; stderr?: string };
      assert.equal(execError.status, 1);
      assert.match(execError.stderr ?? '', /orientation/i);
    }
    assert.ok(threw, 'expected the CLI to exit with a non-zero status');
  });
});
