'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Users,
  Clock,
  Info,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';
import { AdBannerSlot } from '@/components/ads/AdBannerSlot';

export interface GameDef {
  id: string;
  title: string;
  genre: string;
  category: 'cards' | 'bluff' | 'words';
  status: 'ready' | 'dev';
  players: string;
  duration: string;
  rating: string;
  rankBadge: string;
  topRank: number;
  badgeLabel: string;
  sponsorTag: string;
  description: string;
  rulesSummary: string[];
  image: string;
  heroBackdrop: string;
  href?: string;
  accentColor: string;
}

const ALL_GAMES: GameDef[] = [
  // Ready to Play (3)
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
    badgeLabel: 'NEW EPISODE',
    sponsorTag: 'FINALE PACK • PARTY HIT',
    description:
      'Spot the impostors before they deceive the entire room! Civilians get the real word, Undercover gets a closely related word, and Mr. White gets no word at all. Give one-word clues and vote out the deceivers.',
    rulesSummary: [
      'Each player receives a secret word (Civilians share one word, Undercovers share a similar word).',
      'Take turns describing your secret word with exactly one subtle clue.',
      'Debate and vote out suspected impostors each round until Civilians or Impostors win.',
    ],
    image: '/assets/home/card-undercover.png',
    heroBackdrop: '/assets/home/hero-undercover-wide.png',
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
    badgeLabel: 'TOP 10',
    sponsorTag: 'ROYAL DESI CLASSIC',
    description:
      'The legendary South Asian card evasion game! Clear your hand as fast as possible by following lead suits. If a player cannot follow suit, a "Thulla" (penalty) is triggered, and the highest card holder must pick up the entire pile.',
    rulesSummary: [
      'Ace of Spades leads the very first trick of the round.',
      'Must follow the lead suit if you hold a card of that suit.',
      'Failing to follow suit causes a Thulla — the highest suited card collector picks up all played cards!',
      'Clear your cards to escape. The last remaining player is crowned the Bhabhi!',
    ],
    image: '/assets/home/card-bhabhi.png',
    heroBackdrop: '/assets/home/hero-bhabhi-wide.png',
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
    badgeLabel: 'TOP SUSPENSE',
    sponsorTag: 'SECRET AGENT EDITION',
    description:
      'All players find themselves in a secret location (like an Airplane, Casino, or Submarine) — except for one hidden Spy! Ask cleverly probing questions to identify the spy without revealing where you are.',
    rulesSummary: [
      'Everyone knows the secret location except the Spy.',
      'Take turns asking cross-examination questions to probe other players.',
      'The Spy tries to deduce the location while blending in.',
      'Vote to accuse the Spy or the Spy can guess the location to steal the win.',
    ],
    image: '/assets/home/card-spyfall.png',
    heroBackdrop: '/assets/home/hero-spyfall-wide.png',
    href: '/games/spyfall',
    accentColor: '#f59e0b',
  },

  // In Development (8)
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
    badgeLabel: 'NEW SERIES',
    sponsorTag: 'FESTIVE SPECIAL',
    description:
      'Classic 3-card Indian poker with virtual chips. Play blind or seen, manage your stakes, and win with high card hands or brilliant bluffing.',
    rulesSummary: [
      'Players receive 3 hole cards face-down.',
      'Bet blind or inspect cards and bet double.',
      'Trail (Trio), Pure Sequence, Sequence, Color, Pair, and High Card rankings apply.',
    ],
    image: '/assets/home/icon-teenpatti.png',
    heroBackdrop: '/assets/home/icon-teenpatti.png',
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
    badgeLabel: 'TOP STRATEGY',
    sponsorTag: 'ENCRYPTION LAB',
    description:
      'Transmit secret 3-digit codes to your teammates without letting the intercepting rival team crack your secret four keywords.',
    rulesSummary: [
      'Two opposing teams each have 4 secret words known only to them.',
      'Encrypt a 3-digit numeric sequence with clues for your teammates.',
      'Guess wrong and get a miscommunication token; intercept opponents to earn victory tokens.',
    ],
    image: '/assets/home/icon-decrypto.png',
    heroBackdrop: '/assets/home/icon-decrypto.png',
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
    badgeLabel: 'PARTY HIT',
    sponsorTag: 'SPYMASTER SUITE',
    description:
      'Two rival Spymasters know the secret identities of 25 agents on the grid. They provide one-word clues linked to multiple cards on the table.',
    rulesSummary: [
      'Spymasters give a one-word clue plus a number (e.g., "Water: 2").',
      'Field operatives guess which grid cards correspond to their team.',
      'Beware the Assassin card which triggers an immediate loss!',
    ],
    image: '/assets/home/icon-codenames.png',
    heroBackdrop: '/assets/home/icon-codenames.png',
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
    badgeLabel: 'TOP DRAMA',
    sponsorTag: 'ARTHURIAN LEGENDS',
    description:
      'Loyal Servants of Arthur battle the treacherous Minions of Mordred. Pass 3 holy quests to claim Camelot, or sow discord to see it fall.',
    rulesSummary: [
      'Players are secretly aligned with Good or Evil.',
      'Vote on proposed teams to embark on critical quests.',
      'Evil minions attempt to secretly sabotage quest missions.',
    ],
    image: '/assets/home/icon-avalon.png',
    heroBackdrop: '/assets/home/icon-avalon.png',
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
    badgeLabel: 'TOP SUSPENSE',
    sponsorTag: 'CABINET INTRIGUE',
    description:
      'Elected governments try to enact progressive policies while hidden fascists work in secret to appoint their secret chancellor.',
    rulesSummary: [
      'Elect President and Chancellor pairs to enact policy cards.',
      'Liberals try to pass 5 liberal policies; Fascists pass 6 or elect their Chancellor.',
      'Use presidential investigation powers to weed out deceptive ministers.',
    ],
    image: '/assets/home/icon-chancellor.png',
    heroBackdrop: '/assets/home/icon-chancellor.png',
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
    badgeLabel: 'PARTY THRILLER',
    sponsorTag: 'VILLAGE NIGHTMARE',
    description:
      'Villagers sleep at night while werewolves hunt. In the morning, survivors debate and vote to eliminate the bloodthirsty monsters.',
    rulesSummary: [
      'Day and Night cycles with custom roles: Seer, Doctor, Hunter.',
      'Werewolves choose a victim secretly during the night.',
      'Daytime open tribunal debate to identify and banish werewolves.',
    ],
    image: '/assets/home/icon-werewolf.png',
    heroBackdrop: '/assets/home/icon-werewolf.png',
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
    badgeLabel: 'NEW SERIES',
    sponsorTag: 'BUNKER CONFLICT',
    description:
      'Players are split into two separate physical rooms. One room holds the President; one holds the Bomber. Hostages are swapped each round!',
    rulesSummary: [
      'Players are divided equally between two physical rooms.',
      'Color share or card share to uncover allegiances.',
      'Send hostages across rooms each timed round. If Bomber ends in the President’s room, Red wins!',
    ],
    image: '/assets/home/icon-tworooms.png',
    heroBackdrop: '/assets/home/icon-tworooms.png',
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
    topRank: 11,
    badgeLabel: 'MIND BENDER',
    sponsorTag: 'SPECTRUM TELEPATHY',
    description:
      'A game of intuition and social calibration. One player knows where a target sits on a spectrum between two opposing concepts and gives a single clue.',
    rulesSummary: [
      'Spin the dial to a secret target hidden on a spectrum (e.g. Hot <-> Cold, Rough <-> Smooth).',
      'The psychic gives a clue representing that specific coordinate.',
      'Teammates turn the dial to where they believe the clue falls.',
    ],
    image: '/assets/home/icon-wavelength.png',
    heroBackdrop: '/assets/home/icon-wavelength.png',
    accentColor: '#d946ef',
  },
];

// Reusable Prime Video Carousel Content Row
function PrimeVideoCarouselRow({
  title,
  games,
  showRanks = false,
  onOpenInfo,
}: {
  title: string;
  games: GameDef[];
  showRanks?: boolean;
  onOpenInfo: (game: GameDef) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [games]);

  const scroll = (direction: 'left' | 'right') => {
    soundManager.playSelect();
    if (!scrollRef.current) return;
    const offset = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="relative w-full space-y-2 group/row text-left">
      {/* Row Header (Clean, bold, pure Prime Video typography) */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <Link
          href="/games"
          onClick={() => soundManager.playSelect()}
          className="text-xs font-bold text-[#00a8e1] hover:underline"
        >
          See more
        </Link>
      </div>

      {/* Row Container with Navigation Chevrons */}
      <div className="relative">
        {/* Left Scroll Chevron Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Right Scroll Chevron Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Horizontal Scrolling Card Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {games.map((game, index) => {
            const isReady = game.status === 'ready';

            return (
              <div
                key={game.id}
                className="group relative flex-none w-[240px] sm:w-[280px] lg:w-[320px] aspect-[16/9] rounded-lg overflow-hidden bg-[#070b18] border border-white/10 hover:border-white/40 transition-all duration-300 shadow-xl hover:scale-[1.04] cursor-pointer"
                onClick={() => {
                  soundManager.playSelect();
                  if (isReady && game.href) {
                    window.location.href = game.href;
                  } else {
                    onOpenInfo(game);
                  }
                }}
              >
                {/* 16:9 Landscape Artwork */}
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                {/* Top Corner Badge (Exact Prime Video Screenshot Style: White Tag, Bold Black Text) */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                  {showRanks ? (
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white text-black shadow-md">
                      #{index + 1} IN INDIA
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white text-black shadow-md">
                      {game.badgeLabel}
                    </span>
                  )}
                </div>

                {/* Top Right Quick Info Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playSelect();
                    onOpenInfo(game);
                  }}
                  title="Game rules and details"
                  className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-110 cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>

                {/* Center Play Button Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/35 backdrop-blur-[1px]">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Bottom Card Title & Metadata Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 z-10 text-left space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-md">
                      {game.title}
                    </h3>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                        isReady
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isReady ? 'FREE' : 'SOON'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-medium">
                    <span>{game.players}</span>
                    <span>•</span>
                    <span>{game.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [infoModalGame, setInfoModalGame] = useState<GameDef | null>(null);

  // Playable games for the Hero Billboard
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
  const topPicks = ALL_GAMES.filter((g) => g.status === 'ready' || g.topRank <= 6);
  const top10Games = ALL_GAMES.filter((g) => g.topRank <= 10).sort(
    (a, b) => a.topRank - b.topRank
  );
  const cardGames = ALL_GAMES.filter((g) => g.category === 'cards');
  const bluffGames = ALL_GAMES.filter((g) => g.category === 'bluff');
  const wordGames = ALL_GAMES.filter((g) => g.category === 'words');

  return (
    <div className="w-full bg-[#00050d] text-white select-none">
      {/* =========================================================================
          1. FULL-WIDTH CINEMATIC BILLBOARD CAROUSEL (Exact Prime Video Layout)
          - Extends 100% full width under top navbar
          - Clean dark vignette on left & bottom
          - Accurate buttons: White Play CTA, circular '+', circular 'ℹ'
          - Chevrons on absolute far left & right edges
          ========================================================================= */}
      <section
        className="relative w-full h-[540px] sm:h-[620px] lg:h-[700px] xl:h-[740px] overflow-hidden group bg-[#00050d] flex items-end"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Dynamic Backdrops Stack with Smooth Cross-Fade */}
        {heroGames.map((game, idx) => {
          const isActive = currentSlide === idx;
          return (
            <div
              key={game.id}
              className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <img
                src={game.heroBackdrop}
                alt={game.title}
                className="w-full h-full object-cover object-center lg:object-right transition-transform duration-1000 scale-100 group-hover:scale-105"
              />

              {/* Prime Video Seamless Vignette Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00050d] via-[#00050d]/85 via-45% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00050d] via-[#00050d]/60 via-20% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#00050d]/90 via-transparent to-transparent h-24" />

              {/* Ambient Spotlight Glow on Right */}
              <div
                className="absolute top-1/2 right-12 -translate-y-1/2 w-[550px] h-[450px] blur-[160px] opacity-35 pointer-events-none rounded-full"
                style={{ backgroundColor: game.accentColor }}
              />
            </div>
          );
        })}

        {/* Side Chevrons (Absolute Far Left & Right Screen Edges) */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous Featured Title"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-14 h-24 rounded-r-lg bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next Featured Title"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-14 h-24 rounded-l-lg bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        {/* Billboard Hero Content Area (Aligned to Left with Full Max Width) */}
        <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pb-14 sm:pb-16 space-y-4 text-left">
          {/* Top Brand Network Tag (Mirrors 'MX' with cyan curve in screenshot) */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                <span>TY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a8e1]" />
              </span>
              <svg
                viewBox="0 0 42 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-1 text-[#00a8e1]"
              >
                <path
                  d="M 1 1.5 Q 21 5.5 41 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Large Stylized Game Title (Flanked by Diamond Emblems) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl text-amber-400 font-serif">◈</span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase drop-shadow-2xl leading-[1.05]">
                {activeHero.title}
              </h1>
              <span className="text-xl sm:text-2xl text-amber-400 font-serif">◈</span>
            </div>

            {/* Sponsor / Edition Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-black uppercase tracking-wider text-zinc-300">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                {activeHero.sponsorTag}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300">{activeHero.genre}</span>
            </div>
          </div>

          {/* Trending Rank Tag (Exact Prime Video '#2 in India' Green Pill) */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00d47b] bg-[#00d47b]/15 border border-[#00d47b]/30 px-2.5 py-0.5 rounded-full">
              <span className="w-4 h-4 rounded-full bg-[#00d47b]/30 flex items-center justify-center text-[11px] font-black">
                ↗
              </span>
              <span>{activeHero.rankBadge}</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Big White Button ('Episode 40 Watch now' in screenshot) */}
            {activeHero.href ? (
              <Link
                href={activeHero.href}
                onClick={() => soundManager.playSelect()}
                className="flex items-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-md bg-white hover:bg-zinc-200 text-black font-black text-sm sm:text-base shadow-2xl transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Play Now</span>
              </Link>
            ) : null}

            {/* Circular '+' Button (Add / Create Room) */}
            <Link
              href={activeHero.href || '/games'}
              onClick={() => soundManager.playSelect()}
              title="Create Room"
              className="w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/30 text-white flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </Link>

            {/* Circular 'ℹ' Button (Rules & Info) */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setInfoModalGame(activeHero);
              }}
              title="Game Details & Rules"
              className="w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/30 text-white flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-label ('✔ Watch for free' in screenshot) */}
          <div className="flex items-center gap-2 text-xs text-zinc-300 pt-1 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#00a8e1]" />
            <span>Watch &amp; play for free with friends • Instant Web Room • No Downloads</span>
          </div>
        </div>

        {/* Bottom Center Pagination Indicators (─ • • •) */}
        <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
          {heroGames.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => {
                soundManager.playSelect();
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}: ${game.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Bottom Right Age Rating Pill ('U/A 16+' in screenshot) */}
        <div className="absolute bottom-5 right-6 sm:right-12 hidden sm:flex items-center gap-2 text-[11px] font-black tracking-wider text-zinc-300 bg-black/75 border border-white/20 px-3 py-1 rounded-sm backdrop-blur-md z-20">
          <span>{activeHero.rating}</span>
        </div>
      </section>

      {/* =========================================================================
          2. MAIN CONTENT ROWS (Exact Prime Video Layout & Gutter Margins)
          - Spans w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16
          - All cards are 16:9 widescreen landscape
          - Horizontal smooth scrolling carousels with chevrons
          ========================================================================= */}
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-8 space-y-10 sm:space-y-12">
        {/* Ad Placement 1: Top Sponsored Banner */}
        <AdBannerSlot slotId="home-hero-leaderboard" format="leaderboard" />

        {/* Row 1: Today's top picks for you */}
        <PrimeVideoCarouselRow
          title="Today's top picks for you"
          games={topPicks}
          onOpenInfo={(game) => setInfoModalGame(game)}
        />

        {/* Row 2: Top 10 Games in India Today */}
        <PrimeVideoCarouselRow
          title="Top 10 Games in India Today"
          games={top10Games}
          showRanks={true}
          onOpenInfo={(game) => setInfoModalGame(game)}
        />

        {/* Ad Placement 2: Mid-Feed Sponsored Billboard */}
        <AdBannerSlot slotId="home-midfeed-sponsor" format="billboard" />

        {/* Row 3: Card Classics & Desi Favorites */}
        <PrimeVideoCarouselRow
          title="Popular card games and South Asian classics"
          games={cardGames}
          onOpenInfo={(game) => setInfoModalGame(game)}
        />

        {/* Row 4: Social Deduction & Psychological Bluff */}
        <PrimeVideoCarouselRow
          title="Social deduction and psychological bluffing"
          games={bluffGames}
          onOpenInfo={(game) => setInfoModalGame(game)}
        />

        {/* Row 5: Word Games & Mind Association */}
        <PrimeVideoCarouselRow
          title="Word games and mind association"
          games={wordGames}
          onOpenInfo={(game) => setInfoModalGame(game)}
        />
      </div>

      {/* =========================================================================
          3. DETAILS & RULES MODAL (Cinema Overlay)
          ========================================================================= */}
      {infoModalGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setInfoModalGame(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-xl bg-[#091122] border border-white/20 shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black/60">
              <img
                src={infoModalGame.image}
                alt={infoModalGame.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-[#091122]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#091122]/90 via-transparent to-transparent" />

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
                  className="px-4 py-2.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition border border-white/10 cursor-pointer"
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
                    className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-black shadow-xl transition hover:scale-105 active:scale-95 cursor-pointer"
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
