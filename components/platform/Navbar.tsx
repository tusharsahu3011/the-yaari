'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gamepad2,
  Home,
  Sparkles,
  Layers,
  Flame,
  Moon,
  Sun,
  User,
  ChevronDown,
  Edit2,
  Check,
  X,
  Menu,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playerName, setPlayerName] = useState('Guest');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gameshub_player_name');
      if (saved) {
        setPlayerName(saved);
        setNameInput(saved);
      } else {
        const randId = Math.floor(1000 + Math.random() * 9000);
        const autoName = `VibeSeeker_${randId}`;
        setPlayerName(autoName);
        setNameInput(autoName);
        localStorage.setItem('gameshub_player_name', autoName);
      }
    } catch (e) {}
  }, []);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    setPlayerName(nameInput.trim());
    setIsEditingName(false);
    try {
      localStorage.setItem('gameshub_player_name', nameInput.trim());
    } catch (e) {}
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'All Games', href: '/games', icon: Gamepad2 },
    { label: 'Card Games', href: '/games/bhabhi', icon: Layers },
    { label: 'Social Bluff', href: '/games/undercover', icon: Flame },
    { label: 'Party Rooms', href: '/games/bhabhi', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080b14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-900/40 group-hover:shadow-purple-700/60 transition">
            <div className="w-full h-full bg-[#0a0d18] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black text-lg tracking-tight text-white flex items-center gap-1">
              Games <span className="text-xs font-normal text-gray-400">by</span>{' '}
              <span className="text-purple-400">Coder Tushar</span>
            </span>
            <span className="text-[10px] font-semibold text-purple-300/70 tracking-widest uppercase">
              Multiplayer Gaming Hub
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101424] p-1 rounded-2xl border border-white/10 shadow-inner">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Dark mode moon icon (visual parity) */}
          <button
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition border border-white/5"
            title="Dark theme active"
          >
            <Moon className="w-4 h-4 text-purple-300" />
          </button>

          {/* User Profile Pill / Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition"
            >
              <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                👤
              </div>
              <span className="max-w-[110px] truncate">{playerName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#111827] border border-white/15 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-gray-300">Player Identity</span>
                  <button
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="text-gray-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!isEditingName ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-xs font-bold text-white truncate">{playerName}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 rounded text-purple-400 hover:text-purple-300 hover:bg-white/10"
                      title="Edit player name"
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
                      className="flex-1 bg-black/50 border border-purple-500/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                )}

                <div className="pt-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block w-full py-2 rounded-xl text-center text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                  >
                    View Stats & Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sign In CTA */}
          <Link
            href="/profile"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition active:scale-95"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0d18] px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-purple-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
