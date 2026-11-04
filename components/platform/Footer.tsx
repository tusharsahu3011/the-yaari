'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Heart, Shield, Sparkles, Tv } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#00050d] mt-auto">
      {/* Prime Video Signature Top Cyan Line */}
      <div
        className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-[#00a8e1]/40 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/about" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] p-0.5">
                <img
                  src="/assets/brand/the-yaari-icon.png"
                  alt="The Yaari"
                  className="w-full h-full object-cover rounded-[6px]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg text-white tracking-tight group-hover:text-cyan-300 transition">
                  the yaari
                </span>
                <span className="text-[10px] text-[#00a8e1] font-bold uppercase tracking-wider">
                  BY CODER TUSHAR
                </span>
              </div>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              India&apos;s browser-based multiplayer gaming platform. Stream and play classic desi card games,
              social deduction, and pass-and-play party hits with dost &amp; yaar.
            </p>
          </div>

          {/* Featured Channels & Games */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00a8e1] mb-3">
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
                  Teen Patti Flush (Pipeline)
                </Link>
              </li>
            </ul>
          </div>

          {/* OTT Platform Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00a8e1] mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00a8e1]" />
                Zero-Install Web Rooms (PWA)
              </li>
              <li className="flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                Cinema-Grade Streaming Interface
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Server-Authoritative Anti-Cheat
              </li>
              <li className="flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                Smart AI Bots &amp; Desi Commentary
              </li>
            </ul>
          </div>

          {/* About Creator */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00a8e1] mb-3">
              About The Yaari
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              <strong>TheYaari by Coder Tushar</strong> — Engineered with passion by{' '}
              <strong>Tushar Kumar Sahu</strong> for party lovers everywhere.
            </p>
            <div className="text-[11px] text-zinc-500">
              © 2026, TheYaari by Coder Tushar. All rights reserved.
            </div>
          </div>
        </div>

        {/* Prime Video Style Legal Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>TheYaari by Coder Tushar • Modern Social Gaming Platform</p>
          <div className="flex items-center gap-5 text-xs text-zinc-400">
            <Link href="/about" className="hover:text-cyan-400 transition font-bold text-white">
              About TheYaari
            </Link>
            <Link href="/how-to-play" className="hover:text-cyan-400 transition">
              Rules &amp; Strategy
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
