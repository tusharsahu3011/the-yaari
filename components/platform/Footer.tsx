'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#00050d] py-10 sm:py-14 select-none">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col items-center justify-center text-center space-y-4">
        {/* Brand Typography Logo with Cyan Smile Curve */}
        <Link href="/about" className="flex flex-col items-center group">
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

        {/* Minimal Footer Navigation Links (Prime Video Exact Style) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#00a8e1]">
          <Link href="/about" className="hover:underline text-cyan-400">
            About TheYaari
          </Link>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <Link href="/how-to-play" className="hover:underline text-cyan-400">
            Rules &amp; Strategy
          </Link>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <Link href="/games" className="hover:underline text-cyan-400">
            All Games
          </Link>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <a
            href="https://codertushar.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-cyan-400"
          >
            CoderTushar.in
          </a>
        </div>

        {/* Legal & Copyright */}
        <div className="space-y-1 pt-1 text-[11px] text-zinc-400 max-w-xl leading-relaxed">
          <p>© 2026 TheYaari by Coder Tushar. All rights reserved.</p>
          <p className="text-zinc-400">
            100% free recreational multiplayer gaming platform. Zero real-money gambling, zero microtransactions.
          </p>
        </div>
      </div>
    </footer>
  );
}
