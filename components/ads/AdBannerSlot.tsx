'use client';

import React from 'react';
import { ExternalLink, Info, Sparkles } from 'lucide-react';

export interface AdBannerSlotProps {
  slotId?: string;
  format?: 'leaderboard' | 'billboard' | 'rectangle';
  className?: string;
}

/**
 * AdBannerSlot
 * 
 * Future-ready advertisement container for Google AdSense, Adsterra, Mediavine,
 * or direct brand sponsorships.
 * 
 * HOW TO CONNECT ADS IN THE FUTURE:
 * 1. Google AdSense:
 *    - Add your AdSense script in `app/layout.tsx`:
 *      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX" />
 *    - In this component, replace the placeholder with:
 *      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXX" data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true" />
 *      and call `(window.adsbygoogle = window.adsbygoogle || []).push({})` on mount.
 * 2. Direct Sponsor:
 *    - Simply pass sponsor banner image and destination link!
 */
export function AdBannerSlot({
  slotId = 'home-hero-leaderboard',
  format = 'leaderboard',
  className = '',
}: AdBannerSlotProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto my-4 px-2 sm:px-0 ${className}`}>
      <div className="relative rounded-2xl border border-dashed border-white/15 bg-gradient-to-r from-[#0d1224]/80 via-[#101730]/70 to-[#0d1224]/80 backdrop-blur-md overflow-hidden p-3 sm:p-4 text-center transition-all hover:border-purple-500/30">
        {/* Top subtle sponsor indicator */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 px-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Sponsored / Partner Ad Slot</span>
          </div>
          <span className="text-[9px] text-zinc-500 hover:text-zinc-300 cursor-pointer flex items-center gap-1">
            <Info className="w-3 h-3" /> Ad Info
          </span>
        </div>

        {/* Ad Content Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/5 min-h-[90px]">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 font-black text-sm shrink-0">
              AD
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>Advertise with Games.CoderTushar</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  728 × 90
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Reach thousands of active multiplayer and party gamers. Connect AdSense, Adsterra or custom sponsor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-zinc-500 hidden md:inline">Slot: #{slotId}</span>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition border border-white/10 flex items-center gap-1.5 cursor-pointer">
              <span>Partner with Us</span>
              <ExternalLink className="w-3 h-3 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

