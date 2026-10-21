import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { commands, isCommand } from './commands';
import type { RobotState } from './types';

describe('command transforms', () => {
  it('L turns left without moving', () => {
    const state: RobotState = { position: { x: 2, y: 3 }, orientation: 'N' };
    assert.deepEqual(commands.L(state), { position: { x: 2, y: 3 }, orientation: 'W' });
  });

  it('R turns right without moving', () => {
    const state: RobotState = { position: { x: 2, y: 3 }, orientation: 'N' };
    assert.deepEqual(commands.R(state), { position: { x: 2, y: 3 }, orientation: 'E' });
  });

  it('F moves forward keeping orientation', () => {
    const state: RobotState = { position: { x: 1, y: 1 }, orientation: 'E' };
    assert.deepEqual(commands.F(state), { position: { x: 2, y: 1 }, orientation: 'E' });
  });
});

describe('isCommand', () => {
  it('accepts the known command characters', () => {
    for (const character of ['L', 'R', 'F']) {
      assert.equal(isCommand(character), true);
    }
  });

  it('rejects unknown characters', () => {
    for (const character of ['X', ' ', '']) {
      assert.equal(isCommand(character), false);
    }
  });
});
