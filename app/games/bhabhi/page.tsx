'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Settings,
  Sparkles,
  Crown,
  Edit2,
  Check,
  Bot,
  Radio,
  Play,
  Plus,
  Hash,
  X,
  Users,
  Clock,
  User,
  Tv,
  TrendingUp,
  Shield,
  Volume2,
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';
import {
  SmartAssetImage,
  SoloRobotIllustration,
  OnlineMultiplayerIllustration,
  EntryCardsAndChipsIllustration,
  EntryPurpleCardsIllustration,
} from '@/components/illustrations/GameIllustrations';
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 space-y-8 select-none">
      {/* Prime Video Back Navigation Strip */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>The Yaari Stream</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-black text-sm">🃏</span>
          <span className="font-extrabold text-sm text-white">Bhabhi</span>
          <span className="text-xs text-zinc-400 font-semibold">(Get Away)</span>
        </div>

        <button
          onClick={() => {
            soundManager.playSelect();
            setIsRulesModalOpen(true);
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Rules Guide</span>
        </button>
      </div>

      {/* =========================================================================
          PRIME VIDEO STYLE MOVIE/SHOW HERO DETAIL BILLBOARD
          ========================================================================= */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] min-h-[420px] sm:min-h-[480px] flex items-end bg-[#050811] p-6 sm:p-10 lg:p-12">
        {/* Full-Bleed 3D Backdrop Artwork */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
          <img
            src="/assets/home/card-bhabhi.png"
            alt="Bhabhi Get Away Artwork"
            className="w-full h-full object-cover object-center sm:object-right scale-100"
          />
          {/* Prime Video Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030610] via-[#030610]/90 via-55% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030610] via-[#030610]/70 via-30% to-transparent" />
          {/* Ambient Pink Glow */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[450px] h-[400px] bg-pink-600/20 blur-[130px] rounded-full pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full space-y-4 max-w-2xl text-left">
          {/* Meta Tags */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-extrabold text-[11px] uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE YAARI ORIGINAL</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>#1 IN CARD GAMES</span>
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-300 font-semibold">South Asian Card Classic</span>
          </div>

          {/* Title with Logo Box */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-black/80 border-2 border-pink-500/60 p-1 shrink-0 shadow-2xl shadow-pink-950/60">
              <img
                src="/assets/home/card-bhabhi.png"
                alt="Bhabhi Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="text-xs font-black text-pink-400 uppercase tracking-widest">
                <span>♠ EVASION CLASSIC</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Bhabhi</span> <span className="text-pink-400 text-2xl sm:text-4xl">(Get Away)</span>
              </h1>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
            Clear your cards as fast as possible by following lead suits. If a player fails to follow suit,
            a high-stakes <strong>&quot;Thulla&quot;</strong> penalty is triggered and the highest card holder picks up the
            pile! The last remaining player is crowned the Bhabhi.
          </p>

          {/* Player Identity Pill */}
          <div className="flex items-center gap-3 pt-1">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0a0e1c] border border-white/10 text-xs">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-[11px] font-bold text-white">
                {playerName.charAt(0).toUpperCase()}
              </span>
              {!isEditingName ? (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Playing as</span>
                  <strong className="text-white font-bold">{playerName}</strong>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-cyan-400 hover:text-cyan-300 p-0.5 cursor-pointer"
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
                    className="bg-black/60 border border-cyan-400 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded bg-cyan-500 text-black font-bold text-[10px] cursor-pointer"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Prime Video Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Big White Button */}
            <Link
              href="/games/bhabhi/solo"
              onClick={() => soundManager.playSelect()}
              className="flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm sm:text-base shadow-2xl shadow-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Play Solo vs AI</span>
            </Link>

            {/* Big Blue CTA (Host Custom Room) */}
            <button
              onClick={handleCreateRoom}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a8e1] hover:bg-[#0094c7] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
              className="px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/90 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition hover:scale-105 cursor-pointer flex items-center gap-1.5"
            >
              <Hash className="w-4 h-4 text-cyan-400" />
              <span>Join with Code</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EPISODES / GAME MODES SECTION (Prime Video Style)
          ========================================================================= */}
      <section className="w-full space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Select Game Mode &amp; Channel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Episode 1: Solo vs Smart AI Bots */}
          <Link
            href="/games/bhabhi/solo"
            onClick={() => soundManager.playSelect()}
            className="group p-6 sm:p-7 rounded-3xl bg-[#070b18] border-2 border-emerald-500/40 hover:border-emerald-400 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" /> EPISODE 1 • SINGLE PLAYER
                </span>
                <span className="text-xs text-zinc-400 font-semibold">Offline Ready</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-white group-hover:text-emerald-300 transition">
                    Solo vs AI Bots
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Play against smart AI personalities (Kabir, Simran, Arjun). Practice your Thulla evasion tactics at your own pace.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-black/60 border border-emerald-500/40 p-1 shrink-0">
                  <img
                    src="/assets/bhabhi/solo-robot.png"
                    alt="AI Bot"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-zinc-400 flex items-center gap-3 font-semibold">
                <span>👥 1 Human + 3 Bots</span>
                <span>⏱️ Instant Start</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span>Launch Solo</span>
                <Play className="w-3.5 h-3.5 fill-emerald-400" />
              </div>
            </div>
          </Link>

          {/* Episode 2: Custom Online Multiplayer Room */}
          <div
            onClick={handleCreateRoom}
            className="group p-6 sm:p-7 rounded-3xl bg-[#070b18] border-2 border-cyan-500/40 hover:border-cyan-400 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between space-y-5 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" /> EPISODE 2 • LIVE ROOM
                </span>
                <span className="text-xs text-zinc-400 font-semibold">3 - 6 Players</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition">
                    Host Private Room
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Create a private room, share a 6-letter room code with friends, and play in real time with audio commentary.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-black/60 border border-cyan-500/40 p-1 shrink-0">
                  <img
                    src="/assets/bhabhi/online-globe.png"
                    alt="Multiplayer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-zinc-400 flex items-center gap-3 font-semibold">
                <span>🌐 WebRTC P2P</span>
                <span>🔒 Private Lobby</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <span>Create Room</span>
                <Play className="w-3.5 h-3.5 fill-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner Slot */}
      <AdBannerSlot slotId="bhabhi-entry-leaderboard" format="leaderboard" />

      {/* Join Room Code Modal */}
      {isJoinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsJoinModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-[#090d1a] border border-white/20 p-6 sm:p-8 space-y-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <Hash className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Enter Room Code</h3>
              <p className="text-xs text-zinc-400">
                Enter the 6-letter room code shared by your friend
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
                    className="w-11 h-14 text-center text-xl font-black text-white bg-black/60 border-2 border-white/20 focus:border-cyan-400 rounded-xl focus:outline-none uppercase"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={codeBoxes.join('').trim().length < 4}
                className="w-full py-3.5 rounded-xl bg-[#00a8e1] hover:bg-[#0094c7] disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-cyan-950/40 transition cursor-pointer"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsRulesModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl bg-[#090d1a] border border-white/20 p-6 sm:p-8 space-y-5 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
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
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
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
