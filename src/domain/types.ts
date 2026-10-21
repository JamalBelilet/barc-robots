import type { Command } from './commands';

export type Orientation = 'N' | 'E' | 'S' | 'W';

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface RobotState {
  readonly position: Position;
  readonly orientation: Orientation;
}

export interface Grid {
  readonly maxX: number;
  readonly maxY: number;
}

export type Result = RobotState & { readonly lost: boolean };

export interface RobotProgram {
  readonly start: RobotState;
  readonly instructions: readonly Command[];
}

export interface World {
  readonly grid: Grid;
  readonly robots: readonly RobotProgram[];
}
