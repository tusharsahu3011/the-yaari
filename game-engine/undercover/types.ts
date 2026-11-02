export type UndercoverRole = 'civilian' | 'undercover' | 'mr_white';

export interface RoleMeta {
  name: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  badgeClass: string;
  description: string;
}

export const ROLE_INFO: Record<UndercoverRole, RoleMeta> = {
  civilian: {
    name: 'Civilian',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.4)',
    icon: 'Shield',
    badgeClass: 'badge-cyan',
    description: 'You share the secret word with the other civilians. Find the impostors!',
  },
  undercover: {
    name: 'Undercover',
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.15)',
    border: 'rgba(244, 63, 94, 0.4)',
    icon: 'EyeOff',
    badgeClass: 'badge-rose',
    description: 'You have a slightly different word. Blend in and mislead the civilians!',
  },
  mr_white: {
    name: 'Mr. White',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.4)',
    icon: 'HelpCircle',
    badgeClass: 'badge-purple',
    description: 'You have NO word at all! Bluff your way through and deduce the civilian word.',
  },
};

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
  color: string;
  role: UndercoverRole;
  secretWord?: string; // Undefined for Mr. White
  isEliminated: boolean;
  eliminatedRound?: number | null;
  votesReceived: number;
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

export interface RecommendedRoles {
  undercovers: number;
  mrWhites: number;
}

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
