import {
  BhabhiGameState,
  Card,
  PlayerConfig,
  chooseBotMove,
  createInitialGameState,
  getPlayableCards,
  playCardAction,
  canStrikeThulla,
} from '@/game-engine/bhabhi';
import { MaskedRoomPlayer, MaskedRoomState, RoomChatMessage, RoomPlayer } from './room-types';

interface InternalRoom {
  roomCode: string;
  createdAt: number;
  hostId: string;
  status: 'lobby' | 'playing' | 'game_over';
  players: RoomPlayer[];
  gameState: BhabhiGameState | null;
  chatMessages: RoomChatMessage[];
  subscribers: Set<(playerId: string) => void>;
  botTimeoutId?: NodeJS.Timeout;
}

// Global store to survive hot-reloading in Next.js development
declare global {
  var __gameshub_rooms: Map<string, InternalRoom> | undefined;
}

if (!globalThis.__gameshub_rooms) {
  globalThis.__gameshub_rooms = new Map();
}

const rooms = globalThis.__gameshub_rooms;

export function getOrCreateRoom(
  roomCode: string,
  host?: { id: string; name: string; avatar: string }
): InternalRoom {
  const code = roomCode.toUpperCase();
  let room = rooms.get(code);

  if (!room) {
    const initialPlayers: RoomPlayer[] = [];
    if (host) {
      initialPlayers.push({
        id: host.id,
        name: host.name,
        isHost: true,
        isBot: false,
        avatar: host.avatar,
        isReady: true,
        cardCount: 0,
        isSafe: false,
      });
    }

    room = {
      roomCode: code,
      createdAt: Date.now(),
      hostId: host ? host.id : '',
      status: 'lobby',
      players: initialPlayers,
      gameState: null,
      chatMessages: [
        {
          id: `sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          avatar: '🎮',
          text: `Welcome to Room ${code}! Share this code with friends to join.`,
          timestamp: Date.now(),
          isSystem: true,
        },
      ],
      subscribers: new Set(),
    };
    rooms.set(code, room);
  } else if (host && room.players.length === 0) {
    room.hostId = host.id;
    room.players.push({
      id: host.id,
      name: host.name,
      isHost: true,
      isBot: false,
      avatar: host.avatar,
      isReady: true,
      cardCount: 0,
      isSafe: false,
    });
  }

  return room;
}

export function joinRoom(
  roomCode: string,
  player: { id: string; name: string; avatar: string }
): { success: boolean; error?: string } {
  const room = getOrCreateRoom(roomCode);

  if (room.status !== 'lobby') {
    return { success: false, error: 'Game is already in progress in this room.' };
  }

  const existingIdx = room.players.findIndex((p) => p.id === player.id);
  if (existingIdx !== -1) {
    // Update existing player's details
    room.players[existingIdx].name = player.name;
    room.players[existingIdx].avatar = player.avatar;
    notifyRoomSubscribers(room);
    return { success: true };
  }

  if (room.players.length >= 6) {
    return { success: false, error: 'Room is full (max 6 players).' };
  }

  const isHost = room.players.length === 0 || room.hostId === player.id;
  if (isHost && !room.hostId) {
    room.hostId = player.id;
  }

  room.players.push({
    id: player.id,
    name: player.name,
    isHost,
    isBot: false,
    avatar: player.avatar,
    isReady: true,
    cardCount: 0,
    isSafe: false,
  });

  room.chatMessages.push({
    id: `join-${Date.now()}`,
    senderId: 'system',
    senderName: 'System',
    avatar: '👋',
    text: `${player.name} joined the room.`,
    timestamp: Date.now(),
    isSystem: true,
  });

  notifyRoomSubscribers(room);
  return { success: true };
}

export function addBotToRoom(
  roomCode: string,
  hostId: string
): { success: boolean; error?: string } {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return { success: false, error: 'Room not found' };
  if (room.hostId !== hostId) return { success: false, error: 'Only the host can add bots' };
  if (room.players.length >= 6) return { success: false, error: 'Room is full' };

  const botCount = room.players.filter((p) => p.isBot).length + 1;
  const botNames = ['Rohit (Smart)', 'Priya (Normal)', 'Aman (Easy)', 'Simran', 'Kabir'];
  const botAvatars = ['🤖', '🦊', '🐼', '🦁', '🐯'];

  const newBot: RoomPlayer = {
    id: `bot-${Date.now()}-${botCount}`,
    name: `Bot ${botNames[(botCount - 1) % botNames.length]}`,
    isHost: false,
    isBot: true,
    avatar: botAvatars[(botCount - 1) % botAvatars.length],
    isReady: true,
    botDifficulty: botCount % 2 === 0 ? 'smart' : 'normal',
    cardCount: 0,
    isSafe: false,
  };

  room.players.push(newBot);
  room.chatMessages.push({
    id: `bot-join-${Date.now()}`,
    senderId: 'system',
    senderName: 'System',
    avatar: '🤖',
    text: `${newBot.name} joined the table.`,
    timestamp: Date.now(),
    isSystem: true,
  });

  notifyRoomSubscribers(room);
  return { success: true };
}

export function removePlayerFromRoom(
  roomCode: string,
  playerId: string,
  requesterId: string
): { success: boolean; error?: string } {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return { success: false, error: 'Room not found' };

  // Can remove if self or if requester is host
  if (requesterId !== playerId && room.hostId !== requesterId) {
    return { success: false, error: 'Unauthorized to remove player' };
  }

  const removed = room.players.find((p) => p.id === playerId);
  room.players = room.players.filter((p) => p.id !== playerId);

  if (removed) {
    room.chatMessages.push({
      id: `leave-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      avatar: '🚪',
      text: `${removed.name} left the room.`,
      timestamp: Date.now(),
      isSystem: true,
    });
  }

  // If host left, assign next human as host
  if (room.hostId === playerId && room.players.length > 0) {
    const nextHuman = room.players.find((p) => !p.isBot) || room.players[0];
    room.hostId = nextHuman.id;
    nextHuman.isHost = true;
  }

  notifyRoomSubscribers(room);
  return { success: true };
}

export function startRoomGame(
  roomCode: string,
  hostId: string
): { success: boolean; error?: string } {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return { success: false, error: 'Room not found' };
  if (room.hostId !== hostId) return { success: false, error: 'Only the host can start the game' };
  if (room.players.length < 3 || room.players.length > 6) {
    return {
      success: false,
      error: `Bhabhi requires 3 to 6 players. Currently have ${room.players.length}.`,
    };
  }

  const playerConfigs: PlayerConfig[] = room.players.map((p) => ({
    id: p.id,
    name: p.name,
    isBot: p.isBot,
    avatar: p.avatar,
    botDifficulty: p.botDifficulty,
  }));

  const initialEngineState = createInitialGameState(playerConfigs);
  room.gameState = initialEngineState;
  room.status = 'playing';

  // Sync player hands count
  room.players.forEach((p, idx) => {
    p.cardCount = initialEngineState.players[idx].hand.length;
    p.isSafe = initialEngineState.players[idx].isSafe;
  });

  room.chatMessages.push({
    id: `start-${Date.now()}`,
    senderId: 'system',
    senderName: 'System',
    avatar: '🃏',
    text: `Game has started! Cards are dealt. ${initialEngineState.players[initialEngineState.currentTurnIndex].name} holds the Ace of Spades (A♠)!`,
    timestamp: Date.now(),
    isSystem: true,
  });

  notifyRoomSubscribers(room);

  // If initial turn belongs to an AI bot, trigger bot loop
  checkAndTriggerBotMove(room);

  return { success: true };
}

export function playRoomCard(
  roomCode: string,
  playerId: string,
  card: Card
): { success: boolean; error?: string } {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return { success: false, error: 'Room not found' };
  if (room.status !== 'playing' || !room.gameState) {
    return { success: false, error: 'Game is not actively playing' };
  }

  const playerIndex = room.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) {
    return { success: false, error: 'Player not in room' };
  }

  if (room.gameState.currentTurnIndex !== playerIndex) {
    return { success: false, error: 'Not your turn' };
  }

  const { state: nextState, error } = playCardAction(room.gameState, playerIndex, card);
  if (error) {
    return { success: false, error };
  }

  room.gameState = nextState;

  // Update card counts
  room.players.forEach((p, idx) => {
    p.cardCount = nextState.players[idx].hand.length;
    p.isSafe = nextState.players[idx].isSafe;
    p.safeRank = nextState.players[idx].safeRank;
  });

  if (nextState.phase === 'game_over') {
    room.status = 'game_over';
  }

  notifyRoomSubscribers(room);

  // Check if next turn is an AI bot
  if (room.status === 'playing') {
    checkAndTriggerBotMove(room);
  }

  return { success: true };
}

function checkAndTriggerBotMove(room: InternalRoom) {
  if (room.status !== 'playing' || !room.gameState) return;

  const currentIdx = room.gameState.currentTurnIndex;
  const currentPlayer = room.gameState.players[currentIdx];

  if (currentPlayer && currentPlayer.isBot && !currentPlayer.isSafe) {
    clearTimeout(room.botTimeoutId);
    room.botTimeoutId = setTimeout(() => {
      if (!room.gameState || room.status !== 'playing') return;
      try {
        const botMove = chooseBotMove(currentIdx, room.gameState);
        const { state: nextState } = playCardAction(room.gameState, currentIdx, botMove);
        room.gameState = nextState;

        room.players.forEach((p, idx) => {
          p.cardCount = nextState.players[idx].hand.length;
          p.isSafe = nextState.players[idx].isSafe;
          p.safeRank = nextState.players[idx].safeRank;
        });

        if (nextState.phase === 'game_over') {
          room.status = 'game_over';
        }

        notifyRoomSubscribers(room);

        // Chain next bot move if still bot's turn
        if (room.status === 'playing') {
          checkAndTriggerBotMove(room);
        }
      } catch (err) {
        console.error('Error during bot move execution in room', room.roomCode, err);
      }
    }, 1000);
  }
}

export function sendRoomChatMessage(
  roomCode: string,
  senderId: string,
  text: string
): { success: boolean; error?: string } {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return { success: false, error: 'Room not found' };

  const player = room.players.find((p) => p.id === senderId);
  const senderName = player ? player.name : 'Spectator';
  const avatar = player ? player.avatar : '👤';

  room.chatMessages.push({
    id: `msg-${Date.now()}`,
    senderId,
    senderName,
    avatar,
    text,
    timestamp: Date.now(),
  });

  notifyRoomSubscribers(room);
  return { success: true };
}

/**
 * Returns a masked representation of the room state for a specific player.
 * CARDS PRIVACY: Only the requesting player receives their private hand!
 */
export function getMaskedRoomState(
  roomCode: string,
  playerId?: string
): MaskedRoomState | null {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return null;

  const currentTurnIdx = room.gameState ? room.gameState.currentTurnIndex : 0;
  const currentTurnPlayer = room.players[currentTurnIdx];

  const playerIndex = playerId
    ? room.players.findIndex((p) => p.id === playerId)
    : -1;

  let yourHand: Card[] | undefined;
  let playableCardIds: string[] | undefined;
  let canStrikeThullaFlag: boolean | undefined;
  const isYourTurn = playerIndex !== -1 && playerIndex === currentTurnIdx;

  if (room.gameState && playerIndex !== -1) {
    yourHand = room.gameState.players[playerIndex]?.hand;
    if (isYourTurn && room.status === 'playing') {
      const playable = getPlayableCards(playerIndex, room.gameState);
      playableCardIds = playable.map((c) => c.id);
      canStrikeThullaFlag = canStrikeThulla(playerIndex, room.gameState);
    }
  }

  const maskedPlayers: MaskedRoomPlayer[] = room.players.map((p, idx) => {
    const isSelf = p.id === playerId;
    return {
      ...p,
      // Strictly expose private hand ONLY to self
      hand: isSelf && room.gameState ? room.gameState.players[idx]?.hand : undefined,
    };
  });

  const bhabhiIdx = room.gameState?.bhabhiPlayerIndex;
  const bhabhiPlayer =
    bhabhiIdx !== undefined ? room.players[bhabhiIdx] : undefined;

  return {
    roomCode: room.roomCode,
    createdAt: room.createdAt,
    hostId: room.hostId,
    status: room.status,
    players: maskedPlayers,
    activeTrick: room.gameState ? room.gameState.activeTrick : null,
    discardCount: room.gameState ? room.gameState.discardPile.length : 0,
    currentTurnPlayerId: currentTurnPlayer ? currentTurnPlayer.id : null,
    currentTurnIndex: currentTurnIdx,
    lastResolution: room.gameState ? room.gameState.lastResolution : null,
    bhabhiPlayerId: bhabhiPlayer?.id,
    bhabhiPlayerName: bhabhiPlayer?.name,
    chatMessages: room.chatMessages.slice(-50), // Last 50 messages
    events: room.gameState ? room.gameState.history.slice(-20) : [],
    yourHand,
    playableCardIds,
    canStrikeThulla: canStrikeThullaFlag,
    isYourTurn,
  };
}

export function subscribeToRoom(
  roomCode: string,
  callback: (playerId: string) => void
): () => void {
  const room = getOrCreateRoom(roomCode);
  room.subscribers.add(callback);
  return () => {
    room.subscribers.delete(callback);
  };
}

function notifyRoomSubscribers(room: InternalRoom) {
  room.subscribers.forEach((cb) => {
    try {
      cb(room.roomCode);
    } catch (e) {
      console.error('Subscriber notify error', e);
    }
  });
}

