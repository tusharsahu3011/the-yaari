'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { soundManager } from '@/lib/audio/sound-effects';
import {
  Gamepad2,
  Search,
  User,
  ChevronDown,
  Edit2,
  Check,
  X,
  Menu,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Games', href: '/games' },
  { label: 'Card Games', href: '/games/bhabhi' },
  { label: 'Social Bluff', href: '/games/undercover' },
  { label: 'How to Play', href: '/how-to-play' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playerName, setPlayerName] = useState('Guest');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gameshub_player_name');
      if (saved) {
        setPlayerName(saved);
        setNameInput(saved);
      } else {
        const randId = Math.floor(1000 + Math.random() * 9000);
        const autoName = `Dost_${randId}`;
        setPlayerName(autoName);
        setNameInput(autoName);
        localStorage.setItem('gameshub_player_name', autoName);
      }
    } catch { }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const clean = nameInput.trim();
    setPlayerName(clean);
    setIsEditingName(false);
    try {
      localStorage.setItem('gameshub_player_name', clean);
    } catch { }
    soundManager.playSelect();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-8">
      {/* Frosted strip behind the floating bar: covers the bar, fades out below it */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-28 bg-[#030712]/40 backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
        aria-hidden="true"
      />

      {/* Floating Island Glass Pill Bar (Signature Codertushar Style) */}
      <div className="glass relative mx-auto mt-4 sm:mt-5 flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 sm:px-6 shadow-2xl shadow-black/50">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={() => {
            soundManager.playSelect();
            setMobileMenuOpen(false);
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 p-[1.5px] shadow-lg shadow-purple-900/40">
            <div className="w-full h-full bg-[#080b14] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[11px] text-zinc-400 font-normal">Games by</span>
            <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-purple-300 transition-colors">
              Coder Tushar
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation with Animated Origin-Left Underline */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                onClick={() => soundManager.playSelect()}
                className={`group relative text-sm font-semibold transition-colors hover:text-white ${
                  active ? 'text-white' : 'text-zinc-400'
                }`}
              >
                <span>{link.label}</span>
                {/* Underline with small gap: purple/pink gradient when active, zinc on hover */}
                <span
                  className={`absolute -bottom-2 left-0 h-[2px] w-full origin-left transition-transform duration-300 ${
                    active
                      ? 'scale-x-100 bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                      : 'scale-x-0 bg-zinc-500 group-hover:scale-x-100'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Search, Sound, Player Identity, Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button */}
          <Link
            href="/games"
            onClick={() => soundManager.playSelect()}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Search games"
            aria-label="Search games"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Sound Mute / Unmute */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) soundManager.playSelect();
            }}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* Player Identity Pill Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                soundManager.playTap();
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition shadow-sm"
              aria-label="User profile menu"
            >
              {/* Circular Avatar Initial */}
              <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-[11px] font-black text-white shadow-sm">
                {playerName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[85px] sm:max-w-[110px] truncate">{playerName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Profile Dropdown Panel */}
            {isProfileDropdownOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close profile menu"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <div className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#0b1220]/95 p-3 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-zinc-300">Player Identity</span>
                    <button
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="text-zinc-500 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!isEditingName ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-xs font-bold text-white">
                          {playerName.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-white truncate">{playerName}</span>
                      </div>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 rounded text-purple-400 hover:text-purple-300 hover:bg-white/10 transition"
                        title="Edit name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        maxLength={18}
                        className="flex-1 bg-black/60 border border-purple-500/60 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  )}

                  <div className="pt-1 border-t border-white/10 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>Multiplayer ready</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white transition-colors md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Mobile Menu (Signature Codertushar Style) */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 -z-10 cursor-default md:hidden"
          />

          <nav className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl border border-white/10 bg-[#0b1220]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl md:hidden animate-in fade-in zoom-in-95">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => {
                    soundManager.playSelect();
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}
