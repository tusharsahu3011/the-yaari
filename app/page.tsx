'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Tag,
  CircleDot,
} from 'lucide-react';

interface GameDef {
  id: string;
  title: string;
  genre: string;
  category: string;
  status: 'ready' | 'dev';
  players: string;
  duration: string;
  icon?: string;
  image: string;
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
    image: '/assets/home/card-undercover.png',
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
    image: '/assets/home/card-spyfall.png',
    href: '/games/undercover',
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
    image: '/assets/home/card-bhabhi.png',
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
    image: '/assets/home/icon-decrypto.png',
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
    image: '/assets/home/icon-codenames.png',
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
    image: '/assets/home/icon-avalon.png',
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
    image: '/assets/home/icon-chancellor.png',
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
    image: '/assets/home/icon-werewolf.png',
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
    image: '/assets/home/icon-tworooms.png',
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
    image: '/assets/home/icon-wavelength.png',
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
    image: '/assets/home/icon-teenpatti.png',
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
    <div className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10 max-w-7xl select-none">
      {/* 1. Hero Section (Image 5 visual parity) */}
      <section className="relative w-full rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#12162e] via-[#0d1022] to-[#070913] border border-white/10 shadow-2xl overflow-hidden">
        {/* Ambient neon backdrop glow */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[350px] bg-purple-600/25 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-cyan-600/15 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-white tracking-tight leading-[1.1]">
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
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#632df3] hover:bg-[#5224d8] text-white font-extrabold text-sm shadow-xl shadow-purple-600/40 transition transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Browse All Games</span>
              </Link>

              <Link
                href="/games/bhabhi"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#12162a] hover:bg-white/10 border border-white/15 text-white font-bold text-sm transition"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Create Room</span>
              </Link>
            </div>
          </div>

          {/* Right Visual 3D Showcase (Image 5 exact 3D composition) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
              <img
                src="/assets/home/hero-3d.png"
                alt="Games 3D Art Composition"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(139,92,246,0.35)]"
              />
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
            className="group relative p-4 sm:p-5 rounded-2xl bg-[#0f1424] border border-emerald-500/40 hover:border-emerald-400 transition shadow-lg shadow-emerald-950/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition">
                  Single Player
                </h3>
                <p className="text-xs text-gray-400">Play offline, at your own pace</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Local Party */}
          <Link
            href="/games/undercover"
            className="group relative p-4 sm:p-5 rounded-2xl bg-[#0f1424] border border-purple-500/40 hover:border-purple-400 transition shadow-lg shadow-purple-950/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition">
                  Local Party
                </h3>
                <p className="text-xs text-gray-400">Play together on one device</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Online Multiplayer */}
          <Link
            href="/games/bhabhi"
            className="group relative p-4 sm:p-5 rounded-2xl bg-[#0f1424] border border-cyan-500/40 hover:border-cyan-400 transition shadow-lg shadow-cyan-950/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Online Multiplayer
                </h3>
                <p className="text-xs text-gray-400">Create or join a room and play with friends anywhere</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Featured Games Row (Image 5 visual parity) */}
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
          <div className="p-5 rounded-2xl bg-[#101428] border border-purple-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> READY TO PLAY
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Undercover</h3>
                <p className="text-xs text-gray-400">Social Deduction • Group</p>
              </div>
              <div className="w-20 h-20 shrink-0">
                <img
                  src="/assets/home/featured-undercover.png"
                  alt="Undercover"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-[11px] text-gray-400 flex items-center gap-3">
                <span>👥 3 - 20 Players</span>
                <span>⏱️ 10 - 15 Min</span>
              </div>
              <Link
                href="/games/undercover"
                className="w-9 h-9 rounded-full bg-[#632df3] hover:bg-[#5224d8] text-white flex items-center justify-center shadow-md shadow-purple-600/40 transition transform hover:scale-110 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Featured Card 2: Spyfall */}
          <div className="p-5 rounded-2xl bg-[#101428] border border-amber-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> READY TO PLAY
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Spyfall</h3>
                <p className="text-xs text-gray-400">Interrogation • Bluffing</p>
              </div>
              <div className="w-20 h-20 shrink-0">
                <img
                  src="/assets/home/featured-spyfall.png"
                  alt="Spyfall"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
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
          <div className="p-5 rounded-2xl bg-[#101428] border border-pink-500/40 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> READY TO PLAY
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Bhabhi (Get Away)</h3>
                <p className="text-xs text-gray-400">Card Game • Evasion</p>
              </div>
              <div className="w-20 h-20 shrink-0">
                <img
                  src="/assets/home/featured-bhabhi.png"
                  alt="Bhabhi"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
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
          <div className="flex items-center gap-1.5 bg-[#0e1224] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setGamesFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                gamesFilter === 'all'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>All Games {ALL_GAMES_CATALOG.length}</span>
            </button>
            <button
              onClick={() => setGamesFilter('ready')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                gamesFilter === 'ready'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready to Play 3</span>
            </button>
            <button
              onClick={() => setGamesFilter('dev')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                gamesFilter === 'dev'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>In Development 8</span>
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
                className={`p-4 rounded-2xl bg-[#0e1224] border transition flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                  isReady
                    ? 'border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-900/30'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isReady
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {isReady ? 'READY TO PLAY' : 'IN DEVELOPMENT'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                        {game.title}
                      </h3>
                      <p className="text-[11px] text-gray-400">{game.genre}</p>
                    </div>

                    <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-black/30 border border-white/5">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
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
            <Zap className="w-5 h-5 fill-amber-400" />
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
