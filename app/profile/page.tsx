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
} from 'lucide-react';

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
  const [playerName, setPlayerName] = useState('Guest Player');
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
      const storedName = localStorage.getItem('gameshub_player_name');
      const storedAvatar = localStorage.getItem('gameshub_player_avatar');
      const storedPersonality = localStorage.getItem('gameshub_fav_dealer');
      const storedStats = localStorage.getItem('gameshub_player_stats');

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('gameshub_player_name', playerName.trim() || 'Player');
      localStorage.setItem('gameshub_player_avatar', playerAvatar);
      localStorage.setItem('gameshub_fav_dealer', favoritePersonality);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    }
  };

  const escapeRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesEscaped / stats.gamesPlayed) * 100)
      : 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-20 z-50 px-5 py-2.5 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Profile updated successfully!
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Player Profile & Stats
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Personalize your gaming identity across solo games and multiplayer rooms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Left Column: Avatar & Profile Card (1 col) */}
        <div className="md:col-span-1 flex flex-col items-center p-6 rounded-3xl bg-[#121626] border border-white/10 text-center space-y-4 shadow-xl">
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-5xl shadow-lg shadow-purple-900/40 border-2 border-white/20">
            {playerAvatar}
            <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider">
              Level 3
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">{playerName}</h2>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-300 text-[11px] font-semibold border border-purple-500/30">
              ⚡ Escape Artist
            </span>
          </div>

          <div className="w-full pt-4 border-t border-white/5 space-y-2 text-xs text-left">
            <div className="flex justify-between text-gray-400">
              <span>Account Type:</span>
              <span className="text-emerald-400 font-bold">Guest (Local)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Escape Rate:</span>
              <span className="text-white font-bold">{escapeRate}%</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Preferred Dealer:</span>
              <span className="text-purple-300 font-semibold capitalize">
                {favoritePersonality.replace('_', ' ')}
              </span>
            </div>
          </div>

          <Link
            href="/games/bhabhi/solo"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:brightness-110 transition"
          >
            <Gamepad2 className="w-4 h-4" />
            Jump into Solo Match
          </Link>
        </div>

        {/* Right Column: Customization & Statistics (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#121626] border border-white/10 flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">
                Matches
              </span>
              <span className="text-2xl font-black text-white mt-1">
                {stats.gamesPlayed}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121626] border border-emerald-500/30 flex flex-col">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                Escaped Safe
              </span>
              <span className="text-2xl font-black text-emerald-300 mt-1">
                {stats.gamesEscaped}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121626] border border-amber-500/30 flex flex-col">
              <span className="text-[10px] text-amber-400 uppercase font-semibold">
                #1 First Escape
              </span>
              <span className="text-2xl font-black text-amber-300 mt-1">
                {stats.rank1Escapes}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121626] border border-rose-500/30 flex flex-col">
              <span className="text-[10px] text-rose-400 uppercase font-semibold">
                Bhabhi (Losses)
              </span>
              <span className="text-2xl font-black text-rose-300 mt-1">
                {stats.bhabhiCount}
              </span>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form
            onSubmit={handleSave}
            className="p-6 rounded-3xl bg-[#121626] border border-white/10 space-y-5 text-left shadow-xl"
          >
            <h3 className="font-extrabold text-base text-white">Edit Your Identity</h3>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Display Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">
                Choose Avatar
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setPlayerAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${
                      playerAvatar === av
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-110 shadow-md shadow-purple-800/50'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorite Dealer Personality */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Default AI Dealer Personality
              </label>
              <select
                value={favoritePersonality}
                onChange={(e) => setFavoritePersonality(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                <option value="desi_host">👳‍♂️ Chacha Chaudhary (Desi Party Host)</option>
                <option value="savage">🕶️ Viper (Savage & Roasting)</option>
                <option value="dramatic">🧙‍♂️ The Grandmaster (Epic & Dramatic)</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
