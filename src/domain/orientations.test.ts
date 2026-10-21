import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { step, turnLeft, turnRight } from './orientations';

describe('turnRight', () => {
  it('cycles clockwise N -> E -> S -> W -> N', () => {
    assert.equal(turnRight('N'), 'E');
    assert.equal(turnRight('E'), 'S');
    assert.equal(turnRight('S'), 'W');
    assert.equal(turnRight('W'), 'N');
  });
});

describe('turnLeft', () => {
  it('cycles anticlockwise N -> W -> S -> E -> N', () => {
    assert.equal(turnLeft('N'), 'W');
    assert.equal(turnLeft('W'), 'S');
    assert.equal(turnLeft('S'), 'E');
    assert.equal(turnLeft('E'), 'N');
  });
});

describe('step', () => {
  it('moves one grid point in the facing direction', () => {
    assert.deepEqual(step({ x: 5, y: 5 }, 'N'), { x: 5, y: 6 });
    assert.deepEqual(step({ x: 5, y: 5 }, 'E'), { x: 6, y: 5 });
    assert.deepEqual(step({ x: 5, y: 5 }, 'S'), { x: 5, y: 4 });
    assert.deepEqual(step({ x: 5, y: 5 }, 'W'), { x: 4, y: 5 });
  });
});
