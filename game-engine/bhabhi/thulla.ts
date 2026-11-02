import { Card, PlayedCard, Suit } from './types';

export interface ThullaAnalysis {
  highestLeadCard: Card;
  highestLeadPlayerIndex: number;
}

/**
 * Finds the highest card of the lead suit among the played cards in the trick.
 */
export function findHighestLeadCard(
  playedCards: PlayedCard[],
  leadSuit: Suit
): ThullaAnalysis {
  const leadCards = playedCards.filter((pc) => pc.card.suit === leadSuit);
  if (leadCards.length === 0) {
    throw new Error('No lead suit cards found in trick to resolve Thulla.');
  }

  let highest = leadCards[0];
  for (let i = 1; i < leadCards.length; i++) {
    if (leadCards[i].card.rank > highest.card.rank) {
      highest = leadCards[i];
    }
  }

  return {
    highestLeadCard: highest.card,
    highestLeadPlayerIndex: highest.playerIndex,
  };
}

