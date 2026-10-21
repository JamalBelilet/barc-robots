import { readFileSync } from 'node:fs';
import { simulate } from './domain/simulate';
import { formatOutput } from './io/format';
import { ParseError, parseInput } from './io/parse';

const STDIN_FD = 0;

function readInput(filePath: string | undefined): string {
  return readFileSync(filePath ?? STDIN_FD, 'utf8');
}

function main(): void {
  const world = parseInput(readInput(process.argv[2]));
  const output = formatOutput(simulate(world));
  if (output.length > 0) {
    process.stdout.write(`${output}\n`);
  }
}

try {
  main();
} catch (error) {
  if (error instanceof ParseError) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exit(1);
  }
  throw error;
}
