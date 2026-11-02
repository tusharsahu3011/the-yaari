'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Heart, Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#07090e] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">
                Games.CoderTushar.in
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Modern browser-based multiplayer gaming hub. Play classic desi card games,
              party deduction games, solo vs AI, and private rooms with friends.
            </p>
          </div>

          {/* Quick Games */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
              Playable & Upcoming
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link
                  href="/games/bhabhi"
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Bhabhi (Thulla / Get Away)
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                Undercover (Coming Soon)
              </li>
              <li className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                Spyfall (Coming Soon)
              </li>
              <li className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                Wavelength (Coming Soon)
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                AI Commentary & Personalities
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Server-Authoritative Rules
              </li>
              <li className="flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                Zero-install Browser Play
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
              Developer
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Crafted with care by <strong>Tushar Kumar Sahu</strong> for social game lovers
              everywhere.
            </p>
            <div className="text-[11px] text-gray-500">
              © 2026 CoderTushar. All rights reserved.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>Built with Next.js, TypeScript, Tailwind CSS & Framer Motion.</p>
          <div className="flex items-center gap-4">
            <Link href="/how-to-play" className="hover:text-gray-300 transition">
              How to Play Bhabhi
            </Link>
            <Link href="/privacy" className="hover:text-gray-300 transition">
              Fair Play & Rules
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
