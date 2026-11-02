'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/audio/sound-effects';
import {
  BhabhiGameState,
  Card,
  DealerPersonality,
  PlayerConfig,
  chooseBotMove,
  createInitialGameState,
  createSeededRng,
  getPlayableCards,
  getSuitSymbol,
  getSuitName,
  playCardAction,
  canStrikeThulla,
} from '@/game-engine/bhabhi';
import { PlayingCard } from '@/components/cards/PlayingCard';
import {
  Crown,
  Flame,
  RotateCcw,
  Sparkles,
  Trophy,
  Layers,
  ArrowLeft,
  BookOpen,
  Settings,
  Clock,
  Lightbulb,
  Play,
  X,
  Bot,
} from 'lucide-react';

interface BhabhiGameTableProps {
  initialPlayers?: PlayerConfig[];
}

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { id: 'human-1', name: 'You', isBot: false, avatar: '/assets/bhabhi/player-avatar.png' },
  { id: 'bot-1', name: 'Bot 1', isBot: true, botDifficulty: 'smart', avatar: '/assets/bhabhi/bot-avatar.png' },
  { id: 'bot-2', name: 'Bot 2', isBot: true, botDifficulty: 'normal', avatar: '/assets/bhabhi/bot-avatar.png' },
  { id: 'bot-3', name: 'Bot 3', isBot: true, botDifficulty: 'easy', avatar: '/assets/bhabhi/bot-avatar.png' },
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

  const [botSpeed] = useState<number>(900); // ms
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Turn Countdown Timer (Image 3: Turn Time: 00:45)
  const [turnTime, setTurnTime] = useState<number>(45);

  const humanIndex = 0;
  const humanPlayer = gameState.players[humanIndex];
  const isHumanTurn =
    gameState.phase === 'playing' &&
    gameState.currentTurnIndex === humanIndex &&
    !humanPlayer.isSafe;

  const playableCards = isHumanTurn ? getPlayableCards(humanIndex, gameState) : [];
  const playableCardIds = new Set(playableCards.map((c) => c.id));
  const humanCanThulla = isHumanTurn && canStrikeThulla(humanIndex, gameState);

  // Auto-select first playable card if nothing selected
  useEffect(() => {
    if (isHumanTurn && playableCards.length > 0 && !selectedCardId) {
      setSelectedCardId(playableCards[0].id);
    }
  }, [isHumanTurn, playableCards, selectedCardId]);

  // Turn Timer countdown
  useEffect(() => {
    if (gameState.phase !== 'playing') return;
    const timer = setInterval(() => {
      setTurnTime((prev) => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.phase, gameState.currentTurnIndex]);

  // Reset turn time on turn change
  useEffect(() => {
    setTurnTime(45);
  }, [gameState.currentTurnIndex]);

  // Dynamic opponents mapping (3 to 6 players)
  const opponents = gameState.players
    .map((p, idx) => ({ player: p, index: idx }))
    .filter((item) => item.index !== humanIndex);

  // Restart Game
  const handleRestart = useCallback(() => {
    soundManager.playDramaticBoom();
    const newState = createInitialGameState(initialPlayers);
    setGameState(newState);
    setSelectedCardId(null);
  }, [initialPlayers]);

  const triggerEventAudio = (nextState: BhabhiGameState) => {
    soundManager.playCardSnap();
    if (nextState.lastResolution?.type === 'THULLA') {
      soundManager.playThullaBoom();
    } else if (nextState.lastResolution?.type === 'CLEAN_SWEEP') {
      soundManager.playCleanSweepChime();
    }
    if (nextState.lastResolution?.newlySafePlayers?.length) {
      soundManager.playPlayerSafeFanfare();
    }
  };

  // Human card play
  const handleCardClick = (card: Card) => {
    if (!isHumanTurn || !playableCardIds.has(card.id)) {
      soundManager.playTap();
      return;
    }
    setSelectedCardId(card.id);
  };

  const handleConfirmPlayCard = () => {
    if (!isHumanTurn || !selectedCardId) return;
    const cardToPlay = humanPlayer.hand.find((c) => c.id === selectedCardId);
    if (!cardToPlay) return;

    try {
      const res = playCardAction(gameState, humanIndex, cardToPlay);
      if (!res.error) {
        triggerEventAudio(res.state);
        setGameState(res.state);
        setSelectedCardId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bot Turn Automation Loop
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const currentTurnIdx = gameState.currentTurnIndex;
    const currentPlayer = gameState.players[currentTurnIdx];

    if (!currentPlayer || !currentPlayer.isBot || currentPlayer.isSafe) {
      return;
    }

    const timer = setTimeout(() => {
      try {
        const botMove = chooseBotMove(currentTurnIdx, gameState);
        if (botMove) {
          const res = playCardAction(gameState, currentTurnIdx, botMove);
          if (!res.error) {
            triggerEventAudio(res.state);
            setGameState(res.state);
          }
        }
      } catch (err) {
        console.error('Bot play error', err);
      }
    }, botSpeed);

    return () => clearTimeout(timer);
  }, [gameState, botSpeed]);

  // Contextual Hint Banner text (Image 3)
  const getContextualHint = () => {
    if (gameState.phase === 'game_over') {
      const bhabhi = gameState.players.find((p) => !p.isSafe);
      if (bhabhi) {
        return `Game Over! ${bhabhi.name} became the Bhabhi! 👑`;
      }
      return 'Game Finished!';
    }
    if (isHumanTurn) {
      if (humanCanThulla) {
        return '💥 You are VOID in the lead suit! Strike a THULLA on the highest card!';
      }
      if (gameState.activeTrick?.leadSuit) {
        return `Play a ${getSuitName(gameState.activeTrick.leadSuit)} card (since it\'s the lead suit).`;
      }
      return 'You lead this trick! Play any card (or A♠ if first round).';
    }
    const currentP = gameState.players[gameState.currentTurnIndex];
    return `${currentP?.name || 'Bot'} is thinking...`;
  };

  const topBot = opponents.find((o) => o.player.name.includes('1')) || opponents[0];
  const rightBot = opponents.find((o) => o.player.name.includes('2')) || opponents[1];
  const leftBot = opponents.find((o) => o.player.name.includes('3')) || opponents[2];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center select-none py-2 space-y-4">
      {/* 1. Top Navigation Bar (Image 3) */}
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-[#0d1020] border border-white/10 shadow-lg flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/games/bhabhi"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-black text-base">🃏</span>
            <span className="font-black text-sm text-white">Bhabhi</span>
            <span className="text-xs text-gray-400 font-semibold">(Get Away)</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-purple-400" /> Solo vs AI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRulesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Rules</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
            title="Table settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top Info Badges (Image 3) */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-xl bg-[#111827] border border-white/10 text-white font-bold">
            Round {gameState.activeTrick ? gameState.activeTrick.trickNumber : 1} / 5
          </span>
          {gameState.activeTrick?.leadSuit && (
            <span className="text-xs px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5">
              <span>Lead Suit:</span>
              <span className="text-base">{getSuitSymbol(gameState.activeTrick.leadSuit)}</span>
              <span>{getSuitName(gameState.activeTrick.leadSuit)}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-[#111827] border border-white/10 px-3 py-1 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-gray-400 font-medium">Turn Time:</span>
          <span className="font-mono text-xs font-black text-emerald-400">
            00:{turnTime < 10 ? `0${turnTime}` : turnTime}
          </span>
        </div>
      </div>

      {/* 3. The Oval Felt Card Table (Image 3 exact velvet oval and rim glow) */}
      <div className="relative w-full h-[470px] sm:h-[510px] rounded-[52px] bg-[radial-gradient(ellipse_at_center,_#2b135c_0%,_#160b33_60%,_#09041a_100%)] border-4 border-[#8b2cf5] shadow-[0_0_80px_rgba(139,44,245,0.45)] flex flex-col justify-between p-5 sm:p-7 overflow-hidden">
        {/* Gold inner line accent */}
        <div className="absolute inset-2.5 rounded-[46px] border border-amber-400/20 pointer-events-none" />

        {/* TOP OPPONENT: Bot 1 */}
        {topBot && (
          <div className="w-full flex flex-col items-center z-10">
            {/* Fanned facedown purple cards behind bot */}
            <div className="flex -space-x-4 mb-1">
              {[...Array(Math.min(7, topBot.player.hand.length))].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-10 rounded-md bg-gradient-to-br from-purple-700 to-indigo-950 border border-purple-400/50 shadow-md transform -rotate-3"
                />
              ))}
            </div>

            {/* Bot 1 Avatar & Badge */}
            <div
              className={`relative flex flex-col items-center ${
                gameState.currentTurnIndex === topBot.index ? 'scale-105' : 'opacity-90'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full overflow-hidden border-2 transition shadow-lg ${
                  gameState.currentTurnIndex === topBot.index
                    ? 'border-cyan-400 ring-4 ring-cyan-400/50 animate-pulse'
                    : 'border-purple-400/60 ring-2 ring-purple-500/20'
                }`}
              >
                <img
                  src="/assets/bhabhi/bot-avatar.png"
                  alt="Bot 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-1 px-3 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow">
                <span>{topBot.player.name}</span>
                <span className="text-[10px] text-purple-300 font-mono">
                  {topBot.player.hand.length} Cards
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MIDDLE SECTION: Left Bot 3, Center Trick, Right Bot 2 */}
        <div className="w-full flex items-center justify-between my-auto z-10 px-2 sm:px-6">
          {/* LEFT OPPONENT: Bot 3 */}
          {leftBot && (
            <div className="flex flex-col items-center">
              {/* Cards behind */}
              <div className="flex -space-x-3 mb-1">
                {[...Array(Math.min(5, leftBot.player.hand.length))].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-9 rounded bg-gradient-to-br from-purple-700 to-indigo-950 border border-purple-400/40 shadow-sm"
                  />
                ))}
              </div>
              <div
                className={`w-14 h-14 rounded-full overflow-hidden border-2 transition shadow-lg ${
                  gameState.currentTurnIndex === leftBot.index
                    ? 'border-cyan-400 ring-4 ring-cyan-400/50 animate-pulse'
                    : 'border-emerald-400/60 ring-2 ring-emerald-500/20'
                }`}
              >
                <img
                  src="/assets/bhabhi/bot-avatar.png"
                  alt="Bot 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-xs font-bold text-white flex items-center gap-1 shadow">
                <span>{leftBot.player.name}</span>
                <span className="text-[10px] text-emerald-300 font-mono">
                  {leftBot.player.hand.length} Cards
                </span>
              </div>
            </div>
          )}

          {/* CENTER TRICK FELT AREA (Image 3: Glowing Concentric Halo!) */}
          <div className="flex flex-col items-center space-y-3">
            {/* Lead Suit Pill Banner */}
            {gameState.activeTrick?.leadSuit && (
              <div className="px-5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/80 text-cyan-300 text-xs font-black shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center gap-2">
                <span className="text-base">{getSuitSymbol(gameState.activeTrick.leadSuit)}</span>
                <span>{getSuitName(gameState.activeTrick.leadSuit)} are the Lead Suit</span>
              </div>
            )}

            {/* Played Cards with Concentric Cyan Halo Rings */}
            <div className="relative min-h-[130px] flex items-center justify-center p-3">
              {/* Cyan concentric glowing rings in center felt (Image 3) */}
              <div className="absolute w-36 h-36 rounded-full border border-cyan-400/30 blur-[2px] pointer-events-none" />
              <div className="absolute w-48 h-48 rounded-full border border-cyan-400/20 blur-[4px] pointer-events-none" />

              {(!gameState.activeTrick || gameState.activeTrick.cards.length === 0) ? (
                <div className="w-20 h-28 rounded-2xl border-2 border-dashed border-purple-400/30 flex flex-col items-center justify-center text-purple-300/40 text-[10px] font-bold">
                  <span>EMPTY TRICK</span>
                  <span>Lead card</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 z-10">
                  {gameState.activeTrick.cards.map((item, idx: number) => {
                    const isWinning = idx === 0;

                    return (
                      <div
                        key={item.card.id}
                        className={`transition-all duration-300 transform ${
                          isWinning
                            ? 'ring-4 ring-cyan-400 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.8)] scale-110 z-20'
                            : 'scale-95 z-10'
                        }`}
                      >
                        <PlayingCard card={item.card} size="md" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trick Card Count */}
            {gameState.activeTrick && gameState.activeTrick.cards.length > 0 && (
              <div className="text-[11px] font-bold text-gray-300 bg-black/60 px-3 py-0.5 rounded-full border border-white/15">
                Current Trick ({gameState.activeTrick.cards.length} cards)
              </div>
            )}
          </div>

          {/* RIGHT OPPONENT: Bot 2 */}
          {rightBot && (
            <div className="flex flex-col items-center">
              {/* Cards behind */}
              <div className="flex -space-x-3 mb-1">
                {[...Array(Math.min(5, rightBot.player.hand.length))].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-9 rounded bg-gradient-to-br from-purple-700 to-indigo-950 border border-purple-400/40 shadow-sm"
                  />
                ))}
              </div>
              <div
                className={`w-14 h-14 rounded-full overflow-hidden border-2 transition shadow-lg ${
                  gameState.currentTurnIndex === rightBot.index
                    ? 'border-cyan-400 ring-4 ring-cyan-400/50 animate-pulse'
                    : 'border-amber-400/60 ring-2 ring-amber-500/20'
                }`}
              >
                <img
                  src="/assets/bhabhi/bot-avatar.png"
                  alt="Bot 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-xs font-bold text-white flex items-center gap-1 shadow">
                <span>{rightBot.player.name}</span>
                <span className="text-[10px] text-amber-300 font-mono">
                  {rightBot.player.hand.length} Cards
                </span>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: You Avatar & Discard Pile (Image 3) */}
        <div className="w-full flex items-center justify-between z-10 pt-2 border-t border-white/10">
          {/* Discard Pile indicator with Spade artwork */}
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-purple-400/30 bg-[#16122d]">
              <img
                src="/assets/bhabhi/discard-pile.png"
                alt="Discard Pile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-gray-300 block">Discard Pile</span>
              <span className="text-xs font-mono font-black text-purple-300">
                {gameState.discardPile.length} cards
              </span>
            </div>
          </div>

          {/* "You" Avatar in Glowing Green Ring (Image 3) */}
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-full overflow-hidden border-2 transition shadow-xl ${
                isHumanTurn
                  ? 'border-emerald-400 ring-4 ring-emerald-400/50 animate-pulse'
                  : 'border-emerald-500/60 ring-2 ring-emerald-500/30'
              }`}
            >
              <img
                src="/assets/bhabhi/player-avatar.png"
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>You</span>
                {isHumanTurn && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Your Turn
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-300 font-mono font-bold">
                {humanPlayer.hand.length} Cards
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Contextual Hint Banner (Image 3: Lightbulb Banner) */}
      <div className="w-full max-w-2xl flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#101424] border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-lg text-center">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{getContextualHint()}</span>
      </div>

      {/* 5. Player's Hand & Action Buttons (Image 3) */}
      <div className="w-full flex flex-col items-center space-y-4">
        {/* Horizontal Fanned Card Hand */}
        <div className="w-full overflow-x-auto pb-3 flex justify-center items-end px-4 min-h-[140px]">
          <div className="flex -space-x-5 sm:-space-x-6 hover:-space-x-3 transition-all duration-300 py-4">
            {humanPlayer.hand.map((card) => {
              const isPlayable = isHumanTurn && playableCardIds.has(card.id);
              const isSelected = selectedCardId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`transition-all duration-200 cursor-pointer transform ${
                    isSelected
                      ? '-translate-y-6 scale-110 ring-4 ring-emerald-400 rounded-xl z-30 shadow-2xl'
                      : isPlayable
                      ? 'hover:-translate-y-4 hover:scale-105 z-10'
                      : 'opacity-50 hover:opacity-75 z-0'
                  }`}
                >
                  <PlayingCard card={card} size="md" isPlayable={isPlayable} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons (Image 3: Play Card, Draw Card / Restart) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirmPlayCard}
            disabled={!isHumanTurn || !selectedCardId}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-black font-black text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-emerald-500/30 transition transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Play Card</span>
          </button>

          {gameState.phase === 'game_over' ? (
            <button
              onClick={handleRestart}
              className="px-6 py-3.5 rounded-2xl bg-[#632df3] hover:bg-[#5224d8] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Deal Again</span>
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playTap();
                if (humanPlayer.hand.length > 0 && isHumanTurn) {
                  const valid = humanPlayer.hand.find((c) => playableCardIds.has(c.id));
                  if (valid) setSelectedCardId(valid.id);
                }
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#632df3] hover:bg-[#5224d8] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Draw Card</span>
            </button>
          )}
        </div>
      </div>

      {/* Rules Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#111827] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" /> Bhabhi Rules
              </h3>
              <button onClick={() => setIsRulesOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <p>• <strong>Ace of Spades (A♠)</strong> leads the first round.</p>
              <p>• Must follow the lead suit if you possess any card of that suit.</p>
              <p>• If void in the lead suit, strike a <strong>Thulla</strong> to dump the pile on the highest lead card!</p>
              <p>• First to empty their hand gets away safe. Last player left holding cards is the <strong>Bhabhi</strong>!</p>
            </div>
            <button
              onClick={() => setIsRulesOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
