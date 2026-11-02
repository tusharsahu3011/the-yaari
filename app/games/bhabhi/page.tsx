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
  User,
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none">
      {/* Top Navigation Bar (Image 4) */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Games Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-black text-base">🃏</span>
          <span className="font-extrabold text-sm text-white">Bhabhi</span>
          <span className="text-xs text-gray-400 font-semibold">(Get Away)</span>
        </div>

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

      {/* Hero Header Section with Left & Right 3D Art (Image 4 signature!) */}
      <div className="relative py-6 overflow-hidden rounded-3xl bg-gradient-to-b from-[#100d28]/60 to-transparent">
        {/* Left 3D Cards + Chips */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-44 sm:w-56 pointer-events-none hidden md:block opacity-90">
          <img
            src="/assets/bhabhi/entry-cards-chips.png"
            alt="Playing Cards and Chips"
            className="w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Right 3D Glowing Purple Cards */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-44 sm:w-56 pointer-events-none hidden md:block opacity-90">
          <img
            src="/assets/bhabhi/entry-purple-cards.png"
            alt="Glowing Purple Cards"
            className="w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Center Content */}
        <div className="text-center relative z-10 space-y-3 px-4 max-w-xl mx-auto">
          {/* Sparkle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-black tracking-widest uppercase shadow-md shadow-purple-950/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Traditional Indian Card Game</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>Bhabhi</span>{' '}
            <span className="text-amber-300 flex items-center gap-1.5">
              (Get Away) <Crown className="w-7 h-7 text-amber-400 fill-amber-400" />
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
            A classic evasion card game where the goal is simple — get rid of all your cards, or become the Bhabhi!
          </p>

          {/* Playing as Pill */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#12162a] border border-white/10 text-xs shadow-lg">
              <div className="w-6 h-6 rounded-full bg-[#632df3] text-white flex items-center justify-center text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              {!isEditingName ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Playing as</span>
                  <strong className="text-white font-bold">{playerName}</strong>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-purple-400 hover:text-purple-300 p-0.5 ml-1"
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
                    autoFocus
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
        </div>
      </div>

      {/* 2 Main Game Mode Cards (Image 4 visual parity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1: Solo vs AI Bots */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0f1424] border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/30 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> SOLO MODE
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Solo vs AI Bots</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xs">
                  Play against smart AI opponents (Kabir, Simran, Arjun) and sharpen your strategy.
                </p>
              </div>

              {/* 3D Robot Image */}
              <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                <img
                  src="/assets/bhabhi/solo-robot.png"
                  alt="AI Robot"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                4 Players (You + 3 AI)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                10 – 15 Min
              </span>
            </div>
          </div>

          <div>
            <Link
              href="/games/bhabhi/solo"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-500/20 active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play Now →</span>
            </Link>
          </div>
        </div>

        {/* Mode 2: Online Multiplayer */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0f1424] border-2 border-purple-500/40 shadow-2xl shadow-purple-950/30 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-purple-400 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold border border-purple-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> ONLINE MODE
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Online Multiplayer</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xs">
                  Create a room or join with a code and play with friends in real time on any device.
                </p>
              </div>

              {/* 3D Wireframe Globe Image */}
              <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                <img
                  src="/assets/bhabhi/entry-globe.png"
                  alt="Online Globe"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                3 – 6 Players
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                10 – 15 Min
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCreateRoom}
              className="py-3.5 rounded-2xl bg-[#632df3] hover:bg-[#5224d8] text-white font-extrabold text-sm flex items-center justify-center gap-1.5 transition shadow-xl shadow-purple-600/30 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Host New Room</span>
            </button>

            <button
              onClick={() => {
                soundManager.playSelect();
                setIsJoinModalOpen(true);
              }}
              className="py-3.5 rounded-2xl bg-[#12162a] hover:bg-[#1a203b] border border-white/15 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <Hash className="w-4 h-4 text-purple-400" />
              <span>Join with Room Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Join Room Modal with 6 boxes */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111827] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Join Room</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Enter the 6-character room code from your host
                </p>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {codeBoxes.map((box, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={box}
                    onChange={(e) => handleCodeBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleCodeBoxKeyDown(idx, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-mono font-black text-white bg-black/50 border-2 border-purple-500/40 rounded-2xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:outline-none uppercase"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={codeBoxes.join('').length < 4}
                  className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30"
                >
                  Join Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111827] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Bhabhi Rules & Guide</span>
              </h3>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                <strong>1. Ace of Spades (A♠) Rule:</strong> Whoever holds the Ace of Spades must lead with it on the very first trick.
              </p>
              <p>
                <strong>2. Follow Suit:</strong> All players must play a card of the lead suit if they have one.
              </p>
              <p>
                <strong>3. Thulla (Defect / Penalty):</strong> If you do NOT hold the lead suit, you can throw ANY card. The player with the highest lead suit card must pick up the entire trick!
              </p>
              <p>
                <strong>4. Objective:</strong> Get rid of all your cards. The last remaining player with cards in their hand becomes the <strong>Bhabhi</strong>!
              </p>
            </div>

            <button
              onClick={() => setIsRulesModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Understood! Let&apos;s Play
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
