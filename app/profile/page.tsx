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
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';

const AVATAR_OPTIONS = [
  '😎', '🤠', '🧙‍♂️', '🦊', '🦁', '👑', '🚀', '🐼',
  '🥷', '👾', '🐯', '🦄', '⚡', '💎', '🎲', '🎯', '🃏', '🔥'
];

interface PlayerStats {
  gamesPlayed: number;
  gamesEscaped: number;
  rank1Escapes: number;
  bhabhiCount: number;
}

export default function ProfilePage() {
  const [playerName, setPlayerName] = useState('Yaar_9410');
  const [playerAvatar, setPlayerAvatar] = useState('😎');
  const [favoritePersonality, setFavoritePersonality] = useState('desi_host');
  const [stats, setStats] = useState<PlayerStats>({
    gamesPlayed: 14,
    gamesEscaped: 12,
    rank1Escapes: 7,
    bhabhiCount: 2,
  });
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName =
        localStorage.getItem('theyaari_player_name') || localStorage.getItem('gameshub_player_name');
      const storedAvatar =
        localStorage.getItem('theyaari_player_avatar') || localStorage.getItem('gameshub_player_avatar');
      const storedPersonality =
        localStorage.getItem('theyaari_fav_dealer') || localStorage.getItem('gameshub_fav_dealer');
      const storedStats =
        localStorage.getItem('theyaari_player_stats') || localStorage.getItem('gameshub_player_stats');

      if (storedName) setPlayerName(storedName);
      if (storedAvatar) setPlayerAvatar(storedAvatar);
      if (storedPersonality) setFavoritePersonality(storedPersonality);
      if (storedStats) {
        try {
          setStats(JSON.parse(storedStats));
        } catch (e) {}
      }
    }
  }, []);

  const handleSave = () => {
    soundManager.playSelect();
    try {
      localStorage.setItem('theyaari_player_name', playerName.trim() || 'Player');
      localStorage.setItem('theyaari_player_avatar', playerAvatar);
      localStorage.setItem('theyaari_fav_dealer', favoritePersonality);
      localStorage.setItem('gameshub_player_name', playerName.trim() || 'Player');
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    } catch (e) {}
  };

  const escapeRate =
    stats.gamesPlayed > 0 ? Math.round((stats.gamesEscaped / stats.gamesPlayed) * 100) : 0;

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
            Manage your player display name, choose your favorite avatar, and view your escape record.
          </p>
        </div>

        {/* Profile Card & Avatar Tile */}
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl bg-[#091122] border border-white/10 shadow-2xl space-y-8 text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
            {/* Avatar Tile */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] p-1 shrink-0 shadow-2xl shadow-cyan-950/60">
              <div className="w-full h-full bg-[#050813] rounded-xl flex items-center justify-center text-5xl">
                {playerAvatar}
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
                <div className="text-xl sm:text-2xl font-black text-white">{stats.gamesPlayed}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Escape Rate
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">{escapeRate}%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Rank 1 Escapes
                </span>
                <div className="text-xl sm:text-2xl font-black text-amber-400">
                  {stats.rank1Escapes}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Bhabhi Count
                </span>
                <div className="text-xl sm:text-2xl font-black text-rose-400">
                  {stats.bhabhiCount}
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
              Cancel
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
    </div>
  );
}
