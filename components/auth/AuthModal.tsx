'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  Sparkles,
  ExternalLink,
  Check,
  LogOut,
  RefreshCw,
  Trophy,
  Tv,
} from 'lucide-react';
import {
  coderTusharAuth,
  AuthState,
  getCoderTusharBaseUrl,
} from '@/lib/auth/codertushar-auth';
import { soundManager } from '@/lib/audio/sound-effects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authState, setAuthState] = useState<AuthState>(coderTusharAuth.getState());
  const [guestName, setGuestName] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const unsub = coderTusharAuth.subscribe((st) => {
      setAuthState(st);
      if (st.user?.displayName) {
        setGuestName(st.user.displayName);
      }
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleCoderTusharLogin = () => {
    soundManager.playSelect();
    coderTusharAuth.loginWithCoderTushar();
  };

  const handleCoderTusharSignup = () => {
    soundManager.playSelect();
    coderTusharAuth.signupWithCoderTushar();
  };

  const handleCheckSync = async () => {
    soundManager.playSelect();
    setIsChecking(true);
    await coderTusharAuth.checkLiveSession();
    setIsChecking(false);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    soundManager.playSelect();
    coderTusharAuth.updateGuestProfile(guestName.trim());
    onClose();
  };

  const handleLogout = () => {
    soundManager.playSelect();
    coderTusharAuth.logout();
  };

  const baseUrl = getCoderTusharBaseUrl();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-left"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#091122] border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prime Video Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a8e1]" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              {authState.isAuthenticated ? 'CoderTushar Account' : 'Player Account & Sign In'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card: Logged in vs Guest */}
        {authState.isAuthenticated ? (
          <div className="space-y-5">
            {/* User Profile Card */}
            <div className="p-4 rounded-xl bg-black/50 border border-[#00a8e1]/40 flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#00a8e1] shrink-0 bg-zinc-800">
                <img
                  src={authState.user.avatar}
                  alt={authState.user.displayName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white truncate">
                    {authState.user.displayName}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#00a8e1]/20 text-[#00a8e1] text-[10px] font-black border border-[#00a8e1]/30">
                    CODERTUSHAR
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">
                  {authState.user.email || `@${authState.user.username}`}
                </p>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Cloud Profile Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="text-lg font-black text-white">{authState.stats.gamesPlayed}</div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Games</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="text-lg font-black text-emerald-400">{authState.stats.winRate}%</div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Win Rate</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="text-lg font-black text-amber-400">
                  {authState.stats.rating || 1200}
                </div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Rating</div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={`${baseUrl}/dashboard`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-[#00a8e1] hover:underline"
              >
                <span>CoderTushar Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-rose-300 text-xs font-bold transition border border-rose-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch to Guest</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connect CoderTushar Account Option */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c1833] to-[#091122] border border-[#00a8e1]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#00a8e1] text-black font-black text-xs flex items-center justify-center">
                    CT
                  </span>
                  <span className="font-bold text-sm text-white">CoderTushar Account</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RECOMMENDED
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                Use your official <strong>CoderTushar.in</strong> credentials. Sync match records, achievements, ELO ratings, and play seamlessly across all subdomains.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  onClick={handleCoderTusharLogin}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] text-white text-xs font-black shadow-lg shadow-cyan-950/50 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign In with CoderTushar</span>
                </button>

                <button
                  onClick={handleCoderTusharSignup}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-md bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-bold transition border border-white/10 cursor-pointer whitespace-nowrap"
                >
                  Create Account
                </button>
              </div>

              {/* Quick Sync Verification check */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Already logged into codertushar.in?</span>
                <button
                  onClick={handleCheckSync}
                  disabled={isChecking}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>Detect Session</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                OR PLAY AS GUEST
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {/* Quick Guest Name Form */}
            <form onSubmit={handleSaveGuest} className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Guest Player Name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={guestName}
                    maxLength={16}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Yaar_9410"
                    className="flex-1 bg-black/60 border border-white/20 rounded-md px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00a8e1]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500">
                Guest accounts are saved locally on this device. You can upgrade to a CoderTushar account anytime without losing your active room.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
