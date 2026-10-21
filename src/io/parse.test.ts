import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ParseError, parseInput } from './parse';

const expectParseError = (input: string, messageMatch: RegExp): void => {
  assert.throws(
    () => parseInput(input),
    (error: unknown) => {
      assert.ok(error instanceof ParseError, 'expected a ParseError');
      assert.match(error.message, messageMatch);
      return true;
    },
  );
};

describe('parseInput', () => {
  it('parses the grid size and an empty robot list', () => {
    const world = parseInput('5 3\n');
    assert.deepEqual(world.grid, { maxX: 5, maxY: 3 });
    assert.equal(world.robots.length, 0);
  });

  it('parses the full sample into three robots', () => {
    const world = parseInput('5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL\n');
    assert.equal(world.robots.length, 3);
    assert.deepEqual(world.robots[0]?.start, { position: { x: 1, y: 1 }, orientation: 'E' });
    assert.deepEqual(world.robots[0]?.instructions, ['R', 'F', 'R', 'F', 'R', 'F', 'R', 'F']);
  });

  it('tolerates extra whitespace, blank lines and CRLF endings', () => {
    const world = parseInput('  5   3  \r\n\r\n1  1  E\r\nRF\r\n');
    assert.deepEqual(world.grid, { maxX: 5, maxY: 3 });
    assert.equal(world.robots.length, 1);
    assert.deepEqual(world.robots[0]?.start, { position: { x: 1, y: 1 }, orientation: 'E' });
    assert.deepEqual(world.robots[0]?.instructions, ['R', 'F']);
  });

  it('rejects empty or whitespace-only input', () => {
    expectParseError('', /empty/i);
    expectParseError('   \n  \n', /empty/i);
  });

  it('rejects a malformed coordinate', () => {
    expectParseError('5 3\n-1 2 N\nF\n', /non-negative integer/i);
    expectParseError('5 3\n1 x N\nF\n', /non-negative integer/i);
  });

  it('rejects an invalid orientation', () => {
    expectParseError('5 3\n1 1 Z\nF\n', /orientation/i);
  });

  it('rejects an unknown command and names the offending character', () => {
    expectParseError('5 3\n1 1 E\nRFXRF\n', /Unknown command "X"/);
  });

  it('rejects a robot that starts outside the grid', () => {
    expectParseError('5 3\n6 2 N\nF\n', /outside the grid/i);
  });

  it('rejects a position line with no instruction line', () => {
    expectParseError('5 3\n1 1 E\n', /no instruction line/i);
  });
});
