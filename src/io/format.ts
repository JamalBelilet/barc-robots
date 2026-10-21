import type { Result } from '../domain/types';

export function formatResult(result: Result): string {
  const base = `${result.position.x} ${result.position.y} ${result.orientation}`;
  return result.lost ? `${base} LOST` : base;
}

export function formatOutput(results: readonly Result[]): string {
  return results.map(formatResult).join('\n');
}
