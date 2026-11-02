import { describe, it, expect } from 'vitest';
import {
  initUndercoverGame,
  advanceSecretView,
  submitPlayerDescription,
  castUndercoverVote,
  submitMrWhiteWordGuess,
  getRecommendedRoles,
  checkMrWhiteGuess,
} from '../index';
import { getRandomWordPair, UNDERCOVER_CATEGORIES, WORD_PAIRS } from '../words';

describe('Undercover Game Engine', () => {
  const dummyPlayers = [
    { id: 'p1', name: 'Alice' },
    { id: 'p2', name: 'Bob' },
    { id: 'p3', name: 'Charlie' },
    { id: 'p4', name: 'Dave' },
  ];

  it('calculates recommended roles correctly according to player count', () => {
    expect(getRecommendedRoles(3)).toEqual({ undercovers: 1, mrWhites: 0 });
    expect(getRecommendedRoles(4)).toEqual({ undercovers: 1, mrWhites: 0 });
    expect(getRecommendedRoles(5)).toEqual({ undercovers: 1, mrWhites: 1 });
    expect(getRecommendedRoles(6)).toEqual({ undercovers: 1, mrWhites: 1 });
    expect(getRecommendedRoles(8)).toEqual({ undercovers: 2, mrWhites: 1 });
    expect(getRecommendedRoles(12)).toEqual({ undercovers: 3, mrWhites: 1 });
  });

  it('validates Mr. White fuzzy guessing logic', () => {
    // Exact match
    expect(checkMrWhiteGuess('Coffee', 'Coffee')).toBe(true);
    expect(checkMrWhiteGuess('coffee', 'Coffee')).toBe(true);
    expect(checkMrWhiteGuess('  COFFEE  ', 'Coffee')).toBe(true);

    // Substring match with min length >= 3
    expect(checkMrWhiteGuess('cold coffee', 'coffee')).toBe(true);
    expect(checkMrWhiteGuess('coffee', 'cold coffee')).toBe(true);
    expect(checkMrWhiteGuess('spider', 'spider-man')).toBe(true);
    expect(checkMrWhiteGuess('swimming', 'swimming pool')).toBe(true);

    // Short strings shouldn't false match
    expect(checkMrWhiteGuess('to', 'toast')).toBe(false);

    // Complete mismatch
    expect(checkMrWhiteGuess('burger', 'pizza')).toBe(false);
    expect(checkMrWhiteGuess('', 'tea')).toBe(false);
  });

  it('supports category filtering and custom word pairs', () => {
    const foodPair = getRandomWordPair('food');
    expect(foodPair.category).toBe('food');

    const custom = getRandomWordPair('all', Math.random, {
      civilian: 'Batman',
      undercover: 'Robin',
    });
    expect(custom.civilianWord).toBe('Batman');
    expect(custom.undercoverWord).toBe('Robin');
    expect(custom.category).toBe('custom');
  });

  it('initializes game with correct role distribution', () => {
    const state = initUndercoverGame(dummyPlayers, {
      undercoverCount: 1,
      mrWhiteCount: 0,
    });

    expect(state.players).toHaveLength(4);
    const undercovers = state.players.filter((p) => p.role === 'undercover');
    const civilians = state.players.filter((p) => p.role === 'civilian');

    expect(undercovers).toHaveLength(1);
    expect(civilians).toHaveLength(3);
    expect(state.phase).toBe('role_reveal');
    expect(state.wordPair.civilianWord).toBeDefined();
    expect(state.wordPair.undercoverWord).toBeDefined();
  });

  it('transitions from role_reveal to describing after all players view secret', () => {
    let state = initUndercoverGame(dummyPlayers, { undercoverCount: 1, mrWhiteCount: 0 });

    for (let i = 0; i < 4; i++) {
      state = advanceSecretView(state, i);
    }

    expect(state.phase).toBe('describing');
    expect(state.currentDescriberIndex).toBe(0);
  });

  it('transitions from describing to voting after all active players submit descriptions', () => {
    let state = initUndercoverGame(dummyPlayers, { undercoverCount: 1, mrWhiteCount: 0 });
    for (let i = 0; i < 4; i++) {
      state = advanceSecretView(state, i);
    }

    for (let i = 0; i < 4; i++) {
      state = submitPlayerDescription(state, state.players[i].id, `Clue ${i + 1}`);
    }

    expect(state.phase).toBe('voting');
  });

  it('eliminates voted player and awards Civilians win if Undercover is eliminated', () => {
    let state = initUndercoverGame(dummyPlayers, { undercoverCount: 1, mrWhiteCount: 0 });
    for (let i = 0; i < 4; i++) {
      state = advanceSecretView(state, i);
    }
    for (let i = 0; i < 4; i++) {
      state = submitPlayerDescription(state, state.players[i].id, `Clue ${i}`);
    }

    const undercoverPlayer = state.players.find((p) => p.role === 'undercover')!;

    // Everyone votes for the undercover
    state = castUndercoverVote(state, dummyPlayers[0].id, undercoverPlayer.id);
    state = castUndercoverVote(state, dummyPlayers[1].id, undercoverPlayer.id);
    state = castUndercoverVote(state, dummyPlayers[2].id, undercoverPlayer.id);
    state = castUndercoverVote(state, dummyPlayers[3].id, undercoverPlayer.id);

    expect(state.phase).toBe('game_over');
    expect(state.winner).toBe('civilians');
    expect(state.eliminatedPlayerId).toBe(undercoverPlayer.id);
  });

  it('awards Undercovers win when Undercovers >= Civilians', () => {
    // 4 players: 2 civilians, 2 undercovers
    let state = initUndercoverGame(dummyPlayers, { undercoverCount: 2, mrWhiteCount: 0 });
    for (let i = 0; i < 4; i++) {
      state = advanceSecretView(state, i);
    }
    for (let i = 0; i < 4; i++) {
      state = submitPlayerDescription(state, state.players[i].id, `Clue ${i}`);
    }

    const civilianPlayer = state.players.find((p) => p.role === 'civilian')!;

    // Eliminate one civilian
    state = castUndercoverVote(state, dummyPlayers[0].id, civilianPlayer.id);
    state = castUndercoverVote(state, dummyPlayers[1].id, civilianPlayer.id);
    state = castUndercoverVote(state, dummyPlayers[2].id, civilianPlayer.id);
    state = castUndercoverVote(state, dummyPlayers[3].id, civilianPlayer.id);

    // Remaining: 1 civilian, 2 undercovers -> Undercovers win!
    expect(state.phase).toBe('game_over');
    expect(state.winner).toBe('undercover');
  });

  it('allows Mr. White to steal win with correct word guess upon elimination', () => {
    const players5 = [...dummyPlayers, { id: 'p5', name: 'Eve' }];
    let state = initUndercoverGame(players5, { undercoverCount: 1, mrWhiteCount: 1 });

    const mrWhitePlayer = state.players.find((p) => p.role === 'mr_white')!;

    for (let i = 0; i < 5; i++) {
      state = advanceSecretView(state, i);
    }
    for (let i = 0; i < 5; i++) {
      state = submitPlayerDescription(state, state.players[i].id, `Clue ${i}`);
    }

    // Everyone votes for Mr. White
    for (let i = 0; i < 5; i++) {
      state = castUndercoverVote(state, players5[i].id, mrWhitePlayer.id);
    }

    expect(state.phase).toBe('mr_white_guess');
    expect(state.mrWhiteGuesserId).toBe(mrWhitePlayer.id);

    // Mr. White guesses correctly
    state = submitMrWhiteWordGuess(state, state.wordPair.civilianWord);
    expect(state.phase).toBe('game_over');
    expect(state.winner).toBe('mr_white');
  });
});
