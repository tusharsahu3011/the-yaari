import { describe, it, expect } from 'vitest';
import {
  createSpyfallGame,
  advanceReveal,
  tickTimer,
  initiateAccusation,
  castVote,
  resolveAccusation,
  spySurrenderAndGuess,
  submitSpyGuess,
} from '../engine';

describe('Spyfall Engine', () => {
  const players = [
    { id: 'p1', name: 'Aman', avatar: '😎' },
    { id: 'p2', name: 'Simran', avatar: '👩' },
    { id: 'p3', name: 'Rohan', avatar: '🎧' },
    { id: 'p4', name: 'Priya', avatar: '✨' },
  ];

  it('initializes a game with exactly 1 spy and sets location roles', () => {
    const game = createSpyfallGame(players, { timerMinutes: 5, spyCount: 1 });
    expect(game.phase).toBe('reveal');
    expect(game.players.length).toBe(4);
    expect(game.location).toBeDefined();

    const spies = game.players.filter((p) => p.isSpy);
    const innocents = game.players.filter((p) => !p.isSpy);

    expect(spies.length).toBe(1);
    expect(innocents.length).toBe(3);

    // Innocents have roles, spy does not
    expect(spies[0].role).toBeUndefined();
    innocents.forEach((innocent) => {
      expect(innocent.role).toBeDefined();
      expect(innocent.role?.name).toBeTruthy();
    });
  });

  it('advances through role reveals and starts investigation on completion', () => {
    let game = createSpyfallGame(players, { timerMinutes: 5 });

    expect(game.currentRevealIndex).toBe(0);
    expect(game.phase).toBe('reveal');

    // 4 players reveal
    game = advanceReveal(game); // p1
    expect(game.currentRevealIndex).toBe(1);
    game = advanceReveal(game); // p2
    expect(game.currentRevealIndex).toBe(2);
    game = advanceReveal(game); // p3
    expect(game.currentRevealIndex).toBe(3);
    game = advanceReveal(game); // p4

    expect(game.phase).toBe('investigation');
    expect(game.isTimerRunning).toBe(true);
    expect(game.timerSeconds).toBe(300);
  });

  it('ticks down timer and triggers accusation when time runs out', () => {
    let game = createSpyfallGame(players, { timerMinutes: 1 });
    // fast forward to investigation
    for (let i = 0; i < 4; i++) game = advanceReveal(game);

    game.timerSeconds = 2;
    game = tickTimer(game);
    expect(game.timerSeconds).toBe(1);
    expect(game.phase).toBe('investigation');

    game = tickTimer(game);
    expect(game.timerSeconds).toBe(0);
    expect(game.phase).toBe('accusation');
    expect(game.isTimerRunning).toBe(false);
  });

  it('handles accusation voting when an innocent is wrongly convicted', () => {
    let game = createSpyfallGame(players, { timerMinutes: 5 });
    for (let i = 0; i < 4; i++) game = advanceReveal(game);

    const innocent = game.players.find((p) => !p.isSpy)!;
    game = initiateAccusation(game, innocent.id);

    expect(game.phase).toBe('accusation');
    expect(game.accusedPlayerId).toBe(innocent.id);

    // Vote guilty
    const voters = game.players.filter((p) => p.id !== innocent.id);
    voters.forEach((v) => {
      game = castVote(game, v.id, true);
    });

    game = resolveAccusation(game);
    expect(game.phase).toBe('game_over');
    expect(game.winner).toBe('spies');
  });

  it('handles accusation voting when spy is caught and then guesses location correctly', () => {
    let game = createSpyfallGame(players, { timerMinutes: 5 });
    for (let i = 0; i < 4; i++) game = advanceReveal(game);

    const spy = game.players.find((p) => p.isSpy)!;
    game = initiateAccusation(game, spy.id);

    // Everyone votes guilty
    const voters = game.players.filter((p) => p.id !== spy.id);
    voters.forEach((v) => {
      game = castVote(game, v.id, true);
    });

    // Resolves to spy_guess phase
    game = resolveAccusation(game);
    expect(game.phase).toBe('spy_guess');

    // Spy guesses the true location
    game = submitSpyGuess(game, game.location.id);
    expect(game.phase).toBe('game_over');
    expect(game.winner).toBe('spies');
  });

  it('innocents win when spy guesses location incorrectly', () => {
    let game = createSpyfallGame(players, { timerMinutes: 5 });
    for (let i = 0; i < 4; i++) game = advanceReveal(game);

    game = spySurrenderAndGuess(game);
    expect(game.phase).toBe('spy_guess');

    game = submitSpyGuess(game, 'definitely_fake_location_id_123');
    expect(game.phase).toBe('game_over');
    expect(game.winner).toBe('innocents');
  });
});
