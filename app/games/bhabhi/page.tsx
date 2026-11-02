'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Users,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  Sliders,
  LogIn,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export default function BhabhiLandingPage() {
  const router = useRouter();

  // Active Tab: 'modes' | 'solo-setup' | 'join-room' | 'create-room'
  const [activeTab, setActiveTab] = useState<'modes' | 'solo-setup' | 'join-room' | 'create-room'>('modes');

  // Solo Setup State
  const [soloPlayerCount, setSoloPlayerCount] = useState<number>(4);
  const [soloDifficulty, setSoloDifficulty] = useState<'easy' | 'normal' | 'smart'>('normal');
  const [soloDealer, setSoloDealer] = useState<string>('desi_host');

  // Create Room State
  const [createPlayerCount, setCreatePlayerCount] = useState<number>(4);

  // Join Room 6-box inputs
  const [codeBoxes, setCodeBoxes] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleStartSolo = () => {
    // Save preferences in URL query or sessionStorage
    router.push(`/games/bhabhi/solo?players=${soloPlayerCount}&difficulty=${soloDifficulty}&dealer=${soloDealer}`);
  };

  const handleCreateRoomSubmit = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    router.push(`/games/bhabhi/room/${code}`);
  };

  const handleCodeBoxChange = (idx: number, val: string) => {
    const char = val.toUpperCase().slice(-1); // Take latest char
    const newBoxes = [...codeBoxes];
    newBoxes[idx] = char;
    setCodeBoxes(newBoxes);

    // Auto-advance focus
    if (char && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleCodeBoxKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeBoxes[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasted.length > 0) {
      const newBoxes = ['', '', '', '', '', ''];
      for (let i = 0; i < Math.min(6, pasted.length); i++) {
        newBoxes[i] = pasted[i];
      }
      setCodeBoxes(newBoxes);
      const focusIndex = Math.min(5, pasted.length);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeBoxes.join('').trim().toUpperCase();
    if (fullCode.length >= 4) {
      router.push(`/games/bhabhi/room/${fullCode}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Flagship Card Game
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          🃏 Bhabhi — Thulla / Get Away
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          The beloved subcontinental card shedding game. Play the mandatory Ace of Spades, follow suit,
          strike Thullas, and get away safe before you're crowned the Bhabhi!
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-8 max-w-md w-full justify-center">
        <button
          onClick={() => setActiveTab('modes')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'modes'
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Select Mode
        </button>
        <button
          onClick={() => setActiveTab('solo-setup')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'solo-setup'
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🤖 Solo Setup
        </button>
        <button
          onClick={() => setActiveTab('join-room')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'join-room' || activeTab === 'create-room'
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🌐 Multiplayer
        </button>
      </div>

      {/* 1. MODES SELECTION (Section 11) */}
      {activeTab === 'modes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
          {/* Solo Option */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#14182b] to-[#0d1020] border-2 border-purple-500/30 hover:border-purple-500/60 flex flex-col justify-between space-y-6 shadow-xl transition group">
            <div className="space-y-3 text-left">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Bot className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400">
                Solo Play
              </span>
              <h2 className="text-2xl font-black text-white">Play vs Smart AI</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Instant match against rule-aware bots. Customize difficulty, adjust game speed, and
                enjoy live AI dealer commentary.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('solo-setup')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 hover:brightness-110 active:scale-95 transition"
            >
              <Sliders className="w-4 h-4" />
              Configure & Start Solo
            </button>
          </div>

          {/* Multiplayer Option */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#14182b] to-[#0d1020] border-2 border-cyan-500/30 hover:border-cyan-500/60 flex flex-col justify-between space-y-6 shadow-xl transition group">
            <div className="space-y-3 text-left">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                Online Social
              </span>
              <h2 className="text-2xl font-black text-white">Online Multiplayer</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Host a private table for 3 to 6 friends. Synchronous real-time cards, live text chat,
                and WebRTC voice communication.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCreateRoomSubmit}
                className="py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:brightness-110 active:scale-95 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Create Room
              </button>
              <button
                onClick={() => setActiveTab('join-room')}
                className="py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <LogIn className="w-4 h-4" />
                Join Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SOLO SETUP SCREEN (Section 12) */}
      {activeTab === 'solo-setup' && (
        <div className="w-full max-w-lg p-8 rounded-3xl bg-[#121626] border border-white/10 shadow-2xl flex flex-col space-y-6 text-left mb-8 animate-in fade-in">
          <div>
            <span className="text-[11px] font-extrabold text-purple-400 uppercase tracking-wider">
              Solo vs AI
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Configure Your Table</h2>
          </div>

          {/* Player Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Total Players</label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSoloPlayerCount(count)}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    soloPlayerCount === count
                      ? 'bg-purple-600 text-white ring-2 ring-purple-400 shadow'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                  }`}
                >
                  {count} Players
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Bot Intelligence</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'easy', label: 'Easy (Casual)' },
                { id: 'normal', label: 'Normal (Balanced)' },
                { id: 'smart', label: 'Smart (Strategic)' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSoloDifficulty(diff.id as any)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition ${
                    soloDifficulty === diff.id
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Dealer Personality */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">AI Dealer Personality</label>
            <select
              value={soloDealer}
              onChange={(e) => setSoloDealer(e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
            >
              <option value="desi_host">👳‍♂️ Chacha Chaudhary (Desi Party Host)</option>
              <option value="savage">🕶️ Viper (Savage & Roasting)</option>
              <option value="dramatic">🧙‍♂️ The Grandmaster (Epic & Dramatic)</option>
            </select>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartSolo}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            Deal Cards & Start Match
          </button>
        </div>
      )}

      {/* 3. JOIN ROOM SCREEN (Section 14: 6-Box Code Input) */}
      {activeTab === 'join-room' && (
        <div className="w-full max-w-lg p-8 rounded-3xl bg-[#121626] border border-white/10 shadow-2xl flex flex-col space-y-6 text-center mb-8 animate-in fade-in">
          <div>
            <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider">
              Multiplayer
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Join a Room</h2>
            <p className="text-xs text-gray-400 mt-1">
              Enter the 6-character room code shared by the host
            </p>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-6">
            {/* 6 Code Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handleCodePaste}>
              {codeBoxes.map((char, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleCodeBoxChange(idx, e.target.value)}
                  onKeyDown={(e) => handleCodeBoxKeyDown(idx, e)}
                  className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black uppercase rounded-2xl bg-black/50 border-2 border-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 text-white outline-none transition"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={codeBoxes.join('').length < 4}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-900/40 hover:brightness-110 active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Enter Room
              </button>

              <button
                type="button"
                onClick={handleCreateRoomSubmit}
                className="text-xs font-semibold text-gray-400 hover:text-white transition"
              >
                Want to host instead? <span className="text-cyan-400 underline">Create New Room</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules Banner Link */}
      <div className="w-full max-w-3xl p-5 rounded-3xl bg-[#0f1322] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-bold text-white text-sm">Need a refresher on Bhabhi rules?</h4>
            <p className="text-xs text-gray-400">
              Read our illustrated guide to Ace of Spades opening, Thulla traps, and clean sweeps.
            </p>
          </div>
        </div>
        <Link
          href="/how-to-play"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition whitespace-nowrap"
        >
          View Full Rules Guide →
        </Link>
      </div>
    </div>
  );
}
