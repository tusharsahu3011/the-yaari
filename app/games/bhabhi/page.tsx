'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Settings,
  Sparkles,
  Crown,
  Edit2,
  Check,
  Bot,
  Radio,
  Play,
  Plus,
  Hash,
  X,
  Users,
  Clock,
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';

export default function BhabhiGameEntryPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('VibeSeeker_9410');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // 6-box room code input
  const [codeBoxes, setCodeBoxes] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gameshub_player_name');
      if (saved) {
        setPlayerName(saved);
        setNameInput(saved);
      } else {
        const autoName = `VibeSeeker_${Math.floor(1000 + Math.random() * 9000)}`;
        setPlayerName(autoName);
        setNameInput(autoName);
        localStorage.setItem('gameshub_player_name', autoName);
      }
    } catch (e) {}
  }, []);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    soundManager.playSelect();
    setPlayerName(nameInput.trim());
    setIsEditingName(false);
    try {
      localStorage.setItem('gameshub_player_name', nameInput.trim());
    } catch (e) {}
  };

  const handleCreateRoom = () => {
    soundManager.playDramaticBoom();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    router.push(`/games/bhabhi/room/${code}`);
  };

  const handleCodeBoxChange = (idx: number, val: string) => {
    const char = val.toUpperCase().slice(-1);
    const newBoxes = [...codeBoxes];
    newBoxes[idx] = char;
    setCodeBoxes(newBoxes);

    if (char && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleCodeBoxKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeBoxes[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeBoxes.join('').trim().toUpperCase();
    if (fullCode.length >= 4) {
      soundManager.playSelect();
      router.push(`/games/bhabhi/room/${fullCode}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Navigation Bar (Image 4) */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Games Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playSelect();
              setIsRulesModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Rules & Guide</span>
          </button>
          <button
            onClick={() => soundManager.playTap()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Section (Image 4) */}
      <div className="text-center relative py-6 space-y-4">
        {/* Sparkle Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-extrabold tracking-widest uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Traditional Indian Card Game</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-2.5">
          <span>Bhabhi (Get Away)</span>
          <Crown className="w-8 h-8 text-amber-400 fill-amber-400/20" />
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          A classic evasion card game where the goal is simple — get rid of all your cards, or become the Bhabhi!
        </p>

        {/* Player Identity Pill */}
        <div className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#12162a] border border-white/10 text-xs">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
            👤
          </div>
          {!isEditingName ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Playing as</span>
              <strong className="text-white">{playerName}</strong>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-purple-400 hover:text-purple-300 p-0.5"
                title="Change username"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={18}
                className="bg-black/60 border border-purple-400 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
              />
              <button
                onClick={handleSaveName}
                className="p-1 rounded bg-emerald-500 text-black font-bold text-[10px]"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2 Main Game Mode Cards (Image 4 visual parity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1: Solo vs AI Bots */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1424] border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/30 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> SOLO MODE
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Solo vs AI Bots</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Play against smart AI opponents (Kabir, Simran, Arjun) and sharpen your strategy.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                🤖
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                4 Players (You + 3 AI)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                10 - 15 Min
              </span>
            </div>
          </div>

          <div>
            <Link
              href="/games/bhabhi/solo"
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-500/20 active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play Now →</span>
            </Link>
          </div>
        </div>

        {/* Mode 2: Online Multiplayer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1424] border-2 border-purple-500/40 shadow-2xl shadow-purple-950/30 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-purple-400 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold border border-purple-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> ONLINE MODE
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Online Multiplayer</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Create a room or join with a code and play with friends in real time on any device.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                🌐
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                3 - 6 Players
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                10 - 15 Min
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCreateRoom}
              className="py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 transition shadow-xl shadow-purple-600/30 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Host New Room</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                setIsJoinModalOpen(true);
              }}
              className="py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <Hash className="w-4 h-4 text-purple-400" />
              <span>Join with Room Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Join Room Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#111827] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-black text-white">Join Bhabhi Room</h3>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Enter the 6-character room code shared by your friend to join their table:
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div className="flex justify-center gap-2">
                {codeBoxes.map((box, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={box}
                    onChange={(e) => handleCodeBoxChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeBoxKeyDown(i, e)}
                    className="w-11 h-14 bg-black/50 border border-purple-500/40 rounded-xl text-center text-xl font-mono font-black text-white focus:outline-none focus:border-purple-400"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={codeBoxes.join('').trim().length < 4}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-black text-sm transition shadow-lg shadow-purple-600/30"
              >
                Join Room Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-[#111827] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">Bhabhi Rules & Guide</h3>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                <strong>Objective:</strong> Evasion! Get rid of all your cards. The last player holding cards becomes the <strong>Bhabhi</strong>!
              </p>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                <div className="text-purple-300 font-bold">1. Mandatory Ace of Spades Opening</div>
                <p>The player holding the Ace of Spades (A♠) must lead it as the very first card of the match.</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
                <div className="text-cyan-300 font-bold">2. Must Follow Suit</div>
                <p>Every player must play a card of the lead suit if they have one.</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                <div className="text-rose-300 font-bold">3. Thulla (Strike)!</div>
                <p>If a player does not possess the lead suit, they can strike any card as a <strong>Thulla</strong>! The player who played the highest card of the lead suit is penalized and must pick up the entire trick pile!</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                <div className="text-emerald-300 font-bold">4. Clean Sweep</div>
                <p>If all players follow suit with no Thulla, the trick is discarded out of play, and the player with the highest card leads the next trick.</p>
              </div>
            </div>

            <button
              onClick={() => setIsRulesModalOpen(false)}
              className="w-full py-3 rounded-xl bg-white text-black font-black text-sm"
            >
              Understood!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
