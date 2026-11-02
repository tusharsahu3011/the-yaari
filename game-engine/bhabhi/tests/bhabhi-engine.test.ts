import { describe, it, expect } from 'vitest';
import {
  createDeck,
  dealCards,
  createInitialGameState,
  playCardAction,
  validateMove,
  chooseBotMove,
  getPlayableCards,
  canStrikeThulla,
  PlayerConfig,
  Card,
  BhabhiGameState,
  computeGameSummary,
} from '../index';

describe('Bhabhi Game Engine', () => {
  const dummyPlayers: PlayerConfig[] = [
    { id: 'p1', name: 'Tushar', isBot: false },
    { id: 'p2', name: 'Bot Rohit', isBot: true, botDifficulty: 'smart' },
    { id: 'p3', name: 'Bot Priya', isBot: true, botDifficulty: 'normal' },
    { id: 'p4', name: 'Bot Aman', isBot: true, botDifficulty: 'easy' },
  ];

  it('creates a standard 52-card deck', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    const uniqueIds = new Set(deck.map((c) => c.id));
    expect(uniqueIds.size).toBe(52);
  });

  it('deals 52 cards across 4 players (13 each) and identifies Ace of Spades', () => {
    const { players, aceOfSpadesPlayerIndex } = dealCards(dummyPlayers);
    expect(players).toHaveLength(4);
    for (const player of players) {
      expect(player.hand).toHaveLength(13);
    }
    const totalCards = players.reduce((sum, p) => sum + p.hand.length, 0);
    expect(totalCards).toBe(52);

    expect(aceOfSpadesPlayerIndex).toBeGreaterThanOrEqual(0);
    expect(aceOfSpadesPlayerIndex).toBeLessThan(4);
    const leaderHand = players[aceOfSpadesPlayerIndex].hand;
    const hasAS = leaderHand.some((c) => c.suit === 'S' && c.rank === 14);
    expect(hasAS).toBe(true);
  });

  it('handles 3, 5, and 6 players dealing correctly', () => {
    const p3 = dummyPlayers.slice(0, 3);
    const deal3 = dealCards(p3);
    expect(deal3.players).toHaveLength(3);
    const sum3 = deal3.players.reduce((sum, p) => sum + p.hand.length, 0);
    expect(sum3).toBe(52);

    const p5: PlayerConfig[] = [
      ...dummyPlayers,
      { id: 'p5', name: 'Bot Simran', isBot: true },
    ];
    const deal5 = dealCards(p5);
    expect(deal5.players).toHaveLength(5);
    const sum5 = deal5.players.reduce((sum, p) => sum + p.hand.length, 0);
    expect(sum5).toBe(52);

    const p6: PlayerConfig[] = [
      ...p5,
      { id: 'p6', name: 'Bot Kabir', isBot: true },
    ];
    const deal6 = dealCards(p6);
    expect(deal6.players).toHaveLength(6);
    const sum6 = deal6.players.reduce((sum, p) => sum + p.hand.length, 0);
    expect(sum6).toBe(52);
  });

  it('enforces Ace of Spades as the required opening move', () => {
    const state = createInitialGameState(dummyPlayers);
    const leaderIdx = state.currentTurnIndex;
    const leader = state.players[leaderIdx];

    // Find non-AS card
    const nonAsCard = leader.hand.find((c) => !(c.suit === 'S' && c.rank === 14));
    if (nonAsCard) {
      const invalidResult = validateMove(leaderIdx, nonAsCard, state);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.reason).toContain('Ace of Spades');
    }

    // Play Ace of Spades
    const asCard = leader.hand.find((c) => c.suit === 'S' && c.rank === 14)!;
    const validResult = validateMove(leaderIdx, asCard, state);
    expect(validResult.valid).toBe(true);

    const { state: afterOpen, error } = playCardAction(state, leaderIdx, asCard);
    expect(error).toBeUndefined();
    expect(afterOpen.activeTrick.cards).toHaveLength(1);
    expect(afterOpen.activeTrick.leadSuit).toBe('S');
    expect(afterOpen.players[leaderIdx].hand.some((c) => c.id === asCard.id)).toBe(false);
  });

  it('enforces follow-suit rule and detects Thulla correctly', () => {
    const p1Cards: Card[] = [
      { id: 'AS', suit: 'S', rank: 14 },
      { id: '10S', suit: 'S', rank: 10 },
    ];
    const p2Cards: Card[] = [
      { id: 'KS', suit: 'S', rank: 13 },
      { id: '2H', suit: 'H', rank: 2 },
    ];
    const p3Cards: Card[] = [
      { id: 'AH', suit: 'H', rank: 14 }, // VOID in Spades! Can strike Thulla!
      { id: 'KD', suit: 'D', rank: 13 },
    ];

    const customState: BhabhiGameState = {
      players: [
        { id: 'p1', name: 'P1', isBot: false, avatar: '1', hand: p1Cards, isSafe: false },
        { id: 'p2', name: 'P2', isBot: true, avatar: '2', hand: p2Cards, isSafe: false },
        { id: 'p3', name: 'P3', isBot: true, avatar: '3', hand: p3Cards, isSafe: false },
      ],
      currentTurnIndex: 0,
      activeTrick: {
        trickNumber: 1,
        leadPlayerIndex: 0,
        leadSuit: null,
        cards: [],
      },
      discardPile: [],
      firstTrick: true,
      phase: 'playing',
      lastResolution: null,
      safeCount: 0,
      history: [],
    };

    // P1 leads Ace of Spades
    const res1 = playCardAction(customState, 0, p1Cards[0]);
    expect(res1.error).toBeUndefined();
    const s1 = res1.state;
    expect(s1.currentTurnIndex).toBe(1);

    // P2 has Spades (KS), so trying to play Hearts (2H) should be INVALID!
    const invalidP2 = validateMove(1, p2Cards[1], s1);
    expect(invalidP2.valid).toBe(false);
    expect(invalidP2.reason).toContain('Must follow suit');

    // P2 plays King of Spades
    const res2 = playCardAction(s1, 1, p2Cards[0]);
    expect(res2.error).toBeUndefined();
    const s2 = res2.state;
    expect(s2.currentTurnIndex).toBe(2);

    // P3 has no Spades! canStrikeThulla should be true!
    expect(canStrikeThulla(2, s2)).toBe(true);

    // P3 strikes Thulla by playing Ace of Hearts!
    const res3 = playCardAction(s2, 2, p3Cards[0]);
    expect(res3.error).toBeUndefined();
    const s3 = res3.state;

    // Trick should resolve as THULLA!
    expect(s3.lastResolution?.type).toBe('THULLA');
    expect(s3.lastResolution?.thullaPlayerIndex).toBe(2);
    // Highest lead card played was AS by P1 (player 0)!
    expect(s3.lastResolution?.highestLeadPlayerIndex).toBe(0);

    // P1 picked up all 3 cards: 1 remaining + 3 picked up = 4
    expect(s3.players[0].hand).toHaveLength(4);

    // Next trick leader is P3 (player 2), who struck the Thulla
    expect(s3.currentTurnIndex).toBe(2);
    expect(s3.activeTrick.leadPlayerIndex).toBe(2);
    expect(s3.activeTrick.cards).toHaveLength(0);
  });

  it('handles safe player skipping and lead succession when leader becomes safe', () => {
    // P1 has 1 card (AS), P2 has 2 cards, P3 has 1 card (QS)
    const p1Cards: Card[] = [{ id: 'AS', suit: 'S', rank: 14 }];
    const p2Cards: Card[] = [
      { id: 'KS', suit: 'S', rank: 13 },
      { id: '2H', suit: 'H', rank: 2 },
    ];
    const p3Cards: Card[] = [{ id: 'QS', suit: 'S', rank: 12 }];

    const customState: BhabhiGameState = {
      players: [
        { id: 'p1', name: 'P1', isBot: false, avatar: '1', hand: p1Cards, isSafe: false },
        { id: 'p2', name: 'P2', isBot: true, avatar: '2', hand: p2Cards, isSafe: false },
        { id: 'p3', name: 'P3', isBot: true, avatar: '3', hand: p3Cards, isSafe: false },
      ],
      currentTurnIndex: 0,
      activeTrick: {
        trickNumber: 1,
        leadPlayerIndex: 0,
        leadSuit: null,
        cards: [],
      },
      discardPile: [],
      firstTrick: true,
      phase: 'playing',
      lastResolution: null,
      safeCount: 0,
      history: [],
    };

    // P1 plays AS
    const s1 = playCardAction(customState, 0, p1Cards[0]).state;
    // P2 plays KS
    const s2 = playCardAction(s1, 1, p2Cards[0]).state;
    // P3 plays QS
    const s3 = playCardAction(s2, 2, p3Cards[0]).state;

    // Clean sweep: winner is P1 (AS)!
    expect(s3.lastResolution?.type).toBe('CLEAN_SWEEP');
    expect(s3.lastResolution?.winnerIndex).toBe(0);

    // P1 had 0 cards left and won the trick without penalty, so P1 is SAFE!
    expect(s3.players[0].isSafe).toBe(true);
    expect(s3.players[0].safeRank).toBe(1);

    // P3 also emptied their hand and followed suit, so P3 is also SAFE!
    expect(s3.players[2].isSafe).toBe(true);
    expect(s3.players[2].safeRank).toBe(2);

    // Only P2 remains with cards (has '2H')! So P2 is the Bhabhi!
    expect(s3.phase).toBe('game_over');
    expect(s3.bhabhiPlayerIndex).toBe(1);

    // Verify summary
    const summary = computeGameSummary(s3);
    expect(summary.bhabhi.playerIndex).toBe(1);
    expect(summary.rankings[0].playerIndex).toBe(0); // P1 Rank 1
  });

  it('AI bot selects legal cards and respects game rules', () => {
    const state = createInitialGameState(dummyPlayers);
    const leaderIdx = state.currentTurnIndex;

    const botMove = chooseBotMove(leaderIdx, state);
    expect(botMove.suit).toBe('S');
    expect(botMove.rank).toBe(14); // Ace of Spades must be chosen

    const nextState = playCardAction(state, leaderIdx, botMove).state;
    const nextTurn = nextState.currentTurnIndex;
    const nextPlayable = getPlayableCards(nextTurn, nextState);
    expect(nextPlayable.length).toBeGreaterThan(0);

    const bot2Move = chooseBotMove(nextTurn, nextState);
    expect(nextPlayable.some((c) => c.id === bot2Move.id)).toBe(true);
  });
});
