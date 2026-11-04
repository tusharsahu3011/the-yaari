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
  Tv,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { PlayingCard } from '@/components/cards/PlayingCard';
import { AdBannerSlot } from '@/components/ads/AdBannerSlot';
import { soundManager } from '@/lib/audio/sound-effects';

export default function HowToPlayPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex flex-col items-center select-none text-left">
      {/* Prime Video Help & Rules Header */}
      <div className="w-full text-center max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>THE YAARI RULES &amp; STRATEGY HUB</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How to Play Bhabhi (Get Away)
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Master the iconic South Asian card game of escape, bluffing, and the dreaded Thulla.
          Learn all the official rules from the opening Ace of Spades to escaping safe.
        </p>
      </div>

      {/* Main Content Sections (Prime Video Episode Guide Style) */}
      <div className="w-full space-y-6">
        {/* Rule 1: The Objective */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070b18] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black">
              1
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">The Objective</h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            In Bhabhi (also known as <em>Thulla</em> or <em>Get Away</em>), there is no single &quot;winner&quot;
            who scores points. Instead, all players race to <strong>shed every single card from their hand</strong>!
            The last remaining player holding cards after everyone else has safely escaped is crowned
            the <span className="font-bold text-rose-400">Bhabhi</span> (the loser).
          </p>
        </div>

        {/* Rule 2: Opening Lead with Ace of Spades */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070b18] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black">
              2
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              The Ace of Spades (A♠) Opening Lead
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Whoever is dealt the <strong>Ace of Spades (A♠)</strong> MUST play it on the very first trick of the match.
            Every other player who holds Spades must also play a Spade card.
          </p>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 w-fit">
            <PlayingCard card={{ id: 'AS', suit: 'S', rank: 14 }} size="md" />
            <div className="text-xs text-zinc-300 font-semibold">
              <span className="text-cyan-400 font-bold block">First Move Rule</span>
              Must be led to kick off round 1.
            </div>
          </div>
        </div>

        {/* Rule 3: Following Suit */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070b18] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black">
              3
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Must Follow Suit</h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            When a player leads a suit (for example Hearts ♥), all players in turn order <strong>must play Hearts</strong> if
            they have any Heart in hand. The player who plays the highest card of the lead suit wins the trick and leads the next trick.
          </p>
        </div>

        {/* Rule 4: The Dreaded Thulla */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1a0c10] via-[#070b18] to-[#070b18] border-2 border-rose-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black">
              4
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>The Dreaded &quot;Thulla&quot; Penalty</span>
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            If a player has <strong>NO cards of the lead suit</strong>, they are allowed to play ANY card from their hand.
            This action is called a <strong className="text-rose-400 font-bold">&quot;Thulla&quot;</strong>!
          </p>
          <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/30 text-xs sm:text-sm text-zinc-200 space-y-2">
            <p className="font-bold text-white">💥 What happens during a Thulla?</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li>The trick ends immediately.</li>
              <li>
                The player who threw the <strong>highest card of the original lead suit</strong> must pick up the ENTIRE discard pile into their hand!
              </li>
              <li>
                The player who gave the Thulla gets the right to lead the next round!
              </li>
            </ul>
          </div>
        </div>

        {/* Rule 5: Escaping */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070b18] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              5
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Safe Escape (Get Away)</h2>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            The moment you play your last card, you escape safely! The remaining players keep fighting until only ONE player
            remains holding cards. That last unfortunate soul is crowned the <strong>Bhabhi</strong>!
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="w-full p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0a1228] to-purple-950/60 border border-white/15 text-center space-y-4">
        <h3 className="text-2xl font-black text-white">Ready to Put Strategy into Practice?</h3>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
          Start a Solo practice match against AI bots or invite your dost & yaars for a private online room.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/games/bhabhi/solo"
            onClick={() => soundManager.playSelect()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-xl transition hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Play Solo vs AI</span>
          </Link>
          <Link
            href="/games/bhabhi"
            onClick={() => soundManager.playSelect()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a8e1] hover:bg-[#0094c7] text-white font-extrabold text-sm shadow-xl transition hover:scale-105 active:scale-95"
          >
            <span>Host Custom Room</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <AdBannerSlot slotId="how-to-play-leaderboard" format="leaderboard" />
    </div>
  );
}
