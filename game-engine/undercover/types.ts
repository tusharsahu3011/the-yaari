export type UndercoverRole = 'civilian' | 'undercover' | 'mr_white';

export interface WordPair {
  id: string;
  category: string;
  civilianWord: string;
  undercoverWord: string;
}

export interface UndercoverPlayer {
  id: string;
  name: string;
  avatar: string;
  role: UndercoverRole;
  secretWord?: string; // Empty for Mr. White
  isEliminated: boolean;
  hasViewedSecret: boolean;
  descriptionHistory: string[];
}

export type UndercoverPhase =
  | 'setup'
  | 'role_reveal'
  | 'describing'
  | 'voting'
  | 'mr_white_guess'
  | 'game_over';

export interface UndercoverVote {
  voterId: string;
  targetId: string;
}

export type UndercoverWinner = 'civilians' | 'undercover' | 'mr_white' | null;

export interface UndercoverGameState {
  players: UndercoverPlayer[];
  phase: UndercoverPhase;
  wordPair: WordPair;
  roundNumber: number;
  currentDescriberIndex: number;
  revealPlayerIndex: number;
  votes: Record<string, string>; // voterId -> targetId
  eliminatedPlayerId?: string;
  mrWhiteGuesserId?: string;
  winner: UndercoverWinner;
  winReason?: string;
  history: string[];
}
