import { BhabhiGameState, PlayerState } from './types';

export interface PlayerResultSummary {
  playerIndex: number;
  name: string;
  isBot: boolean;
  avatar: string;
  isBhabhi: boolean;
  rank: number; // 1 = 1st safe, 2 = 2nd safe, ..., last = Bhabhi
  statusLabel: string;
}

export interface BhabhiGameSummary {
  totalTricks: number;
  totalCardsDiscarded: number;
  bhabhi: PlayerResultSummary;
  rankings: PlayerResultSummary[];
}

export function computeGameSummary(state: BhabhiGameState): BhabhiGameSummary {
  const bhabhiIdx = state.bhabhiPlayerIndex;

  const rankings: PlayerResultSummary[] = state.players.map((p, idx) => {
    const isBhabhi = idx === bhabhiIdx;
    const rank = isBhabhi ? state.players.length : p.safeRank || state.players.length;
    const statusLabel = isBhabhi ? '👑 BHABHI (Loser)' : `Rank #${rank} (Escaped)`;

    return {
      playerIndex: idx,
      name: p.name,
      isBot: p.isBot,
      avatar: p.avatar,
      isBhabhi,
      rank,
      statusLabel,
    };
  });

  // Sort: Rank 1 first, Rank 2 second, ..., Bhabhi last
  rankings.sort((a, b) => a.rank - b.rank);

  const bhabhi = rankings.find((r) => r.isBhabhi) || rankings[rankings.length - 1];

  return {
    totalTricks: state.activeTrick.trickNumber,
    totalCardsDiscarded: state.discardPile.length,
    bhabhi,
    rankings,
  };
}

