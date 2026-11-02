'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Search, Sparkles, Filter, ArrowRight, Play } from 'lucide-react';

interface GameItem {
  id: string;
  slug: string;
  title: string;
  category: 'Card' | 'Social Deduction' | 'Party' | 'Strategy';
  players: string;
  duration: string;
  description: string;
  icon: string;
  status: 'live' | 'upcoming';
  accentColor: string;
}

const GAMES: GameItem[] = [
  {
    id: 'bhabhi',
    slug: 'bhabhi',
    title: 'Bhabhi (Thulla / Get Away)',
    category: 'Card',
    players: '3 - 6 Players',
    duration: '5 - 10 Mins',
    description:
      'Classic subcontinental card shedding game. Mandatory Ace of Spades opening, follow-suit rules, and high-stakes Thulla traps!',
    icon: '🃏',
    status: 'live',
    accentColor: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'undercover',
    slug: 'undercover',
    title: 'Undercover',
    category: 'Social Deduction',
    players: '4 - 12 Players',
    duration: '10 - 15 Mins',
    description:
      'Civilians share a secret word, while the Undercover has a slightly different word, and Mr. White has no word at all!',
    icon: '🕵️',
    status: 'upcoming',
    accentColor: 'from-amber-600 to-orange-600',
  },
  {
    id: 'spyfall',
    slug: 'spyfall',
    title: 'Spyfall',
    category: 'Social Deduction',
    players: '4 - 8 Players',
    duration: '8 - 12 Mins',
    description:
      'Everyone knows the secret location except the Spy. Ask probing questions without giving the location away!',
    icon: '🔍',
    status: 'upcoming',
    accentColor: 'from-cyan-600 to-blue-600',
  },
  {
    id: 'wavelength',
    slug: 'wavelength',
    title: 'Wavelength',
    category: 'Party',
    players: '2 - 12 Players',
    duration: '15 Mins',
    description:
      'A telepathic party game of fine spectrums and social intuition. Read your teammate\'s mind on a scale!',
    icon: '🎯',
    status: 'upcoming',
    accentColor: 'from-rose-600 to-pink-600',
  },
];

export default function GamesCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Card', 'Social Deduction', 'Party'];

  const filteredGames = GAMES.filter((g) => {
    const matchesCategory =
      selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      {/* Title */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Game Catalogue
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Discover modern, instant browser-based games. Play solo vs AI or create multiplayer rooms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121626] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="p-6 rounded-3xl bg-[#121626] border border-white/10 shadow-xl flex flex-col justify-between space-y-4 group hover:border-purple-500/40 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{game.icon}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 font-bold text-gray-300">
                    {game.category}
                  </span>
                </div>
                {game.status === 'live' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    🟢 Playable
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    ⏳ Coming Soon
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{game.title}</h3>
                <span className="text-[11px] text-gray-400">
                  {game.players} • {game.duration}
                </span>
                <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                  {game.description}
                </p>
              </div>
            </div>

            {game.status === 'live' ? (
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/games/${game.slug}/solo`}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs text-center shadow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Play Solo vs AI
                </Link>
                <Link
                  href={`/games/${game.slug}`}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition flex items-center justify-center gap-1"
                >
                  Room Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <span className="block w-full py-2.5 rounded-xl bg-white/5 text-gray-500 font-semibold text-xs text-center border border-white/5">
                  In Active Development
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
