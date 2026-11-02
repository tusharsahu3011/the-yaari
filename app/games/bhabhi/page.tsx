'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Users,
  Play,
  ArrowRight,
  ShieldAlert,
  Flame,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function BhabhiLandingPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');

  const handleCreateRoom = () => {
    // Generate a random 6-character room code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    router.push(`/games/bhabhi/room/${code}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode.trim().toUpperCase();
    if (cleanCode.length >= 4) {
      router.push(`/games/bhabhi/room/${cleanCode}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Flagship Card Game
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          🃏 Bhabhi — Thulla / Get Away
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          The ultimate game of shedding cards, setting traps, and escaping danger! Don't let yourself
          get caught holding cards when everyone else is safe.
        </p>
      </div>

      {/* Mode Select Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
        {/* Solo vs AI Card */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#14182b] to-[#0d1020] border-2 border-emerald-500/30 hover:border-emerald-500/60 shadow-xl flex flex-col justify-between transition-all group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Bot className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                Instant Practice & Fun
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Solo vs Smart AI</h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Jump right in with 3 rule-aware AI bots. Adjust game speed, pick dealer commentary
                personalities, and sharpen your Thulla strategy.
              </p>
            </div>

            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Zero waiting time — starts instantly
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live commentary by Chacha Chaudhary
              </div>
            </div>
          </div>

          <Link
            href="/games/bhabhi/solo"
            className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-center shadow-lg shadow-emerald-900/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            Launch Solo Game
          </Link>
        </div>

        {/* Online Multiplayer Card */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#14182b] to-[#0d1020] border-2 border-purple-500/30 hover:border-purple-500/60 shadow-xl flex flex-col justify-between transition-all group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                Play With Friends
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Online Multiplayer Room</h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Create a private room, send the link or 6-letter room code to your friends, and play
                together with real-time state synchronization!
              </p>
            </div>

            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                3 to 6 players supported
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Private hands & host controls
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCreateRoom}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-center shadow-lg shadow-purple-900/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Create New Room
            </button>

            {/* Join Room Form */}
            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-char Room Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
              <button
                type="submit"
                disabled={joinCode.trim().length < 3}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-semibold text-xs transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Rules Quick Reference Link */}
      <div className="w-full max-w-4xl p-6 rounded-3xl bg-[#0f1322] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-bold text-white text-sm">Need a refresher on Bhabhi rules?</h4>
            <p className="text-xs text-gray-400">
              Read our illustrated guide to the Ace of Spades opening, Thulla traps, and clean sweeps.
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
