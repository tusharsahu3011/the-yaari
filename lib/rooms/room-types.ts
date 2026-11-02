import { Card, Trick, TrickResolution, GameEventRecord } from '@/game-engine/bhabhi';

export interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
  isBot: boolean;
  avatar: string;
  isReady: boolean;
  botDifficulty?: 'easy' | 'normal' | 'smart';
  cardCount: number;
  isSafe: boolean;
  safeRank?: number;
}

export interface MaskedRoomPlayer extends RoomPlayer {
  // Hand is ONLY populated for the requesting player's own ID!
  hand?: Card[];
}

export interface RoomChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface MaskedRoomState {
  roomCode: string;
  createdAt: number;
  hostId: string;
  status: 'lobby' | 'playing' | 'game_over';
  players: MaskedRoomPlayer[];
  activeTrick: Trick | null;
  discardCount: number;
  currentTurnPlayerId: string | null;
  currentTurnIndex: number;
  lastResolution: TrickResolution | null;
  bhabhiPlayerId?: string;
  bhabhiPlayerName?: string;
  chatMessages: RoomChatMessage[];
  events: GameEventRecord[];
  yourHand?: Card[];
  playableCardIds?: string[];
  canStrikeThulla?: boolean;
  isYourTurn?: boolean;
}
