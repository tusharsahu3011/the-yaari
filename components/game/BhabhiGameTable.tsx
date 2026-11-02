'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  BhabhiGameState,
  Card,
  DealerPersonality,
  DealerQuote,
  PlayerConfig,
  chooseBotMove,
  computeGameSummary,
  createInitialGameState,
  createSeededRng,
  getDealerCommentary,
  getPlayableCards,
  getSuitSymbol,
  getSuitName,
  playCardAction,
  sortHand,
  canStrikeThulla,
} from '@/game-engine/bhabhi';
import { PlayingCard } from '@/components/cards/PlayingCard';
import {
  Crown,
  Flame,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface BhabhiGameTableProps {
  initialPlayers?: PlayerConfig[];
}

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { id: 'human-1', name: 'You', isBot: false, avatar: '😎' },
  { id: 'bot-1', name: 'Rohit (Smart)', isBot: true, botDifficulty: 'smart', avatar: '🤖' },
  { id: 'bot-2', name: 'Priya (Normal)', isBot: true, botDifficulty: 'normal', avatar: '🦊' },
  { id: 'bot-3', name: 'Aman (Easy)', isBot: true, botDifficulty: 'easy', avatar: '🐼' },
];

export function BhabhiGameTable({
  initialPlayers = DEFAULT_PLAYERS,
}: BhabhiGameTableProps) {
  // Use deterministic seed for initial prerender to satisfy Next.js SSR
  const [gameState, setGameState] = useState<BhabhiGameState>(() =>
    createInitialGameState(initialPlayers, createSeededRng(42))
  );

  // Re-deal with true random on client mount
  useEffect(() => {
    setGameState(createInitialGameState(initialPlayers));
  }, [initialPlayers]);
  const [personality, setPersonality] = useState<DealerPersonality>('desi_host');
  const [botSpeed, setBotSpeed] = useState<number>(900); // ms
  const [latestCommentary, setLatestCommentary] = useState<DealerQuote | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  const humanIndex = 0;
  const humanPlayer = gameState.players[humanIndex];
  const isHumanTurn =
    gameState.phase === 'playing' &&
    gameState.currentTurnIndex === humanIndex &&
    !humanPlayer.isSafe;

  const playableCards = isHumanTurn ? getPlayableCards(humanIndex, gameState) : [];
  const playableCardIds = new Set(playableCards.map((c) => c.id));
  const humanCanThulla = isHumanTurn && canStrikeThulla(humanIndex, gameState);

  // Restart Game
  const handleRestart = useCallback(() => {
    const newState = createInitialGameState(initialPlayers);
    setGameState(newState);
    setLatestCommentary({
      dealerName: 'Chacha Chaudhary',
      avatar: '👳‍♂️',
      text: 'New round! Cards dealt fresh. Whoever has the Ace of Spades leads!',
      mood: 'hype',
    });
  }, [initialPlayers]);

  // Handle Human Move
  const handlePlayCard = (card: Card) => {
    if (!isHumanTurn) return;
    const { state: nextState, error } = playCardAction(gameState, humanIndex, card);
    if (error) {
      alert(error);
      return;
    }
    setGameState(nextState);

    // Update commentary from last event
    const lastEvent = nextState.history[nextState.history.length - 1];
    if (lastEvent) {
      const quote = getDealerCommentary(lastEvent, nextState, personality);
      if (quote) setLatestCommentary(quote);
    }
  };

  // Bot Turn Automation Effect
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const currentIdx = gameState.currentTurnIndex;
    const currentPlayer = gameState.players[currentIdx];

    if (currentPlayer && currentPlayer.isBot && !currentPlayer.isSafe) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        try {
          const chosenCard = chooseBotMove(currentIdx, gameState);
          const { state: nextState } = playCardAction(gameState, currentIdx, chosenCard);
          setGameState(nextState);

          const lastEvent = nextState.history[nextState.history.length - 1];
          if (lastEvent) {
            const quote = getDealerCommentary(lastEvent, nextState, personality);
            if (quote) setLatestCommentary(quote);
          }
        } catch (err) {
          console.error('Bot move failed', err);
        } finally {
          setIsThinking(false);
        }
      }, botSpeed);

      return () => clearTimeout(timer);
    }
  }, [gameState, botSpeed, personality]);

  // Confetti when Human gets Safe or Game Ends
  useEffect(() => {
    if (humanPlayer.isSafe && humanPlayer.safeRank === 1) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    }

    if (gameState.phase === 'game_over') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  }, [humanPlayer.isSafe, humanPlayer.safeRank, gameState.phase]);

  // Compute Game Summary if game over
  const gameSummary =
    gameState.phase === 'game_over' ? computeGameSummary(gameState) : null;

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between p-2 sm:p-4 bg-[#090b11] select-none">
      {/* Top Bar: Controls & Status */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
              Bhabhi (Solo vs AI)
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-semibold border border-purple-500/30">
            Trick #{gameState.activeTrick.trickNumber}
          </span>
          {gameState.activeTrick.leadSuit && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-semibold border border-indigo-500/40 flex items-center gap-1">
              Lead: {getSuitSymbol(gameState.activeTrick.leadSuit)}{' '}
              {getSuitName(gameState.activeTrick.leadSuit)}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Personality selector */}
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value as DealerPersonality)}
            className="text-xs bg-[#121624] border border-white/15 text-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-400"
          >
            <option value="desi_host">👳‍♂️ Chacha Chaudhary (Desi)</option>
            <option value="savage">🕶️ Viper (Savage)</option>
            <option value="dramatic">🧙‍♂️ Grandmaster (Dramatic)</option>
          </select>

          {/* Speed selector */}
          <select
            value={botSpeed}
            onChange={(e) => setBotSpeed(Number(e.target.value))}
            className="text-xs bg-[#121624] border border-white/15 text-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-400"
          >
            <option value={500}>⚡ Fast</option>
            <option value={900}>⏱️ Normal</option>
            <option value={1500}>🐢 Slow</option>
          </select>

          {/* Restart */}
          <button
            onClick={handleRestart}
            title="Restart Game"
            className="p-1.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Rules */}
          <button
            onClick={() => setIsRulesOpen(!isRulesOpen)}
            title="Game Rules"
            className="p-1.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Dealer Commentary Speech Bubble */}
      <div className="w-full max-w-2xl my-2 z-20">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/30 shadow-lg shadow-purple-950/50 backdrop-blur-md">
          <div className="text-2xl sm:text-3xl animate-bounce">
            {latestCommentary?.avatar || '👳‍♂️'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                {latestCommentary?.dealerName || 'Dealer Chacha'}
              </span>
              <span className="text-[10px] text-gray-400">• Live Commentary</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-100 italic">
              "{latestCommentary?.text || 'Ace of Spades must open! The battle begins!'}"
            </p>
          </div>
        </div>
      </div>

      {/* Central Card Table Felt */}
      <div className="relative w-full max-w-5xl h-[480px] sm:h-[520px] rounded-3xl felt-table border-4 border-[#032e23] flex flex-col justify-between p-4 shadow-2xl overflow-hidden my-auto">
        {/* Discard Pile indicator in corner */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-xs text-gray-300">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Discarded: </span>
          <span className="font-bold text-white">{gameState.discardPile.length} cards</span>
        </div>

        {/* Top Player (Bot 2: Priya) */}
        <div className="self-center flex flex-col items-center">
          <PlayerSeatView
            player={gameState.players[2]}
            playerIndex={2}
            isCurrentTurn={gameState.currentTurnIndex === 2}
            isThinking={isThinking && gameState.currentTurnIndex === 2}
          />
        </div>

        {/* Middle Row: Left Player (Bot 1: Rohit), Center Trick Area, Right Player (Bot 3: Aman) */}
        <div className="flex items-center justify-between w-full px-2 sm:px-6">
          {/* Left Player (Bot 1) */}
          <div className="flex flex-col items-center">
            <PlayerSeatView
              player={gameState.players[1]}
              playerIndex={1}
              isCurrentTurn={gameState.currentTurnIndex === 1}
              isThinking={isThinking && gameState.currentTurnIndex === 1}
            />
          </div>

          {/* Center Trick Arena */}
          <div className="relative w-64 sm:w-80 h-44 sm:h-52 rounded-2xl bg-black/25 border border-white/10 flex flex-col items-center justify-center p-2">
            {/* Center Status / Alert Banner */}
            {gameState.lastResolution && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                {gameState.lastResolution.type === 'THULLA' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-700/60 animate-bounce">
                    <Flame className="w-3.5 h-3.5" />
                    THULLA STRUCK! 💥
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-700/60">
                    <Sparkles className="w-3.5 h-3.5" />
                    Clean Sweep ✨
                  </div>
                )}
              </div>
            )}

            {/* Trick Cards Played */}
            <div className="flex items-center justify-center -space-x-4 sm:-space-x-6 min-h-[110px]">
              {gameState.activeTrick.cards.length === 0 ? (
                <div className="text-center text-xs text-emerald-200/50 italic px-4 py-6 border border-dashed border-emerald-500/20 rounded-xl">
                  {gameState.firstTrick
                    ? 'Waiting for Ace of Spades (A♠)...'
                    : 'Awaiting trick lead...'}
                </div>
              ) : (
                gameState.activeTrick.cards.map((played, idx) => (
                  <div
                    key={`${played.card.id}-${idx}`}
                    className="flex flex-col items-center transition-transform hover:scale-110 hover:z-30"
                  >
                    <PlayingCard card={played.card} size="sm" isThullaCandidate={played.isThulla} />
                    <span className="text-[10px] font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded mt-1">
                      {gameState.players[played.playerIndex].name.split(' ')[0]}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Turn Prompt Banner */}
            {gameState.phase === 'playing' && (
              <div className="mt-2 text-center">
                {isHumanTurn ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-full shadow animate-pulse">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    {humanCanThulla
                      ? '⚡ No lead suit! Strike a THULLA!'
                      : '👉 YOUR TURN! Pick a playable card below.'}
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-300">
                    {gameState.players[gameState.currentTurnIndex]?.name}'s turn...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Player (Bot 3) */}
          <div className="flex flex-col items-center">
            <PlayerSeatView
              player={gameState.players[3]}
              playerIndex={3}
              isCurrentTurn={gameState.currentTurnIndex === 3}
              isThinking={isThinking && gameState.currentTurnIndex === 3}
            />
          </div>
        </div>

        {/* Bottom Center: Safe Badge or Escaped Message for Human */}
        <div className="self-center">
          {humanPlayer.isSafe && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              You Got Away! Escaped Safe (Rank #{humanPlayer.safeRank})
            </div>
          )}
        </div>
      </div>

      {/* Human Player Hand Section */}
      <div className="w-full max-w-6xl mt-3 flex flex-col items-center z-20">
        <div className="w-full flex items-center justify-between mb-2 px-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-base">{humanPlayer.avatar}</span>
            <span className="font-bold text-white text-sm">Your Hand</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 font-medium">
              {humanPlayer.hand.length} cards remaining
            </span>
          </div>

          {isHumanTurn && (
            <div className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Tap any highlighted card to play it immediately
            </div>
          )}
        </div>

        {/* Hand Cards Horizontal Scroll / Fan */}
        <div className="w-full overflow-x-auto pb-4 pt-2 px-4 flex items-center justify-start sm:justify-center -space-x-4 sm:-space-x-5 min-h-[140px] rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
          {humanPlayer.hand.length === 0 ? (
            <div className="text-center py-6 text-sm text-emerald-400 font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Your hand is empty! You have won your freedom!
            </div>
          ) : (
            humanPlayer.hand.map((card) => {
              const isPlayable = playableCardIds.has(card.id);
              return (
                <PlayingCard
                  key={card.id}
                  card={card}
                  size="md"
                  isPlayable={isPlayable}
                  isThullaCandidate={humanCanThulla && isPlayable}
                  onClick={() => handlePlayCard(card)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Game Over Victory / Loss Modal */}
      {gameSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-[#181d30] to-[#0c0f1a] border border-white/20 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/40 -mt-12 mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white mb-1">
              Match Finished!
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              The game has concluded. Here are the final standings:
            </p>

            {/* Bhabhi Spotlight */}
            <div className="w-full p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 mb-6 flex items-center gap-3">
              <div className="text-3xl">{gameSummary.bhabhi.avatar}</div>
              <div className="text-left flex-1">
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                  The Official Bhabhi (Loser)
                </span>
                <h3 className="font-extrabold text-base text-rose-100">
                  {gameSummary.bhabhi.name}
                </h3>
              </div>
              <div className="text-xl">👑</div>
            </div>

            {/* Standings Table */}
            <div className="w-full space-y-2 mb-6">
              {gameSummary.rankings.map((r, idx) => (
                <div
                  key={r.playerIndex}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold ${
                    r.isBhabhi
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                      : 'bg-white/5 border-white/10 text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-gray-400 font-mono">#{idx + 1}</span>
                    <span>{r.avatar}</span>
                    <span>{r.name}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      r.isBhabhi
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {r.statusLabel}
                  </span>
                </div>
              ))}
            </div>

            {/* Rematch Button */}
            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition"
            >
              Play Another Game
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#111422] border border-white/20 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="font-black text-lg text-white">How to Play Bhabhi (Thulla)</h3>
              <button
                onClick={() => setIsRulesOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                <strong>Goal:</strong> Empty your hand! The last player left holding cards is the <strong>Bhabhi</strong> (loser).
              </p>
              <p>
                <strong>1. Opening:</strong> The player who receives the <strong>Ace of Spades (A♠)</strong> MUST start the game by leading it.
              </p>
              <p>
                <strong>2. Follow Suit:</strong> The first card played in a trick sets the <em>lead suit</em>. If you hold ANY card of that suit, you MUST play it.
              </p>
              <p>
                <strong>3. Thulla (Thoko):</strong> If you do NOT hold any cards of the lead suit, you can play ANY card! The trick stops immediately. The player who played the <strong>highest card of the original lead suit</strong> must pick up the entire pile! The player who struck the Thulla leads the next trick.
              </p>
              <p>
                <strong>4. Clean Sweep:</strong> If all active players follow the lead suit, the highest card wins and the pile is discarded. The winner leads next.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerSeatView({
  player,
  playerIndex,
  isCurrentTurn,
  isThinking,
}: {
  player: any;
  playerIndex: number;
  isCurrentTurn: boolean;
  isThinking: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Avatar Container */}
      <div
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl border-2 transition-all duration-300 ${
          isCurrentTurn
            ? 'border-amber-400 bg-amber-950/50 ring-4 ring-amber-400/40 scale-105'
            : player.isSafe
            ? 'border-emerald-500 bg-emerald-950/40 opacity-75'
            : 'border-white/10 bg-slate-900/80'
        }`}
      >
        <span>{player.avatar}</span>

        {/* Turn indicator badge */}
        {isCurrentTurn && (
          <div className="absolute -top-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-black text-[9px] uppercase tracking-wider animate-bounce">
            Turn
          </div>
        )}

        {/* Safe Badge */}
        {player.isSafe && (
          <div className="absolute -bottom-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] uppercase tracking-wider">
            Safe #{player.safeRank}
          </div>
        )}
      </div>

      {/* Name and Cards Count */}
      <span className="text-xs font-bold text-white mt-1 max-w-[90px] truncate text-center">
        {player.name}
      </span>
      {!player.isSafe && (
        <span className="text-[10px] text-gray-400 font-medium">
          {isThinking ? (
            <span className="text-amber-400 animate-pulse">Thinking...</span>
          ) : (
            `${player.hand.length} cards`
          )}
        </span>
      )}
    </div>
  );
}
