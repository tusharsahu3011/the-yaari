import { ALL_LOCATIONS } from './locations';
import {
  LocationDefinition,
  SpyfallGameOptions,
  SpyfallGameState,
  SpyfallPlayer,
} from './types';

// Deterministic or standard pseudo-random helper
function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createSpyfallGame(
  playerConfigs: { id: string; name: string; avatar: string }[],
  options: Partial<SpyfallGameOptions> = {},
  rng = Math.random
): SpyfallGameState {
  if (playerConfigs.length < 3) {
    throw new Error('Spyfall requires at least 3 players.');
  }

  const timerMinutes = Math.min(15, Math.max(3, options.timerMinutes ?? 8));
  const spyCount = Math.min(Math.floor(playerConfigs.length / 2), Math.max(1, options.spyCount ?? 1));

  // 1. Pick a random location
  let pool = ALL_LOCATIONS;
  if (options.selectedCategories && options.selectedCategories.length > 0 && !options.selectedCategories.includes('All')) {
    pool = ALL_LOCATIONS.filter((l) => options.selectedCategories!.includes(l.category));
    if (pool.length === 0) pool = ALL_LOCATIONS;
  }
  const locationIndex = Math.floor(rng() * pool.length);
  const location = pool[locationIndex];

  // 2. Assign Spies
  const shuffledIndexes = shuffle(
    playerConfigs.map((_, i) => i),
    rng
  );
  const spyIndexes = new Set(shuffledIndexes.slice(0, spyCount));

  // 3. Assign Roles to Innocents
  const availableRoles = shuffle(location.roles, rng);
  let roleIdx = 0;

  const players: SpyfallPlayer[] = playerConfigs.map((p, idx) => {
    const isSpy = spyIndexes.has(idx);
    let role = undefined;
    if (!isSpy) {
      role = availableRoles[roleIdx % availableRoles.length];
      roleIdx++;
    }
    return {
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isSpy,
      role,
      hasRevealed: false,
    };
  });

  // 4. Select First Question Asker (prefer non-spy for balanced kickoff)
  const nonSpyPlayers = players.filter((p) => !p.isSpy);
  const firstQuestionPlayerId =
    nonSpyPlayers.length > 0
      ? nonSpyPlayers[Math.floor(rng() * nonSpyPlayers.length)].id
      : players[0].id;

  return {
    phase: 'reveal',
    players,
    currentRevealIndex: 0,
    location,
    options: {
      timerMinutes,
      spyCount,
      selectedCategories: options.selectedCategories,
    },
    timerSeconds: timerMinutes * 60,
    isTimerRunning: false,
    firstQuestionPlayerId,
    accusedPlayerId: null,
    accusationVotes: {},
    spyGuessLocationId: null,
    winner: null,
    winReason: null,
  };
}

export function advanceReveal(state: SpyfallGameState): SpyfallGameState {
  const currentIdx = state.currentRevealIndex;
  const updatedPlayers = state.players.map((p, idx) =>
    idx === currentIdx ? { ...p, hasRevealed: true } : p
  );

  const nextIdx = currentIdx + 1;
  if (nextIdx >= state.players.length) {
    // All players have reviewed their identity! Start interrogation.
    return {
      ...state,
      players: updatedPlayers,
      currentRevealIndex: nextIdx,
      phase: 'investigation',
      isTimerRunning: true,
    };
  }

  return {
    ...state,
    players: updatedPlayers,
    currentRevealIndex: nextIdx,
  };
}

export function tickTimer(state: SpyfallGameState): SpyfallGameState {
  if (state.phase !== 'investigation' || !state.isTimerRunning) {
    return state;
  }

  const nextSeconds = state.timerSeconds - 1;
  if (nextSeconds <= 0) {
    // Time expired! Must hold an accusation vote or Spies escape.
    return {
      ...state,
      timerSeconds: 0,
      isTimerRunning: false,
      phase: 'accusation',
      accusedPlayerId: null,
      accusationVotes: {},
    };
  }

  return {
    ...state,
    timerSeconds: nextSeconds,
  };
}

export function toggleTimer(state: SpyfallGameState): SpyfallGameState {
  if (state.phase !== 'investigation') return state;
  return {
    ...state,
    isTimerRunning: !state.isTimerRunning,
  };
}

export function initiateAccusation(
  state: SpyfallGameState,
  accusedPlayerId: string
): SpyfallGameState {
  if (state.phase !== 'investigation' && state.phase !== 'accusation') return state;

  return {
    ...state,
    phase: 'accusation',
    isTimerRunning: false,
    accusedPlayerId,
    accusationVotes: {},
  };
}

export function cancelAccusation(state: SpyfallGameState): SpyfallGameState {
  if (state.phase !== 'accusation') return state;
  return {
    ...state,
    phase: 'investigation',
    isTimerRunning: state.timerSeconds > 0,
    accusedPlayerId: null,
    accusationVotes: {},
  };
}

export function castVote(
  state: SpyfallGameState,
  voterId: string,
  isGuilty: boolean
): SpyfallGameState {
  if (state.phase !== 'accusation' || !state.accusedPlayerId) return state;

  const newVotes = {
    ...state.accusationVotes,
    [voterId]: isGuilty,
  };

  return {
    ...state,
    accusationVotes: newVotes,
  };
}

export function resolveAccusation(state: SpyfallGameState): SpyfallGameState {
  if (state.phase !== 'accusation' || !state.accusedPlayerId) return state;

  const accused = state.players.find((p) => p.id === state.accusedPlayerId);
  if (!accused) return state;

  const eligibleVoters = state.players.filter((p) => p.id !== state.accusedPlayerId);
  const guiltyCount = Object.values(state.accusationVotes).filter(Boolean).length;
  const neededVotes = Math.ceil(eligibleVoters.length / 2);

  // If majority voted guilty
  if (guiltyCount >= neededVotes) {
    if (accused.isSpy) {
      // Caught the spy! Spy gets one final guess to steal the win!
      return {
        ...state,
        phase: 'spy_guess',
      };
    } else {
      // Accused an innocent civilian! Spies win!
      return {
        ...state,
        phase: 'game_over',
        winner: 'spies',
        winReason: `The group wrongfully accused ${accused.name} who was an innocent ${accused.role?.name || 'Civilian'}! The Spy escaped!`,
      };
    }
  }

  // Not enough votes to convict, return to investigation
  return {
    ...state,
    phase: 'investigation',
    isTimerRunning: state.timerSeconds > 0,
    accusedPlayerId: null,
    accusationVotes: {},
  };
}

export function spySurrenderAndGuess(state: SpyfallGameState): SpyfallGameState {
  return {
    ...state,
    phase: 'spy_guess',
    isTimerRunning: false,
  };
}

export function submitSpyGuess(
  state: SpyfallGameState,
  locationId: string
): SpyfallGameState {
  const isCorrect = locationId === state.location.id;
  const guessedLocation = ALL_LOCATIONS.find((l) => l.id === locationId);

  if (isCorrect) {
    return {
      ...state,
      phase: 'game_over',
      spyGuessLocationId: locationId,
      winner: 'spies',
      winReason: `The Spy correctly identified the secret location as ${state.location.name}! Spies win!`,
    };
  } else {
    return {
      ...state,
      phase: 'game_over',
      spyGuessLocationId: locationId,
      winner: 'innocents',
      winReason: `The Spy guessed ${guessedLocation?.name || locationId}, but the real location was ${state.location.name}! Innocents win!`,
    };
  }
}

