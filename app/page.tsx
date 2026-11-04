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
    rankBadge: '#1 IN INDIA',
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
    rankBadge: '#2 IN INDIA',
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
    rankBadge: '#3 IN INDIA',
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
  const cardGames = ALL_GAMES.filter((g) => g.category === 'cards');
  const bluffGames = ALL_GAMES.filter((g) => g.category === 'bluff');
  const wordGames = ALL_GAMES.filter((g) => g.category === 'words');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8 select-none">
      {/* =========================================================================
          1. OTT CINEMATIC BILLBOARD HERO CAROUSEL (Amazon Prime Video Style)
          Both Background Wallpaper AND Game Logo dynamically change together!
          ========================================================================= */}
      <section
        className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] group min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-end bg-[#050811]"
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
              {/* Background Artwork */}
              <img
                src={game.heroBackdrop || game.image}
                alt={game.title}
                className="w-full h-full object-cover object-center sm:object-right transition-transform duration-1000 scale-100 group-hover:scale-105"
              />

              {/* Prime Video Vignette Gradient Overlays:
                  - Left dark vignette for crisp text contrast
                  - Bottom gradient blend into the page
                  - Mobile ambient darkening */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#030610] via-[#030610]/85 via-50% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030610] via-[#030610]/70 via-30% to-transparent" />
              <div className="absolute inset-0 bg-[#030610]/40 sm:hidden" />

              {/* Ambient Spotlight Glow matching game's accent color */}
              <div
                className="absolute top-1/2 right-6 sm:right-16 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[450px] blur-[140px] opacity-35 pointer-events-none rounded-full"
                style={{ backgroundColor: game.accentColor }}
              />
            </div>
          );
        })}

        {/* Floating Slide Navigation Chevrons (Left & Right) */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous Featured Game"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl opacity-80 hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next Featured Game"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl opacity-80 hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Billboard Hero Content Area */}
        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 space-y-4 max-w-2xl text-left">
          {/* Sub-Header Branding / Ranking Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Small Brand Pill */}
            <div className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-white">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE YAARI ORIGINAL</span>
            </div>

            {/* Trending Rank Pill (Prime Video '#2 in India' style) */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeHero.rankBadge || '#1 IN INDIA'}</span>
            </div>

            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">•</span>
            <span className="text-xs text-zinc-300 font-semibold hidden sm:inline">
              {activeHero.genre}
            </span>
          </div>

          {/* GAME OFFICIAL LOGO & TITLE (Changes dynamically with each slide!) */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 pt-1">
            {/* 3D Game Logo Box with ambient glow and border matching active game */}
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-2xl overflow-hidden bg-black/80 border-2 p-1.5 shrink-0 shadow-2xl transition-all duration-500 group-hover:scale-105"
              style={{
                borderColor: `${activeHero.accentColor}99`,
                boxShadow: `0 0 35px ${activeHero.accentColor}55`,
              }}
            >
              <img
                src={activeHero.image}
                alt={`${activeHero.title} Official Logo`}
                className="w-full h-full object-cover rounded-xl transition-all duration-500"
              />
            </div>

            {/* Stylized Title & Tag */}
            <div className="space-y-0.5">
              <div
                className="text-[11px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5"
                style={{ color: activeHero.accentColor }}
              >
                <span>✦ {activeHero.genre}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-xl leading-[1.05]">
                {activeHero.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-300 font-medium line-clamp-2 max-w-xl leading-relaxed drop-shadow">
            {activeHero.description}
          </p>

          {/* Quick Specs Pill: Players • Duration • Rating */}
          <div className="flex items-center gap-3 text-xs text-zinc-300 font-semibold pt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" />
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

          {/* Action Button Row (Prime Video OTT Style) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* White Play CTA */}
            {activeHero.href ? (
              <Link
                href={activeHero.href}
                onClick={() => soundManager.playSelect()}
                className="flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base shadow-2xl shadow-white/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Play Now</span>
              </Link>
            ) : null}

            {/* '+' Circular Action Button (Create Room / Quick Match) */}
            <Link
              href={activeHero.href || '/games'}
              onClick={() => soundManager.playSelect()}
              title="Create Room"
              className="w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700/90 border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </Link>

            {/* 'ℹ' Circular Action Button (Info & Rules Modal) */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setInfoModalGame(activeHero);
              }}
              title="Game Rules & Details"
              className="w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700/90 border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-label: Watch for free / Free to play */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free to Play • Instant Web Room • No Downloads</span>
          </div>
        </div>

        {/* Bottom Center Pagination Indicators (Prime Video • • • dots) */}
        <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
          {heroGames.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => {
                soundManager.playSelect();
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}: ${game.title}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Bottom Right Rating Pill (Matches U/A 16+ on Prime Video) */}
        <div className="absolute bottom-4 right-5 hidden sm:flex items-center gap-2 text-[11px] font-black tracking-wider text-zinc-300 bg-black/60 border border-white/10 px-3 py-1 rounded-md backdrop-blur-md z-20">
          <span>{activeHero.rating}</span>
          <span className="text-zinc-500">|</span>
          <span className="text-emerald-400">MULTIPLAYER</span>
        </div>
      </section>

      {/* =========================================================================
          2. AD CONTAINER PLACEHOLDER #1 (Leaderboard 728x90)
          ========================================================================= */}
      <AdBannerSlot slotId="home-hero-leaderboard" format="leaderboard" />

      {/* =========================================================================
          3. OTT ROW 1: TODAY'S TOP PICKS FOR YOU (16:9 Landscape Poster Format)
          ========================================================================= */}
      <section className="w-full space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Today&apos;s top picks for you
            </h2>
          </div>
          <Link
            href="/games"
            className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Poster Cards (Prime Video Landscape 16:9 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {topPicks.map((game, index) => {
            const badgeLabel =
              index === 0 ? 'TOP 1 READY' : index === 1 ? 'TOP SUSPENSE' : 'TOP PARTY HIT';

            return (
              <div
                key={game.id}
                className="group relative rounded-2xl overflow-hidden bg-[#0a0e1c] border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex flex-col cursor-pointer"
                onClick={() => {
                  soundManager.playSelect();
                  if (game.href) window.location.href = game.href;
                }}
              >
                {/* 16:9 Landscape Poster Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Gradient bottom and top overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1c] via-[#0a0e1c]/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

                  {/* Top Left Prime Video Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white border border-white/20 backdrop-blur-md">
                      {badgeLabel}
                    </span>
                  </div>

                  {/* Top Right 'ℹ' Info Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playSelect();
                      setInfoModalGame(game);
                    }}
                    title="View Rules & Info"
                    className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-110 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  {/* Hover Overlay Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/40 backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-black ml-1" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2 relative z-10 bg-[#0a0e1c]">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
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

                  {/* Specs footer */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-400" />
                      {game.players}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {game.duration}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. OTT ROW 2: CARD GAMES & WAGERING CLASSICS
          ========================================================================= */}
      <section className="w-full space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              🃏 Card Games & Wagering Classics
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">South Asian Favorites</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardGames.map((game) => {
            const isReady = game.status === 'ready';

            return (
              <div
                key={game.id}
                className="group relative rounded-2xl overflow-hidden bg-[#0e1224] border border-white/10 hover:border-pink-500/40 transition-all duration-300 shadow-lg hover:shadow-pink-950/40 hover:scale-[1.02] flex flex-col justify-between p-4 cursor-pointer"
                onClick={() => {
                  soundManager.playSelect();
                  if (isReady && game.href) {
                    window.location.href = game.href;
                  } else {
                    setInfoModalGame(game);
                  }
                }}
              >
                {/* Watermark art background */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
                  <img
                    src={game.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover object-center opacity-[0.08] group-hover:opacity-[0.15] scale-105 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1224] via-[#0e1224]/85 to-transparent" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isReady
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {isReady ? 'READY TO PLAY' : 'IN DEVELOPMENT'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playSelect();
                        setInfoModalGame(game);
                      }}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/15 p-1 shrink-0 flex items-center justify-center shadow-lg group-hover:border-pink-400/60 transition-colors">
                      <SmartAssetImage
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full rounded-lg overflow-hidden"
                        fallback={<CatalogIconGraphic gameId={game.id} className="w-10 h-10" />}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-pink-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-zinc-400">{game.genre}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 relative z-10 font-semibold">
                  <span>{game.players}</span>
                  <span className="text-emerald-400">{isReady ? '▶ Play' : 'View Rules'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. AD CONTAINER PLACEHOLDER #2 (Mid-Feed Sponsored Banner)
          ========================================================================= */}
      <AdBannerSlot slotId="home-midfeed-sponsor" format="billboard" />

      {/* =========================================================================
          6. OTT ROW 3: SOCIAL DEDUCTION & BLUFFING (Party Night)
          ========================================================================= */}
      <section className="w-full space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              🕵️ Social Deduction & Bluffing (Party Night)
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">{bluffGames.length} Titles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bluffGames.map((game) => {
            const isReady = game.status === 'ready';

            return (
              <div
                key={game.id}
                className="group relative rounded-2xl overflow-hidden bg-[#0c1020] border border-white/10 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-950/40 hover:scale-[1.02] flex flex-col justify-between p-4 cursor-pointer"
                onClick={() => {
                  soundManager.playSelect();
                  if (isReady && game.href) {
                    window.location.href = game.href;
                  } else {
                    setInfoModalGame(game);
                  }
                }}
              >
                {/* Watermark art background */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
                  <img
                    src={game.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover object-center opacity-[0.08] group-hover:opacity-[0.14] scale-105 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1020] via-[#0c1020]/85 to-transparent" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
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
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/15 p-1 shrink-0 flex items-center justify-center shadow-lg group-hover:border-purple-400/60 transition-colors">
                      <SmartAssetImage
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full rounded-lg overflow-hidden"
                        fallback={<CatalogIconGraphic gameId={game.id} className="w-10 h-10" />}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-zinc-400 line-clamp-1">
                        {game.genre}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 relative z-10 font-semibold">
                  <span>{game.players}</span>
                  <span className="text-purple-400">{isReady ? '▶ Play Now' : 'Inspect Rules'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          7. OTT ROW 4: WORD GAMES & MIND READING
          ========================================================================= */}
      <section className="w-full space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              🧠 Word Games & Mind Reading
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">Vocabulary & Associations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wordGames.map((game) => {
            const isReady = game.status === 'ready';

            return (
              <div
                key={game.id}
                className="group relative rounded-2xl overflow-hidden bg-[#0c1222] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-950/40 hover:scale-[1.02] flex flex-col justify-between p-4 cursor-pointer"
                onClick={() => {
                  soundManager.playSelect();
                  if (isReady && game.href) {
                    window.location.href = game.href;
                  } else {
                    setInfoModalGame(game);
                  }
                }}
              >
                {/* Watermark art background */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
                  <img
                    src={game.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover object-center opacity-[0.08] group-hover:opacity-[0.14] scale-105 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/85 to-transparent" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
                      {game.rankBadge || 'IN DEVELOPMENT'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playSelect();
                        setInfoModalGame(game);
                      }}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/15 p-1 shrink-0 flex items-center justify-center shadow-lg group-hover:border-cyan-400/60 transition-colors">
                      <SmartAssetImage
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full rounded-lg overflow-hidden"
                        fallback={<CatalogIconGraphic gameId={game.id} className="w-10 h-10" />}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-zinc-400 line-clamp-1">
                        {game.genre}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 relative z-10 font-semibold">
                  <span>{game.players}</span>
                  <span className="text-cyan-400">Inspect Rules</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. PLAY YOUR WAY QUICK-LAUNCH ROW
          ========================================================================= */}
      <section className="w-full space-y-3.5">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Play Your Way</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Single Player */}
          <Link
            href="/games/bhabhi/solo"
            onClick={() => soundManager.playSelect()}
            className="group relative p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-emerald-500/30 hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-950/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition">
                  Single Player vs AI
                </h3>
                <p className="text-xs text-zinc-400">Play offline Bhabhi at your own pace</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Local Party */}
          <Link
            href="/games/undercover"
            onClick={() => soundManager.playSelect()}
            className="group relative p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-purple-500/30 hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-950/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition">
                  Local Pass & Play
                </h3>
                <p className="text-xs text-zinc-400">Play together on a single shared screen</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Online Multiplayer */}
          <Link
            href="/games/bhabhi"
            onClick={() => soundManager.playSelect()}
            className="group relative p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-950/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Online Custom Rooms
                </h3>
                <p className="text-xs text-zinc-400">Create private rooms with friends anywhere</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          9. VALUE PROPOSITION STRIP
          ========================================================================= */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 p-4 sm:p-5 rounded-2xl bg-[#0b0f1d] border border-white/10">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">No Gambling or In-App Purchases</div>
            <div className="text-[11px] text-zinc-400">Pure recreational gameplay with friends</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <span className="font-black text-xs">Ad</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">Ad-Supported Free Platform</div>
            <div className="text-[11px] text-zinc-400">Minimal non-intrusive sponsor slots</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Instant Browser Play (PWA)</div>
            <div className="text-[11px] text-zinc-400">Works seamlessly on Mobile & Desktop</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. PRIME VIDEO STYLE OTT INFO & RULES MODAL
          ========================================================================= */}
      {infoModalGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setInfoModalGame(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-[#0b0f1d] border border-white/20 shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Art Banner */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black/60">
              <img
                src={infoModalGame.image}
                alt={infoModalGame.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1d] via-[#0b0f1d]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f1d]/90 via-transparent to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setInfoModalGame(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition hover:scale-110 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Badge inside Banner */}
              <div className="absolute bottom-4 left-6 z-10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-500/25 text-purple-300 border border-purple-500/30">
                  {infoModalGame.genre}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {infoModalGame.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Meta Stats Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-300 pb-3 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  {infoModalGame.players}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {infoModalGame.duration}
                </span>
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

              {/* Synopsis */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Overview</h4>
                <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                  {infoModalGame.description}
                </p>
              </div>

              {/* Quick How to Play Rules */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  How to Play (3 Simple Rules)
                </h4>
                <div className="space-y-2">
                  {infoModalGame.rulesSummary.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTA */}
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
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black shadow-xl shadow-white/20 transition hover:scale-105 active:scale-95 cursor-pointer"
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
