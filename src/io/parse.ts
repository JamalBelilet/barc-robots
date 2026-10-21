import { isCommand, type Command } from '../domain/commands';
import { ORIENTATIONS } from '../domain/orientations';
import { inBounds } from '../domain/simulate';
import type { Grid, Orientation, RobotProgram, RobotState, World } from '../domain/types';

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export function parseInput(text: string): World {
  const [gridLine, ...robotLines] = splitIntoLines(text);

  if (gridLine === undefined) {
    throw new ParseError('Input is empty: expected the grid size on the first line.');
  }

  const grid = parseGrid(gridLine);
  return { grid, robots: parseRobots(robotLines, grid) };
}

function splitIntoLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function parseRobots(lines: string[], grid: Grid): RobotProgram[] {
  const robots: RobotProgram[] = [];

  for (let i = 0; i < lines.length; i += 2) {
    const positionLine = lines[i];
    if (positionLine === undefined) break;

    const instructionLine = lines[i + 1];
    if (instructionLine === undefined) {
      throw new ParseError(`Robot "${positionLine}" has a position line but no instruction line.`);
    }

    robots.push({
      start: parsePosition(positionLine, grid),
      instructions: parseInstructions(instructionLine),
    });
  }

  return robots;
}

function parseGrid(line: string): Grid {
  const [first, second, ...rest] = line.split(/\s+/);
  if (first === undefined || second === undefined || rest.length > 0) {
    throw new ParseError(`Invalid grid size "${line}": expected two integers "maxX maxY".`);
  }
  return { maxX: parseCoordinate(first, line), maxY: parseCoordinate(second, line) };
}

function parsePosition(line: string, grid: Grid): RobotState {
  const [first, second, third, ...rest] = line.split(/\s+/);
  if (first === undefined || second === undefined || third === undefined || rest.length > 0) {
    throw new ParseError(
      `Invalid robot position "${line}": expected "x y orientation" (e.g. "1 1 E").`,
    );
  }

  const position = { x: parseCoordinate(first, line), y: parseCoordinate(second, line) };
  const orientation = parseOrientation(third, line);

  if (!inBounds(grid, position)) {
    throw new ParseError(
      `Robot start (${position.x}, ${position.y}) is outside the grid (0..${grid.maxX}, 0..${grid.maxY}).`,
    );
  }

  return { position, orientation };
}

function parseInstructions(line: string): Command[] {
  const instructions: Command[] = [];
  for (const character of line) {
    if (!isCommand(character)) {
      throw new ParseError(`Unknown command "${character}" in instruction string "${line}".`);
    }
    instructions.push(character);
  }
  return instructions;
}

function parseCoordinate(token: string, context: string): number {
  if (!/^\d+$/.test(token)) {
    throw new ParseError(
      `Invalid coordinate "${token}" in "${context}": expected a non-negative integer.`,
    );
  }
  return Number(token);
}

function parseOrientation(token: string, context: string): Orientation {
  if (!isOrientation(token)) {
    throw new ParseError(
      `Invalid orientation "${token}" in "${context}": expected one of N, E, S, W.`,
    );
  }
  return token;
}

const isOrientation = (value: string): value is Orientation =>
  (ORIENTATIONS as readonly string[]).includes(value);
