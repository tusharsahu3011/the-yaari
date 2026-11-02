import { Card, Rank, Suit } from './types';

export const SUITS: Suit[] = ['S', 'H', 'C', 'D'];

export const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export function getRankLabel(rank: Rank): string {
  switch (rank) {
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    case 14:
      return 'A';
    default:
      return rank.toString();
  }
}

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'S':
      return '♠';
    case 'H':
      return '♥';
    case 'D':
      return '♦';
    case 'C':
      return '♣';
  }
}

export function getSuitColor(suit: Suit): 'black' | 'red' {
  return suit === 'H' || suit === 'D' ? 'red' : 'black';
}

export function getSuitName(suit: Suit): string {
  switch (suit) {
    case 'S':
      return 'Spades';
    case 'H':
      return 'Hearts';
    case 'D':
      return 'Diamonds';
    case 'C':
      return 'Clubs';
  }
}

export function getCardName(card: Card): string {
  const rankStr =
    card.rank === 14
      ? 'Ace'
      : card.rank === 13
      ? 'King'
      : card.rank === 12
      ? 'Queen'
      : card.rank === 11
      ? 'Jack'
      : card.rank.toString();
  return `${rankStr} of ${getSuitName(card.suit)}`;
}

export function getCardShortCode(card: Card): string {
  return `${getRankLabel(card.rank)}${getSuitSymbol(card.suit)}`;
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${getRankLabel(rank)}${suit}`,
        suit,
        rank,
      });
    }
  }
  return deck;
}

/**
 * Sorts cards by suit first, then by rank ascending
 */
export function sortHand(cards: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = { S: 0, H: 1, C: 2, D: 3 };
  return [...cards].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return a.rank - b.rank;
  });
}
