'use client';

import React, { useState, useEffect } from 'react';
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
  Tag,
  CircleDot,
  Info,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Volume2,
  Tv,
} from 'lucide-react';
import {
  SmartAssetImage,
  HeroGameComposition,
  UndercoverIllustration,
  SpyfallIllustration,
  BhabhiCardIllustration,
  CatalogIconGraphic,
} from '@/components/illustrations/GameIllustrations';
import { AdBannerSlot } from '@/components/ads/AdBannerSlot';
import { soundManager } from '@/lib/audio/sound-effects';

export interface GameDef {
  id: string;
  title: string;
  genre: string;
  category: 'cards' | 'bluff' | 'words';
  status: 'ready' | 'dev';
  players: string;
  duration: string;
  rating: string;
  rankBadge?: string;
  topRank?: number;
  description: string;
  rulesSummary: string[];
  image: string;
  heroBackdrop?: string;
  href?: string;
  accentColor: string;
}

const ALL_GAMES: GameDef[] = [
  // Ready to Play
  {
    id: 'undercover',
    title: 'Undercover',
    genre: 'Social Deduction • Party Bluffing',
    category: 'bluff',
    status: 'ready',
    players: '3 - 20 Players',
    duration: '10 - 15 Min',
    rating: 'U/A 13+',
    rankBadge: '#1 in India',
    topRank: 1,
    description:
      'Spot the impostors before they deceive the entire room! Civilians get the real word, Undercover gets a closely related word, and Mr. White gets no word at all. Give one-word clues and vote out the deceivers.',
    rulesSummary: [
      'Each player receives a secret word (Civilians share one word, Undercovers share a similar word).',
      'Take turns describing your secret word with exactly one subtle clue.',
      'Debate and vote out suspected impostors each round until Civilians or Impostors win.',
    ],
    image: '/assets/home/card-undercover.png',
    heroBackdrop: '/assets/home/card-undercover.png',
    href: '/games/undercover',
    accentColor: '#a855f7',
  },
  {
    id: 'bhabhi',
    title: 'Bhabhi (Get Away)',
    genre: 'South Asian Card Classic • Evasion',
    category: 'cards',
    status: 'ready',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    rating: 'ALL AGES',
    rankBadge: '#2 in India',
    topRank: 2,
    description:
      'The legendary South Asian card evasion game! Clear your hand as fast as possible by following lead suits. If a player cannot follow suit, a "Thulla" (penalty) is triggered, and the highest card holder must pick up the entire pile.',
    rulesSummary: [
      'Ace of Spades leads the very first trick of the round.',
      'Must follow the lead suit if you hold a card of that suit.',
      'Failing to follow suit causes a Thulla — the highest suited card collector picks up all played cards!',
      'Clear your cards to escape. The last remaining player is crowned the Bhabhi!',
    ],
    image: '/assets/home/card-bhabhi.png',
    heroBackdrop: '/assets/home/card-bhabhi.png',
    href: '/games/bhabhi',
    accentColor: '#ec4899',
  },
  {
    id: 'spyfall',
    title: 'Spyfall',
    genre: 'Interrogation • Hidden Identity',
    category: 'bluff',
    status: 'ready',
    players: '3 - 12 Players',
    duration: '8 - 12 Min',
    rating: 'U/A 13+',
    rankBadge: '#3 in India',
    topRank: 3,
    description:
      'All players find themselves in a secret location (like an Airplane, Casino, or Submarine) — except for one hidden Spy! Ask cleverly probing questions to identify the spy without revealing where you are.',
    rulesSummary: [
      'Everyone knows the secret location except the Spy.',
      'Take turns asking cross-examination questions to probe other players.',
      'The Spy tries to deduce the location while blending in.',
      'Vote to accuse the Spy or the Spy can guess the location to steal the win.',
    ],
    image: '/assets/home/card-spyfall.png',
    heroBackdrop: '/assets/home/card-spyfall.png',
    href: '/games/spyfall',
    accentColor: '#f59e0b',
  },

  // In Development
  {
    id: 'teen-patti',
    title: 'Teen Patti Flush',
    genre: 'Card Classic • Bluff & Wagering',
    category: 'cards',
    status: 'dev',
    players: '3 - 6 Players',
    duration: '10 - 15 Min',
    rating: '18+',
    rankBadge: 'COMING SOON',
    topRank: 4,
    description:
      'Classic 3-card Indian poker with virtual chips. Play blind or seen, manage your stakes, and win with high card hands or brilliant bluffing.',
    rulesSummary: [
      'Players receive 3 hole cards face-down.',
      'Bet blind or inspect cards and bet double.',
      'Trail (Trio), Pure Sequence, Sequence, Color, Pair, and High Card rankings apply.',
    ],
    image: '/assets/home/icon-teenpatti.png',
    accentColor: '#10b981',
  },
  {
    id: 'decrypto',
    title: 'Decrypto',
    genre: 'Code Transmission • Word Encryption',
    category: 'words',
    status: 'dev',
    players: '4 - 8 Players',
    duration: '20 - 30 Min',
    rating: 'ALL AGES',
    rankBadge: 'TOP STRATEGY',
    topRank: 5,
    description:
      'Transmit secret 3-digit codes to your teammates without letting the intercepting rival team crack your secret four keywords.',
    rulesSummary: [
      'Two opposing teams each have 4 secret words known only to them.',
      'Encrypt a 3-digit numeric sequence with clues for your teammates.',
      'Guess wrong and get a miscommunication token; intercept opponents to earn victory tokens.',
    ],
    image: '/assets/home/icon-decrypto.png',
    accentColor: '#06b6d4',
  },
  {
    id: 'codenames',
    title: 'Codenames',
    genre: 'Word Association • Spymaster',
    category: 'words',
    status: 'dev',
    players: '4 - 12 Players',
    duration: '15 - 20 Min',
    rating: 'ALL AGES',
    rankBadge: 'PARTY HIT',
    topRank: 6,
    description:
      'Two rival Spymasters know the secret identities of 25 agents on the grid. They provide one-word clues linked to multiple cards on the table.',
    rulesSummary: [
      'Spymasters give a one-word clue plus a number (e.g., "Water: 2").',
      'Field operatives guess which grid cards correspond to their team.',
      'Beware the Assassin card which triggers an immediate loss!',
    ],
    image: '/assets/home/icon-codenames.png',
    accentColor: '#8b5cf6',
  },
  {
    id: 'avalon',
    title: 'Avalon: Secret Identities',
    genre: 'Good vs Evil • Hidden Roles',
    category: 'bluff',
    status: 'dev',
    players: '5 - 10 Players',
    duration: '25 - 35 Min',
    rating: 'U/A 13+',
    rankBadge: 'EPIC DEDUCTION',
    topRank: 7,
    description:
      'Loyal Servants of Arthur battle the treacherous Minions of Mordred. Pass 3 holy quests to claim Camelot, or sow discord to see it fall.',
    rulesSummary: [
      'Players are secretly aligned with Good or Evil.',
      'Vote on proposed teams to embark on critical quests.',
      'Evil minions attempt to secretly sabotage quest missions.',
    ],
    image: '/assets/home/icon-avalon.png',
    accentColor: '#eab308',
  },
  {
    id: 'secret-chancellor',
    title: 'Secret Chancellor',
    genre: 'Political Intrigue & Deception',
    category: 'bluff',
    status: 'dev',
    players: '5 - 10 Players',
    duration: '30 - 45 Min',
    rating: 'U/A 16+',
    rankBadge: 'HIGH TENSION',
    topRank: 8,
    description:
      'Elected governments try to enact progressive policies while hidden fascists work in secret to appoint their secret chancellor.',
    rulesSummary: [
      'Elect President and Chancellor pairs to enact policy cards.',
      'Liberals try to pass 5 liberal policies; Fascists pass 6 or elect their Chancellor.',
      'Use presidential investigation powers to weed out deceptive ministers.',
    ],
    image: '/assets/home/icon-chancellor.png',
    accentColor: '#f43f5e',
  },
  {
    id: 'werewolf',
    title: 'Ultimate Werewolf',
    genre: 'Village Social Deduction',
    category: 'bluff',
    status: 'dev',
    players: '6 - 24 Players',
    duration: '20 - 40 Min',
    rating: 'ALL AGES',
    rankBadge: 'MASSIVE PARTY',
    topRank: 9,
    description:
      'Villagers sleep at night while werewolves hunt. In the morning, survivors debate and vote to eliminate the bloodthirsty monsters.',
    rulesSummary: [
      'Day and Night cycles with custom roles: Seer, Doctor, Hunter.',
      'Werewolves choose a victim secretly during the night.',
      'Daytime open tribunal debate to identify and banish werewolves.',
    ],
    image: '/assets/home/icon-werewolf.png',
    accentColor: '#3b82f6',
  },
  {
    id: 'two-rooms',
    title: 'Two Rooms and a Boom',
    genre: 'Hostage Swap • Room Movement',
    category: 'bluff',
    status: 'dev',
    players: '6 - 30 Players',
    duration: '10 - 15 Min',
    rating: 'ALL AGES',
    rankBadge: 'FAST PACED',
    topRank: 10,
    description:
      'Players are split into two separate physical rooms. One room holds the President; one holds the Bomber. Hostages are swapped each round!',
    rulesSummary: [
      'Players are divided equally between two physical rooms.',
      'Color share or card share to uncover allegiances.',
      'Send hostages across rooms each timed round. If Bomber ends in the President’s room, Red wins!',
    ],
    image: '/assets/home/icon-tworooms.png',
    accentColor: '#ef4444',
  },
  {
    id: 'wavelength',
    title: 'Wavelength',
    genre: 'Telepathic Spectrum • Mind Reading',
    category: 'words',
    status: 'dev',
    players: '4 - 12 Players',
    duration: '15 - 25 Min',
    rating: 'ALL AGES',
    rankBadge: 'VIBE CHECK',
    description:
      'A game of intuition and social calibration. One player knows where a target sits on a spectrum between two opposing concepts and gives a single clue.',
    rulesSummary: [
      'Spin the dial to a secret target hidden on a spectrum (e.g. Hot <-> Cold, Rough <-> Smooth).',
      'The psychic gives a clue representing that specific coordinate.',
      'Teammates turn the dial to where they believe the clue falls.',
    ],
    image: '/assets/home/icon-wavelength.png',
    accentColor: '#d946ef',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [infoModalGame, setInfoModalGame] = useState<GameDef | null>(null);

  // Ready playable games for Hero Billboard carousel
  const heroGames = ALL_GAMES.filter((g) => g.status === 'ready');
  const activeHero = heroGames[currentSlide] || heroGames[0];

  // Auto-advance billboard carousel every 7 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroGames.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, heroGames.length]);

  const handleNextSlide = () => {
    soundManager.playSelect();
    setCurrentSlide((prev) => (prev + 1) % heroGames.length);
  };

  const handlePrevSlide = () => {
    soundManager.playSelect();
    setCurrentSlide((prev) => (prev - 1 + heroGames.length) % heroGames.length);
  };

  // Content Row Filter Collections
  const topPicks = ALL_GAMES.filter((g) => g.status === 'ready');
  const top10Games = ALL_GAMES.filter((g) => g.topRank !== undefined).sort(
    (a, b) => (a.topRank || 0) - (b.topRank || 0)
  );
  const cardGames = ALL_GAMES.filter((g) => g.category === 'cards');
  const bluffGames = ALL_GAMES.filter((g) => g.category === 'bluff');
  const wordGames = ALL_GAMES.filter((g) => g.category === 'words');

  return (
    <div className="w-full bg-[#00050d] text-white select-none">
      {/* =========================================================================
          1. FULL-WIDTH EDGE-TO-EDGE BILLBOARD CAROUSEL (Amazon Prime Video Clone)
          Stretches 100% viewport width, seamless dark dissolves
          ========================================================================= */}
      <section
        className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden group bg-[#00050d] flex items-end"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Dynamic Full-Bleed Backdrops Stack with Smooth Cross-Fade */}
        {heroGames.map((game, idx) => {
          const isActive = currentSlide === idx;
          return (
            <div
              key={game.id}
              className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              {/* Background 3D Artwork */}
              <img
                src={game.heroBackdrop || game.image}
                alt={game.title}
                className="w-full h-full object-cover object-center sm:object-right transition-transform duration-1000 scale-100 group-hover:scale-105"
              />

              {/* Amazon Prime Video Signature Gradient Masks:
                  - Left heavy dark vignette for perfect contrast
                  - Top shadow so transparent navbar stays readable
                  - Bottom dissolve seamlessly into the page content */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00050d] via-[#00050d]/85 via-50% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00050d] via-[#00050d]/60 via-30% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#00050d]/80 via-transparent to-transparent h-28" />

              {/* Ambient Spotlight Glow matching active game color */}
              <div
                className="absolute top-1/2 right-10 -translate-y-1/2 w-[550px] h-[450px] blur-[150px] opacity-40 pointer-events-none rounded-full"
                style={{ backgroundColor: game.accentColor }}
              />
            </div>
          );
        })}

        {/* Floating Slide Navigation Chevrons on Far Left & Far Right Edges */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous Featured Game"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-16 sm:w-14 sm:h-20 rounded-r-lg bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next Featured Game"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-16 sm:w-14 sm:h-20 rounded-l-lg bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        {/* Billboard Hero Content Area (Aligned to Left) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-12 sm:pb-16 space-y-4 text-left">
          {/* Prime Video Sub-Brand Logo / Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#00a8e1] flex items-center gap-1.5">
              <Tv className="w-4 h-4" />
              <span>THE YAARI ORIGINAL</span>
            </span>

            {/* Trending Green Pill (Prime Video '#2 in India' Exact Style) */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px]">
                ↗
              </span>
              <span>{activeHero.rankBadge || '#1 in India'}</span>
            </div>
          </div>

          {/* GAME LOGO & TITLE */}
          <div className="flex items-center gap-4 pt-1">
            {/* 3D Game Logo Box with glowing accent */}
            <div
              className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-black/80 border-2 p-1.5 shrink-0 shadow-2xl transition-all duration-500"
              style={{
                borderColor: `${activeHero.accentColor}99`,
                boxShadow: `0 0 40px ${activeHero.accentColor}60`,
              }}
            >
              <img
                src={activeHero.image}
                alt={`${activeHero.title} Logo`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <div
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: activeHero.accentColor }}
              >
                <span>✦ {activeHero.genre}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl leading-[1.05]">
                {activeHero.title}
              </h1>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-300 font-medium line-clamp-2 max-w-xl leading-relaxed drop-shadow">
            {activeHero.description}
          </p>

          {/* Quick Specs: Players • Duration • Rating */}
          <div className="flex items-center gap-3 text-xs text-zinc-300 font-semibold pt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              {activeHero.players}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {activeHero.duration}
            </span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/15 border border-white/20 text-white font-bold">
              {activeHero.rating}
            </span>
          </div>

          {/* Action Button Row (Prime Video Clone Style) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Big White Play Button (Exact Prime Video 'Watch Now' style) */}
            {activeHero.href ? (
              <Link
                href={activeHero.href}
                onClick={() => soundManager.playSelect()}
                className="flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-md bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base shadow-2xl transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Play Now</span>
              </Link>
            ) : null}

            {/* Circular '+' Button (Create Room / Add) */}
            <Link
              href={activeHero.href || '/games'}
              onClick={() => soundManager.playSelect()}
              title="Create Room"
              className="w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700/90 border border-white/20 text-white flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </Link>

            {/* Circular 'ℹ' Button (Rules & Info Modal) */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setInfoModalGame(activeHero);
              }}
              title="Game Rules & Details"
              className="w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700/90 border border-white/20 text-white flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-label */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#00a8e1]" />
            <span>✔ Free to play with friends • Instant Web Room • No Downloads</span>
          </div>
        </div>

        {/* Bottom Center Pagination Indicators (Prime Video • • • dots) */}
        <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
          {heroGames.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => {
                soundManager.playSelect();
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}: ${game.title}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Bottom Right Rating Pill (Matches U/A 16+ on Prime Video) */}
        <div className="absolute bottom-5 right-6 sm:right-12 hidden sm:flex items-center gap-2 text-[11px] font-black tracking-wider text-zinc-300 bg-black/60 border border-white/10 px-3 py-1 rounded-md backdrop-blur-md z-20">
          <span>{activeHero.rating}</span>
          <span className="text-zinc-500">|</span>
          <span className="text-[#00a8e1]">THE YAARI</span>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Ad Container Placement 1 (Leaderboard) */}
        <AdBannerSlot slotId="home-hero-leaderboard" format="leaderboard" />

        {/* =========================================================================
            2. OTT ROW 1: TODAY'S TOP PICKS FOR YOU (16:9 Widescreen Posters)
            ========================================================================= */}
        <section className="w-full space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Today&apos;s top picks for you
              </h2>
            </div>
            <Link
              href="/games"
              className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              <span>See more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {topPicks.map((game, index) => {
              const badgeLabel =
                index === 0 ? 'TOP 1 READY' : index === 1 ? 'TOP SUSPENSE' : 'TOP PARTY HIT';

              return (
                <div
                  key={game.id}
                  className="group relative rounded-xl overflow-hidden bg-[#070b18] border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl hover:scale-[1.03] flex flex-col cursor-pointer"
                  onClick={() => {
                    soundManager.playSelect();
                    if (game.href) window.location.href = game.href;
                  }}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b18] via-[#070b18]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-white border border-white/20 backdrop-blur-md">
                        {badgeLabel}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playSelect();
                        setInfoModalGame(game);
                      }}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-110 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/40 backdrop-blur-[2px]">
                      <div className="w-13 h-13 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-[#070b18]">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {game.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          READY
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-medium line-clamp-1 mt-0.5">
                        {game.genre}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                      <span>👥 {game.players}</span>
                      <span>⏱️ {game.duration}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            3. SIGNATURE PRIME VIDEO "TOP 10 IN INDIA TODAY" ROW
            Features massive, iconic stylized rank numbers (1, 2, 3...)
            ========================================================================= */}
        <section className="w-full space-y-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Top 10 Games in India Today</span>
              <span className="text-xs text-[#00a8e1] font-semibold bg-[#00a8e1]/10 px-2 py-0.5 rounded">
                Daily Charts
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {top10Games.slice(0, 5).map((game) => {
              const isReady = game.status === 'ready';

              return (
                <div
                  key={game.id}
                  className="group relative flex flex-col cursor-pointer"
                  onClick={() => {
                    soundManager.playSelect();
                    if (isReady && game.href) {
                      window.location.href = game.href;
                    } else {
                      setInfoModalGame(game);
                    }
                  }}
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#070b18] border border-white/10 group-hover:border-[#00a8e1] transition-all duration-300 shadow-xl group-hover:scale-105">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* Massive Prime Video Top 10 Number in Foreground */}
                    <div className="absolute bottom-1 left-2 z-10 pointer-events-none">
                      <span className="text-6xl sm:text-7xl font-black text-white/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] stroke-black tracking-tighter">
                        {game.topRank}
                      </span>
                    </div>

                    {/* Top Status */}
                    <div className="absolute top-2 right-2 z-10">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-black/70 text-zinc-400'
                        }`}
                      >
                        {isReady ? 'PLAY' : 'DEV'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-left space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {game.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate">{game.genre}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ad Container Placement 2 (Mid-Feed Sponsored) */}
        <AdBannerSlot slotId="home-midfeed-sponsor" format="billboard" />

        {/* =========================================================================
            4. OTT ROW 2: CARD CLASSICS & DESI FAVORITES
            ========================================================================= */}
        <section className="w-full space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              🃏 Card Classics &amp; Desi Favorites
            </h2>
            <span className="text-xs text-zinc-400">South Asian Parlor Games</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardGames.map((game) => {
              const isReady = game.status === 'ready';

              return (
                <div
                  key={game.id}
                  className="group relative rounded-xl overflow-hidden bg-[#070b18] border border-white/10 hover:border-pink-500/50 transition-all duration-300 shadow-lg hover:scale-[1.02] flex flex-col justify-between p-4 cursor-pointer"
                  onClick={() => {
                    soundManager.playSelect();
                    if (isReady && game.href) {
                      window.location.href = game.href;
                    } else {
                      setInfoModalGame(game);
                    }
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {isReady ? 'READY TO PLAY' : 'IN PIPELINE'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playSelect();
                          setInfoModalGame(game);
                        }}
                        className="w-6 h-6 rounded-full bg-white/10 text-zinc-300 flex items-center justify-center"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/10 p-1 shrink-0">
                        <img
                          src={game.image}
                          alt={game.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition">
                          {game.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400">{game.genre}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                    <span>{game.players}</span>
                    <span className="text-cyan-400">{isReady ? '▶ Stream' : 'Rules'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            5. OTT ROW 3: SOCIAL DEDUCTION & PSYCHOLOGICAL BLUFF
            ========================================================================= */}
        <section className="w-full space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              🕵️ Social Deduction &amp; Psychological Bluff
            </h2>
            <span className="text-xs text-zinc-400">{bluffGames.length} Titles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bluffGames.map((game) => {
              const isReady = game.status === 'ready';

              return (
                <div
                  key={game.id}
                  className="group relative rounded-xl overflow-hidden bg-[#070b18] border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:scale-[1.02] flex flex-col justify-between p-4 cursor-pointer"
                  onClick={() => {
                    soundManager.playSelect();
                    if (isReady && game.href) {
                      window.location.href = game.href;
                    } else {
                      setInfoModalGame(game);
                    }
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-purple-950/50 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {game.rankBadge || (isReady ? 'READY TO PLAY' : 'IN DEVELOPMENT')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playSelect();
                          setInfoModalGame(game);
                        }}
                        className="w-6 h-6 rounded-full bg-white/10 text-zinc-300 flex items-center justify-center"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/10 p-1 shrink-0">
                        <img
                          src={game.image}
                          alt={game.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                          {game.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">{game.genre}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                    <span>{game.players}</span>
                    <span className="text-purple-400">{isReady ? '▶ Stream Now' : 'Details'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            6. VALUE PROPOSITION STRIP
            ========================================================================= */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 p-4 sm:p-5 rounded-xl bg-[#050813] border border-white/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Recreational Party Play</div>
              <div className="text-[11px] text-zinc-400">No real-money gambling or microtransactions</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-[#00a8e1]/20 text-[#00a8e1] flex items-center justify-center shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">OTT-Grade Streaming UI</div>
              <div className="text-[11px] text-zinc-400">Zero-install browser rooms for friends</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">PWA Mobile &amp; Desktop</div>
              <div className="text-[11px] text-zinc-400">Instant play via shared room codes</div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          7. PRIME VIDEO STYLE OTT INFO & RULES MODAL
          ========================================================================= */}
      {infoModalGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setInfoModalGame(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[#070b18] border border-white/20 shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black/60">
              <img
                src={infoModalGame.image}
                alt={infoModalGame.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b18] via-[#070b18]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070b18]/90 via-transparent to-transparent" />

              <button
                onClick={() => setInfoModalGame(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition hover:scale-110 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 z-10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#00a8e1]/30 text-cyan-300 border border-[#00a8e1]/40">
                  {infoModalGame.genre}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {infoModalGame.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-300 pb-3 border-b border-white/10">
                <span>👥 {infoModalGame.players}</span>
                <span>•</span>
                <span>⏱️ {infoModalGame.duration}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold border border-white/15">
                  {infoModalGame.rating}
                </span>
                <span>•</span>
                <span
                  className={
                    infoModalGame.status === 'ready' ? 'text-emerald-400' : 'text-zinc-400'
                  }
                >
                  {infoModalGame.status === 'ready'
                    ? '● Available to Play'
                    : '○ In Development Pipeline'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Overview</h4>
                <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                  {infoModalGame.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  How to Play (3 Simple Rules)
                </h4>
                <div className="space-y-2">
                  {infoModalGame.rulesSummary.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <span className="w-5 h-5 rounded-full bg-[#00a8e1]/20 text-cyan-300 border border-[#00a8e1]/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setInfoModalGame(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition border border-white/10 cursor-pointer"
                >
                  Close
                </button>
                {infoModalGame.status === 'ready' && infoModalGame.href ? (
                  <Link
                    href={infoModalGame.href}
                    onClick={() => {
                      soundManager.playSelect();
                      setInfoModalGame(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black shadow-xl transition hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Launch Game</span>
                  </Link>
                ) : (
                  <span className="text-xs text-zinc-500 italic">Game engine coming soon</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
