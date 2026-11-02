import { PlayerState } from './types';

/**
 * Returns the count of players who are still active (not yet safe).
 */
export function getActivePlayerCount(players: PlayerState[]): number {
  return players.filter((p) => !p.isSafe).length;
}

/**
 * Checks if the game has ended (only 1 or 0 players remain active).
 */
export function isGameOver(players: PlayerState[]): boolean {
  return getActivePlayerCount(players) <= 1;
}

/**
 * Finds the index of the player who lost (the Bhabhi) when the game ends.
 */
export function getBhabhiPlayerIndex(players: PlayerState[]): number | undefined {
  if (!isGameOver(players)) return undefined;
  const idx = players.findIndex((p) => !p.isSafe);
  return idx !== -1 ? idx : undefined;
}

/**
 * Finds the next active (non-safe) player in clockwise order starting after fromIndex.
 */
export function getNextActivePlayerIndex(
  fromIndex: number,
  players: PlayerState[]
): number {
  const n = players.length;
  for (let i = 1; i <= n; i++) {
    const candidateIdx = (fromIndex + i) % n;
    if (!players[candidateIdx].isSafe) {
      return candidateIdx;
    }
  }
  return fromIndex;
}
