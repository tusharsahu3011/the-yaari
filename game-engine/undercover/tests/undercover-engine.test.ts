import { describe, it, expect } from 'vitest';
import {
  initUndercoverGame,
  advanceSecretView,
  submitPlayerDescription,
  castUndercoverVote,
  submitMrWhiteWordGuess,
} from '../engine';

describe('Undercover Game Engine', () => {
  const dummyPlayers = [
    { id: 'p1', name: 'Alice' },
    { id: 'p2', name: 'Bob' },
    { id: 'p3', name: 'Charlie' },
    { id: 'p4', name: 'Dave' },
  ];

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

    // Mr. White guesses civilian word correctly!
    const afterGuess = submitMrWhiteWordGuess(state, state.wordPair.civilianWord);
    expect(afterGuess.phase).toBe('game_over');
    expect(afterGuess.winner).toBe('mr_white');
  });
});
