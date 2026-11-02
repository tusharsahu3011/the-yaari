export type Suit = 'S' | 'H' | 'D' | 'C';

// 2 through 10, J=11, Q=12, K=13, A=14
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  id: string; // e.g. "AS", "10H", "2C", "KD"
  suit: Suit;
  rank: Rank;
}

export interface PlayerConfig {
  id: string;
  name: string;
  isBot: boolean;
  avatar?: string;
  botDifficulty?: 'easy' | 'normal' | 'smart';
}

export interface PlayerState {
  id: string;
  name: string;
  isBot: boolean;
  avatar: string;
  hand: Card[];
  isSafe: boolean;
  safeRank?: number; // 1 = 1st to get away, etc.
  botDifficulty?: 'easy' | 'normal' | 'smart';
}

export interface PlayedCard {
  playerIndex: number;
  card: Card;
  isThulla?: boolean;
}

export interface Trick {
  trickNumber: number;
  leadPlayerIndex: number;
  leadSuit: Suit | null;
  cards: PlayedCard[];
}

export type TrickResolutionType = 'CLEAN_SWEEP' | 'THULLA';

export interface TrickResolution {
  type: TrickResolutionType;
  // If CLEAN_SWEEP:
  winnerIndex?: number;
  winningCard?: Card;
  discardedCards?: Card[];
  // If THULLA:
  thullaPlayerIndex?: number;
  highestLeadPlayerIndex?: number;
  highestLeadCard?: Card;
  penaltyCards?: Card[];
  thullaCard?: Card;
  // Safe players who emptied their hand upon this trick resolution
  newlySafePlayers: number[];
}

export type GamePhase =
  | 'dealing'
  | 'playing'
  | 'resolving_trick'
  | 'game_over';

export interface GameEventRecord {
  id: string;
  timestamp: number;
  type:
    | 'GAME_START'
    | 'CARD_PLAYED'
    | 'CLEAN_SWEEP'
    | 'THULLA'
    | 'PLAYER_SAFE'
    | 'GAME_OVER';
  message: string;
  playerIndex?: number;
  card?: Card;
  resolution?: TrickResolution;
}

export interface BhabhiGameState {
  players: PlayerState[];
  currentTurnIndex: number;
  activeTrick: Trick;
  discardPile: Card[];
  firstTrick: boolean;
  phase: GamePhase;
  lastResolution: TrickResolution | null;
  bhabhiPlayerIndex?: number;
  safeCount: number;
  history: GameEventRecord[];
}

