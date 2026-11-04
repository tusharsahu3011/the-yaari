'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  BookOpen,
  Sparkles,
  Users,
} from 'lucide-react';

export const primaryNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Free to Play', href: '/games' },
  { label: 'Card Games', href: '/games?cat=cards' },
  { label: 'Party Bluff', href: '/games?cat=bluff' },
  { label: 'Mind & Words', href: '/games?cat=words' },
  { label: 'Live Rooms', href: '/games/bhabhi' },
] as const;

export const secondaryNavLinks = [
  { label: 'Categories', href: '/games', icon: LayoutGrid },
  { label: 'Rules & Guides', href: '/how-to-play', icon: BookOpen },
  { label: 'About', href: '/about' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playerName, setPlayerName] = useState('Yaar_9410');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isGridDropdownOpen, setIsGridDropdownOpen] = useState(false);
  const [isBookmarkDropdownOpen, setIsBookmarkDropdownOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll listener for seamless transparent-to-solid navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync saved player name
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

  // Keyboard escape listener
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
        setIsGridDropdownOpen(false);
        setIsBookmarkDropdownOpen(false);
        setSearchOpen(false);
        setIsJoinModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      soundManager.playSelect();
      router.push(`/games?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    soundManager.playSelect();
    const code = roomCodeInput.trim().toUpperCase();
    setIsJoinModalOpen(false);
    setRoomCodeInput('');
    router.push(`/games/bhabhi?room=${code}`);
  };

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.includes('?')) {
      return pathname === href.split('?')[0];
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#00050d]/95 backdrop-blur-md shadow-2xl shadow-black/90 border-b border-white/5'
            : 'bg-gradient-to-b from-[#00050d]/95 via-[#00050d]/65 to-transparent'
        }`}
      >
        {/* Full-width container with matching outer padding */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex h-16 sm:h-[68px] items-center justify-between">
          {/* Left Section: Brand Logo + Primary Navigation Tabs */}
          <div className="flex items-center gap-4 lg:gap-7 xl:gap-8 min-w-0">
            {/* "the yaari" Brand Typography with Signature Cyan Smile Underline */}
            <Link
              href="/"
              className="flex flex-col text-left leading-none group shrink-0"
              onClick={() => {
                soundManager.playSelect();
                setMobileMenuOpen(false);
              }}
            >
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                the yaari
              </span>
              <svg
                viewBox="0 0 72 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-1.5 -mt-0.5 text-[#00a8e1]"
              >
                <path
                  d="M 1 2 Q 36 8.5 71 1"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_5px_rgba(0,168,225,0.9)]"
                />
              </svg>
            </Link>

            {/* Primary Navigation Tabs (Prime Video Pill Style) */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 text-xs lg:text-sm font-semibold select-none">
              {primaryNavLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => soundManager.playSelect()}
                    className={`transition-all duration-200 whitespace-nowrap ${
                      active
                        ? 'bg-white/20 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-sm'
                        : 'text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Vertical divider */}
              <span className="h-4 w-px bg-white/20 mx-1 hidden lg:block" />

              {/* Secondary Links (Subscriptions / Store equivalents) */}
              <div className="hidden lg:flex items-center gap-1">
                <Link
                  href="/games"
                  onClick={() => soundManager.playSelect()}
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Categories</span>
                </Link>

                <Link
                  href="/how-to-play"
                  onClick={() => soundManager.playSelect()}
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Rules</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => soundManager.playSelect()}
                  className="text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition"
                >
                  About
                </Link>
              </div>
            </nav>
          </div>

          {/* Right Section: Search, Launcher Grid, Bookmark, Profile Avatar, and Prime Blue CTA */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search Expander */}
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center animate-fade-in"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search games, card classics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 sm:w-64 bg-black/80 border border-white/20 rounded-md pl-8 pr-7 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#00a8e1]"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setSearchOpen(true);
                }}
                title="Search games"
                className="w-9 h-9 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* 9-Dot Grid Launcher Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setIsGridDropdownOpen(!isGridDropdownOpen);
                  setIsProfileDropdownOpen(false);
                  setIsBookmarkDropdownOpen(false);
                }}
                title="Game Launcher"
                className="w-9 h-9 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>

              {isGridDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#091122] border border-white/15 shadow-2xl p-3 z-50 space-y-2 text-left">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2">
                    Quick Launch
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/games/bhabhi"
                      onClick={() => setIsGridDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 text-xs font-semibold text-white transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Bhabhi (Get Away)</span>
                    </Link>
                    <Link
                      href="/games/undercover"
                      onClick={() => setIsGridDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 text-xs font-semibold text-white transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>Undercover Bluff</span>
                    </Link>
                    <Link
                      href="/games/spyfall"
                      onClick={() => setIsGridDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 text-xs font-semibold text-white transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Spyfall Secret Agent</span>
                    </Link>
                    <Link
                      href="/games"
                      onClick={() => setIsGridDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 text-xs font-semibold text-[#00a8e1] transition border-t border-white/10 mt-1 pt-2"
                    >
                      <span>Explore All 11 Titles →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bookmark / Watchlist Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setIsBookmarkDropdownOpen(!isBookmarkDropdownOpen);
                  setIsProfileDropdownOpen(false);
                  setIsGridDropdownOpen(false);
                }}
                title="Saved & Favorites"
                className="w-9 h-9 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <Bookmark className="w-5 h-5" />
              </button>

              {isBookmarkDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#091122] border border-white/15 shadow-2xl p-4 z-50 text-left space-y-2">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    My Game List
                  </div>
                  <p className="text-xs text-zinc-400">
                    Your starred party games and recently played rooms will appear here.
                  </p>
                  <Link
                    href="/games"
                    onClick={() => setIsBookmarkDropdownOpen(false)}
                    className="block text-center text-xs font-bold text-[#00a8e1] hover:underline pt-2"
                  >
                    Browse &amp; Add Titles
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsGridDropdownOpen(false);
                  setIsBookmarkDropdownOpen(false);
                }}
                title="Player Profile"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/30 hover:border-white transition flex items-center justify-center cursor-pointer bg-zinc-800"
              >
                <img
                  src="/assets/bhabhi/avatar-you.png"
                  alt={playerName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <User className="w-4 h-4 text-white" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#091122] border border-white/15 shadow-2xl p-4 z-50 space-y-4 text-left">
                  {/* Player Name Edit */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Player Identity
                    </span>
                    {isEditingName ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={nameInput}
                          maxLength={16}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="flex-1 bg-black/60 border border-cyan-400 rounded-md px-2.5 py-1 text-xs text-white focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') setIsEditingName(false);
                          }}
                        />
                        <button
                          onClick={handleSaveName}
                          className="p-1 rounded bg-[#00a8e1] text-white hover:bg-cyan-500"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setIsEditingName(false)}
                          className="p-1 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-white/10">
                        <span className="text-sm font-bold text-white truncate">{playerName}</span>
                        <button
                          onClick={() => {
                            soundManager.playSelect();
                            setIsEditingName(true);
                          }}
                          className="text-zinc-400 hover:text-cyan-300 p-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Audio Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-zinc-300">Sound Effects</span>
                    <button
                      onClick={() => {
                        const next = !soundEnabled;
                        setSoundEnabled(next);
                        soundManager.setSoundEnabled(next);
                        if (next) soundManager.playSelect();
                      }}
                      className={`p-1.5 rounded-md transition ${
                        soundEnabled ? 'text-[#00a8e1] bg-[#00a8e1]/10' : 'text-zinc-500 bg-white/5'
                      }`}
                    >
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Links */}
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <Link
                      href="/about"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block text-xs text-zinc-300 hover:text-white py-1"
                    >
                      About TheYaari
                    </Link>
                    <Link
                      href="/how-to-play"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block text-xs text-zinc-300 hover:text-white py-1"
                    >
                      Game Rules &amp; FAQ
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Signature Prime Blue CTA: "Join Room" */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setIsJoinModalOpen(true);
              }}
              className="bg-[#00a8e1] hover:bg-[#0094c7] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Join Room
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden w-9 h-9 rounded-md hover:bg-white/10 text-white flex items-center justify-center transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#00050d] border-b border-white/10 px-4 py-4 space-y-3 text-left">
            <div className="space-y-1">
              {primaryNavLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      soundManager.playSelect();
                      setMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      active ? 'bg-white/20 text-white font-bold' : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1">
              <Link
                href="/how-to-play"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Rules &amp; Guides
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                About TheYaari by Coder Tushar
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Join Room Modal */}
      {isJoinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsJoinModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#091122] border border-white/20 shadow-2xl p-6 sm:p-8 space-y-5 text-left animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00a8e1]" />
                <h3 className="text-xl font-bold text-white">Join Live Room</h3>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Enter the 6-character room code shared by your friend to jump directly into the live game table.
            </p>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Room Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. YAAR42"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-lg font-mono font-bold text-center tracking-widest text-[#00a8e1] uppercase focus:outline-none focus:border-[#00a8e1]"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!roomCodeInput.trim()}
                  className="px-6 py-2 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] disabled:opacity-50 text-white text-xs font-bold transition shadow-lg cursor-pointer"
                >
                  Enter Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
