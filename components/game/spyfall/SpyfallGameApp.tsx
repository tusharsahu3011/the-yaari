'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  BookOpen,
  Settings,
  Users,
  Clock,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  HelpCircle,
  Plus,
  Trash2,
  Pause,
  MapPin,
  Shield,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';
import {
  ALL_LOCATIONS,
  LOCATION_CATEGORIES,
  SpyfallGameState,
  SpyfallPlayer,
  createSpyfallGame,
  advanceReveal,
  tickTimer,
  toggleTimer,
  initiateAccusation,
  cancelAccusation,
  castVote,
  resolveAccusation,
  spySurrenderAndGuess,
  submitSpyGuess,
} from '@/game-engine/spyfall';
import { StylizedAvatar, SmartAssetImage } from '@/components/illustrations/GameIllustrations';

const DEFAULT_PLAYERS = [
  { id: 'p1', name: 'Aman', avatar: '😎' },
  { id: 'p2', name: 'Simran', avatar: '👩' },
  { id: 'p3', name: 'Rohan', avatar: '🎧' },
  { id: 'p4', name: 'Priya', avatar: '✨' },
];

export function SpyfallGameApp() {
  // Setup State
  const [playerList, setPlayerList] = useState(DEFAULT_PLAYERS);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(8);
  const [spyCount, setSpyCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [cheatSheetSearch, setCheatSheetSearch] = useState('');

  // Active Game State
  const [gameState, setGameState] = useState<SpyfallGameState | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Timer Tick Hook
  useEffect(() => {
    if (!gameState || gameState.phase !== 'investigation' || !gameState.isTimerRunning) {
      return;
    }

    const interval = setInterval(() => {
      setGameState((prev) => (prev ? tickTimer(prev) : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.phase, gameState?.isTimerRunning]);

  // Game Over Celebration
  useEffect(() => {
    if (gameState?.phase === 'game_over') {
      soundManager.playVictory();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [gameState?.phase]);

  // Actions
  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed || playerList.length >= 12) return;
    soundManager.playTap();
    const avatars = ['😎', '👩', '🎧', '✨', '🦊', '🐼', '🦁', '🐯', '🚀', '🎩'];
    const avatar = avatars[playerList.length % avatars.length];
    setPlayerList([
      ...playerList,
      { id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, name: trimmed, avatar },
    ]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    if (playerList.length <= 3) return;
    soundManager.playTap();
    setPlayerList(playerList.filter((p) => p.id !== id));
  };

  const handleStartGame = () => {
    soundManager.playDramaticBoom();
    const categories = selectedCategory === 'All' ? undefined : [selectedCategory];
    const newGame = createSpyfallGame(playerList, {
      timerMinutes,
      spyCount,
      selectedCategories: categories,
    });
    setGameState(newGame);
    setIsCardFlipped(false);
  };

  const handleRevealNext = () => {
    soundManager.playCardSnap();
    if (!gameState) return;
    setIsCardFlipped(false);
    setGameState(advanceReveal(gameState));
  };

  const handleToggleTimer = () => {
    soundManager.playTap();
    if (!gameState) return;
    setGameState(toggleTimer(gameState));
  };

  const handleStartAccusation = (accusedId: string) => {
    soundManager.playSelect();
    if (!gameState) return;
    setGameState(initiateAccusation(gameState, accusedId));
  };

  const handleVote = (voterId: string, isGuilty: boolean) => {
    soundManager.playSelect();
    if (!gameState) return;
    setGameState(castVote(gameState, voterId, isGuilty));
  };

  const handleResolveVote = () => {
    soundManager.playDramaticBoom();
    if (!gameState) return;
    setGameState(resolveAccusation(gameState));
  };

  const handleCancelAccuse = () => {
    soundManager.playTap();
    if (!gameState) return;
    setGameState(cancelAccusation(gameState));
  };

  const handleSpySurrender = () => {
    soundManager.playDramaticBoom();
    if (!gameState) return;
    setGameState(spySurrenderAndGuess(gameState));
  };

  const handleGuessLocation = (locId: string) => {
    soundManager.playDramaticBoom();
    if (!gameState) return;
    setGameState(submitSpyGuess(gameState, locId));
  };

  const handleResetToSetup = () => {
    soundManager.playSelect();
    setGameState(null);
    setIsCardFlipped(false);
  };

  // Format Timer mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================================================
  // VIEW 1: SETUP SCREEN
  // ==========================================================================
  if (!gameState || gameState.phase === 'setup') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 select-none">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link
            href="/games"
            className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Games</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xl">🕵️</span>
            <span className="font-extrabold text-base text-white">Spyfall</span>
            <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Pass & Play
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playSelect();
              setIsRulesModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Rules</span>
          </button>
        </div>

        {/* Hero Card Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#181126] to-purple-950/40 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interrogation & Bluffing</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Spyfall
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
              Everyone is at a secret location with a specific role, except the <strong className="text-amber-400">Spy</strong> who has no idea where they are! Ask clever questions, uncover the impostor, or guess the location to win!
            </p>
          </div>

          <div className="w-32 h-32 shrink-0 rounded-2xl bg-black/40 border border-amber-500/40 p-4 flex flex-col items-center justify-center text-center shadow-xl shadow-amber-500/10">
            <span className="text-5xl mb-2">🔍</span>
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-widest">
              3 - 12 Players
            </span>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Players List */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0f1424] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Players ({playerList.length} / 12)</h2>
              </div>
              <span className="text-[11px] text-gray-400">Min 3 players</span>
            </div>

            {/* Player list */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {playerList.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{p.avatar}</span>
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    {idx === 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        HOST
                      </span>
                    )}
                  </div>
                  {playerList.length > 3 && (
                    <button
                      onClick={() => handleRemovePlayer(p.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Remove player"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add player form */}
            {playerList.length < 12 && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                  placeholder="Enter player name..."
                  maxLength={18}
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleAddPlayer}
                  disabled={!newPlayerName.trim()}
                  className="p-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Round Options */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0f1424] border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="pb-3 border-b border-white/10">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Game Configuration
                </h2>
              </div>

              {/* Timer Duration */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-2 block">
                  Question Round Timer
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 8, 10].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        soundManager.playTap();
                        setTimerMinutes(mins);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        timerMinutes === mins
                          ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Spies */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-2 block">
                  Number of Spies
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      soundManager.playTap();
                      setSpyCount(1);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      spyCount === 1
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    1 Spy (Standard)
                  </button>
                  <button
                    onClick={() => {
                      if (playerList.length < 6) return;
                      soundManager.playTap();
                      setSpyCount(2);
                    }}
                    disabled={playerList.length < 6}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      playerList.length < 6
                        ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-500 border-white/5'
                        : spyCount === 2
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    2 Spies (6+ Players)
                  </button>
                </div>
              </div>

              {/* Location Category Filter */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-2 block">
                  Location Pack
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {LOCATION_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        soundManager.playTap();
                        setSelectedCategory(cat);
                      }}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition border ${
                        selectedCategory === cat
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartGame}
              disabled={playerList.length < 3}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-xl shadow-amber-500/30 active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Deal Secret Cards ({playerList.length} Players)</span>
            </button>
          </div>
        </div>

        {/* Rules Modal */}
        {isRulesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#111827] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" /> How to Play Spyfall
                </h3>
                <button onClick={() => setIsRulesModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs text-gray-300 leading-relaxed max-h-96 overflow-y-auto pr-1">
                <p>
                  <strong>1. The Premise:</strong> All players (except the Spy) receive the exact same secret location card (e.g. <em>Airplane</em>, <em>Casino</em>, <em>Submarine</em>) along with a specific role at that location.
                </p>
                <p>
                  <strong>2. The Spy:</strong> The Spy receives a card that says <span className="text-amber-400 font-bold">YOU ARE THE SPY!</span> with no location.
                </p>
                <p>
                  <strong>3. Interrogation:</strong> A 8-minute timer begins. Players take turns asking each other questions (e.g., <em>"What are you wearing today?"</em>, <em>"Are there any children around?"</em>).
                </p>
                <p>
                  <strong>4. Strategy:</strong>
                  <br />• <em>Innocents:</em> Ask questions specific enough to prove you know where you are, but vague enough so the Spy cannot deduce the location!
                  <br />• <em>Spy:</em> Answer smoothly, listen to other answers, and try to deduce the location before time expires!
                </p>
                <p>
                  <strong>5. Winning:</strong>
                  <br />• <em>Accusation:</em> Players can stop the clock to vote on an accused spy. If unanimous/majority, the spy is caught!
                  <br />• <em>Spy Guess:</em> The Spy can reveal themselves anytime to guess the location. A correct guess wins instantly!
                </p>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs"
              >
                Got It, Let's Play!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: ROLE REVEAL SCREEN (Pass & Play)
  // ==========================================================================
  if (gameState.phase === 'reveal') {
    const currentPlayer = gameState.players[gameState.currentRevealIndex];

    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center space-y-6 py-6 select-none">
        {/* Pass device banner */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Player {gameState.currentRevealIndex + 1} of {gameState.players.length}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Pass device to <span className="text-amber-300">{currentPlayer.name}</span>
          </h2>
          <p className="text-xs text-gray-400">
            Make sure no one else is looking at the screen before tapping to reveal!
          </p>
        </div>

        {/* Card Reveal Box */}
        <div
          onClick={() => {
            soundManager.playCardSnap();
            setIsCardFlipped(!isCardFlipped);
          }}
          className={`w-full max-w-sm h-80 rounded-3xl p-6 border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden ${
            isCardFlipped
              ? currentPlayer.isSpy
                ? 'bg-gradient-to-b from-rose-950/80 to-[#100612] border-rose-500/60 shadow-rose-900/40'
                : 'bg-gradient-to-b from-[#18112e] to-[#0c0818] border-amber-500/60 shadow-amber-900/30'
              : 'bg-[#101424] border-white/15 hover:border-white/30'
          }`}
        >
          {!isCardFlipped ? (
            /* Card Back (Hidden) */
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-inner">
                {currentPlayer.avatar}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{currentPlayer.name}</h3>
                <p className="text-xs text-gray-400 mt-1">Tap anywhere to reveal your secret identity</p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                <Eye className="w-3.5 h-3.5" />
                <span>Tap to Reveal</span>
              </div>
            </div>
          ) : (
            /* Card Front (Revealed) */
            <div className="flex-1 flex flex-col items-center justify-between w-full py-2 animate-in fade-in zoom-in-95 duration-200">
              {currentPlayer.isSpy ? (
                <>
                  <div className="space-y-1">
                    <span className="text-3xl">🕵️</span>
                    <h3 className="text-2xl font-black text-rose-400 uppercase tracking-wider">
                      YOU ARE THE SPY!
                    </h3>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-rose-500/30 text-xs text-gray-200 space-y-1.5">
                    <p className="font-bold text-rose-300">Your Objective:</p>
                    <p>• You do NOT know the location.</p>
                    <p>• Listen carefully to everyone&apos;s questions & answers.</p>
                    <p>• Blend in and deduce the secret location without getting caught!</p>
                  </div>

                  <div className="text-[11px] text-gray-400 font-semibold">
                    Tap &quot;Hide & Pass&quot; below once you are ready.
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <span className="text-4xl">{gameState.location.icon}</span>
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                      Secret Location
                    </h4>
                    <h3 className="text-2xl font-black text-amber-300 tracking-tight">
                      {gameState.location.name}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 w-full text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Your Role</span>
                    <div className="text-sm font-black text-white">{currentPlayer.role?.name}</div>
                    <div className="text-[11px] text-gray-300 leading-tight">
                      {currentPlayer.role?.description}
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400">
                    Keep this secret! Answer questions naturally.
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleRevealNext}
          className="w-full max-w-sm py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-amber-500/30 active:scale-[0.99]"
        >
          <span>{gameState.currentRevealIndex + 1 === gameState.players.length ? 'Start Interrogation 🚀' : 'Hide Card & Pass Device →'}</span>
        </button>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 3: INVESTIGATION / INTERROGATION PHASE
  // ==========================================================================
  if (gameState.phase === 'investigation') {
    const firstAsker = gameState.players.find((p) => p.id === gameState.firstQuestionPlayerId);

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 select-none">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <button
            onClick={handleResetToSetup}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>

          {/* Centered Timer */}
          <div className="flex items-center gap-3 bg-[#11172a] px-4 py-2 rounded-2xl border border-amber-500/30 shadow-lg">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-2xl font-black text-white tracking-widest">
              {formatTime(gameState.timerSeconds)}
            </span>
            <button
              onClick={handleToggleTimer}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              title={gameState.isTimerRunning ? 'Pause timer' : 'Resume timer'}
            >
              {gameState.isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => setIsCheatSheetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#632df3] hover:bg-[#5224d8] text-white font-bold text-xs shadow-md shadow-purple-600/30 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Cheat Sheet</span>
          </button>
        </div>

        {/* Kickoff Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 shadow">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎙️</span>
            <span>
              <strong>{firstAsker?.name || 'A player'}</strong> starts by asking anyone a question!
            </span>
          </div>
          <span className="text-[10px] text-gray-400">Remember: Don&apos;t ask the person who just asked you!</span>
        </div>

        {/* Players Grid (Tap to Accuse) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Players in Room (Tap to Accuse)
            </h3>
            <span className="text-[11px] text-gray-500">
              {gameState.options.spyCount} Spy lurking among you
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gameState.players.map((p) => (
              <div
                key={p.id}
                onClick={() => handleStartAccusation(p.id)}
                className="p-4 rounded-2xl bg-[#0f1424] border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/5 cursor-pointer transition flex flex-col items-center justify-between space-y-2 group shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {p.avatar}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-gray-500">Tap to Accuse</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Bar: Spy Guess & Location Cheat sheet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleSpySurrender}
            className="py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-900/30 transition"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>I Am The Spy! (Stop & Guess Location)</span>
          </button>

          <button
            onClick={() => setIsCheatSheetOpen(true)}
            className="py-3.5 rounded-2xl bg-[#141a2e] border border-white/15 hover:border-white/30 text-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>View All Possible Locations ({ALL_LOCATIONS.length})</span>
          </button>
        </div>

        {/* Location Cheat Sheet Modal */}
        {isCheatSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-[#101424] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Possible Locations Cheat Sheet
                  </h3>
                </div>
                <button
                  onClick={() => setIsCheatSheetOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={cheatSheetSearch}
                  onChange={(e) => setCheatSheetSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Locations Grid */}
              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                {ALL_LOCATIONS.filter((l) =>
                  l.name.toLowerCase().includes(cheatSheetSearch.toLowerCase())
                ).map((loc) => (
                  <div
                    key={loc.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5"
                  >
                    <span className="text-2xl">{loc.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{loc.name}</div>
                      <div className="text-[10px] text-gray-400">{loc.category}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsCheatSheetOpen(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                Close Cheat Sheet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 4: ACCUSATION & VOTING PHASE
  // ==========================================================================
  if (gameState.phase === 'accusation') {
    const accused = gameState.players.find((p) => p.id === gameState.accusedPlayerId);
    const eligibleVoters = gameState.players.filter((p) => p.id !== gameState.accusedPlayerId);
    const votes = gameState.accusationVotes;
    const guiltyVotesCount = Object.values(votes).filter(Boolean).length;
    const neededVotes = Math.ceil(eligibleVoters.length / 2);

    return (
      <div className="w-full max-w-xl mx-auto space-y-6 py-6 select-none">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
            Emergency Accusation Vote
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Is <span className="text-amber-300">{accused?.name || 'this player'}</span> the Spy?
          </h2>
          <p className="text-xs text-gray-300">
            Requires at least <strong>{neededVotes} guilty votes</strong> to convict.
          </p>
        </div>

        {/* Accused Showcase */}
        <div className="p-6 rounded-3xl bg-[#0f1424] border-2 border-rose-500/40 shadow-2xl flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-rose-400 shadow flex items-center justify-center text-4xl">
            {accused?.avatar}
          </div>
          <div className="text-base font-black text-white">{accused?.name}</div>
          <div className="text-xs text-gray-400">
            Accused of espionage. The accused does not vote.
          </div>
        </div>

        {/* Eligible Voters ballot */}
        <div className="p-5 rounded-3xl bg-[#0f1424] border border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Player Ballots ({Object.keys(votes).length} / {eligibleVoters.length} Voted)
          </h3>

          <div className="space-y-2">
            {eligibleVoters.map((voter) => {
              const hasVoted = votes[voter.id] !== undefined;
              const isGuilty = votes[voter.id] === true;

              return (
                <div
                  key={voter.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{voter.avatar}</span>
                    <span className="text-xs font-bold text-white">{voter.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleVote(voter.id, true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                        hasVoted && isGuilty
                          ? 'bg-rose-500 text-white border-rose-400 shadow'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-rose-500/20'
                      }`}
                    >
                      Guilty 🔴
                    </button>
                    <button
                      onClick={() => handleVote(voter.id, false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                        hasVoted && !isGuilty
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-emerald-500/20'
                      }`}
                    >
                      Innocent 🟢
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tally & Resolution Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancelAccuse}
            className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs"
          >
            Cancel Accusation
          </button>

          <button
            onClick={handleResolveVote}
            disabled={Object.keys(votes).length === 0}
            className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xl shadow-amber-500/20"
          >
            <span>Resolve Accusation ({guiltyVotesCount} Guilty)</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 5: SPY GUESS PHASE
  // ==========================================================================
  if (gameState.phase === 'spy_guess') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 py-4 select-none">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-black tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Final Espionage Chance
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            The Spy Must Guess the Location!
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            If the Spy picks the correct location, they steal the victory! If they guess wrong, Innocents win!
          </p>
        </div>

        {/* 16 Locations Picker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleGuessLocation(loc.id)}
              className="p-4 rounded-2xl bg-[#0f1424] border border-white/10 hover:border-amber-400 hover:bg-amber-500/10 transition flex flex-col items-center justify-center space-y-1.5 text-center group shadow-lg active:scale-95"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">{loc.icon}</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-300">{loc.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 6: GAME OVER SCREEN
  // ==========================================================================
  const spies = gameState.players.filter((p) => p.isSpy);
  const innocents = gameState.players.filter((p) => !p.isSpy);
  const didSpiesWin = gameState.winner === 'spies';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 py-6 select-none">
      {/* Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-3 shadow-2xl ${
          didSpiesWin
            ? 'bg-gradient-to-b from-rose-950/60 to-[#100914] border-rose-500/50 shadow-rose-900/30'
            : 'bg-gradient-to-b from-emerald-950/60 to-[#091410] border-emerald-500/50 shadow-emerald-900/30'
        }`}
      >
        <span className="text-5xl">{didSpiesWin ? '🕵️' : '🎉'}</span>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          {didSpiesWin ? 'The Spy Has Won!' : 'Innocents Catch the Spy!'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-200 max-w-md mx-auto leading-relaxed">
          {gameState.winReason}
        </p>
      </div>

      {/* Secret Location Reveal */}
      <div className="p-5 rounded-3xl bg-[#0f1424] border border-white/10 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{gameState.location.icon}</span>
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Secret Location</div>
            <div className="text-lg font-black text-white">{gameState.location.name}</div>
            <div className="text-[11px] text-gray-400">{gameState.location.description}</div>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
          {gameState.location.category}
        </span>
      </div>

      {/* Spies & Roles Roster */}
      <div className="p-5 rounded-3xl bg-[#0f1424] border border-white/10 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Player Roles Breakdown
        </h3>

        <div className="space-y-2">
          {gameState.players.map((p) => (
            <div
              key={p.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                p.isSpy
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  : 'bg-white/5 border-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{p.avatar}</span>
                <span className="font-bold text-white">{p.name}</span>
                {p.isSpy ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-black border border-rose-500/30">
                    SPY
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">({p.role?.name})</span>
                )}
              </div>

              <div className="text-[11px] text-gray-400">
                {p.isSpy ? 'Infiltrator' : 'Civilian'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleStartGame}
          className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition active:scale-[0.99]"
        >
          <RotateCcw className="w-4 h-4 fill-black" />
          <span>Play Again (Same Players)</span>
        </button>

        <button
          onClick={handleResetToSetup}
          className="py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition"
        >
          New Setup
        </button>
      </div>
    </div>
  );
}
