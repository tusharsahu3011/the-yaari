export interface LocationRole {
  name: string;
  description: string;
}

export interface LocationDefinition {
  id: string;
  name: string;
  category: 'Everyday' | 'Adventure' | 'High Stakes' | 'Mystery';
  icon: string;
  description: string;
  roles: LocationRole[];
}

export interface SpyfallPlayer {
  id: string;
  name: string;
  avatar: string;
  isSpy: boolean;
  role?: LocationRole; // null for Spy
  hasRevealed: boolean;
}

export type SpyfallPhase =
  | 'setup'
  | 'reveal'
  | 'investigation'
  | 'accusation'
  | 'spy_guess'
  | 'game_over';

export interface SpyfallGameOptions {
  timerMinutes: number; // typically 5 to 10
  spyCount: number; // 1 or 2
  selectedCategories?: string[];
}

export interface SpyfallGameState {
  phase: SpyfallPhase;
  players: SpyfallPlayer[];
  currentRevealIndex: number;
  location: LocationDefinition;
  options: SpyfallGameOptions;
  timerSeconds: number;
  isTimerRunning: boolean;
  firstQuestionPlayerId: string;
  
  // Accusation & Voting
  accusedPlayerId: string | null;
  accusationVotes: Record<string, boolean>; // voterId -> isGuilty
  
  // Spy Guess
  spyGuessLocationId: string | null;
  
  // End Game
  winner: 'spies' | 'innocents' | null;
  winReason: string | null;
}

