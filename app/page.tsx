'use client';

import React from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Sparkles,
  Users,
  Bot,
  Flame,
  ShieldCheck,
  ArrowRight,
  Trophy,
  Play,
  Layers,
  Mic,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center text-center">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Browser-First Multiplayer & Card Gaming Hub</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6">
            Play. Laugh.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Compete.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed font-normal">
            No downloads, no installations. Jump into classic card games like{' '}
            <strong className="text-white">Bhabhi (Thulla)</strong>, play solo against smart AI bots,
            or host private rooms with friends.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/games/bhabhi/solo"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-purple-900/40 hover:brightness-110 active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-white" />
              Play Bhabhi Now (Free)
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-semibold text-base transition"
            >
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              Explore All Games
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Flagship Game Spotlight */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Flagship Game
            </h2>
            <p className="text-sm text-gray-400">
              The classic subcontinental card game with server-validated rules & AI commentary
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            🟢 Playable Now
          </span>
        </div>

        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#121629] via-[#0d1020] to-[#080a14] border border-white/15 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-[11px] font-black uppercase tracking-wider text-white">
                Card Game
              </span>
              <span className="text-xs text-gray-400">3 - 6 Players • 5 - 10 Mins</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              🃏 Bhabhi — Thulla / Get Away
            </h3>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              The goal is simple: get rid of every card in your hand! Open with the mandatory{' '}
              <strong className="text-amber-300">Ace of Spades (A♠)</strong>, follow the lead suit,
              and strike a <strong className="text-rose-400">Thulla</strong> when void to dump the entire
              trick onto the highest lead player. The last person left with cards is crowned the{' '}
              <span className="underline decoration-rose-500 font-bold text-white">Bhabhi</span>!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/games/bhabhi/solo"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 hover:brightness-110 active:scale-95 transition"
              >
                <Bot className="w-4 h-4" />
                Play Solo vs AI
              </Link>
              <Link
                href="/games/bhabhi"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition"
              >
                Game Details & Room
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual Cards Mockup */}
          <div className="flex items-center -space-x-8 sm:-space-x-10 p-4">
            <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-xl bg-white border border-slate-300 shadow-xl flex flex-col justify-between p-2 text-slate-900 -rotate-12 hover:rotate-0 transition">
              <span className="font-bold text-sm">A♠</span>
              <span className="text-3xl self-center">♠</span>
              <span className="font-bold text-sm rotate-180 self-end">A♠</span>
            </div>
            <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-xl bg-white border border-slate-300 shadow-2xl flex flex-col justify-between p-2 text-red-600 -rotate-3 hover:rotate-0 transition z-10">
              <span className="font-bold text-sm">K♥</span>
              <span className="text-3xl self-center">♥</span>
              <span className="font-bold text-sm rotate-180 self-end">K♥</span>
            </div>
            <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-xl bg-white border border-slate-300 shadow-xl flex flex-col justify-between p-2 text-slate-900 rotate-12 hover:rotate-0 transition">
              <span className="font-bold text-sm">Q♣</span>
              <span className="text-3xl self-center">♣</span>
              <span className="font-bold text-sm rotate-180 self-end">Q♣</span>
            </div>
          </div>
        </div>
      </section>

      {/* Play Your Way 3 Pillars */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center mb-10">
          Play Your Way
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-[#101424] border border-white/10 flex flex-col text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Solo vs Smart AI</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Don't wait for a group. Play anytime against rule-aware AI bots featuring customizable
              difficulty levels and strategic suit tracking.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-[#101424] border border-white/10 flex flex-col text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Private Multiplayer Rooms</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Share a 6-letter room code or link. Play seamlessly across phones, laptops, and tablets
              with real-time state synchronization.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-[#101424] border border-white/10 flex flex-col text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Dealer Commentary</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Experience dynamic commentary from hilarious dealer personalities like Chacha Chaudhary,
              Viper the Savage, and the Dramatic Grandmaster!
            </p>
          </div>
        </div>
      </section>

      {/* Catalog & Coming Soon */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center mb-8">
          The Games Roadmap
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Game 1: Bhabhi */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🃏</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Playable
                </span>
              </div>
              <h4 className="font-extrabold text-white text-base">Bhabhi (Thulla)</h4>
              <p className="text-xs text-gray-400 mt-1">
                Classic card shedding game. Don't be the last player holding cards.
              </p>
            </div>
            <Link
              href="/games/bhabhi/solo"
              className="mt-4 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs text-center transition"
            >
              Play Now
            </Link>
          </div>

          {/* Game 2: Undercover */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/30 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🕵️</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Playable
                </span>
              </div>
              <h4 className="font-extrabold text-white text-base">Undercover</h4>
              <p className="text-xs text-gray-400 mt-1">
                Social word deduction party game. Find the impostor before they blend in!
              </p>
            </div>
            <Link
              href="/games/undercover"
              className="mt-4 w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs text-center transition"
            >
              Play Pass & Play
            </Link>
          </div>

          {/* Game 3: Spyfall */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between text-left opacity-80">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🔍</span>
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold border border-yellow-500/30">
                  Coming Soon
                </span>
              </div>
              <h4 className="font-extrabold text-white text-base">Spyfall</h4>
              <p className="text-xs text-gray-400 mt-1">
                Ask clever questions without revealing the secret location to the spy.
              </p>
            </div>
            <span className="mt-4 w-full py-2 rounded-xl bg-white/5 text-gray-400 font-semibold text-xs text-center border border-white/5">
              In Development
            </span>
          </div>

          {/* Game 4: Wavelength */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between text-left opacity-80">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🎯</span>
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold border border-yellow-500/30">
                  Coming Soon
                </span>
              </div>
              <h4 className="font-extrabold text-white text-base">Wavelength</h4>
              <p className="text-xs text-gray-400 mt-1">
                Telepathic party game of fine spectrums and social intuition.
              </p>
            </div>
            <span className="mt-4 w-full py-2 rounded-xl bg-white/5 text-gray-400 font-semibold text-xs text-center border border-white/5">
              In Development
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
