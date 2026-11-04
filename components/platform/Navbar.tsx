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
  Play,
  Sparkles,
} from 'lucide-react';

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Games', href: '/games' },
  { label: 'Card Games', href: '/games?cat=cards' },
  { label: 'Social Bluff', href: '/games?cat=bluff' },
  { label: 'Word Games', href: '/games?cat=words' },
  { label: 'How to Play', href: '/how-to-play' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playerName, setPlayerName] = useState('Yaar_9410');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theyaari_player_name') || localStorage.getItem('gameshub_player_name');
      if (saved) {
        setPlayerName(saved);
        setNameInput(saved);
      } else {
        const randId = Math.floor(1000 + Math.random() * 9000);
        const autoName = `Yaar_${randId}`;
        setPlayerName(autoName);
        setNameInput(autoName);
        localStorage.setItem('theyaari_player_name', autoName);
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
      localStorage.setItem('theyaari_player_name', clean);
      localStorage.setItem('gameshub_player_name', clean);
    } catch { }
    soundManager.playSelect();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.includes('?')) {
      const basePath = href.split('?')[0];
      return pathname === basePath;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-8">
      {/* Frosted strip behind the floating bar: covers the bar, fades out below it */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-28 bg-[#030610]/60 backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
        aria-hidden="true"
      />

      {/* Floating Island Glass Pill Bar (Prime Video OTT Style + Codertushar Glass) */}
      <div className="glass relative mx-auto mt-4 sm:mt-5 flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 sm:px-6 shadow-2xl shadow-black/70 border border-white/10 bg-[#070b18]/85">
        {/* Brand Logo: The Yaari (with Prime Video style smile curve) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group"
          onClick={() => {
            soundManager.playSelect();
            setMobileMenuOpen(false);
          }}
        >
          {/* Logo App Icon */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-950/50 shrink-0">
            <div className="w-full h-full bg-[#050813] rounded-[10px] overflow-hidden flex items-center justify-center p-0.5">
              <img
                src="/assets/brand/the-yaari-icon.png"
                alt="The Yaari Icon"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Gamepad2 className="w-5 h-5 text-cyan-400 absolute group-hover:scale-110 transition-transform hidden [body:has(img[style*='display: none'])_&]:block" />
            </div>
          </div>

          {/* Typography: "the yaari" with Prime Video smile curve */}
          <div className="flex flex-col text-left leading-tight relative">
            <div className="flex items-center gap-1">
              <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                the yaari
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30">
                OTT
              </span>
            </div>

            {/* Glowing cyan smile curve underneath (Prime Video signature) */}
            <svg
              viewBox="0 0 72 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-1.5 -mt-0.5 text-cyan-400"
            >
              <path
                d="M 1 2 Q 36 8 71 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]"
              />
            </svg>
          </div>
        </Link>

        {/* Center Desktop Navigation with Animated Origin-Left Underline */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                onClick={() => soundManager.playSelect()}
                className={`group relative text-xs lg:text-sm font-semibold transition-colors hover:text-white ${
                  active ? 'text-white font-bold' : 'text-zinc-400'
                }`}
              >
                <span>{link.label}</span>
                {/* Underline: cyan/blue gradient when active */}
                <span
                  className={`absolute -bottom-2 left-0 h-[2px] w-full origin-left transition-transform duration-300 ${
                    active
                      ? 'scale-x-100 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : 'scale-x-0 bg-zinc-500 group-hover:scale-x-100'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Search, Sound, Join Room, Profile Pill, Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
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
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* Prime Video Style "Join Room" Button (Matches 'Join Prime') */}
          <Link
            href="/games/bhabhi"
            onClick={() => soundManager.playSelect()}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00a8e1] hover:bg-[#0094c7] text-white text-xs font-black shadow-md shadow-cyan-900/40 transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Join Room</span>
          </Link>

          {/* Player Identity Pill Dropdown ("Who's Playing?") */}
          <div className="relative">
            <button
              onClick={() => {
                soundManager.playTap();
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
              }}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition shadow-sm cursor-pointer"
              aria-label="User profile menu"
            >
              {/* Circular Avatar Initial */}
              <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-[11px] font-black text-white shadow-sm">
                {playerName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[75px] sm:max-w-[100px] truncate">{playerName}</span>
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
                <div className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#090d1a]/95 p-3.5 text-white shadow-2xl shadow-black/80 backdrop-blur-2xl space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-zinc-300">Who&apos;s Playing?</span>
                    <button
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!isEditingName ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-xs font-bold text-white">
                          {playerName.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-white truncate">{playerName}</span>
                      </div>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 rounded text-cyan-400 hover:text-cyan-300 hover:bg-white/10 transition cursor-pointer"
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
                        className="flex-1 bg-black/60 border border-cyan-500/60 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-2.5 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-1 pt-1 border-t border-white/10">
                    <Link
                      href="/profile"
                      onClick={() => {
                        soundManager.playSelect();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition"
                    >
                      <span>Manage Profiles & Stats</span>
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-400 flex items-center justify-between">
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
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white transition-colors md:hidden cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Mobile Menu (Prime Video Style) */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 -z-10 cursor-default md:hidden"
          />

          <nav className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl border border-white/10 bg-[#090d1a]/95 p-3 shadow-2xl shadow-black/80 backdrop-blur-2xl md:hidden animate-in fade-in zoom-in-95">
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
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 mt-1 border-t border-white/10">
              <Link
                href="/games/bhabhi"
                onClick={() => {
                  soundManager.playSelect();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00a8e1] text-white font-black text-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Join Room</span>
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
