'use client';

import React from 'react';

// 1. Hero 3D Composition (Ace of Spades, Werewolf, Detective, Poker Chips, Dice, Mask)
export function HeroGameComposition({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 460 380" className="w-full h-full max-h-[380px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Card Gradients */}
          <linearGradient id="cardPurple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#1e1035" />
          </linearGradient>
          <linearGradient id="cardBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="cardWhite" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="chipRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="chipBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <filter id="glowPurple" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Backdrop Ambient Glow */}
        <circle cx="260" cy="180" r="140" fill="#a855f7" opacity="0.22" filter="url(#glowPurple)" />

        {/* 1. Comedy Mask (Left Back) */}
        <g transform="translate(60, 100) rotate(-18) scale(0.85)">
          <path
            d="M50 10 C20 10 5 35 5 70 C5 105 25 140 50 140 C75 140 95 105 95 70 C95 35 80 10 50 10 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
            filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))"
          />
          {/* Eyes & Smiling mouth */}
          <ellipse cx="32" cy="55" rx="8" ry="6" fill="#1e293b" />
          <ellipse cx="68" cy="55" rx="8" ry="6" fill="#1e293b" />
          <path d="M28 85 Q50 120 72 85" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>

        {/* 2. Detective Card (Left Tilt) */}
        <g transform="translate(110, 45) rotate(-14)">
          <rect width="130" height="190" rx="18" fill="url(#cardPurple)" stroke="#c084fc" strokeWidth="2.5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))" />
          {/* Inner Frame */}
          <rect x="8" y="8" width="114" height="174" rx="12" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
          {/* Fedora & Sunglasses Silhouette */}
          <path d="M30 85 C30 75 42 62 65 62 C88 62 100 75 100 85 L115 88 C95 86 35 86 15 88 Z" fill="#0f172a" />
          <path d="M38 78 C38 68 46 65 65 65 C84 65 92 68 92 78 Z" fill="#38bdf8" opacity="0.8" />
          {/* Sunglasses */}
          <path d="M42 98 L58 98 L56 110 L44 110 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M72 98 L88 98 L86 110 L74 110 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="58" y1="102" x2="72" y2="102" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Trench Coat Collar */}
          <path d="M35 140 L55 120 L65 130 L75 120 L95 140 Z" fill="#1e1b4b" />
        </g>

        {/* 3. Werewolf Card (Center Tilt) */}
        <g transform="translate(200, 25) rotate(-2)">
          <rect width="136" height="198" rx="18" fill="url(#cardBlue)" stroke="#60a5fa" strokeWidth="2.5" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.7))" />
          <rect x="8" y="8" width="120" height="182" rx="12" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
          {/* Full Moon */}
          <circle cx="88" cy="65" r="28" fill="#f8fafc" opacity="0.9" />
          <circle cx="82" cy="60" r="4" fill="#cbd5e1" opacity="0.5" />
          {/* Wolf Profile Howling */}
          <path
            d="M30 155 C45 135 55 110 50 90 L60 82 L70 95 C80 85 92 70 85 55 C98 75 95 105 85 125 L115 155 Z"
            fill="#090d16"
          />
          {/* Wolf Eye */}
          <circle cx="72" cy="80" r="2" fill="#38bdf8" />
        </g>

        {/* 4. Ace of Spades Card (Right Tilt) */}
        <g transform="translate(290, 50) rotate(14)">
          <rect width="130" height="190" rx="18" fill="url(#cardWhite)" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))" />
          {/* Top Rank */}
          <text x="16" y="34" fontFamily="sans-serif" fontSize="24" fontWeight="900" fill="#0f172a">A</text>
          <text x="17" y="52" fontFamily="sans-serif" fontSize="18" fill="#0f172a">♠</text>
          {/* Big Center Spade */}
          <g transform="translate(42, 65) scale(1.8)">
            <path
              d="M12 2 C8 8 2 13 2 18 C2 22 5 24 9 24 C11 24 13 22 14 20 C13 23 11 26 9 28 L17 28 C15 26 13 23 12 20 C13 22 15 24 17 24 C21 24 24 22 24 18 C24 13 18 8 14 2 Z"
              fill="#0f172a"
            />
          </g>
          {/* Bottom Inverted Rank */}
          <text x="114" y="172" fontFamily="sans-serif" fontSize="24" fontWeight="900" fill="#0f172a" textAnchor="end">A</text>
          <text x="113" y="154" fontFamily="sans-serif" fontSize="18" fill="#0f172a" textAnchor="end">♠</text>
        </g>

        {/* 5. Casino Chips Stack (Front Left) */}
        <g transform="translate(130, 240)">
          {/* Chip 1 (Red) */}
          <ellipse cx="40" cy="55" rx="36" ry="14" fill="#7f1d1d" />
          <ellipse cx="40" cy="48" rx="36" ry="14" fill="url(#chipRed)" stroke="#ffffff" strokeWidth="2" />
          <ellipse cx="40" cy="48" rx="22" ry="8" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" />
          <text x="40" y="52" fontFamily="sans-serif" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">50</text>

          {/* Chip 2 (Blue stacked) */}
          <ellipse cx="65" cy="38" rx="36" ry="14" fill="#1e3a8a" />
          <ellipse cx="65" cy="31" rx="36" ry="14" fill="url(#chipBlue)" stroke="#ffffff" strokeWidth="2" />
          <ellipse cx="65" cy="31" rx="22" ry="8" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" />
          <text x="65" y="35" fontFamily="sans-serif" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">100</text>
        </g>

        {/* 6. 3D Dice (Front Right) */}
        <g transform="translate(295, 230) rotate(16)">
          {/* Isometric Cube Top Face */}
          <polygon points="40,10 70,25 40,40 10,25" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Left Face */}
          <polygon points="10,25 40,40 40,75 10,60" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Right Face */}
          <polygon points="40,40 70,25 70,60 40,75" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
          {/* Dice Pips */}
          <circle cx="40" cy="25" r="3.5" fill="#0f172a" />
          <circle cx="25" cy="48" r="3" fill="#0f172a" />
          <circle cx="25" cy="62" r="3" fill="#0f172a" />
          <circle cx="55" cy="46" r="3" fill="#0f172a" />
          <circle cx="55" cy="60" r="3" fill="#0f172a" />
        </g>
      </svg>
    </div>
  );
}

// 2. Cute AI Robot with Headset & Cards (Solo Mode & AI Dealer - Images 1, 3, 4)
export function CuteAIRobotIllustration({
  speechText,
  className = 'w-24 h-24',
}: {
  speechText?: string;
  className?: string;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {speechText && (
        <div className="max-w-md mb-2 p-3 px-4 rounded-2xl bg-purple-950/90 border border-purple-400/50 shadow-2xl backdrop-blur-md text-xs text-purple-200 animate-in fade-in zoom-in-95 relative">
          <strong className="text-purple-300 block mb-0.5 font-bold">🤖 AI Dealer:</strong>
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-purple-950/90" />
        </div>
      )}

      <div className={`relative ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="botHead" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="botVisor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <filter id="neonVisorGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Headphones Band */}
          <path d="M30 75 C30 35 130 35 130 75" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" />
          {/* Headphone Ear Cups */}
          <rect x="20" y="60" width="16" height="32" rx="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="2" />
          <rect x="124" y="60" width="16" height="32" rx="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="2" />

          {/* Robot Head Body */}
          <rect x="34" y="44" width="92" height="74" rx="26" fill="url(#botHead)" stroke="#e2e8f0" strokeWidth="3" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))" />

          {/* Glowing Visor Screen */}
          <rect x="44" y="56" width="72" height="42" rx="14" fill="url(#botVisor)" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Glowing Cyan Eyes */}
          <ellipse cx="64" cy="74" rx="7" ry="9" fill="#38bdf8" filter="url(#neonVisorGlow)" />
          <ellipse cx="96" cy="74" rx="7" ry="9" fill="#38bdf8" filter="url(#neonVisorGlow)" />
          <path d="M72 88 Q80 94 88 88" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Red Bowtie / Collar */}
          <polygon points="80,122 66,114 66,130" fill="#ef4444" />
          <polygon points="80,122 94,114 94,130" fill="#ef4444" />
          <circle cx="80" cy="122" r="4" fill="#b91c1c" />

          {/* Tiny Fanned Hand of Cards */}
          <g transform="translate(100, 95) rotate(15) scale(0.6)">
            <rect x="0" y="0" width="28" height="42" rx="4" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
            <text x="4" y="14" fontSize="10" fill="#ef4444" fontWeight="bold">A♥</text>
          </g>
          <g transform="translate(108, 98) rotate(30) scale(0.6)">
            <rect x="0" y="0" width="28" height="42" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <text x="4" y="14" fontSize="10" fill="#0f172a" fontWeight="bold">K♠</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

// 3. 3D Globe with Multiplayer Figures (Image 4 Online Mode)
export function OnlineMultiplayerIllustration({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#1e3a8a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Glowing Globe Circle */}
        <circle cx="80" cy="70" r="48" fill="url(#globeGlow)" stroke="#38bdf8" strokeWidth="2.5" filter="drop-shadow(0 0 20px rgba(56,189,248,0.4))" />

        {/* Globe Longitude/Latitude lines */}
        <ellipse cx="80" cy="70" rx="24" ry="48" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="80" cy="70" rx="48" ry="20" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
        <line x1="32" y1="70" x2="128" y2="70" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />

        {/* Social Agent 1 (Left) */}
        <g transform="translate(34, 95)">
          <circle cx="16" cy="14" r="10" fill="#a855f7" />
          <path d="M4 36 C4 24 28 24 28 36 Z" fill="#a855f7" />
        </g>

        {/* Social Agent 2 (Center Big) */}
        <g transform="translate(64, 85)">
          <circle cx="16" cy="14" r="12" fill="#38bdf8" />
          <path d="M2 42 C2 28 30 28 30 42 Z" fill="#38bdf8" />
        </g>

        {/* Social Agent 3 (Right) */}
        <g transform="translate(96, 95)">
          <circle cx="16" cy="14" r="10" fill="#c084fc" />
          <path d="M4 36 C4 24 28 24 28 36 Z" fill="#c084fc" />
        </g>
      </svg>
    </div>
  );
}
