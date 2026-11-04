'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Gamepad2,
  Search,
  Sparkles,
  Filter,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  Users,
  Tv,
  Flame,
  X,
  Info,
} from 'lucide-react';
import {
  SmartAssetImage,
  CatalogIconGraphic,
} from '@/components/illustrations/GameIllustrations';
import { AdBannerSlot } from '@/components/ads/AdBannerSlot';
import { soundManager } from '@/lib/audio/sound-effects';

export interface GameItem {
  id: string;
  slug: string;
  title: string;
  genre: string;
  category: 'cards' | 'bluff' | 'words' | 'party';
  categoryLabel: string;
  players: string;
  duration: string;
  rating: string;
  description: string;
  image: string;
  href?: string;
  status: 'ready' | 'in_development';
  accentColor: string;
  rankBadge?: string;
}

const ALL_GAMES: GameItem[] = [
  {
    id: 'undercover',
    slug: 'undercover',
    title: 'Undercover',
    genre: 'Social Deduction • Group Bluffing',
    category: 'bluff',
    categoryLabel: 'Social Bluff',
    players: '3 - 20 Players',
    duration: '10 - 15 Min',
    rating: 'U/A 13+',
    rankBadge: 'TOP 1 READY',
    description:
      'Civilians share a secret word, while the Undercover has a slightly different word, and Mr. White has no word at all! Pass & Play and online rooms supported.',
    image: '/assets/home/card-undercover.png',
    href: '/games/undercover',
    status: 'ready',
    accentColor: '#a855f7',
  },
  {
    id: 'bhabhi',
    slug: 'bhabhi',
    title: 'Bhabhi (Get Away)',
    genre: 'Desi Card Classic • Evasion',
    category: 'cards',
    categoryLabel: 'Card Games',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    rating: 'ALL AGES',
    rankBadge: 'TOP 2 READY',
    description:
      'A classic evasion card game where the goal is simple — get rid of all your cards, avoid the Thulla penalty, or become the Bhabhi! Includes Solo AI bot mode.',
    image: '/assets/home/card-bhabhi.png',
    href: '/games/bhabhi',
    status: 'ready',
    accentColor: '#ec4899',
  },
  {
    id: 'spyfall',
    slug: 'spyfall',
    title: 'Spyfall',
    genre: 'Interrogation • Hidden Location',
    category: 'bluff',
    categoryLabel: 'Social Bluff',
    players: '3 - 12 Players',
    duration: '8 - 12 Min',
    rating: 'U/A 13+',
    rankBadge: 'TOP 3 READY',
    description:
      'Everyone is at a secret location with a role, except the Spy who has no idea where they are! Ask probing questions without giving the location away.',
    image: '/assets/home/card-spyfall.png',
    href: '/games/spyfall',
    status: 'ready',
    accentColor: '#f59e0b',
  },
  {
    id: 'teen-patti',
    slug: 'teen-patti',
    title: 'Teen Patti Flush',
    genre: 'Card / Wagering • Bluffing',
    category: 'cards',
    categoryLabel: 'Card Games',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    rating: '18+',
    rankBadge: 'COMING SOON',
    description:
      'The beloved three-card Indian poker game with Trail, Pure Sequence, Flush, and exciting Chaal / Seen betting rounds using virtual chips.',
    image: '/assets/home/icon-teenpatti.png',
    status: 'in_development',
    accentColor: '#10b981',
  },
  {
    id: 'decrypto',
    slug: 'decrypto',
    title: 'Decrypto',
    genre: 'Code Transmission • Encryption',
    category: 'words',
    categoryLabel: 'Word Games',
    players: '4 - 8 Players',
    duration: '20 - 30 Min',
    rating: 'ALL AGES',
    rankBadge: 'STRATEGY',
    description:
      'Two teams compete to transmit coded messages without letting the opposing team intercept and decode their keywords.',
    image: '/assets/home/icon-decrypto.png',
    status: 'in_development',
    accentColor: '#06b6d4',
  },
  {
    id: 'codenames',
    slug: 'codenames',
    title: 'Codenames',
    genre: 'Word Association • Spymaster',
    category: 'words',
    categoryLabel: 'Word Games',
    players: '4 - 12 Players',
    duration: '15 - 20 Min',
    rating: 'ALL AGES',
    rankBadge: 'PARTY HIT',
    description:
      'Spymasters give one-word clues that point to multiple words on the board. Teammates try to guess words of the right color while avoiding the assassin.',
    image: '/assets/home/icon-codenames.png',
    status: 'in_development',
    accentColor: '#8b5cf6',
  },
  {
    id: 'avalon',
    slug: 'avalon',
    title: 'Avalon: Secret Identities',
    genre: 'Hidden Loyalty • Arthurian Quest',
    category: 'bluff',
    categoryLabel: 'Social Bluff',
    players: '5 - 10 Players',
    duration: '25 - 35 Min',
    rating: 'U/A 13+',
    rankBadge: 'DEDUCTION',
    description:
      'The forces of good and evil battle to control the future of Arthurian Britain. Merlin knows the minions of Mordred, but can he guide his team without being assassinated?',
    image: '/assets/home/icon-avalon.png',
    status: 'in_development',
    accentColor: '#eab308',
  },
  {
    id: 'secret-chancellor',
    slug: 'secret-chancellor',
    title: 'Secret Chancellor',
    genre: 'Political Intrigue & Deception',
    category: 'bluff',
    categoryLabel: 'Social Bluff',
    players: '5 - 10 Players',
    duration: '30 - 45 Min',
    rating: 'U/A 16+',
    rankBadge: 'HIGH TENSION',
    description:
      'A dramatic game of political intrigue and betrayal. Players are divided into liberals and fascists, but only the fascists know each other.',
    image: '/assets/home/icon-chancellor.png',
    status: 'in_development',
    accentColor: '#f43f5e',
  },
  {
    id: 'werewolf',
    slug: 'werewolf',
    title: 'Ultimate Werewolf',
    genre: 'Village Social Deduction',
    category: 'bluff',
    categoryLabel: 'Social Bluff',
    players: '6 - 24 Players',
    duration: '20 - 40 Min',
    rating: 'ALL AGES',
    rankBadge: 'MASSIVE PARTY',
    description:
      'Villagers and Werewolves face off in a struggle for survival. By night, wolves hunt; by day, the village gathers to find the suspects.',
    image: '/assets/home/icon-werewolf.png',
    status: 'in_development',
    accentColor: '#3b82f6',
  },
  {
    id: 'two-rooms',
    slug: 'two-rooms',
    title: 'Two Rooms and a Boom',
    genre: 'Hostage Swaps • Room Movement',
    category: 'party',
    categoryLabel: 'Party Rooms',
    players: '6 - 30 Players',
    duration: '10 - 15 Min',
    rating: 'ALL AGES',
    rankBadge: 'FAST PACED',
    description:
      'Two teams separated into different physical rooms. Hostages are traded each round. Blue team protects the President; Red team detonates the Bomber.',
    image: '/assets/home/icon-tworooms.png',
    status: 'in_development',
    accentColor: '#ef4444',
  },
  {
    id: 'wavelength',
    slug: 'wavelength',
    title: 'Wavelength',
    genre: 'Mind Reading • Spectrum',
    category: 'words',
    categoryLabel: 'Word Games',
    players: '4 - 12 Players',
    duration: '15 - 25 Min',
    rating: 'ALL AGES',
    rankBadge: 'VIBE CHECK',
    description:
      'A telepathic party game where two teams compete to read each other\'s minds on a spectrum between two concepts.',
    image: '/assets/home/icon-wavelength.png',
    status: 'in_development',
    accentColor: '#d946ef',
  },
];

function GamesCatalogueContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'ready' | 'dev'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (catParam) {
      if (['cards', 'bluff', 'words', 'party'].includes(catParam)) {
        setSelectedCategory(catParam);
      }
    }
  }, [catParam]);

  const categories = [
    { id: 'all', label: 'All Titles' },
    { id: 'cards', label: '🃏 Card Games' },
    { id: 'bluff', label: '🕵️ Social Bluff' },
    { id: 'words', label: '🧠 Word Games' },
    { id: 'party', label: '🎉 Party Rooms' },
  ];

  const filteredGames = ALL_GAMES.filter((g) => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'ready' && g.status === 'ready') ||
      (selectedStatus === 'dev' && g.status === 'in_development');
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 space-y-8 select-none">
      {/* Prime Video OTT Browse Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#070b18] via-[#091128] to-[#070b18] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-left z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-extrabold text-[11px] uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE YAARI BROWSE</span>
            </span>
            <span className="text-xs text-zinc-400 font-medium">• {ALL_GAMES.length} Titles</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Explore All Games & Shows
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            From classic desi card evasion in Bhabhi to psychological bluffing in Undercover and Spyfall.
            Zero installs, stream right on your phone or PC with your yaars.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Filter and Search Navigation Bar (Prime Video Style) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#070b18]/90 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playSelect();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-950/40'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, genre, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-Filters: Status & Count */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playSelect();
              setSelectedStatus('all');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
              selectedStatus === 'all'
                ? 'bg-white/15 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({ALL_GAMES.length})
          </button>
          <button
            onClick={() => {
              soundManager.playSelect();
              setSelectedStatus('ready');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'ready'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-emerald-300'
            }`}
          >
            <span>● Ready to Play (3)</span>
          </button>
          <button
            onClick={() => {
              soundManager.playSelect();
              setSelectedStatus('dev');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedStatus === 'dev'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
                : 'text-zinc-400 hover:text-purple-300'
            }`}
          >
            <span>○ Pipeline (8)</span>
          </button>
        </div>

        <span className="text-zinc-400 font-semibold text-[11px]">
          Showing {filteredGames.length} titles
        </span>
      </div>

      {/* Prime Video 16:9 Movie Poster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredGames.map((game) => {
          const isReady = game.status === 'ready';

          return (
            <div
              key={game.id}
              className="group relative rounded-2xl overflow-hidden bg-[#070b18] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between cursor-pointer"
              onClick={() => {
                soundManager.playSelect();
                if (isReady && game.href) {
                  window.location.href = game.href;
                }
              }}
            >
              {/* 16:9 Poster Header */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b18] via-[#070b18]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

                {/* Top Left Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-white border border-white/20 backdrop-blur-md">
                    {game.rankBadge || (isReady ? 'READY' : 'IN DEV')}
                  </span>
                </div>

                {/* Top Right Rating Badge */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20 backdrop-blur-md">
                    {game.rating}
                  </span>
                </div>

                {/* Play Overlay on Hover */}
                {isReady && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/40 backdrop-blur-[2px]">
                    <div className="w-13 h-13 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#070b18]">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        isReady
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {isReady ? 'READY TO PLAY' : 'IN PIPELINE'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium line-clamp-2 mt-1">
                    {game.description}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    {game.players}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {game.duration}
                  </span>
                  <span className={isReady ? 'text-cyan-400' : 'text-zinc-500'}>
                    {isReady ? '▶ Stream Now' : 'Details'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-Feed Ad Banner Slot */}
      <AdBannerSlot slotId="catalog-infeed-sponsor" format="leaderboard" />
    </div>
  );
}

export default function GamesCataloguePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading catalog...</div>}>
      <GamesCatalogueContent />
    </Suspense>
  );
}
