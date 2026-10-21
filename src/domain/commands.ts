import { step, turnLeft, turnRight } from './orientations';
import type { RobotState } from './types';

export type Transform = (state: RobotState) => RobotState;

export const commands = {
  L: (state) => ({ ...state, orientation: turnLeft(state.orientation) }),
  R: (state) => ({ ...state, orientation: turnRight(state.orientation) }),
  F: (state) => ({ ...state, position: step(state.position, state.orientation) }),
} satisfies Record<string, Transform>;

export type Command = keyof typeof commands;

export const isCommand = (value: string): value is Command => Object.hasOwn(commands, value);
