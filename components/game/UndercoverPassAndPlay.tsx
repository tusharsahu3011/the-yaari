'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  UndercoverGameState,
  initUndercoverGame,
  advanceSecretView,
  submitPlayerDescription,
  castUndercoverVote,
  submitMrWhiteWordGuess,
} from '@/game-engine/undercover';
import {
  Eye,
  EyeOff,
  UserCheck,
  Crown,
  Users,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Vote,
  AlertTriangle,
  Play,
  UserPlus,
  Trash2,
} from 'lucide-react';

export function UndercoverPassAndPlay() {
  // Setup State
  const [setupPlayers, setSetupPlayers] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [undercoverCount, setUndercoverCount] = useState<number>(1);
  const [mrWhiteCount, setMrWhiteCount] = useState<number>(0);
  const [category, setCategory] = useState<string>('All');

  // Game Engine State
  const [gameState, setGameState] = useState<UndercoverGameState | null>(null);

  // UI state for Pass & Play Privacy Reveal
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [currentDescriptionInput, setCurrentDescriptionInput] = useState('');
  const [selectedVoteTarget, setSelectedVoteTarget] = useState<string>('');
  const [currentVoterIndex, setCurrentVoterIndex] = useState<number>(0);
  const [mrWhiteGuessInput, setMrWhiteGuessInput] = useState('');

  // 1. Setup Handlers
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    if (setupPlayers.length >= 12) return;
    setSetupPlayers([...setupPlayers, newPlayerName.trim()]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (idx: number) => {
    if (setupPlayers.length <= 4) return;
    setSetupPlayers(setupPlayers.filter((_, i) => i !== idx));
  };

  const handleStartGame = () => {
    const configs = setupPlayers.map((name, i) => ({
      id: `p-${i + 1}`,
      name,
    }));
    const initial = initUndercoverGame(configs, {
      undercoverCount,
      mrWhiteCount,
      category,
    });
    setGameState(initial);
    setIsSecretRevealed(false);
    setCurrentVoterIndex(0);
  };

  // 2. Secret View Handlers
  const handleRevealClick = () => {
    setIsSecretRevealed(true);
  };

  const handleNextPlayerPass = () => {
    if (!gameState) return;
    const nextState = advanceSecretView(gameState, gameState.revealPlayerIndex);
    setGameState(nextState);
    setIsSecretRevealed(false);
  };

  // 3. Description Handlers
  const handleNextDescriber = () => {
    if (!gameState) return;
    const describer = gameState.players[gameState.currentDescriberIndex];
    const text = currentDescriptionInput.trim() || 'Said a clue';
    const nextState = submitPlayerDescription(gameState, describer.id, text);
    setGameState(nextState);
    setCurrentDescriptionInput('');
  };

  // 4. Voting Handlers
  const handleConfirmVote = () => {
    if (!gameState || !selectedVoteTarget) return;
    const activePlayers = gameState.players.filter((p) => !p.isEliminated);
    const voter = activePlayers[currentVoterIndex];

    const nextState = castUndercoverVote(gameState, voter.id, selectedVoteTarget);
    setGameState(nextState);
    setSelectedVoteTarget('');

    if (currentVoterIndex + 1 < activePlayers.length) {
      setCurrentVoterIndex(currentVoterIndex + 1);
    } else {
      setCurrentVoterIndex(0);
      if (nextState.winner) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
    }
  };

  // 5. Mr. White Guess Handler
  const handleMrWhiteGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameState || !mrWhiteGuessInput.trim()) return;
    const nextState = submitMrWhiteWordGuess(gameState, mrWhiteGuessInput);
    setGameState(nextState);
    setMrWhiteGuessInput('');
    if (nextState.winner) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  };

  // 0. SETUP SCREEN
  if (!gameState) {
    return (
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 shadow-2xl flex flex-col space-y-6 text-left my-6 animate-in fade-in">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-500/30">
            <Users className="w-3.5 h-3.5" /> Single Device / Pass & Play
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            🕵️ Undercover Setup
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Pass one device around. Secret roles will be revealed privately!
          </p>
        </div>

        {/* Players List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span>Players ({setupPlayers.length}/12)</span>
            <span className="text-gray-500 font-normal">Min 4 required</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {setupPlayers.map((name, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-gray-500 font-mono">#{idx + 1}</span>
                  <span className="font-semibold">{name}</span>
                </div>
                {setupPlayers.length > 4 && (
                  <button
                    onClick={() => handleRemovePlayer(idx)}
                    className="text-gray-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Player Input */}
          {setupPlayers.length < 12 && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add player name..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={handleAddPlayer}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Role Counts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Undercovers</label>
            <select
              value={undercoverCount}
              onChange={(e) => setUndercoverCount(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
            >
              <option value={1}>1 Undercover</option>
              {setupPlayers.length >= 6 && <option value={2}>2 Undercovers</option>}
              {setupPlayers.length >= 9 && <option value={3}>3 Undercovers</option>}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Mr. White</label>
            <select
              value={mrWhiteCount}
              onChange={(e) => setMrWhiteCount(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
            >
              <option value={0}>0 (None)</option>
              <option value={1}>1 Mr. White</option>
            </select>
          </div>
        </div>

        {/* Word Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300">Word Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white"
          >
            <option value="All">🎲 All Categories (Mixed)</option>
            <option value="Food & Drinks">🍕 Food & Drinks</option>
            <option value="Everyday Objects">🎒 Everyday Objects</option>
            <option value="Tech & Media">📱 Tech & Media</option>
            <option value="Nature & Animals">🦁 Nature & Animals</option>
            <option value="Travel & Places">✈️ Travel & Places</option>
          </select>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-900/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          Start Pass & Play ({setupPlayers.length} Players)
        </button>
      </div>
    );
  }

  // 1. PRIVACY SCREEN (Section 28 of Visual Blueprint)
  if (gameState.phase === 'role_reveal') {
    const currentPlayer = gameState.players[gameState.revealPlayerIndex];

    return (
      <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-[#14182b] to-[#0d1020] border-2 border-amber-500/40 shadow-2xl flex flex-col items-center text-center space-y-6 my-8 animate-in zoom-in-95">
        {!isSecretRevealed ? (
          // Privacy Pass Hand-off Screen
          <>
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
              🔒
            </div>

            <div>
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">
                Pass The Device To
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {currentPlayer.name}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                Make sure nobody else is looking at the screen!
              </p>
            </div>

            <button
              onClick={handleRevealClick}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-sm shadow-lg shadow-amber-900/40 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Reveal My Secret Word
            </button>
          </>
        ) : (
          // Revealed Secret Word
          <>
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">
                Secret Identity for {currentPlayer.name}
              </span>
            </div>

            {currentPlayer.role === 'mr_white' ? (
              <div className="w-full p-6 rounded-2xl bg-slate-900 border-2 border-purple-500/50 space-y-2">
                <div className="text-4xl">🎩</div>
                <h3 className="text-xl font-black text-purple-300">
                  You are MR. WHITE!
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  You have <strong>NO word</strong>! Listen to the other players' clues, pretend
                  you know the word, and guess their word if you get voted out!
                </p>
              </div>
            ) : (
              <div className="w-full p-6 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 space-y-2">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  Your Secret Word Is:
                </span>
                <div className="text-3xl font-black text-white tracking-wide">
                  "{currentPlayer.secretWord}"
                </div>
                <p className="text-[11px] text-gray-400">
                  Category: {gameState.wordPair.category}
                </p>
              </div>
            )}

            <button
              onClick={handleNextPlayerPass}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <EyeOff className="w-4 h-4" />
              {gameState.revealPlayerIndex + 1 < gameState.players.length
                ? 'I Got It! Pass to Next Player'
                : 'Everyone Has Seen Their Word → Begin Round!'}
            </button>
          </>
        )}
      </div>
    );
  }

  // 2. DESCRIBING PHASE
  if (gameState.phase === 'describing') {
    const currentDescriber = gameState.players[gameState.currentDescriberIndex];
    const activePlayers = gameState.players.filter((p) => !p.isEliminated);

    return (
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 shadow-2xl flex flex-col space-y-6 text-left my-6 animate-in fade-in">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            Round {gameState.roundNumber} • Description
          </span>
          <span className="text-xs text-gray-400">
            {activePlayers.length} Players Active
          </span>
        </div>

        {/* Current Describer Spotlight */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 to-slate-900 border border-purple-500/30 text-center space-y-2">
          <div className="text-4xl">{currentDescriber.avatar}</div>
          <span className="text-xs uppercase font-extrabold text-purple-400 tracking-wider">
            Now Speaking
          </span>
          <h2 className="text-2xl font-black text-white">
            {currentDescriber.name}
          </h2>
          <p className="text-xs text-gray-300">
            Say your <strong>ONE-WORD clue</strong> out loud to the group!
          </p>
        </div>

        {/* Optional input to log clue */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400">
            Log Clue Word (Optional for memory):
          </label>
          <input
            type="text"
            placeholder="Type clue word..."
            value={currentDescriptionInput}
            onChange={(e) => setCurrentDescriptionInput(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <button
          onClick={handleNextDescriber}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <span>Done Speaking</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Clue History this round */}
        <div className="pt-2 border-t border-white/5 space-y-1">
          <span className="text-[11px] font-bold text-gray-400">Recent Clues:</span>
          <div className="text-xs text-gray-400 space-y-1">
            {gameState.history.slice(-4).map((h, idx) => (
              <div key={idx} className="truncate">• {h}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. VOTING PHASE
  if (gameState.phase === 'voting') {
    const activePlayers = gameState.players.filter((p) => !p.isEliminated);
    const currentVoter = activePlayers[currentVoterIndex];

    return (
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 shadow-2xl flex flex-col space-y-6 text-left my-6 animate-in fade-in">
        <div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
            Round {gameState.roundNumber} • Vote Out Impostor
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            Vote: {currentVoter.name}'s Choice
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Select the player you suspect of being the Undercover or Mr. White!
          </p>
        </div>

        {/* Voting Candidates */}
        <div className="space-y-2">
          {activePlayers
            .filter((p) => p.id !== currentVoter.id)
            .map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => setSelectedVoteTarget(candidate.id)}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between transition ${
                  selectedVoteTarget === candidate.id
                    ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/40 text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{candidate.avatar}</span>
                  <span className="font-bold text-sm">{candidate.name}</span>
                </div>
                {candidate.descriptionHistory.length > 0 && (
                  <span className="text-[11px] text-gray-400 italic">
                    "{candidate.descriptionHistory[candidate.descriptionHistory.length - 1]}"
                  </span>
                )}
              </button>
            ))}
        </div>

        <button
          onClick={handleConfirmVote}
          disabled={!selectedVoteTarget}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-sm shadow-lg shadow-rose-900/40 hover:brightness-110 active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          <Vote className="w-4 h-4" />
          Confirm Vote ({currentVoterIndex + 1}/{activePlayers.length})
        </button>
      </div>
    );
  }

  // 4. MR. WHITE GUESS PHASE
  if (gameState.phase === 'mr_white_guess') {
    const mrWhitePlayer = gameState.players.find((p) => p.id === gameState.mrWhiteGuesserId);

    return (
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#14182b] border-2 border-purple-500 shadow-2xl flex flex-col items-center text-center space-y-6 my-6 animate-in zoom-in-95">
        <div className="text-5xl animate-bounce">🎩</div>
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            Last Chance To Steal Victory
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            {mrWhitePlayer?.name} is MR. WHITE!
          </h2>
          <p className="text-xs text-gray-300 mt-2">
            You were voted out, but if you guess the <strong>Civilians' secret word</strong> correctly,
            you WIN the game instantly!
          </p>
        </div>

        <form onSubmit={handleMrWhiteGuess} className="w-full space-y-4">
          <input
            type="text"
            placeholder="Type your guess here..."
            value={mrWhiteGuessInput}
            onChange={(e) => setMrWhiteGuessInput(e.target.value)}
            className="w-full bg-black/50 border-2 border-purple-400/50 rounded-2xl px-4 py-3 text-sm text-center font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={!mrWhiteGuessInput.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-xl shadow-purple-900/40 hover:brightness-110 active:scale-95 disabled:opacity-40 transition"
          >
            Submit Final Guess
          </button>
        </form>
      </div>
    );
  }

  // 5. GAME OVER RESULT SCREEN
  if (gameState.phase === 'game_over') {
    return (
      <div className="w-full max-w-lg p-8 rounded-3xl bg-gradient-to-b from-[#181d30] to-[#0c0f1a] border border-white/20 shadow-2xl flex flex-col items-center text-center space-y-6 my-6 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/40 -mt-12 mb-2">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            Match Concluded
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            {gameState.winner === 'civilians'
              ? '🎉 CIVILIANS WIN!'
              : gameState.winner === 'undercover'
              ? '🕵️ UNDERCOVERS WIN!'
              : '🎩 MR. WHITE WINS!'}
          </h2>
          <p className="text-xs text-gray-300 mt-2 font-medium">
            {gameState.winReason}
          </p>
        </div>

        {/* Revealed Words */}
        <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Civilian Word:</span>
            <span className="font-bold text-emerald-400">"{gameState.wordPair.civilianWord}"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Undercover Word:</span>
            <span className="font-bold text-rose-400">"{gameState.wordPair.undercoverWord}"</span>
          </div>
        </div>

        {/* Final Roles Reveal */}
        <div className="w-full space-y-2 text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-left">
            All Players' Roles:
          </span>
          {gameState.players.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5"
            >
              <div className="flex items-center gap-2">
                <span>{p.avatar}</span>
                <span className="font-semibold text-white">{p.name}</span>
                {p.isEliminated && (
                  <span className="text-[10px] text-rose-400">(Eliminated)</span>
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  p.role === 'civilian'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    : p.role === 'undercover'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    : 'bg-purple-950 text-purple-300 border border-purple-500/30'
                }`}
              >
                {p.role.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>

        {/* Rematch Button */}
        <div className="w-full space-y-2 pt-2">
          <button
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition"
          >
            Play Another Round (New Words)
          </button>
          <button
            onClick={() => setGameState(null)}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold transition"
          >
            Change Player Names / Settings
          </button>
        </div>
      </div>
    );
  }

  return null;
}

