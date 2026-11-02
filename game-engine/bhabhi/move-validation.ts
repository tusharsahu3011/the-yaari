import { Card, BhabhiGameState } from './types';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  isThulla?: boolean;
}

/**
 * Validates whether a specific card move is legal according to Bhabhi rules.
 */
export function validateMove(
  playerIndex: number,
  card: Card,
  gameState: BhabhiGameState
): ValidationResult {
  if (gameState.phase !== 'playing') {
    return { valid: false, reason: 'Game is not in active playing phase.' };
  }

  if (gameState.currentTurnIndex !== playerIndex) {
    return { valid: false, reason: 'It is not this player\'s turn.' };
  }

  const player = gameState.players[playerIndex];
  if (!player) {
    return { valid: false, reason: 'Player does not exist.' };
  }

  if (player.isSafe) {
    return { valid: false, reason: 'Player is already safe and out of active play.' };
  }

  const cardInHand = player.hand.some((c) => c.id === card.id);
  if (!cardInHand) {
    return { valid: false, reason: 'Card is not in player\'s hand.' };
  }

  const { activeTrick, firstTrick } = gameState;
  const isLeading = activeTrick.cards.length === 0;

  // Very first trick of the game: must open with the Ace of Spades
  if (firstTrick && isLeading) {
    if (card.suit !== 'S' || card.rank !== 14) {
      return {
        valid: false,
        reason: 'The game must be opened with the Ace of Spades (A♠).',
      };
    }
    return { valid: true, isThulla: false };
  }

  // If leading the trick (not first trick), any card in hand is valid
  if (isLeading) {
    return { valid: true, isThulla: false };
  }

  // Following the trick: must follow suit if player holds any card of leadSuit
  const leadSuit = activeTrick.leadSuit!;
  const hasLeadSuit = player.hand.some((c) => c.suit === leadSuit);

  if (hasLeadSuit) {
    if (card.suit !== leadSuit) {
      return {
        valid: false,
        reason: `Must follow suit! You have ${leadSuit} cards in your hand.`,
      };
    }
    return { valid: true, isThulla: false };
  }

  // Player does NOT have the lead suit: ANY card played triggers a Thulla!
  return { valid: true, isThulla: true };
}

/**
 * Checks if the current player has no cards of the lead suit (eligible for Thulla).
 */
export function canStrikeThulla(
  playerIndex: number,
  gameState: BhabhiGameState
): boolean {
  if (gameState.activeTrick.cards.length === 0 || !gameState.activeTrick.leadSuit) {
    return false;
  }
  const player = gameState.players[playerIndex];
  if (!player || player.isSafe) return false;
  return !player.hand.some((c) => c.suit === gameState.activeTrick.leadSuit);
}

/**
 * Returns all legally playable cards for a player given the current state.
 */
export function getPlayableCards(
  playerIndex: number,
  gameState: BhabhiGameState
): Card[] {
  const player = gameState.players[playerIndex];
  if (!player || player.isSafe || gameState.currentTurnIndex !== playerIndex) {
    return [];
  }

  const { activeTrick, firstTrick } = gameState;

  // First trick opening: only Ace of Spades
  if (firstTrick && activeTrick.cards.length === 0) {
    return player.hand.filter((c) => c.suit === 'S' && c.rank === 14);
  }

  // Leading a trick: all cards are playable
  if (activeTrick.cards.length === 0 || !activeTrick.leadSuit) {
    return [...player.hand];
  }

  // Following a trick: if has lead suit, only lead suit cards; otherwise all cards
  const leadSuit = activeTrick.leadSuit;
  const leadSuitCards = player.hand.filter((c) => c.suit === leadSuit);
  if (leadSuitCards.length > 0) {
    return leadSuitCards;
  }

  return [...player.hand];
}

