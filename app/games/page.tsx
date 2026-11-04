'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Search, Sparkles, Filter, ArrowRight, Play, CheckCircle2, Clock, Users } from 'lucide-react';
import {
  SmartAssetImage,
  UndercoverIllustration,
  SpyfallIllustration,
  BhabhiCardIllustration,
  CatalogIconGraphic,
} from '@/components/illustrations/GameIllustrations';

interface GameItem {
  id: string;
  slug: string;
  title: string;
  genre: string;
  category: 'All' | 'Card Games' | 'Social Bluff' | 'Party Rooms' | 'Word Games';
  players: string;
  duration: string;
  description: string;
  image: string;
  href?: string;
  status: 'ready' | 'in_development';
  accentColor: string;
}

const ALL_GAMES: GameItem[] = [
  {
    id: 'undercover',
    slug: 'undercover',
    title: 'Undercover',
    genre: 'Social Deduction • Group',
    category: 'Social Bluff',
    players: '3 - 20 Players',
    duration: '10 - 15 Min',
    description: 'Civilians share a secret word, while the Undercover has a slightly different word, and Mr. White has no word at all! Pass & Play supported.',
    image: '/assets/home/card-undercover.png',
    href: '/games/undercover',
    status: 'ready',
    accentColor: '#8b5cf6',
  },
  {
    id: 'spyfall',
    slug: 'spyfall',
    title: 'Spyfall',
    genre: 'Interrogation • Bluffing',
    category: 'Social Bluff',
    players: '3 - 12 Players',
    duration: '8 - 12 Min',
    description: 'Everyone is at a secret location with a role, except the Spy who has no idea where they are! Ask probing questions without giving it away.',
    image: '/assets/home/card-spyfall.png',
    href: '/games/spyfall',
    status: 'ready',
    accentColor: '#f59e0b',
  },
  {
    id: 'bhabhi',
    slug: 'bhabhi',
    title: 'Bhabhi (Get Away)',
    genre: 'Card Game • Evasion',
    category: 'Card Games',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    description: 'A classic evasion card game where the goal is simple — get rid of all your cards, avoid the Thulla penalty, or become the Bhabhi!',
    image: '/assets/home/card-bhabhi.png',
    href: '/games/bhabhi',
    status: 'ready',
    accentColor: '#10b981',
  },
  {
    id: 'decrypto',
    slug: 'decrypto',
    title: 'Decrypto',
    genre: 'Code Transmission',
    category: 'Word Games',
    players: '4 - 8 Players',
    duration: '20 - 30 Min',
    description: 'Two teams compete to transmit coded messages without letting the opposing team intercept and decode them.',
    image: '/assets/home/icon-decrypto.png',
    status: 'in_development',
    accentColor: '#a855f7',
  },
  {
    id: 'codenames',
    slug: 'codenames',
    title: 'Codenames',
    genre: 'Word Association',
    category: 'Word Games',
    players: '4 - 12 Players',
    duration: '15 - 20 Min',
    description: 'Spymasters give one-word clues that can point to multiple words on the board. Teammates try to guess words of the right color.',
    image: '/assets/home/icon-codenames.png',
    status: 'in_development',
    accentColor: '#6366f1',
  },
  {
    id: 'avalon',
    slug: 'avalon',
    title: 'Avalon: Secret Identities',
    genre: 'Hidden Loyalty',
    category: 'Social Bluff',
    players: '5 - 10 Players',
    duration: '25 - 35 Min',
    description: 'The forces of good and evil battle to control the future of Arthurian Britain. Merlin knows the minions of Mordred, but can he guide his team without being assassinated?',
    image: '/assets/home/icon-avalon.png',
    status: 'in_development',
    accentColor: '#eab308',
  },
  {
    id: 'secret-chancellor',
    slug: 'secret-chancellor',
    title: 'Secret Chancellor',
    genre: 'Political Deduction',
    category: 'Social Bluff',
    players: '5 - 10 Players',
    duration: '30 - 45 Min',
    description: 'A dramatic game of political intrigue and betrayal. Players are divided into liberals and fascists, but only the fascists know each other.',
    image: '/assets/home/icon-chancellor.png',
    status: 'in_development',
    accentColor: '#ef4444',
  },
  {
    id: 'werewolf',
    slug: 'werewolf',
    title: 'Ultimate Werewolf',
    genre: 'Social Deduction',
    category: 'Social Bluff',
    players: '6 - 24 Players',
    duration: '20 - 40 Min',
    description: 'Villagers and Werewolves face off in a struggle for survival. By night, wolves hunt; by day, the village gathers to lynch a suspect.',
    image: '/assets/home/icon-werewolf.png',
    status: 'in_development',
    accentColor: '#38bdf8',
  },
  {
    id: 'two-rooms',
    slug: 'two-rooms',
    title: 'Two Rooms and a Boom',
    genre: 'Hostage Swaps',
    category: 'Party Rooms',
    players: '6 - 30 Players',
    duration: '10 - 15 Min',
    description: 'Two teams separated into different physical rooms. Hostages are traded each round. Blue team protects the President; Red team detonates the Bomber.',
    image: '/assets/home/icon-tworooms.png',
    status: 'in_development',
    accentColor: '#f97316',
  },
  {
    id: 'wavelength',
    slug: 'wavelength',
    title: 'Wavelength',
    genre: 'Mind Reading',
    category: 'Party Rooms',
    players: '4 - 12 Players',
    duration: '15 - 25 Min',
    description: 'A telepathic party game where two teams compete to read each other\'s minds on a spectrum between two concepts.',
    image: '/assets/home/icon-wavelength.png',
    status: 'in_development',
    accentColor: '#ec4899',
  },
  {
    id: 'teen-patti',
    slug: 'teen-patti',
    title: 'Teen Patti Flush',
    genre: 'Card / Wagering',
    category: 'Card Games',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    description: 'The beloved three-card Indian poker game with Trail, Pure Sequence, Flush, and exciting Chaal / Seen betting rounds.',
    image: '/assets/home/icon-teenpatti.png',
    status: 'in_development',
    accentColor: '#dc2626',
  },
];

export default function GamesCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'ready' | 'in_development'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Card Games', 'Social Bluff', 'Party Rooms', 'Word Games'];

  const filteredGames = ALL_GAMES.filter((g) => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || g.status === selectedStatus;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getFallbackGraphic = (game: GameItem) => {
    if (game.id === 'undercover') return <UndercoverIllustration className="w-full h-full" />;
    if (game.id === 'spyfall') return <SpyfallIllustration className="w-full h-full" />;
    if (game.id === 'bhabhi') return <BhabhiCardIllustration className="w-full h-full" />;
    return <CatalogIconGraphic gameId={game.id} className="w-full h-full" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center select-none space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
          <Gamepad2 className="w-4 h-4 text-purple-400" />
          <span>Complete Catalog ({ALL_GAMES.length} Games)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Game Catalogue
        </h1>
        <p className="text-sm sm:text-base text-gray-300">
          Discover modern, instant browser-based games. Play pass-and-play party classics or live multiplayer rooms with your dost & yaar!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0e1224] p-1.5 rounded-2xl border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#632df3] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search games or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e1224] border border-white/10 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Status Sub-Filters */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 text-xs border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 rounded-xl font-bold transition ${
              selectedStatus === 'all'
                ? 'bg-white/15 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({ALL_GAMES.length})
          </button>
          <button
            onClick={() => setSelectedStatus('ready')}
            className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 ${
              selectedStatus === 'ready'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-gray-400 hover:text-emerald-300'
            }`}
          >
            <span>● Ready to Play (3)</span>
          </button>
          <button
            onClick={() => setSelectedStatus('in_development')}
            className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 ${
              selectedStatus === 'in_development'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-purple-300'
            }`}
          >
            <span>○ In Development (8)</span>
          </button>
        </div>

        <span className="text-gray-400 font-semibold text-[11px]">
          Showing {filteredGames.length} of {ALL_GAMES.length}
        </span>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredGames.map((game) => {
          const isReady = game.status === 'ready';

          return (
            <div
              key={game.id}
              className={`p-6 rounded-3xl bg-[#0e1224] border transition flex flex-col justify-between space-y-4 group relative overflow-hidden ${
                isReady
                  ? 'border-purple-500/30 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-950/40'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isReady
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {isReady ? 'READY TO PLAY' : 'IN DEVELOPMENT'}
                  </span>
                  <span className="text-xs text-gray-400 font-bold">{game.category}</span>
                </div>

                {/* Graphic + Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition">
                      {game.title}
                    </h3>
                    <p className="text-xs text-purple-400 font-semibold">{game.genre}</p>
                  </div>

                  <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-black/40 border border-white/5 p-1 shadow-lg">
                    <SmartAssetImage
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full"
                      fallback={getFallbackGraphic(game)}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Bottom Info Strip & Action */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" /> {game.players}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> {game.duration}
                  </span>
                </div>

                {isReady && game.href ? (
                  <Link
                    href={game.href}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition active:scale-[0.99]"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Play Now</span>
                  </Link>
                ) : (
                  <div className="w-full py-2 rounded-xl bg-white/5 border border-white/5 text-gray-500 font-bold text-center text-xs">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
