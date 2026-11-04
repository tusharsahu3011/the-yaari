'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Heart, Shield, Sparkles, Tv } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#040711] mt-auto">
      {/* Top subtle cyan glow strip (Prime Video signature) */}
      <div
        className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5">
                <img
                  src="/assets/brand/the-yaari-icon.png"
                  alt="The Yaari"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg text-white tracking-tight">the yaari</span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  STREAM PARTY GAMES
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              India&apos;s premier browser-based social gaming and streaming hub. Play classic desi card games,
              social deduction, pass-and-play party hits, and custom private rooms with your yaars & dosts.
            </p>
          </div>

          {/* Featured Channels & Games */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Ready to Stream
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link
                  href="/games/bhabhi"
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Bhabhi (Get Away / Thulla)
                </Link>
              </li>
              <li>
                <Link
                  href="/games/undercover"
                  className="hover:text-purple-400 transition flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Undercover (Group Deduction)
                </Link>
              </li>
              <li>
                <Link
                  href="/games/spyfall"
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Spyfall (Interrogation Party)
                </Link>
              </li>
              <li>
                <Link
                  href="/games?cat=cards"
                  className="hover:text-zinc-200 transition flex items-center gap-1.5 text-zinc-500"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                  Teen Patti Flush (Dev Pipeline)
                </Link>
              </li>
            </ul>
          </div>

          {/* OTT Platform Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Zero-Install Web Rooms (PWA)
              </li>
              <li className="flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                Cinema-Grade OTT UI/UX
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Server-Authoritative Anti-Cheat
              </li>
              <li className="flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                AI Commentary & Solo Bot Mode
              </li>
            </ul>
          </div>

          {/* Copyright & Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              The Yaari Network
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              Designed & engineered by <strong>Tushar Kumar Sahu</strong> for multiplayer party lovers everywhere.
            </p>
            <div className="text-[11px] text-zinc-500">
              © 2026, The Yaari, or its affiliates. All rights reserved.
            </div>
          </div>
        </div>

        {/* Prime Video Style Legal Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>The Yaari • Built with Next.js, TypeScript, Tailwind CSS & Framer Motion.</p>
          <div className="flex items-center gap-5 text-xs text-zinc-400">
            <Link href="/how-to-play" className="hover:text-cyan-400 transition">
              Rules & Strategy
            </Link>
            <Link href="/games" className="hover:text-cyan-400 transition">
              Browse All Games
            </Link>
            <Link href="/profile" className="hover:text-cyan-400 transition">
              Who&apos;s Playing?
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
