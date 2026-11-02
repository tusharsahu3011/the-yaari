import { Card, BhabhiGameState } from './types';
import { getPlayableCards } from './move-validation';

/**
 * AI Bot strategy decision maker.
 * Chooses the best legal card for a bot player based on difficulty.
 */
export function chooseBotMove(
  botIndex: number,
  gameState: BhabhiGameState
): Card {
  const legalCards = getPlayableCards(botIndex, gameState);
  if (legalCards.length === 0) {
    throw new Error(`Bot ${botIndex} has no legal cards to play.`);
  }

  // If only 1 legal card (e.g. Ace of Spades at start), must play it
  if (legalCards.length === 1) {
    return legalCards[0];
  }

  const player = gameState.players[botIndex];
  const difficulty = player.botDifficulty || 'normal';

  if (difficulty === 'easy') {
    // Easy: randomly choose any legal card
    const randomIdx = Math.floor(Math.random() * legalCards.length);
    return legalCards[randomIdx];
  }

  const { activeTrick } = gameState;
  const isLeading = activeTrick.cards.length === 0;

  // Case 1: BOT IS LEADING
  if (isLeading) {
    if (difficulty === 'smart') {
      // Smart: find suits with the fewest cards to void themselves faster,
      // and prefer leading low-to-medium cards so they don't get caught with a high card if someone Thullas.
      const suitCounts = legalCards.reduce((acc, c) => {
        acc[c.suit] = (acc[c.suit] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Sort suits by count ascending (suits with 1 card are prime targets to get void)
      const sortedCards = [...legalCards].sort((a, b) => {
        const countDiff = suitCounts[a.suit] - suitCounts[b.suit];
        if (countDiff !== 0) return countDiff;
        // Within same suit, lead lower ranks to minimize risk of high-card penalty
        return a.rank - b.rank;
      });

      return sortedCards[0];
    }

    // Normal: lead lowest card
    const sorted = [...legalCards].sort((a, b) => a.rank - b.rank);
    return sorted[0];
  }

  // Case 2: BOT IS FOLLOWING
  const leadSuit = activeTrick.leadSuit!;
  const isFollowingLeadSuit = legalCards[0].suit === leadSuit;

  if (isFollowingLeadSuit) {
    // Has lead suit: must follow
    // If smart/normal, determine whether to play low or duck
    // Check highest rank currently played in lead suit
    const highestLeadRank = activeTrick.cards
      .filter((pc) => pc.card.suit === leadSuit)
      .reduce((max, pc) => Math.max(max, pc.card.rank), 0);

    if (difficulty === 'smart') {
      // Check if bot can beat the highest card safely, or play lowest to avoid leading next trick
      // In Bhabhi, winning tricks is NOT necessary—getting rid of cards is the only goal!
      // Often, playing low is safest so you don't take the lead and get Thulla'd.
      const lowerCards = legalCards.filter((c) => c.rank < highestLeadRank);
      if (lowerCards.length > 0) {
        // Play the highest of the lower cards (under the leader) to shed decent cards safely
        return lowerCards.sort((a, b) => b.rank - a.rank)[0];
      }
      // Otherwise must play higher; play lowest among the winning cards
      return legalCards.sort((a, b) => a.rank - b.rank)[0];
    }

    // Normal: play lowest card of the suit to stay safe
    return legalCards.sort((a, b) => a.rank - b.rank)[0];
  }

  // Case 3: BOT IS STRIKING THULLA!
  // No cards of lead suit: any card is a Thulla!
  // Poison the highest lead player by dumping the highest unwanted card (e.g. Ace or King of another suit)
  if (difficulty === 'smart' || difficulty === 'normal') {
    // Sort descending by rank: dump the highest card (Aces, Kings, Queens)
    const sortedDesc = [...legalCards].sort((a, b) => b.rank - a.rank);
    return sortedDesc[0];
  }

  // Fallback
  return legalCards[0];
}

