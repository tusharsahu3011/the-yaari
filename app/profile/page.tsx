'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Crown,
  Trophy,
  Flame,
  CheckCircle2,
  Shield,
  Sparkles,
  Save,
  RotateCcw,
  Gamepad2,
  ArrowRight,
  Tv,
  Check,
  Edit2,
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 space-y-8 select-none text-left">
      {/* Prime Video "Who's Watching?" Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[11px] uppercase tracking-wider border border-cyan-500/30">
          <Tv className="w-3.5 h-3.5 text-cyan-400" />
          <span>THE YAARI ACCOUNT &amp; PROFILES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Who&apos;s Playing?
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Manage your player identity, select your favorite avatar, and view your escape record.
        </p>
      </div>

      {/* Profile Card & Avatar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#070b18] border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
          {/* Avatar Icon */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-1 shrink-0 shadow-2xl shadow-cyan-950/60">
            <div className="w-full h-full bg-[#050813] rounded-full flex items-center justify-center text-5xl">
              {playerAvatar}
            </div>
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
              Profile Display Name
            </div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              placeholder="Enter your name"
              className="text-2xl sm:text-3xl font-black text-white bg-black/50 border border-white/15 focus:border-cyan-400 rounded-2xl px-4 py-2 w-full focus:outline-none"
            />
            <p className="text-xs text-zinc-400">
              Visible to all friends in private multiplayer rooms.
            </p>
          </div>
        </div>

        {/* Choose Avatar Grid */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Choose Your Avatar
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2.5">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  soundManager.playTap();
                  setPlayerAvatar(emoji);
                }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition cursor-pointer ${
                  playerAvatar === emoji
                    ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110 shadow-lg shadow-cyan-950/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {savedToast ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
            </span>
          ) : (
            <span className="text-xs text-zinc-500">Auto-stored locally</span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00a8e1] hover:bg-[#0094c7] text-white font-black text-xs shadow-lg shadow-cyan-950/40 transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Lifetime Stats (Prime Video Stats Dashboard) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#070b18] border border-white/10 space-y-1">
          <span className="text-xs text-zinc-400 font-semibold">Games Played</span>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.gamesPlayed}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070b18] border border-white/10 space-y-1">
          <span className="text-xs text-emerald-400 font-semibold">Escape Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{escapeRate}%</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070b18] border border-white/10 space-y-1">
          <span className="text-xs text-amber-400 font-semibold">Rank #1 Escapes</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.rank1Escapes}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070b18] border border-white/10 space-y-1">
          <span className="text-xs text-rose-400 font-semibold">Crowned Bhabhi</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">{stats.bhabhiCount}</div>
        </div>
      </div>
    </div>
  );
}
