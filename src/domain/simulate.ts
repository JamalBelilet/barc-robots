import { commands } from './commands';
import type { Grid, Position, Result, RobotProgram, RobotState, World } from './types';

export const inBounds = (grid: Grid, position: Position): boolean =>
  position.x >= 0 && position.x <= grid.maxX && position.y >= 0 && position.y <= grid.maxY;

const cellKey = (position: Position): string => `${position.x},${position.y}`;

export function runRobot(grid: Grid, scents: Set<string>, program: RobotProgram): Result {
  let state: RobotState = program.start;

  for (const command of program.instructions) {
    const next = commands[command](state);

    if (inBounds(grid, next.position)) {
      state = next;
    } else if (!scents.has(cellKey(state.position))) {
      scents.add(cellKey(state.position));
      return { ...state, lost: true };
    }
  }

  return { ...state, lost: false };
}

export function simulate(world: World): Result[] {
  const scents = new Set<string>();
  return world.robots.map((program) => runRobot(world.grid, scents, program));
}
