'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Users, BookOpen, Sparkles, Trophy } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090b11]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-900/30 group-hover:shadow-purple-700/50 transition">
            <div className="w-full h-full bg-[#090b11] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-purple-300 bg-clip-text text-transparent">
              Games<span className="text-purple-400">.</span>CoderTushar
            </span>
            <span className="text-[10px] font-medium text-purple-300/70 tracking-wider uppercase">
              Browser Gaming Hub
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          <Link
            href="/games/bhabhi"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Bhabhi (Flagship)
          </Link>
          <Link
            href="/games"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            All Games
          </Link>
          <Link
            href="/how-to-play"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Rules
          </Link>
        </nav>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <Link
            href="/games/bhabhi/solo"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 hover:brightness-110 active:scale-95 transition"
          >
            <Trophy className="w-4 h-4" />
            Play Solo vs AI
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs font-medium text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Guest Player
          </div>
        </div>
      </div>
    </header>
  );
}
