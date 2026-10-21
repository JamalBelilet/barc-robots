import type { Orientation, Position } from './types';

export const ORIENTATIONS = ['N', 'E', 'S', 'W'] as const;

const LEFT_TURNS: Record<Orientation, Orientation> = { N: 'W', W: 'S', S: 'E', E: 'N' };
const RIGHT_TURNS: Record<Orientation, Orientation> = { N: 'E', E: 'S', S: 'W', W: 'N' };

const MOVES: Record<Orientation, { dx: number; dy: number }> = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

export const turnLeft = (orientation: Orientation): Orientation => LEFT_TURNS[orientation];
export const turnRight = (orientation: Orientation): Orientation => RIGHT_TURNS[orientation];

export function step(position: Position, orientation: Orientation): Position {
  const { dx, dy } = MOVES[orientation];
  return { x: position.x + dx, y: position.y + dy };
}
