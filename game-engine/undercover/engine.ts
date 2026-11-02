import {
  RecommendedRoles,
  UndercoverGameState,
  UndercoverPlayer,
  UndercoverRole,
  UndercoverWinner,
  WordPair,
} from './types';
import { getRandomWordPair } from './words';

export const AGENT_COLORS = [
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#818cf8', // Indigo
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export const RANDOM_AGENT_NAMES = [
  'Alex', 'Jordan', 'Maya', 'Liam', 'Chloe', 'Sam',
  'Leo', 'Zara', 'Ethan', 'Priya', 'Noah', 'Elena',
  'Marcus', 'Sophia', 'Rohan', 'Kai', 'Aria', 'Lucas',
  'Aarav', 'Ananya', 'Vikram', 'Meera', 'Kabir', 'Isha',
];

export function getRecommendedRoles(playerCount: number): RecommendedRoles {
  if (playerCount < 3) return { undercovers: 1, mrWhites: 0 };
  if (playerCount <= 4) return { undercovers: 1, mrWhites: 0 };
  if (playerCount <= 6) return { undercovers: 1, mrWhites: 1 };
  if (playerCount <= 10) return { undercovers: 2, mrWhites: 1 };
  return {
    undercovers: Math.max(2, Math.floor(playerCount / 4)),
    mrWhites: 1,
  };
}

export function checkMrWhiteGuess(guess: string, secretWord: string): boolean {
  if (!guess || !secretWord) return false;
  const cleanGuess = guess.trim().toLowerCase();
  const cleanSecret = secretWord.trim().toLowerCase();

  if (cleanGuess === cleanSecret) return true;
  if (cleanSecret.includes(cleanGuess) && cleanGuess.length >= 3) return true;
  if (cleanGuess.includes(cleanSecret) && cleanSecret.length >= 3) return true;

  return false;
}

export interface UndercoverSetupOptions {
  undercoverCount?: number;
  mrWhiteCount?: number;
  category?: string;
  customPair?: { civilian: string; undercover: string };
  rng?: () => number;
}

export function initUndercoverGame(
  playerConfigs: { id: string; name: string; avatar?: string }[],
  options: UndercoverSetupOptions = {}
): UndercoverGameState {
  const n = playerConfigs.length;
  if (n < 3) {
    throw new Error(`Undercover requires at least 3 players. Provided: ${n}`);
  }

  const rng = options.rng || Math.random;
  const wordPair = getRandomWordPair(options.category || 'all', rng, options.customPair);

  // Recommended role distribution fallback
  const rec = getRecommendedRoles(n);
  const undercoverCount = options.undercoverCount !== undefined ? options.undercoverCount : rec.undercovers;
  const mrWhiteCount = options.mrWhiteCount !== undefined ? options.mrWhiteCount : rec.mrWhites;
  const civilianCount = n - undercoverCount - mrWhiteCount;

  if (civilianCount < 1) {
    throw new Error('Not enough civilians for the selected number of special roles.');
  }

  // Pool of roles
  const roles: UndercoverRole[] = [
    ...Array(civilianCount).fill('civilian'),
    ...Array(undercoverCount).fill('undercover'),
    ...Array(mrWhiteCount).fill('mr_white'),
  ];

  // Fisher-Yates shuffle
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  const defaultAvatars = ['🕵️', '🎩', '🕶️', '🔍', '🦊', '🦉', '🦁', '🐼', '🚀', '⭐', '🐯', '🦅'];

  const players: UndercoverPlayer[] = playerConfigs.map((cfg, idx) => {
    const role = roles[idx];
    let secretWord: string | undefined;

    if (role === 'civilian') {
      secretWord = wordPair.civilianWord;
    } else if (role === 'undercover') {
      secretWord = wordPair.undercoverWord;
    } else {
      secretWord = undefined; // Mr. White has no word!
    }

    return {
      id: cfg.id,
      name: cfg.name.trim(),
      avatar: cfg.avatar || defaultAvatars[idx % defaultAvatars.length],
      color: AGENT_COLORS[idx % AGENT_COLORS.length],
      role,
      secretWord,
      isEliminated: false,
      eliminatedRound: null,
      votesReceived: 0,
      hasViewedSecret: false,
      descriptionHistory: [],
    };
  });

  return {
    players,
    phase: 'role_reveal',
    wordPair,
    roundNumber: 1,
    currentDescriberIndex: 0,
    revealPlayerIndex: 0,
    votes: {},
    winner: null,
    history: [`Game initialized with ${n} players. Secret identities assigned.`],
  };
}

export function advanceSecretView(
  prevState: UndercoverGameState,
  playerIndex: number
): UndercoverGameState {
  const state: UndercoverGameState = {
    ...prevState,
    players: prevState.players.map((p, idx) =>
      idx === playerIndex ? { ...p, hasViewedSecret: true } : p
    ),
  };

  const nextRevealIdx = playerIndex + 1;
  if (nextRevealIdx >= state.players.length) {
    // All players have viewed their role! Start description round
    state.phase = 'describing';
    state.revealPlayerIndex = nextRevealIdx;
    state.currentDescriberIndex = 0;
    state.history.push('All agents have reviewed their confidential briefings. Round 1 clues begin!');
  } else {
    state.revealPlayerIndex = nextRevealIdx;
  }

  return state;
}

export function submitPlayerDescription(
  prevState: UndercoverGameState,
  playerId: string,
  text: string
): UndercoverGameState {
  const state: UndercoverGameState = {
    ...prevState,
    players: prevState.players.map((p) => ({
      ...p,
      descriptionHistory: [...p.descriptionHistory],
    })),
    history: [...prevState.history],
  };

  const playerIdx = state.players.findIndex((p) => p.id === playerId);
  if (playerIdx === -1) return state;

  state.players[playerIdx].descriptionHistory.push(text.trim());
  state.history.push(`${state.players[playerIdx].name}: "${text.trim()}"`);

  // Find next active (non-eliminated) describer
  let nextIdx = state.currentDescriberIndex + 1;
  while (nextIdx < state.players.length && state.players[nextIdx].isEliminated) {
    nextIdx++;
  }

  if (nextIdx >= state.players.length) {
    // All active players described! Move to voting
    state.phase = 'voting';
    state.votes = {};
    state.history.push('All agents have spoken. Time to deliberate and vote!');
  } else {
    state.currentDescriberIndex = nextIdx;
  }

  return state;
}

export function castUndercoverVote(
  prevState: UndercoverGameState,
  voterId: string,
  targetId: string
): UndercoverGameState {
  const state: UndercoverGameState = {
    ...prevState,
    votes: { ...prevState.votes, [voterId]: targetId },
  };

  const activePlayers = state.players.filter((p) => !p.isEliminated);
  const totalVotesCast = Object.keys(state.votes).length;

  if (totalVotesCast === activePlayers.length) {
    return resolveVoting(state);
  }

  return state;
}

export function resolveVoting(prevState: UndercoverGameState): UndercoverGameState {
  const state: UndercoverGameState = {
    ...prevState,
    players: prevState.players.map((p) => ({ ...p })),
    history: [...prevState.history],
  };

  // Tally votes
  const tally: Record<string, number> = {};
  Object.values(state.votes).forEach((targetId) => {
    tally[targetId] = (tally[targetId] || 0) + 1;
  });

  let maxVotes = 0;
  let eliminatedId = '';

  Object.entries(tally).forEach(([targetId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      eliminatedId = targetId;
    }
  });

  const eliminatedPlayer = state.players.find((p) => p.id === eliminatedId);
  if (!eliminatedPlayer) return state;

  eliminatedPlayer.isEliminated = true;
  eliminatedPlayer.eliminatedRound = state.roundNumber;
  eliminatedPlayer.votesReceived = maxVotes;
  state.eliminatedPlayerId = eliminatedId;
  state.history.push(
    `🗳️ ${eliminatedPlayer.name} was eliminated with ${maxVotes} votes! Role unmasked: ${eliminatedPlayer.role.toUpperCase()}.`
  );

  // If eliminated player was Mr. White, give them 1 guess to steal the win!
  if (eliminatedPlayer.role === 'mr_white') {
    state.phase = 'mr_white_guess';
    state.mrWhiteGuesserId = eliminatedId;
    state.history.push(
      `🎩 ${eliminatedPlayer.name} is Mr. White! They now have ONE chance to guess the Civilians' secret word!`
    );
    return state;
  }

  return evaluateWinConditions(state);
}

export function submitMrWhiteWordGuess(
  prevState: UndercoverGameState,
  guessedWord: string
): UndercoverGameState {
  const state: UndercoverGameState = {
    ...prevState,
    history: [...prevState.history],
  };

  const isCorrect = checkMrWhiteGuess(guessedWord, state.wordPair.civilianWord);

  if (isCorrect) {
    // Mr. White guessed correctly!
    state.winner = 'mr_white';
    state.phase = 'game_over';
    const mrWhitePlayer = state.players.find((p) => p.id === state.mrWhiteGuesserId);
    state.winReason = `🎩 ${mrWhitePlayer?.name || 'Mr. White'} correctly deduced the secret word "${state.wordPair.civilianWord}" and pulled off the ultimate heist!`;
    state.history.push(state.winReason);
    return state;
  }

  state.history.push(
    `❌ Mr. White guessed "${guessedWord}", which was incorrect! The Civilians' secret word remains safe.`
  );

  return evaluateWinConditions(state);
}

export function evaluateWinConditions(state: UndercoverGameState): UndercoverGameState {
  const active = state.players.filter((p) => !p.isEliminated);
  const activeCivilians = active.filter((p) => p.role === 'civilian').length;
  const activeUndercovers = active.filter((p) => p.role === 'undercover').length;
  const activeMrWhites = active.filter((p) => p.role === 'mr_white').length;
  const totalThreats = activeUndercovers + activeMrWhites;

  // 1. Civilians win if all Undercovers and Mr. Whites are eliminated!
  if (totalThreats === 0) {
    state.winner = 'civilians';
    state.phase = 'game_over';
    state.winReason = '🎉 Civilians rooted out all the impostors! Civilians win!';
    state.history.push(state.winReason);
    return state;
  }

  // 2. Undercovers win if Undercovers >= Civilians
  if (activeUndercovers >= activeCivilians) {
    state.winner = 'undercover';
    state.phase = 'game_over';
    state.winReason = '🕵️ The Undercovers have overwhelmed the civilians! Undercovers win!';
    state.history.push(state.winReason);
    return state;
  }

  // 3. Mr. White wins if only 1 civilian remains and Mr White is alive with no undercovers
  if (activeCivilians <= 1 && totalThreats >= 1 && activeUndercovers === 0) {
    state.winner = 'mr_white';
    state.phase = 'game_over';
    state.winReason = '🎩 Mr. White successfully blended in and outlasted the civilians!';
    state.history.push(state.winReason);
    return state;
  }

  // 4. Game continues: next round
  state.roundNumber += 1;
  state.phase = 'describing';
  state.votes = {};

  // Find first active player to describe
  const firstActiveIdx = state.players.findIndex((p) => !p.isEliminated);
  state.currentDescriberIndex = firstActiveIdx !== -1 ? firstActiveIdx : 0;
  state.history.push(`Round ${state.roundNumber} begins!`);

  return state;
}
