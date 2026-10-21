import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isCommand, type Command } from './commands';
import { inBounds, runRobot, simulate } from './simulate';
import type { Grid, Orientation, RobotProgram } from './types';

const toCommands = (instructions: string): Command[] => [...instructions].filter(isCommand);

const robot = (
  x: number,
  y: number,
  orientation: Orientation,
  instructions: string,
): RobotProgram => ({
  start: { position: { x, y }, orientation },
  instructions: toCommands(instructions),
});

const grid: Grid = { maxX: 5, maxY: 3 };

describe('inBounds', () => {
  it('treats the grid bounds as inclusive', () => {
    assert.equal(inBounds(grid, { x: 0, y: 0 }), true);
    assert.equal(inBounds(grid, { x: 5, y: 3 }), true);
    assert.equal(inBounds(grid, { x: 6, y: 3 }), false);
    assert.equal(inBounds(grid, { x: 5, y: -1 }), false);
  });
});

describe('runRobot', () => {
  it('reports LOST and leaves a scent when it drives off the edge (sample robot 2)', () => {
    const scents = new Set<string>();
    const result = runRobot(grid, scents, robot(3, 2, 'N', 'FRRFLLFFRRFLL'));
    assert.deepEqual(result, { position: { x: 3, y: 3 }, orientation: 'N', lost: true });
    assert.ok(scents.has('3,3'));
  });

  it('is lost immediately when told to step off a corner', () => {
    const scents = new Set<string>();
    const result = runRobot({ maxX: 1, maxY: 1 }, scents, robot(1, 1, 'N', 'F'));
    assert.deepEqual(result, { position: { x: 1, y: 1 }, orientation: 'N', lost: true });
    assert.ok(scents.has('1,1'));
  });

  it('protects a later robot from falling off a scented cell in any direction', () => {
    const small: Grid = { maxX: 1, maxY: 1 };
    const scents = new Set<string>();

    const first = runRobot(small, scents, robot(0, 0, 'S', 'F'));
    assert.equal(first.lost, true);

    const second = runRobot(small, scents, robot(0, 0, 'W', 'F'));
    assert.deepEqual(second, { position: { x: 0, y: 0 }, orientation: 'W', lost: false });
  });

  it('ignores the fatal move but keeps executing later instructions', () => {
    const scents = new Set<string>(['3,3']);
    const result = runRobot(grid, scents, robot(3, 3, 'N', 'FLF'));
    assert.deepEqual(result, { position: { x: 2, y: 3 }, orientation: 'W', lost: false });
  });

  it('never loses a robot that only turns at an edge', () => {
    const result = runRobot(grid, new Set(), robot(0, 0, 'S', 'LLLL'));
    assert.deepEqual(result, { position: { x: 0, y: 0 }, orientation: 'S', lost: false });
  });

  it('handles an empty instruction list', () => {
    const result = runRobot(grid, new Set(), robot(2, 2, 'N', ''));
    assert.deepEqual(result, { position: { x: 2, y: 2 }, orientation: 'N', lost: false });
  });
});

describe('simulate', () => {
  it('runs robots in order, sharing accumulated scents (full sample)', () => {
    const results = simulate({
      grid,
      robots: [
        robot(1, 1, 'E', 'RFRFRFRF'),
        robot(3, 2, 'N', 'FRRFLLFFRRFLL'),
        robot(0, 3, 'W', 'LLFFFLFLFL'),
      ],
    });

    assert.deepEqual(results, [
      { position: { x: 1, y: 1 }, orientation: 'E', lost: false },
      { position: { x: 3, y: 3 }, orientation: 'N', lost: true },
      { position: { x: 2, y: 3 }, orientation: 'S', lost: false },
    ]);
  });
});
