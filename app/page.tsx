'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Users,
  Gamepad2,
  ArrowRight,
  Sparkles,
  Zap,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Clock,
  Flame,
  Layers,
  Crown,
  Eye,
  Search,
} from 'lucide-react';

interface GameDef {
  id: string;
  title: string;
  genre: string;
  category: string;
  status: 'ready' | 'dev';
  players: string;
  duration: string;
  icon: string;
  href?: string;
  accentColor: string;
}

const ALL_GAMES_CATALOG: GameDef[] = [
  // Ready to Play (3)
  {
    id: 'undercover',
    title: 'Undercover',
    genre: 'Social Deduction • Group',
    category: 'bluff',
    status: 'ready',
    players: '3 - 20 Players',
    duration: '10 - 15 Min',
    icon: '🕵️',
    href: '/games/undercover',
    accentColor: '#a855f7',
  },
  {
    id: 'spyfall',
    title: 'Spyfall',
    genre: 'Interrogation • Bluffing',
    category: 'bluff',
    status: 'ready',
    players: '3 - 12 Players',
    duration: '8 - 12 Min',
    icon: '🕶️',
    href: '/games/undercover', // or spyfall
    accentColor: '#f59e0b',
  },
  {
    id: 'bhabhi',
    title: 'Bhabhi (Get Away)',
    genre: 'Card Game • Evasion',
    category: 'cards',
    status: 'ready',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    icon: '🃏',
    href: '/games/bhabhi',
    accentColor: '#ec4899',
  },

  // In Development (8)
  {
    id: 'decrypto',
    title: 'Decrypto',
    genre: 'Code Transmission',
    category: 'words',
    status: 'dev',
    players: '4 - 8 Players',
    duration: '20 - 30 Min',
    icon: '📻',
    accentColor: '#06b6d4',
  },
  {
    id: 'codenames',
    title: 'Codenames',
    genre: 'Word Association',
    category: 'words',
    status: 'dev',
    players: '4 - 12 Players',
    duration: '15 - 20 Min',
    icon: '🕵️‍♂️',
    accentColor: '#8b5cf6',
  },
  {
    id: 'avalon',
    title: 'Avalon: Secret Identities',
    genre: 'Hidden Loyalty',
    category: 'bluff',
    status: 'dev',
    players: '5 - 10 Players',
    duration: '25 - 35 Min',
    icon: '🏆',
    accentColor: '#eab308',
  },
  {
    id: 'secret-chancellor',
    title: 'Secret Chancellor',
    genre: 'Political Deduction',
    category: 'bluff',
    status: 'dev',
    players: '5 - 10 Players',
    duration: '30 - 45 Min',
    icon: '🏛️',
    accentColor: '#f43f5e',
  },
  {
    id: 'werewolf',
    title: 'Ultimate Werewolf',
    genre: 'Social Deduction',
    category: 'bluff',
    status: 'dev',
    players: '6 - 24 Players',
    duration: '20 - 40 Min',
    icon: '🐺',
    accentColor: '#3b82f6',
  },
  {
    id: 'two-rooms',
    title: 'Two Rooms and a Boom',
    genre: 'Hostage Swaps',
    category: 'bluff',
    status: 'dev',
    players: '6 - 30 Players',
    duration: '10 - 15 Min',
    icon: '💣',
    accentColor: '#ef4444',
  },
  {
    id: 'wavelength',
    title: 'Wavelength',
    genre: 'Mind Reading',
    category: 'words',
    status: 'dev',
    players: '4 - 12 Players',
    duration: '15 - 25 Min',
    icon: '🧠',
    accentColor: '#d946ef',
  },
  {
    id: 'teen-patti',
    title: 'Teen Patti Flush',
    genre: 'Card / Wagering',
    category: 'cards',
    status: 'dev',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    icon: '🎴',
    accentColor: '#10b981',
  },
];

export default function HomePage() {
  const [gamesFilter, setGamesFilter] = useState<'all' | 'ready' | 'dev'>('all');

  const filteredGames = ALL_GAMES_CATALOG.filter((g) => {
    if (gamesFilter === 'ready') return g.status === 'ready';
    if (gamesFilter === 'dev') return g.status === 'dev';
    return true;
  });

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12 max-w-7xl">
      {/* 1. Hero Section (Image 5 visual parity) */}
      <section className="relative w-full rounded-3xl p-6 sm:p-12 bg-gradient-to-br from-[#12162e] via-[#0d1022] to-[#070913] border border-white/10 shadow-2xl overflow-hidden">
        {/* Ambient neon backdrop glow */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-purple-600/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-cyan-600/15 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Epic Party & Card Games for your{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                Dost & Yaar.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-normal">
              Bring the vibes! Play social deduction, word games, card classics and more — with friends on one device or online with custom rooms.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/games"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                Browse All Games
              </Link>

              <Link
                href="/games/bhabhi"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm transition"
              >
                <Users className="w-4 h-4 text-purple-400" />
                Create Room
              </Link>
            </div>
          </div>

          {/* Right Visual 3D Showcase (Image 5 composition) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm h-64 sm:h-72 flex items-center justify-center">
              {/* Card 1: Detective Undercover */}
              <div className="absolute -left-2 top-4 w-32 h-44 rounded-2xl bg-gradient-to-br from-purple-800 to-indigo-950 border-2 border-purple-400/50 shadow-2xl p-3 flex flex-col justify-between transform -rotate-12 hover:-rotate-6 transition duration-300">
                <span className="text-2xl">🕵️</span>
                <div className="text-[10px] font-black uppercase text-purple-200">Undercover</div>
              </div>

              {/* Card 2: Werewolf */}
              <div className="absolute left-20 top-0 w-36 h-48 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 border-2 border-blue-400/50 shadow-2xl p-3 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition duration-300 z-10">
                <div className="text-center">
                  <span className="text-3xl">🐺</span>
                </div>
                <div className="text-[10px] font-black uppercase text-center text-blue-200">Werewolf</div>
              </div>

              {/* Card 3: Ace of Spades */}
              <div className="absolute right-4 top-6 w-34 h-46 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-200 border-2 border-white shadow-2xl p-3 flex flex-col justify-between transform rotate-12 hover:rotate-6 transition duration-300 z-20">
                <div className="text-black font-black text-xl">A♠</div>
                <div className="text-center text-3xl">♠</div>
                <div className="text-right text-black font-black text-xs">A♠</div>
              </div>

              {/* Casino chips stack & dice */}
              <div className="absolute -bottom-2 left-10 flex items-center gap-1 z-30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-700 border-2 border-white/60 shadow-lg flex items-center justify-center text-[10px] font-black text-white">
                  50
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-700 border-2 border-white/60 shadow-lg -ml-4 flex items-center justify-center text-[10px] font-black text-white">
                  100
                </div>
              </div>

              <div className="absolute -bottom-1 right-12 z-30 transform rotate-12 text-3xl">
                🎲
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Play Your Way Row (3 wide cards matching Image 5) */}
      <section className="w-full space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Play Your Way</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Single Player */}
          <Link
            href="/games/bhabhi/solo"
            className="group relative p-5 rounded-2xl bg-[#0f1424] border border-emerald-500/30 hover:border-emerald-400 transition shadow-lg shadow-emerald-950/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition">
                  Single Player
                </h3>
                <p className="text-xs text-gray-400">Play offline, at your own pace</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Local Party */}
          <Link
            href="/games/undercover"
            className="group relative p-5 rounded-2xl bg-[#0f1424] border border-purple-500/30 hover:border-purple-400 transition shadow-lg shadow-purple-950/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition">
                  Local Party
                </h3>
                <p className="text-xs text-gray-400">Play together on one device</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Online Multiplayer */}
          <Link
            href="/games/bhabhi"
            className="group relative p-5 rounded-2xl bg-[#0f1424] border border-cyan-500/30 hover:border-cyan-400 transition shadow-lg shadow-cyan-950/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Online Multiplayer
                </h3>
                <p className="text-xs text-gray-400">Create or join a room & play anywhere</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Featured Games Carousel / Row (Image 5 visual parity) */}
      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Featured Games</h2>
          <Link
            href="/games"
            className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured Card 1: Undercover */}
          <div className="p-5 rounded-2xl bg-[#11162a] border border-purple-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> READY TO PLAY
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Undercover</h3>
                <p className="text-xs text-gray-400">Social Deduction • Group</p>
              </div>
              <span className="text-4xl">🕵️</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-[11px] text-gray-400 flex items-center gap-3">
                <span>👥 3 - 20 Players</span>
                <span>⏱️ 10 - 15 Min</span>
              </div>
              <Link
                href="/games/undercover"
                className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-600/30 transition transform hover:scale-110 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Featured Card 2: Spyfall */}
          <div className="p-5 rounded-2xl bg-[#11162a] border border-amber-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> READY TO PLAY
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Spyfall</h3>
                <p className="text-xs text-gray-400">Interrogation • Bluffing</p>
              </div>
              <span className="text-4xl">🕶️</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-[11px] text-gray-400 flex items-center gap-3">
                <span>👥 3 - 12 Players</span>
                <span>⏱️ 8 - 12 Min</span>
              </div>
              <Link
                href="/games/undercover"
                className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-md shadow-amber-500/30 transition transform hover:scale-110 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Featured Card 3: Bhabhi (Get Away) */}
          <div className="p-5 rounded-2xl bg-[#11162a] border border-rose-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> READY TO PLAY
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Bhabhi (Get Away)</h3>
                <p className="text-xs text-gray-400">Card Game • Evasion</p>
              </div>
              <span className="text-4xl">🃏</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-[11px] text-gray-400 flex items-center gap-3">
                <span>👥 3 - 6 Players</span>
                <span>⏱️ 10 - 15 Min</span>
              </div>
              <Link
                href="/games/bhabhi"
                className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-md shadow-amber-500/30 transition transform hover:scale-110 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. All Games (11) Catalogue with Filters (Image 5 visual parity) */}
      <section className="w-full space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              All Games <span className="text-gray-400 text-sm font-normal">({ALL_GAMES_CATALOG.length})</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#101424] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setGamesFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                gamesFilter === 'all'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Games ({ALL_GAMES_CATALOG.length})
            </button>
            <button
              onClick={() => setGamesFilter('ready')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                gamesFilter === 'ready'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Ready to Play (3)
            </button>
            <button
              onClick={() => setGamesFilter('dev')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                gamesFilter === 'dev'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              In Development (8)
            </button>
          </div>
        </div>

        {/* 11 Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredGames.map((game) => {
            const isReady = game.status === 'ready';

            return (
              <div
                key={game.id}
                className={`p-4 rounded-2xl bg-[#0f1424] border transition flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                  isReady
                    ? 'border-white/15 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-900/20'
                    : 'border-white/10 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isReady
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/10 text-purple-300 border border-purple-500/20'
                      }`}
                    >
                      {isReady ? 'READY TO PLAY' : 'IN DEVELOPMENT'}
                    </span>
                    <span className="text-xl">{game.icon}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                    {game.title}
                  </h3>
                  <p className="text-[11px] text-gray-400">{game.genre}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                  <span>{game.players}</span>
                  <span>{game.duration}</span>
                </div>

                {isReady && game.href && (
                  <Link
                    href={game.href}
                    className="absolute inset-0"
                    title={`Play ${game.title}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Value Proposition Strip (Image 5 bottom strip) */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 p-4 sm:p-5 rounded-2xl bg-[#0c101e] border border-white/10">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">No Payments</div>
            <div className="text-[11px] text-gray-400">Play for fun, not for money</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <span className="font-black text-xs">Ad</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">Ad Supported</div>
            <div className="text-[11px] text-gray-400">Free to play with minimal ads</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Web & App</div>
            <div className="text-[11px] text-gray-400">Play on web now, app coming soon</div>
          </div>
        </div>
      </section>
    </div>
  );
}
