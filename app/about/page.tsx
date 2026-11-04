'use client';

import React from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Tv,
  Heart,
  Code2,
  Sparkles,
  Users,
  Shield,
  Zap,
  Globe,
  ExternalLink,
  Play,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { soundManager } from '@/lib/audio/sound-effects';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#00050d] text-white pt-20 sm:pt-24 pb-16 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        {/* Prime Video Studio Banner */}
        <div className="relative rounded-3xl p-6 sm:p-12 overflow-hidden bg-gradient-to-r from-[#070b18] via-[#09142e] to-[#070b18] border border-white/10 shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00a8e1]/15 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00a8e1]/20 text-cyan-300 border border-[#00a8e1]/30 text-xs font-black tracking-wider uppercase">
              <Tv className="w-3.5 h-3.5 text-[#00a8e1]" />
              <span>THE YAARI STUDIOS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
              TheYaari <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8e1] via-cyan-300 to-purple-400">
                by Coder Tushar
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              India&apos;s modern browser-based party and card gaming platform. Designed like an OTT streaming service,
              built for friends, family, and dost &amp; yaar to play anywhere, on any device.
            </p>
          </div>
        </div>

        {/* The Philosophy: Why "The Yaari"? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#050813] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00a8e1]/20 text-[#00a8e1] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">The Yaari Philosophy</h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              &quot;Yaari&quot; is the Hindi word for true friendship, shared laughter, and late-night gaming sessions.
              We wanted to recreate the timeless joy of Indian living rooms—playing classic card games like
              <strong> Bhabhi (Get Away / Thulla)</strong> and party deduction hits like <strong>Undercover</strong> and <strong>Spyfall</strong>—without
              the friction of app store downloads, invasive tracking, or gambling mechanics.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#050813] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">100% Recreational &amp; Free</h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              The Yaari does not support gambling, in-app microtransactions, or real-money wagering.
              Every coin is virtual, every match is for banter and pride, and games can be started in under
              5 seconds by simply sharing a 6-letter room code via WhatsApp or browser.
            </p>
          </div>
        </div>

        {/* Creator Profile Section: Coder Tushar */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#070b18] via-[#050813] to-[#0a1228] border border-white/15 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
            {/* Creator Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-tr from-[#00a8e1] to-[#8b5cf6] p-1 shrink-0 shadow-2xl">
              <div className="w-full h-full bg-[#050813] rounded-full flex items-center justify-center text-4xl">
                👨‍💻
              </div>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="text-xs font-bold text-[#00a8e1] uppercase tracking-wider">
                Founder &amp; Lead Architect
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Tushar Kumar Sahu <span className="text-zinc-400 text-lg sm:text-2xl font-semibold">(Coder Tushar)</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                Full-stack developer, game designer, and creator of CoderTushar. Crafted with a passion for
                modern web performance, real-time multiplayer architectures, and delightful interactive user experiences.
              </p>

              {/* Social and Portfolio Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
                <a
                  href="https://github.com/tusharsahu3011/the-yaari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition border border-white/10"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>

                <a
                  href="https://codertushar.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00a8e1]/20 hover:bg-[#00a8e1]/30 text-cyan-300 text-xs font-bold transition border border-[#00a8e1]/40"
                >
                  <Globe className="w-4 h-4" />
                  <span>CoderTushar.in</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Key Tech Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Engine Core</span>
              <div className="text-sm sm:text-base font-black text-white">Next.js 16 + React 19</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Networking</span>
              <div className="text-sm sm:text-base font-black text-[#00a8e1]">WebRTC P2P + SSE</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Game Engines</span>
              <div className="text-sm sm:text-base font-black text-emerald-400">100% Tested Vitest</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Design UI/UX</span>
              <div className="text-sm sm:text-base font-black text-purple-400">Cinematic Web Platform</div>
            </div>
          </div>
        </div>

        {/* Ready to Play CTA */}
        <div className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#00a8e1]/20 via-[#070b18] to-purple-600/20 border border-white/10 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Experience The Yaari Right Now
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
            Choose from Bhabhi (Get Away), Undercover, or Spyfall. Solo vs AI bots or live rooms with dost &amp; yaar.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              onClick={() => soundManager.playSelect()}
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#00a8e1] hover:bg-[#0094c7] text-white font-extrabold text-sm shadow-xl transition hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Back to The Yaari Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
