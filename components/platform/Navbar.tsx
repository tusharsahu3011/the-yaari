'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { soundManager } from '@/lib/audio/sound-effects';
import {
  Search,
  LayoutGrid,
  Bookmark,
  ChevronDown,
  Edit2,
  Check,
  X,
  Menu,
  Volume2,
  VolumeX,
  Play,
  User,
  Tv,
} from 'lucide-react';

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Free to Play', href: '/games' },
  { label: 'Card Games', href: '/games?cat=cards' },
  { label: 'Party Bluff', href: '/games?cat=bluff' },
  { label: 'Mind & Words', href: '/games?cat=words' },
  { label: 'Live Rooms', href: '/games/bhabhi' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playerName, setPlayerName] = useState('Yaar_9410');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Scroll listener for seamless transparent-to-solid navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('theyaari_player_name') || localStorage.getItem('gameshub_player_name');
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
      return pathname === href.split('?')[0];
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#00050d]/95 backdrop-blur-md shadow-2xl shadow-black/80 border-b border-white/5'
          : 'bg-gradient-to-b from-[#00050d]/95 via-[#00050d]/60 to-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 flex h-16 sm:h-[68px] items-center justify-between">
        {/* Left Section: Brand Logo + Navigation Tabs */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* "the yaari" Brand Mark with Signature Smile Curve */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            onClick={() => {
              soundManager.playSelect();
              setMobileMenuOpen(false);
            }}
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] p-[1.5px] shadow-lg shadow-cyan-950/50">
              <img
                src="/assets/brand/the-yaari-icon.png"
                alt="The Yaari"
                className="w-full h-full object-cover rounded-[7px]"
              />
            </div>

            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                the yaari
              </span>
              <svg
                viewBox="0 0 72 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-1.5 -mt-0.5 text-[#00a8e1]"
              >
                <path
                  d="M 1 2 Q 36 8 71 1"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_4px_rgba(0,168,225,0.9)]"
                />
              </svg>
            </div>
          </Link>

          {/* Navigation Tabs (Pixel-matched to Prime Video tabs) */}
          <nav className="hidden xl:flex items-center gap-1.5 text-xs lg:text-sm font-semibold">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => soundManager.playSelect()}
                  className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-white/10 text-white font-extrabold shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Subtle Divider */}
            <span className="text-zinc-600 px-1 font-light">|</span>

            {/* About Link */}
            <Link
              href="/about"
              onClick={() => soundManager.playSelect()}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                pathname === '/about'
                  ? 'bg-white/10 text-white font-extrabold'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </Link>

            <Link
              href="/how-to-play"
              onClick={() => soundManager.playSelect()}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                pathname === '/how-to-play'
                  ? 'bg-white/10 text-white font-extrabold'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              How to Play
            </Link>
          </nav>
        </div>

        {/* Right Section: Search, Grid, Bookmark, Profile & Join Room CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Icon */}
          <Link
            href="/games"
            onClick={() => soundManager.playSelect()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Search Games"
            aria-label="Search"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Grid / Categories Icon */}
          <Link
            href="/games"
            onClick={() => soundManager.playSelect()}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="All Categories"
            aria-label="Categories"
          >
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Watchlist / Bookmark Icon */}
          <Link
            href="/profile"
            onClick={() => soundManager.playSelect()}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="My Saved Games"
            aria-label="Watchlist"
          >
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) soundManager.playSelect();
            }}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                soundManager.playTap();
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
              }}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-white/20 transition cursor-pointer"
              aria-label="User profile"
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] text-xs font-black text-white shadow-md">
                {playerName.charAt(0).toUpperCase()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
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
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-[#070b18]/98 p-4 text-white shadow-2xl shadow-black/90 backdrop-blur-2xl space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-zinc-400">Who&apos;s Playing?</span>
                    <button
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!isEditingName ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/10">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] text-xs font-bold text-white">
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
                        className="flex-1 bg-black/70 border border-cyan-500 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-2.5 py-1 rounded-xl bg-[#00a8e1] hover:bg-[#0094c7] text-white font-bold text-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-1 pt-1 border-t border-white/10 text-xs">
                    <Link
                      href="/profile"
                      onClick={() => {
                        soundManager.playSelect();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white transition"
                    >
                      <span>Manage Profiles & Stats</span>
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => {
                        soundManager.playSelect();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white transition"
                    >
                      <span>About TheYaari by Coder Tushar</span>
                      <Tv className="w-3.5 h-3.5 text-purple-400" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Prime Video Signature Blue CTA Button ("Join Prime" -> "Join Room") */}
          <Link
            href="/games/bhabhi"
            onClick={() => soundManager.playSelect()}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-cyan-950/40 transition hover:brightness-110 active:scale-95 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Join Room</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white transition xl:hidden cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 -z-10 cursor-default xl:hidden bg-black/60 backdrop-blur-sm"
          />

          <nav className="w-full bg-[#00050d] border-b border-white/10 px-4 py-4 flex flex-col gap-1 shadow-2xl xl:hidden animate-in slide-in-from-top-4">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    soundManager.playSelect();
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/about"
              onClick={() => {
                soundManager.playSelect();
                setMobileMenuOpen(false);
              }}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              About TheYaari by Coder Tushar
            </Link>

            <Link
              href="/how-to-play"
              onClick={() => {
                soundManager.playSelect();
                setMobileMenuOpen(false);
              }}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              How to Play Bhabhi
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
