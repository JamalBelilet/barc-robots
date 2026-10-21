import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Result } from '../domain/types';
import { formatOutput, formatResult } from './format';

describe('formatResult', () => {
  it('formats a robot that is still on the grid', () => {
    const result: Result = { position: { x: 1, y: 1 }, orientation: 'E', lost: false };
    assert.equal(formatResult(result), '1 1 E');
  });

  it('appends LOST for a robot that drove off the edge', () => {
    const result: Result = { position: { x: 3, y: 3 }, orientation: 'N', lost: true };
    assert.equal(formatResult(result), '3 3 N LOST');
  });
});

describe('formatOutput', () => {
  it('joins results with newlines, one line per robot', () => {
    const output = formatOutput([
      { position: { x: 1, y: 1 }, orientation: 'E', lost: false },
      { position: { x: 3, y: 3 }, orientation: 'N', lost: true },
    ]);
    assert.equal(output, '1 1 E\n3 3 N LOST');
  });
});
