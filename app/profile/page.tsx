'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Tv,
  Check,
  Edit2,
  Trophy,
  Flame,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';
import {
  coderTusharAuth,
  AuthState,
  getCoderTusharBaseUrl,
} from '@/lib/auth/codertushar-auth';
import { AuthModal } from '@/components/auth/AuthModal';

const AVATAR_OPTIONS = [
  '😎', '🤠', '🧙‍♂️', '🦊', '🦁', '👑', '🚀', '🐼',
  '🥷', '👾', '🐯', '🦄', '⚡', '💎', '🎲', '🎯', '🃏', '🔥'
];

export default function ProfilePage() {
  const [authState, setAuthState] = useState<AuthState>(coderTusharAuth.getState());
  const [playerName, setPlayerName] = useState('Yaar_9410');
  const [playerAvatar, setPlayerAvatar] = useState('😎');
  const [savedToast, setSavedToast] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsub = coderTusharAuth.subscribe((st) => {
      setAuthState(st);
      if (st.user?.displayName) {
        setPlayerName(st.user.displayName);
      }
      if (st.user?.avatar) {
        setPlayerAvatar(st.user.avatar);
      }
    });
    return unsub;
  }, []);

  const handleSave = () => {
    soundManager.playSelect();
    coderTusharAuth.updateGuestProfile(playerName.trim() || 'Player', playerAvatar);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const gamesPlayed = authState.stats.gamesPlayed;
  const wins = authState.stats.wins;
  const winRate = authState.stats.winRate;
  const baseUrl = getCoderTusharBaseUrl();

  return (
    <div className="w-full bg-[#00050d] text-white select-none pt-24 sm:pt-28 pb-16">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-10">
        {/* Prime Video "Who's Watching?" Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#00a8e1]/20 text-cyan-300 font-extrabold text-[11px] uppercase tracking-wider border border-[#00a8e1]/30">
            <Tv className="w-3.5 h-3.5 text-[#00a8e1]" />
            <span>THE YAARI PROFILES &amp; IDENTITY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Who&apos;s Playing?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Manage your player display name, connect your CoderTushar account, and view your stats.
          </p>
        </div>

        {/* Profile Card & Avatar Tile */}
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl bg-[#091122] border border-white/10 shadow-2xl space-y-8 text-left">
          {/* CoderTushar Account Connection Banner */}
          {authState.isAuthenticated ? (
            <div className="p-4 rounded-xl bg-black/50 border border-[#00a8e1]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#00a8e1] text-black font-black flex items-center justify-center text-xs">
                  CT
                </span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Connected to CoderTushar Account</span>
                    <span className="w-2 h-2 rounded-full bg-[#00a8e1]" />
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Logged in as <strong>{authState.user.email || authState.user.username}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`${baseUrl}/dashboard`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition border border-white/10"
                >
                  <span>Dashboard</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>

                <button
                  onClick={() => coderTusharAuth.logout()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition border border-rose-500/30"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c1833] to-[#091122] border border-[#00a8e1]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00a8e1]" />
                  <span>Use your CoderTushar.in Account</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Sign in once to sync stats, achievements, and player identity across codertushar.in.
                </p>
              </div>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] text-white text-xs font-black shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Sign In with CoderTushar
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
            {/* Avatar Tile */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] p-1 shrink-0 shadow-2xl shadow-cyan-950/60">
              <div className="w-full h-full bg-[#050813] rounded-xl flex items-center justify-center text-5xl">
                {playerAvatar.length <= 4 ? (
                  <span>{playerAvatar}</span>
                ) : (
                  <img
                    src={playerAvatar}
                    alt={playerName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2 flex-1 text-center sm:text-left w-full">
              <div className="text-xs text-[#00a8e1] font-bold uppercase tracking-wider">
                Profile Display Name
              </div>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                placeholder="Enter your name"
                className="text-2xl sm:text-3xl font-black text-white bg-black/50 border border-white/15 focus:border-[#00a8e1] rounded-xl px-4 py-2 w-full focus:outline-none"
              />
              <p className="text-xs text-zinc-400">
                Visible to friends and peers in live multiplayer party rooms.
              </p>
            </div>
          </div>

          {/* Choose Avatar Grid */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2.5">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    soundManager.playTap();
                    setPlayerAvatar(emoji);
                  }}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl transition cursor-pointer ${
                    playerAvatar === emoji
                      ? 'bg-[#00a8e1]/30 border-2 border-[#00a8e1] scale-110 shadow-lg shadow-cyan-950/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Player Statistics Strip */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Escape Statistics &amp; Record
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Games Played
                </span>
                <div className="text-xl sm:text-2xl font-black text-white">{gamesPlayed}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Win Rate
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">{winRate}%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Wins
                </span>
                <div className="text-xl sm:text-2xl font-black text-amber-400">
                  {wins}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Rating (MMR)
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#00a8e1]">
                  {authState.stats.rating || 1200}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-bold text-zinc-400 hover:text-white transition"
            >
              Back to Home
            </Link>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] text-white font-bold text-sm shadow-xl transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>

        {/* Save Toast */}
        {savedToast && (
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs shadow-2xl animate-bounce">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Profile saved successfully!</span>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
