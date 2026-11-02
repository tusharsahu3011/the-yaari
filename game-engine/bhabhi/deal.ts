import { Card, PlayerConfig, PlayerState } from './types';
import { createDeck, sortHand } from './deck';
import { shuffleDeck } from './shuffle';

export interface DealResult {
  players: PlayerState[];
  aceOfSpadesPlayerIndex: number;
}

export function dealCards(
  playerConfigs: PlayerConfig[],
  rng?: () => number
): DealResult {
  const numPlayers = playerConfigs.length;
  if (numPlayers < 3 || numPlayers > 6) {
    throw new Error(`Bhabhi supports 3 to 6 players. Provided: ${numPlayers}`);
  }

  const deck = shuffleDeck(createDeck(), rng);
  const hands: Card[][] = Array.from({ length: numPlayers }, () => []);

  // Deal all 52 cards round-robin
  for (let i = 0; i < deck.length; i++) {
    hands[i % numPlayers].push(deck[i]);
  }

  let aceOfSpadesPlayerIndex = -1;

  const players: PlayerState[] = playerConfigs.map((cfg, idx) => {
    const sortedHand = sortHand(hands[idx]);
    const hasAceOfSpades = sortedHand.some(
      (c) => c.suit === 'S' && c.rank === 14
    );
    if (hasAceOfSpades) {
      aceOfSpadesPlayerIndex = idx;
    }

    return {
      id: cfg.id,
      name: cfg.name,
      isBot: cfg.isBot,
      avatar: cfg.avatar || `avatar-${idx + 1}`,
      botDifficulty: cfg.botDifficulty || 'normal',
      hand: sortedHand,
      isSafe: false,
    };
  });

  if (aceOfSpadesPlayerIndex === -1) {
    throw new Error('Ace of Spades was not found in any player hand.');
  }

  return {
    players,
    aceOfSpadesPlayerIndex,
  };
}

