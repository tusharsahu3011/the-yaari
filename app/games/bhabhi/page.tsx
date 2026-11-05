'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Bot,
  Radio,
  Play,
  Plus,
  Hash,
  X,
  Users,
  Clock,
  Tv,
  TrendingUp,
  Shield,
  Check,
  Edit2,
  Info,
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';
import { AdBannerSlot } from '@/components/ads/AdBannerSlot';

export default function BhabhiGameEntryPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('Yaar_9410');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // 6-box room code input
  const [codeBoxes, setCodeBoxes] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('theyaari_player_name') || localStorage.getItem('gameshub_player_name');
      if (saved) {
        setPlayerName(saved);
        setNameInput(saved);
      } else {
        const autoName = `Yaar_${Math.floor(1000 + Math.random() * 9000)}`;
        setPlayerName(autoName);
        setNameInput(autoName);
        localStorage.setItem('theyaari_player_name', autoName);
      }
    } catch (e) {}
  }, []);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    soundManager.playSelect();
    setPlayerName(nameInput.trim());
    setIsEditingName(false);
    try {
      localStorage.setItem('theyaari_player_name', nameInput.trim());
      localStorage.setItem('gameshub_player_name', nameInput.trim());
    } catch (e) {}
  };

  const handleCreateRoom = () => {
    soundManager.playDramaticBoom();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    router.push(`/games/bhabhi/room/${code}`);
  };

  const handleCodeBoxChange = (idx: number, val: string) => {
    const char = val.toUpperCase().slice(-1);
    const newBoxes = [...codeBoxes];
    newBoxes[idx] = char;
    setCodeBoxes(newBoxes);

    if (char && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleCodeBoxKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeBoxes[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeBoxes.join('').trim().toUpperCase();
    if (fullCode.length >= 4) {
      soundManager.playSelect();
      router.push(`/games/bhabhi/room/${fullCode}`);
    }
  };

  return (
    <div className="w-full bg-[#00050d] text-white select-none">
      {/* =========================================================================
          1. CINEMATIC DETAIL HERO BILLBOARD (Prime Video Movie/Series Page)
          ========================================================================= */}
      <section className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-end overflow-hidden group bg-[#00050d] pt-20">
        {/* Full-Bleed 16:9 Widescreen Backdrop */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
          <img
            src="/assets/home/hero-bhabhi-wide.png"
            alt="Bhabhi Get Away Artwork"
            className="w-full h-full object-cover object-center lg:object-right scale-100"
          />
          {/* Prime Video Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00050d] via-[#00050d]/85 via-50% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00050d] via-[#00050d]/60 via-20% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00050d]/90 via-transparent to-transparent h-24" />

          {/* Ambient Glow */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-[550px] h-[450px] bg-pink-600/20 blur-[150px] rounded-full pointer-events-none" />
        </div>

        {/* Hero Content Area */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pb-12 sm:pb-16 text-left space-y-4">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to The Yaari Home</span>
          </Link>

          {/* Network Tag (Like 'TY' with smile curve) */}
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
              <span>TY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a8e1]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              ORIGINAL GAME
            </span>
          </div>

          {/* Game Title */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl text-amber-400 font-serif">◈</span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase drop-shadow-2xl">
                Bhabhi (Get Away)
              </h1>
              <span className="text-xl sm:text-2xl text-amber-400 font-serif">◈</span>
            </div>

            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-black uppercase tracking-wider text-zinc-300">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                ROYAL DESI CLASSIC
              </span>
              <span className="text-zinc-500">•</span>
              <span>3 - 6 PLAYERS</span>
              <span className="text-zinc-500">•</span>
              <span>10 - 15 MIN</span>
              <span className="text-zinc-500">•</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white">ALL AGES</span>
            </div>
          </div>

          {/* Trending Rank Tag */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00d47b] bg-[#00d47b]/15 border border-[#00d47b]/30 px-2.5 py-0.5 rounded-full">
              <span className="w-4 h-4 rounded-full bg-[#00d47b]/30 flex items-center justify-center text-[11px] font-black">
                ↗
              </span>
              <span>#2 in India Today</span>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl font-normal">
            The legendary South Asian card evasion game! Clear your hand as fast as possible by following lead suits.
            If a player cannot follow suit, a high-stakes <strong>&quot;Thulla&quot;</strong> penalty is triggered and the highest card holder
            must pick up the entire discard pile! Clear all cards to escape — the last remaining player is crowned the Bhabhi.
          </p>

          {/* Player Identity Strip */}
          <div className="flex items-center gap-3 pt-1">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#091122] border border-white/15 text-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] text-[10px] font-bold text-white">
                {playerName.charAt(0).toUpperCase()}
              </span>
              {!isEditingName ? (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Playing as</span>
                  <strong className="text-white font-bold">{playerName}</strong>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-[#00a8e1] hover:underline p-0.5 cursor-pointer"
                    title="Change username"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={18}
                    className="bg-black/60 border border-[#00a8e1] rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded bg-[#00a8e1] text-white font-bold text-[10px] cursor-pointer"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Big White Button: Solo Mode */}
            <Link
              href="/games/bhabhi/solo"
              onClick={() => soundManager.playSelect()}
              className="flex items-center gap-2.5 px-7 py-3 rounded-md bg-white hover:bg-zinc-200 text-black font-black text-sm shadow-2xl transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Play Solo vs AI</span>
            </Link>

            {/* Blue CTA: Create Multiplayer Room */}
            <button
              onClick={handleCreateRoom}
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] text-white font-black text-sm shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Create Private Room</span>
            </button>

            {/* Join with Code Button */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setIsJoinModalOpen(true);
              }}
              className="px-5 py-3 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-white/30 text-white font-bold text-sm backdrop-blur-md transition hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Hash className="w-4 h-4 text-[#00a8e1]" />
              <span>Join with Code</span>
            </button>

            {/* Rules Button */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setIsRulesModalOpen(true);
              }}
              className="w-11 h-11 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/30 text-white flex items-center justify-center transition hover:scale-110 cursor-pointer"
              title="Rules Guide"
            >
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. GAME MODES & CHANNELS (Prime Video Episode Card Format)
          ========================================================================= */}
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-10 space-y-12 text-left">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Select Game Mode
            </h2>
            <span className="text-xs text-zinc-400 font-medium">Free To Play • No Downloads</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode 1: Solo vs Smart AI Bots */}
            <Link
              href="/games/bhabhi/solo"
              onClick={() => soundManager.playSelect()}
              className="group p-6 sm:p-7 rounded-xl bg-[#091122] border border-white/10 hover:border-emerald-400 transition-all duration-300 shadow-xl hover:scale-[1.02] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    <span>SINGLE PLAYER</span>
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">Instant Start</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition">
                      Solo vs AI Bots
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      Play against intelligent AI bot personalities (Kabir, Simran, Arjun) with witty desi commentary.
                      Perfect for practicing your Thulla timing and escape strategies.
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-black/60 border border-white/10 p-1 shrink-0 overflow-hidden">
                    <img
                      src="/assets/bhabhi/solo-robot.png"
                      alt="AI Bot"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-semibold">
                <span>👥 1 Human + 3 Bots</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span>Launch Match</span>
                  <Play className="w-3.5 h-3.5 fill-emerald-400" />
                </span>
              </div>
            </Link>

            {/* Mode 2: Custom Online Multiplayer Room */}
            <div
              onClick={handleCreateRoom}
              className="group p-6 sm:p-7 rounded-xl bg-[#091122] border border-white/10 hover:border-[#00a8e1] transition-all duration-300 shadow-xl hover:scale-[1.02] flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-sm bg-[#00a8e1]/20 text-cyan-300 font-bold border border-[#00a8e1]/30 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    <span>MULTIPLAYER LIVE ROOM</span>
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">3 - 6 Players</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                      Host Private Room
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      Create an encrypted private room, share a 6-letter room code with friends, and enjoy real-time card plays with audio effects.
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-black/60 border border-white/10 p-1 shrink-0 overflow-hidden">
                    <img
                      src="/assets/bhabhi/online-globe.png"
                      alt="Multiplayer"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-semibold">
                <span>🌐 Serverless Sync</span>
                <span className="text-[#00a8e1] flex items-center gap-1 font-bold">
                  <span>Create Table</span>
                  <Play className="w-3.5 h-3.5 fill-[#00a8e1]" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placement */}
        <AdBannerSlot slotId="bhabhi-entry-leaderboard" format="leaderboard" />

        {/* =========================================================================
            3. MORE TITLES YOU'LL LOVE (16:9 Carousel Row)
            ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              More Titles You&apos;ll Love
            </h2>
            <Link href="/games" className="text-xs font-bold text-[#00a8e1] hover:underline">
              See more
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/games/undercover"
              className="group aspect-[16/9] rounded-lg overflow-hidden bg-[#070b18] border border-white/10 hover:border-white/40 transition-all duration-300 relative shadow-xl hover:scale-[1.03]"
            >
              <img
                src="/assets/home/hero-undercover-wide.png"
                alt="Undercover"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-white text-black">
                  NEW EPISODE
                </span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  Undercover
                </h4>
                <p className="text-[10px] text-zinc-400">Social Deduction • 3-20 Players</p>
              </div>
            </Link>

            <Link
              href="/games/spyfall"
              className="group aspect-[16/9] rounded-lg overflow-hidden bg-[#070b18] border border-white/10 hover:border-white/40 transition-all duration-300 relative shadow-xl hover:scale-[1.03]"
            >
              <img
                src="/assets/home/hero-spyfall-wide.png"
                alt="Spyfall"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-white text-black">
                  TOP SUSPENSE
                </span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  Spyfall
                </h4>
                <p className="text-[10px] text-zinc-400">Interrogation • 3-12 Players</p>
              </div>
            </Link>

            <Link
              href="/games"
              className="group aspect-[16/9] rounded-lg overflow-hidden bg-[#070b18] border border-white/10 hover:border-white/40 transition-all duration-300 relative shadow-xl hover:scale-[1.03]"
            >
              <img
                src="/assets/home/icon-teenpatti.png"
                alt="Teen Patti Flush"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-white text-black">
                  NEW SERIES
                </span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  Teen Patti Flush
                </h4>
                <p className="text-[10px] text-zinc-400">Card Classic • In Pipeline</p>
              </div>
            </Link>

            <Link
              href="/games"
              className="group aspect-[16/9] rounded-lg overflow-hidden bg-[#070b18] border border-white/10 hover:border-white/40 transition-all duration-300 relative shadow-xl hover:scale-[1.03]"
            >
              <img
                src="/assets/home/icon-codenames.png"
                alt="Codenames"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-white text-black">
                  PARTY HIT
                </span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  Codenames
                </h4>
                <p className="text-[10px] text-zinc-400">Word Association • 4-12 Players</p>
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* Join Room Code Modal */}
      {isJoinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsJoinModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-xl bg-[#091122] border border-white/20 p-6 sm:p-8 space-y-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#00a8e1]/20 border border-[#00a8e1]/30 text-[#00a8e1] flex items-center justify-center mx-auto">
                <Hash className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Enter Room Code</h3>
              <p className="text-xs text-zinc-400">
                Enter the 6-letter room code shared by your friend to join the table.
              </p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-5">
              <div className="flex justify-center gap-2">
                {codeBoxes.map((box, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={box}
                    onChange={(e) => handleCodeBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleCodeBoxKeyDown(idx, e)}
                    className="w-11 h-14 text-center text-xl font-black text-white bg-black/60 border border-white/20 focus:border-[#00a8e1] rounded-lg focus:outline-none uppercase"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={codeBoxes.join('').trim().length < 4}
                className="w-full py-3 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] disabled:opacity-50 text-white font-bold text-sm shadow-xl transition cursor-pointer"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rules Guide Modal */}
      {isRulesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsRulesModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-xl bg-[#091122] border border-white/20 p-6 sm:p-8 space-y-5 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00a8e1]" />
                <span>Bhabhi Rules &amp; Strategy</span>
              </h3>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p>
                <strong>1. The Objective:</strong> You want to clear your hand as quickly as possible. The last remaining player with cards is crowned the Bhabhi (loser).
              </p>
              <p>
                <strong>2. The Opening Lead:</strong> The player holding the Ace of Spades (A♠) must lead it on the very first trick of the round.
              </p>
              <p>
                <strong>3. Following Suit:</strong> All players must follow the lead suit if they hold any card of that suit.
              </p>
              <p>
                <strong>4. The Thulla Penalty:</strong> If a player does NOT have any card of the lead suit, they can play any other card (a &quot;Thulla&quot;). The player who played the highest card of the original lead suit must pick up the entire discard pile!
              </p>
              <p>
                <strong>5. Escape:</strong> Once all your cards are played, you escape safely!
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
