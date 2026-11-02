import {
  BhabhiGameState,
  Card,
  GameEventRecord,
  PlayedCard,
  PlayerConfig,
  TrickResolution,
} from './types';
import { getCardShortCode, sortHand } from './deck';
import { dealCards } from './deal';
import { validateMove } from './move-validation';
import { findHighestLeadCard } from './thulla';
import {
  getActivePlayerCount,
  getBhabhiPlayerIndex,
  getNextActivePlayerIndex,
  isGameOver,
} from './turn-manager';

let eventCounter = 1;

export function createInitialGameState(
  playerConfigs: PlayerConfig[],
  rng?: () => number
): BhabhiGameState {
  const { players, aceOfSpadesPlayerIndex } = dealCards(playerConfigs, rng);

  const initialEvent: GameEventRecord = {
    id: `evt-${eventCounter++}`,
    timestamp: 0,
    type: 'GAME_START',
    message: `Game started! ${players[aceOfSpadesPlayerIndex].name} holds the Ace of Spades (A♠) and leads the first trick.`,
    playerIndex: aceOfSpadesPlayerIndex,
  };

  return {
    players,
    currentTurnIndex: aceOfSpadesPlayerIndex,
    activeTrick: {
      trickNumber: 1,
      leadPlayerIndex: aceOfSpadesPlayerIndex,
      leadSuit: null,
      cards: [],
    },
    discardPile: [],
    firstTrick: true,
    phase: 'playing',
    lastResolution: null,
    safeCount: 0,
    history: [initialEvent],
  };
}

export function playCardAction(
  prevState: BhabhiGameState,
  playerIndex: number,
  card: Card
): { state: BhabhiGameState; error?: string } {
  const validation = validateMove(playerIndex, card, prevState);
  if (!validation.valid) {
    return { state: prevState, error: validation.reason || 'Invalid move' };
  }

  // Deep clone state for immutability
  const state: BhabhiGameState = {
    ...prevState,
    players: prevState.players.map((p) => ({
      ...p,
      hand: [...p.hand],
    })),
    activeTrick: {
      ...prevState.activeTrick,
      cards: [...prevState.activeTrick.cards],
    },
    discardPile: [...prevState.discardPile],
    history: [...prevState.history],
  };

  const player = state.players[playerIndex];

  // Remove played card from hand
  const cardIdx = player.hand.findIndex((c) => c.id === card.id);
  player.hand.splice(cardIdx, 1);

  // If first card in trick, set lead suit and leader
  const isLeadCard = state.activeTrick.cards.length === 0;
  if (isLeadCard) {
    state.activeTrick.leadSuit = card.suit;
    state.activeTrick.leadPlayerIndex = playerIndex;
  }

  const isThulla = Boolean(validation.isThulla);
  const playedCard: PlayedCard = {
    playerIndex,
    card,
    isThulla,
  };
  state.activeTrick.cards.push(playedCard);

  // Add card played event
  state.history.push({
    id: `evt-${eventCounter++}`,
    timestamp: 0,
    type: 'CARD_PLAYED',
    message: `${player.name} played ${getCardShortCode(card)}`,
    playerIndex,
    card,
  });

  // Check trick resolution:
  // 1. THULLA occurred
  if (isThulla) {
    const leadSuit = state.activeTrick.leadSuit!;
    const { highestLeadCard, highestLeadPlayerIndex } = findHighestLeadCard(
      state.activeTrick.cards,
      leadSuit
    );

    const penaltyPlayer = state.players[highestLeadPlayerIndex];
    const trickCards = state.activeTrick.cards.map((pc) => pc.card);

    // Penalty player picks up all trick cards
    penaltyPlayer.hand.push(...trickCards);
    penaltyPlayer.hand = sortHand(penaltyPlayer.hand);

    // Check newly safe players (players who emptied their hand and did NOT take penalty cards)
    const newlySafePlayers: number[] = [];
    state.players.forEach((p, idx) => {
      if (!p.isSafe && p.hand.length === 0) {
        p.isSafe = true;
        p.safeRank = ++state.safeCount;
        newlySafePlayers.push(idx);

        state.history.push({
          id: `evt-${eventCounter++}`,
          timestamp: 0,
          type: 'PLAYER_SAFE',
          message: `🎉 ${p.name} emptied their hand and got away safe (Rank #${p.safeRank})!`,
          playerIndex: idx,
        });
      }
    });

    const resolution: TrickResolution = {
      type: 'THULLA',
      thullaPlayerIndex: playerIndex,
      thullaCard: card,
      highestLeadPlayerIndex,
      highestLeadCard,
      penaltyCards: trickCards,
      newlySafePlayers,
    };
    state.lastResolution = resolution;

    state.history.push({
      id: `evt-${eventCounter++}`,
      timestamp: 0,
      type: 'THULLA',
      message: `💥 THULLA by ${player.name} with ${getCardShortCode(card)}! ${penaltyPlayer.name} picks up ${trickCards.length} cards (led highest: ${getCardShortCode(highestLeadCard)}).`,
      playerIndex,
      card,
      resolution,
    });

    // Check game over
    if (isGameOver(state.players)) {
      state.phase = 'game_over';
      state.bhabhiPlayerIndex = getBhabhiPlayerIndex(state.players);
      const loserName =
        state.bhabhiPlayerIndex !== undefined
          ? state.players[state.bhabhiPlayerIndex].name
          : 'Unknown';
      state.history.push({
        id: `evt-${eventCounter++}`,
        timestamp: 0,
        type: 'GAME_OVER',
        message: `🏁 Game Over! ${loserName} is the BHABHI!`,
        playerIndex: state.bhabhiPlayerIndex,
      });
      return { state };
    }

    // Next trick leader: player who struck the Thulla (or next active if safe)
    let nextLeader = playerIndex;
    if (state.players[nextLeader].isSafe) {
      nextLeader = getNextActivePlayerIndex(nextLeader, state.players);
    }

    state.firstTrick = false;
    state.currentTurnIndex = nextLeader;
    state.activeTrick = {
      trickNumber: state.activeTrick.trickNumber + 1,
      leadPlayerIndex: nextLeader,
      leadSuit: null,
      cards: [],
    };

    return { state };
  }

  // 2. CLEAN SWEEP check (all active players have played in this trick)
  const activeCount = getActivePlayerCount(state.players);
  if (state.activeTrick.cards.length === activeCount) {
    const leadSuit = state.activeTrick.leadSuit!;
    const leadSuitPlayed = state.activeTrick.cards.filter(
      (pc) => pc.card.suit === leadSuit
    );

    let winner = leadSuitPlayed[0];
    for (let i = 1; i < leadSuitPlayed.length; i++) {
      if (leadSuitPlayed[i].card.rank > winner.card.rank) {
        winner = leadSuitPlayed[i];
      }
    }

    const trickCards = state.activeTrick.cards.map((pc) => pc.card);
    state.discardPile.push(...trickCards);

    // Check newly safe players
    const newlySafePlayers: number[] = [];
    state.players.forEach((p, idx) => {
      if (!p.isSafe && p.hand.length === 0) {
        p.isSafe = true;
        p.safeRank = ++state.safeCount;
        newlySafePlayers.push(idx);

        state.history.push({
          id: `evt-${eventCounter++}`,
          timestamp: 0,
          type: 'PLAYER_SAFE',
          message: `🎉 ${p.name} emptied their hand and got away safe (Rank #${p.safeRank})!`,
          playerIndex: idx,
        });
      }
    });

    const resolution: TrickResolution = {
      type: 'CLEAN_SWEEP',
      winnerIndex: winner.playerIndex,
      winningCard: winner.card,
      discardedCards: trickCards,
      newlySafePlayers,
    };
    state.lastResolution = resolution;

    state.history.push({
      id: `evt-${eventCounter++}`,
      timestamp: 0,
      type: 'CLEAN_SWEEP',
      message: `✨ Clean Sweep! ${state.players[winner.playerIndex].name} won the trick with ${getCardShortCode(winner.card)}. Cards discarded.`,
      playerIndex: winner.playerIndex,
      card: winner.card,
      resolution,
    });

    // Check game over
    if (isGameOver(state.players)) {
      state.phase = 'game_over';
      state.bhabhiPlayerIndex = getBhabhiPlayerIndex(state.players);
      const loserName =
        state.bhabhiPlayerIndex !== undefined
          ? state.players[state.bhabhiPlayerIndex].name
          : 'Unknown';
      state.history.push({
        id: `evt-${eventCounter++}`,
        timestamp: 0,
        type: 'GAME_OVER',
        message: `🏁 Game Over! ${loserName} is the BHABHI!`,
        playerIndex: state.bhabhiPlayerIndex,
      });
      return { state };
    }

    // Next trick leader: winner (or next active if winner got safe)
    let nextLeader = winner.playerIndex;
    if (state.players[nextLeader].isSafe) {
      nextLeader = getNextActivePlayerIndex(nextLeader, state.players);
    }

    state.firstTrick = false;
    state.currentTurnIndex = nextLeader;
    state.activeTrick = {
      trickNumber: state.activeTrick.trickNumber + 1,
      leadPlayerIndex: nextLeader,
      leadSuit: null,
      cards: [],
    };

    return { state };
  }

  // 3. Trick in progress: advance turn to next active player
  state.currentTurnIndex = getNextActivePlayerIndex(playerIndex, state.players);
  return { state };
}
