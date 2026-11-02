'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Crown,
} from 'lucide-react';
import { PlayingCard } from '@/components/cards/PlayingCard';

export default function HowToPlayPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Rules & Strategy Guide
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          How to Play Bhabhi (Thulla)
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Master the classic card game of escape, deception, and the dreaded Thulla. Everything you
          need to know from the opening Ace of Spades to escaping safe.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="w-full space-y-8 text-left">
        {/* Rule 1: The Objective */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black">
              1
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">The Objective</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            In Bhabhi (also known as <em>Thulla</em> or <em>Get Away</em>), there is no single "winner"
            who collects points. Instead, players race to <strong>shed all cards from their hand</strong>!
            The last remaining player holding cards after everyone else has safely escaped is crowned
            the <span className="font-bold text-rose-400">Bhabhi</span> (the loser).
          </p>
        </div>

        {/* Rule 2: Opening Move with Ace of Spades */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black">
              2
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              The Ace of Spades (A♠) Opening
            </h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            All 52 cards are dealt among 3 to 6 players. The player holding the{' '}
            <strong className="text-white">Ace of Spades (A♠)</strong> MUST lead the first trick of
            the game with that exact card. All other active players in clockwise order must play a
            Spade if they hold one.
          </p>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
            <PlayingCard card={{ id: 'AS', suit: 'S', rank: 14 }} size="sm" />
            <div className="text-xs text-gray-300">
              <div className="font-bold text-white">Mandatory First Card</div>
              If you hold A♠, you cannot lead with any other card on Trick #1.
            </div>
          </div>
        </div>

        {/* Rule 3: Follow Suit */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black">
              3
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              The Follow-Suit Rule
            </h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            The first card played in any trick sets the <strong>Lead Suit</strong> (e.g. Hearts ♥,
            Spades ♠, Diamonds ♦, or Clubs ♣). If you hold <em>any</em> card of that suit in your
            hand, you <strong>must</strong> play a card of that suit. You cannot play another suit
            while holding the lead suit.
          </p>
        </div>

        {/* Rule 4: The Thulla (Thoko) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-[#121626] to-[#0c0e1a] border-2 border-rose-500/40 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
              💥
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-300">
              The THULLA! (Off-Suit Strike)
            </h2>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">
            If you do <strong>NOT</strong> have any cards of the lead suit, you can play ANY card in your
            hand! This triggers a <strong>THULLA</strong>:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-300 pl-4 list-disc">
            <li>The trick stops immediately.</li>
            <li>
              The player who played the <strong className="text-amber-300">highest card of the original lead suit</strong>{' '}
              must pick up ALL cards played in the trick into their hand!
            </li>
            <li>
              The player who struck the Thulla earns the lead and starts the next trick.
            </li>
          </ul>
        </div>

        {/* Rule 5: Clean Sweep */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#121626] to-[#0c0e1a] border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black">
              ✨
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-cyan-300">
              Clean Sweep (Cards Discarded)
            </h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            If every active player follows the lead suit, no Thulla occurs. The player who played the
            highest card of the lead suit wins the trick. All cards in the trick are placed into the{' '}
            <strong>discard pile</strong> and removed from the game forever! The winner leads the next trick.
          </p>
        </div>

        {/* Rule 6: Safe Exit & Bhabhi Crown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              🏆
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Getting Away Safe & The Bhabhi
            </h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Whenever a player empties their hand after a trick resolves without receiving penalty cards,
            they become <strong className="text-emerald-400">SAFE</strong> and exit active play! When
            only one player remains with cards, the game ends immediately and that player is the{' '}
            <strong className="text-rose-400">Bhabhi</strong>.
          </p>
        </div>
      </div>

      {/* Play CTA Banner */}
      <div className="w-full mt-12 p-8 rounded-3xl bg-gradient-to-r from-purple-900/60 to-indigo-950/80 border border-purple-500/40 text-center flex flex-col items-center">
        <h3 className="text-2xl font-black text-white mb-2">Ready to test your skills?</h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-lg mb-6">
          Put these rules into practice against our smart AI bots or invite friends for a private match.
        </p>
        <Link
          href="/games/bhabhi/solo"
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          Play Solo vs AI Now
        </Link>
      </div>
    </div>
  );
}

