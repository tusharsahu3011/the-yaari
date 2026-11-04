'use client';

import React, { useState } from 'react';

// ============================================================================
// SMART ASSET WRAPPER (Graceful Image Loader with SVG Fallback)
// ============================================================================
export interface SmartAssetImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
}

export function SmartAssetImage({
  src,
  alt,
  className = '',
  fallback,
}: SmartAssetImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {(!loaded || error) && fallback}
    </div>
  );
}

// ============================================================================
// 1. HERO 3D COMPOSITION (Hero Card on Home Page)
// ============================================================================
export function HeroGameComposition({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 380"
        className="w-full h-full max-h-[380px] drop-shadow-[0_20px_35px_rgba(139,92,246,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
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
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Glow */}
        <circle cx="250" cy="180" r="150" fill="#8b5cf6" opacity="0.25" filter="url(#glowPurple)" />

        {/* 1. Comedy Mask (Left Back) */}
        <g transform="translate(50, 100) rotate(-18) scale(0.85)">
          <path
            d="M50 10 C20 10 5 35 5 70 C5 105 25 140 50 140 C75 140 95 105 95 70 C95 35 80 10 50 10 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
            filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))"
          />
          <ellipse cx="32" cy="55" rx="8" ry="6" fill="#1e293b" />
          <ellipse cx="68" cy="55" rx="8" ry="6" fill="#1e293b" />
          <path d="M28 85 Q50 120 72 85" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>

        {/* 2. Detective Card (Left Tilt) */}
        <g transform="translate(110, 45) rotate(-14)">
          <rect width="130" height="190" rx="18" fill="url(#cardPurple)" stroke="#c084fc" strokeWidth="2.5" />
          <rect x="8" y="8" width="114" height="174" rx="12" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
          {/* Fedora & Sunglasses Silhouette */}
          <path d="M30 85 C30 75 42 62 65 62 C88 62 100 75 100 85 L115 88 C95 86 35 86 15 88 Z" fill="#0f172a" />
          <path d="M38 78 C38 68 46 65 65 65 C84 65 92 68 92 78 Z" fill="#38bdf8" opacity="0.8" />
          <path d="M42 98 L58 98 L56 110 L44 110 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M72 98 L88 98 L86 110 L74 110 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="58" y1="102" x2="72" y2="102" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M35 140 L55 120 L65 130 L75 120 L95 140 Z" fill="#1e1b4b" />
        </g>

        {/* 3. Werewolf Card (Center Tilt) */}
        <g transform="translate(200, 25) rotate(-2)">
          <rect width="136" height="198" rx="18" fill="url(#cardBlue)" stroke="#60a5fa" strokeWidth="2.5" />
          <rect x="8" y="8" width="120" height="182" rx="12" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
          <circle cx="88" cy="65" r="28" fill="#f8fafc" opacity="0.9" />
          <circle cx="82" cy="60" r="4" fill="#cbd5e1" opacity="0.5" />
          <path
            d="M30 155 C45 135 55 110 50 90 L60 82 L70 95 C80 85 92 70 85 55 C98 75 95 105 85 125 L115 155 Z"
            fill="#090d16"
          />
          <circle cx="72" cy="80" r="2" fill="#38bdf8" />
        </g>

        {/* 4. Ace of Spades Card (Right Tilt) */}
        <g transform="translate(290, 50) rotate(14)">
          <rect width="130" height="190" rx="18" fill="url(#cardWhite)" stroke="#ffffff" strokeWidth="2" />
          <text x="16" y="34" fontFamily="sans-serif" fontSize="24" fontWeight="900" fill="#0f172a">A</text>
          <text x="17" y="52" fontFamily="sans-serif" fontSize="18" fill="#0f172a">♠</text>
          <g transform="translate(42, 65) scale(1.8)">
            <path
              d="M12 2 C8 8 2 13 2 18 C2 22 5 24 9 24 C11 24 13 22 14 20 C13 23 11 26 9 28 L17 28 C15 26 13 23 12 20 C13 22 15 24 17 24 C21 24 24 22 24 18 C24 13 18 8 14 2 Z"
              fill="#0f172a"
            />
          </g>
          <text x="114" y="172" fontFamily="sans-serif" fontSize="24" fontWeight="900" fill="#0f172a" textAnchor="end">A</text>
          <text x="113" y="154" fontFamily="sans-serif" fontSize="18" fill="#0f172a" textAnchor="end">♠</text>
        </g>

        {/* 5. Casino Chips Stack */}
        <g transform="translate(130, 240)">
          <ellipse cx="40" cy="55" rx="36" ry="14" fill="#7f1d1d" />
          <ellipse cx="40" cy="48" rx="36" ry="14" fill="url(#chipRed)" stroke="#ffffff" strokeWidth="2" />
          <ellipse cx="40" cy="48" rx="22" ry="8" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" />
          <text x="40" y="52" fontFamily="sans-serif" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">50</text>

          <ellipse cx="65" cy="38" rx="36" ry="14" fill="#1e3a8a" />
          <ellipse cx="65" cy="31" rx="36" ry="14" fill="url(#chipBlue)" stroke="#ffffff" strokeWidth="2" />
          <ellipse cx="65" cy="31" rx="22" ry="8" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" />
          <text x="65" y="35" fontFamily="sans-serif" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">100</text>
        </g>

        {/* 6. 3D Glowing Dice */}
        <g transform="translate(295, 230) rotate(16)">
          <polygon points="40,10 70,25 40,40 10,25" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          <polygon points="10,25 40,40 40,75 10,60" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="40,40 70,25 70,60 40,75" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
          {/* Glowing Purple Pips */}
          <circle cx="40" cy="25" r="3.5" fill="#8b5cf6" filter="url(#glowPurple)" />
          <circle cx="25" cy="48" r="3" fill="#8b5cf6" />
          <circle cx="25" cy="62" r="3" fill="#8b5cf6" />
          <circle cx="55" cy="46" r="3" fill="#8b5cf6" />
          <circle cx="55" cy="60" r="3" fill="#8b5cf6" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 2. FEATURED GAME ILLUSTRATIONS
// ============================================================================
export function UndercoverIllustration({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-900/60 to-indigo-950/80 border border-purple-500/30 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <circle cx="50" cy="50" r="42" fill="#1e1035" />
        <circle cx="50" cy="50" r="32" fill="#3b0764" opacity="0.6" />
        {/* Fedora */}
        <path d="M22 46 C22 38 32 30 50 30 C68 30 78 38 78 46 L88 48 C75 46 25 46 12 48 Z" fill="#0f172a" stroke="#c084fc" strokeWidth="1.5" />
        <path d="M30 42 C30 35 38 32 50 32 C62 32 70 35 70 42 Z" fill="#c084fc" opacity="0.8" />
        {/* Sunglasses */}
        <path d="M32 55 L46 55 L44 64 L34 64 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M54 55 L68 55 L66 64 L56 64 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="46" y1="58" x2="54" y2="58" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Collar */}
        <path d="M28 80 L44 68 L50 74 L56 68 L72 80 Z" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function SpyfallIllustration({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-amber-900/40 to-orange-950/70 border border-amber-500/30 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <circle cx="50" cy="50" r="42" fill="#1c120c" />
        {/* Binoculars Body */}
        <rect x="25" y="38" width="22" height="34" rx="8" fill="#292524" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="53" y="38" width="22" height="34" rx="8" fill="#292524" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="44" y="44" width="12" height="8" rx="2" fill="#78350f" />
        {/* Glowing Lenses */}
        <circle cx="36" cy="58" r="9" fill="#d97706" />
        <circle cx="36" cy="58" r="7" fill="#fbbf24" opacity="0.9" />
        <circle cx="64" cy="58" r="9" fill="#d97706" />
        <circle cx="64" cy="58" r="7" fill="#fbbf24" opacity="0.9" />
        {/* Skyline Reflection in lens */}
        <path d="M30 60 L33 55 L36 57 L39 53 L42 62 Z" fill="#78350f" opacity="0.7" />
        <path d="M58 60 L61 55 L64 57 L67 53 L70 62 Z" fill="#78350f" opacity="0.7" />
      </svg>
    </div>
  );
}

export function BhabhiCardIllustration({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-950/70 border border-pink-500/30 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <circle cx="50" cy="50" r="42" fill="#1e102d" />
        {/* Back Card (King) */}
        <g transform="translate(24, 26) rotate(-10)">
          <rect width="32" height="46" rx="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="4" y="10" fontSize="8" fontWeight="bold" fill="#dc2626">K♥</text>
        </g>
        {/* Front Card (Ace of Spades) */}
        <g transform="translate(42, 28) rotate(12)">
          <rect width="34" height="48" rx="5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="4" y="10" fontSize="8" fontWeight="black" fill="#0f172a">A♠</text>
          <text x="17" y="32" fontSize="16" fill="#0f172a" textAnchor="middle">♠</text>
        </g>
        {/* Golden Royal Crown */}
        <g transform="translate(36, 12)">
          <polygon points="14,14 6,24 22,24" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          <polygon points="14,8 10,22 18,22" fill="#f59e0b" />
          <circle cx="6" cy="14" r="2" fill="#ef4444" />
          <circle cx="14" cy="8" r="2.5" fill="#3b82f6" />
          <circle cx="22" cy="14" r="2" fill="#10b981" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 3. CATALOG GAME ICONS (8 In Development Games)
// ============================================================================
export function CatalogIconGraphic({
  gameId,
  className = 'w-full h-full',
}: {
  gameId: string;
  className?: string;
}) {
  switch (gameId) {
    case 'decrypto':
      return (
        <div className={`rounded-xl bg-cyan-950/70 border border-cyan-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <rect x="8" y="14" width="44" height="34" rx="8" fill="#082f49" stroke="#06b6d4" strokeWidth="2" />
            <line x1="30" y1="14" x2="30" y2="8" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="30" cy="7" r="2" fill="#38bdf8" />
            {/* Waveform */}
            <path d="M14 31 L20 31 L24 22 L28 40 L32 20 L36 36 L40 31 L46 31" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'codenames':
      return (
        <div className={`rounded-xl bg-purple-950/70 border border-purple-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            {/* Red Spy */}
            <circle cx="22" cy="24" r="7" fill="#dc2626" />
            <path d="M12 44 C12 34 32 34 32 44 Z" fill="#991b1b" />
            {/* Blue Spy */}
            <circle cx="38" cy="24" r="7" fill="#2563eb" />
            <path d="M28 44 C28 34 48 34 48 44 Z" fill="#1d4ed8" />
            {/* Dark Fog Silhouette Overlays */}
            <path d="M16 22 L28 22 L26 27 L18 27 Z" fill="#020617" />
            <path d="M32 22 L44 22 L42 27 L34 27 Z" fill="#020617" />
          </svg>
        </div>
      );
    case 'avalon':
      return (
        <div className={`rounded-xl bg-amber-950/70 border border-amber-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <path d="M18 16 C18 30 42 30 42 16 L42 12 L18 12 Z" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
            <path d="M26 28 L26 42 L34 42 L34 28 Z" fill="#d97706" />
            <rect x="20" y="42" width="20" height="6" rx="2" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
            <circle cx="30" cy="20" r="3" fill="#ef4444" />
          </svg>
        </div>
      );
    case 'secret-chancellor':
      return (
        <div className={`rounded-xl bg-rose-950/70 border border-rose-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <path d="M20 26 C20 16 40 16 40 26 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="30" y1="16" x2="30" y2="10" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="30" cy="9" r="1.5" fill="#f43f5e" />
            <rect x="14" y="26" width="32" height="4" fill="#cbd5e1" />
            {/* Columns */}
            <line x1="18" y1="30" x2="18" y2="44" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="26" y1="30" x2="26" y2="44" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="34" y1="30" x2="34" y2="44" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="42" y1="30" x2="42" y2="44" stroke="#ffffff" strokeWidth="2.5" />
            <rect x="12" y="44" width="36" height="5" fill="#94a3b8" />
          </svg>
        </div>
      );
    case 'werewolf':
      return (
        <div className={`rounded-xl bg-blue-950/70 border border-blue-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <circle cx="36" cy="26" r="14" fill="#38bdf8" opacity="0.9" />
            <path d="M14 46 C22 36 26 26 24 20 L28 17 L32 23 C36 19 40 14 38 10 C44 18 42 28 38 34 L46 46 Z" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
            <circle cx="33" cy="22" r="1.5" fill="#38bdf8" />
          </svg>
        </div>
      );
    case 'two-rooms':
      return (
        <div className={`rounded-xl bg-red-950/70 border border-red-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <rect x="12" y="18" width="36" height="28" rx="6" fill="#dc2626" stroke="#f87171" strokeWidth="2" />
            <rect x="22" y="14" width="16" height="6" rx="2" fill="none" stroke="#f87171" strokeWidth="2" />
            <rect x="18" y="26" width="24" height="12" rx="3" fill="#0f172a" />
            <text x="30" y="35" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#ef4444" textAnchor="middle">00:59</text>
          </svg>
        </div>
      );
    case 'wavelength':
      return (
        <div className={`rounded-xl bg-fuchsia-950/70 border border-fuchsia-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <circle cx="28" cy="30" r="12" fill="#d946ef" />
            <path d="M20 48 C20 38 36 38 36 48 Z" fill="#a21caf" />
            {/* Concentric Rainbow Spectrum Waves */}
            <path d="M36 20 C42 24 42 36 36 40" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
            <path d="M40 16 C48 22 48 38 40 44" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 12 C54 20 54 40 44 48" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'teen-patti':
      return (
        <div className={`rounded-xl bg-emerald-950/70 border border-emerald-500/30 p-2 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <g transform="translate(14, 14) rotate(-12)">
              <rect width="18" height="26" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <text x="2" y="7" fontSize="5" fontWeight="bold" fill="#dc2626">A♥</text>
            </g>
            <g transform="translate(24, 14) rotate(4)">
              <rect width="18" height="26" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <text x="2" y="7" fontSize="5" fontWeight="bold" fill="#0f172a">K♠</text>
            </g>
            <g transform="translate(34, 14) rotate(18)">
              <rect width="18" height="26" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <text x="2" y="7" fontSize="5" fontWeight="bold" fill="#dc2626">Q♦</text>
            </g>
            <ellipse cx="26" cy="45" rx="14" ry="6" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />
            <ellipse cx="36" cy="41" rx="14" ry="6" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-xl ${className}`}>
          🎮
        </div>
      );
  }
}

// ============================================================================
// 4. BHABHI MASCOTS (AI Dealer & Solo Robot)
// ============================================================================
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
        <div className="max-w-md mb-2 p-3 px-4 rounded-2xl bg-[#160b33]/95 border border-purple-400/50 shadow-2xl backdrop-blur-md text-xs text-purple-200 animate-in fade-in zoom-in-95 relative">
          <strong className="text-amber-300 block mb-0.5 font-bold flex items-center gap-1">
            <span>🤖 AI Dealer:</span>
          </strong>
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#160b33]" />
        </div>
      )}

      <div className={`relative ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_10px_20px_rgba(139,92,246,0.3)]" fill="none">
          <defs>
            <linearGradient id="botHeadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="goldPedestal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Golden Pedestal */}
          <ellipse cx="80" cy="142" rx="44" ry="12" fill="url(#goldPedestal)" stroke="#f59e0b" strokeWidth="2" />
          <ellipse cx="80" cy="138" rx="36" ry="8" fill="#fef08a" opacity="0.6" />

          {/* Headphones */}
          <path d="M30 65 C30 25 130 25 130 65" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" />
          <rect x="20" y="52" width="16" height="30" rx="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="2" />
          <rect x="124" y="52" width="16" height="30" rx="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="2" />

          {/* Head Body */}
          <rect x="34" y="36" width="92" height="74" rx="26" fill="url(#botHeadGrad)" stroke="#e2e8f0" strokeWidth="3" />

          {/* Visor Screen */}
          <rect x="44" y="48" width="72" height="42" rx="14" fill="#090d16" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="64" cy="66" rx="7" ry="9" fill="#38bdf8" />
          <ellipse cx="96" cy="66" rx="7" ry="9" fill="#38bdf8" />
          <path d="M72 80 Q80 86 88 80" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Red Bowtie */}
          <polygon points="80,114 66,106 66,122" fill="#ef4444" />
          <polygon points="80,114 94,106 94,122" fill="#ef4444" />
          <circle cx="80" cy="114" r="4" fill="#b91c1c" />
        </svg>
      </div>
    </div>
  );
}

export function SoloRobotIllustration({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)]" fill="none">
        {/* Robot Head */}
        <rect x="36" y="32" width="88" height="72" rx="24" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
        {/* Visor */}
        <rect x="46" y="44" width="68" height="40" rx="12" fill="#090d16" stroke="#10b981" strokeWidth="1.5" />
        <ellipse cx="64" cy="62" rx="7" ry="8" fill="#10b981" />
        <ellipse cx="96" cy="62" rx="7" ry="8" fill="#10b981" />
        <path d="M72 74 Q80 80 88 74" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        {/* Antennas */}
        <line x1="80" y1="32" x2="80" y2="18" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="80" cy="16" r="4" fill="#10b981" />
        {/* Three Fanned Red Cards */}
        <g transform="translate(48, 92) rotate(-14) scale(0.7)">
          <rect width="28" height="42" rx="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
        </g>
        <g transform="translate(68, 88) rotate(0) scale(0.7)">
          <rect width="28" height="42" rx="4" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
        </g>
        <g transform="translate(86, 92) rotate(14) scale(0.7)">
          <rect width="28" height="42" rx="4" fill="#b91c1c" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

export function OnlineMultiplayerIllustration({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_10px_20px_rgba(139,92,246,0.3)]" fill="none">
        <circle cx="80" cy="70" r="48" fill="#0c172e" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="80" cy="70" rx="24" ry="48" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="80" cy="70" rx="48" ry="20" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
        <line x1="32" y1="70" x2="128" y2="70" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
        {/* Three Avatars */}
        <g transform="translate(34, 95)">
          <circle cx="16" cy="14" r="10" fill="#a855f7" />
          <path d="M4 36 C4 24 28 24 28 36 Z" fill="#a855f7" />
        </g>
        <g transform="translate(64, 85)">
          <circle cx="16" cy="14" r="12" fill="#38bdf8" />
          <path d="M2 42 C2 28 30 28 30 42 Z" fill="#38bdf8" />
        </g>
        <g transform="translate(96, 95)">
          <circle cx="16" cy="14" r="10" fill="#c084fc" />
          <path d="M4 36 C4 24 28 24 28 36 Z" fill="#c084fc" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 4B. BHABHI ENTRY DECORATIONS (Header Left & Right)
// ============================================================================
export function EntryCardsAndChipsIllustration({ className = 'w-48 h-36' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]" fill="none">
        <defs>
          <filter id="chipShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Card 1: Ace of Spades (left tilted) */}
        <g transform="translate(15, 25) rotate(-16)">
          <rect width="70" height="105" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <text x="8" y="22" fill="#0f172a" fontSize="16" fontWeight="900" fontFamily="sans-serif">A</text>
          <text x="8" y="38" fill="#0f172a" fontSize="14">♠</text>
          <text x="35" y="70" textAnchor="middle" fill="#0f172a" fontSize="30">♠</text>
        </g>

        {/* Card 2: Queen of Diamonds (middle slightly tilted) */}
        <g transform="translate(65, 12) rotate(-3)">
          <rect width="70" height="105" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <text x="8" y="22" fill="#ef4444" fontSize="16" fontWeight="900" fontFamily="sans-serif">Q</text>
          <text x="8" y="38" fill="#ef4444" fontSize="14">♦</text>
          <text x="35" y="70" textAnchor="middle" fill="#ef4444" fontSize="30">♦</text>
        </g>

        {/* Card 3: King of Clubs (right card with King illustration) */}
        <g transform="translate(115, 15) rotate(14)">
          <rect width="75" height="110" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <text x="8" y="22" fill="#0f172a" fontSize="16" fontWeight="900" fontFamily="sans-serif">K</text>
          <text x="8" y="38" fill="#0f172a" fontSize="14">♣</text>
          {/* King Robe & Crown Silhouette */}
          <rect x="20" y="45" width="40" height="50" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
          <polygon points="28,45 32,35 40,40 48,35 52,45" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          <circle cx="40" cy="55" r="9" fill="#fed7aa" />
          <path d="M34 60 Q40 68 46 60" stroke="#78350f" strokeWidth="1.5" fill="none" />
          <rect x="26" y="65" width="28" height="25" fill="#dc2626" rx="2" />
        </g>

        {/* Red Chips Stack (Left) */}
        <g transform="translate(50, 110)" filter="url(#chipShadow)">
          <ellipse cx="30" cy="28" rx="28" ry="12" fill="#991b1b" />
          <rect x="2" y="20" width="56" height="8" fill="#dc2626" />
          <ellipse cx="30" cy="20" rx="28" ry="12" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />
          
          <rect x="2" y="10" width="56" height="8" fill="#dc2626" />
          <ellipse cx="30" cy="10" rx="28" ry="12" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />
        </g>

        {/* Blue Chips Stack (Right) */}
        <g transform="translate(90, 120)" filter="url(#chipShadow)">
          <ellipse cx="30" cy="28" rx="28" ry="12" fill="#1e3a8a" />
          <rect x="2" y="20" width="56" height="8" fill="#2563eb" />
          <ellipse cx="30" cy="20" rx="28" ry="12" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />

          <rect x="2" y="10" width="56" height="8" fill="#2563eb" />
          <ellipse cx="30" cy="10" rx="28" ry="12" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />
        </g>
      </svg>
    </div>
  );
}

export function EntryPurpleCardsIllustration({ className = 'w-48 h-36' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" fill="none">
        {/* Card 1 (Far Left back) */}
        <g transform="translate(20, 35) rotate(-18)">
          <rect width="68" height="105" rx="10" fill="#1e1035" stroke="#7e22ce" strokeWidth="2.5" />
          <rect x="6" y="6" width="56" height="93" rx="7" fill="#2e1065" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 3" />
          <text x="34" y="62" textAnchor="middle" fill="#c084fc" fontSize="24">♠</text>
        </g>

        {/* Card 2 (Middle) */}
        <g transform="translate(70, 20) rotate(-4)">
          <rect width="70" height="110" rx="10" fill="#2e1065" stroke="#a855f7" strokeWidth="2.5" />
          <rect x="6" y="6" width="58" height="98" rx="7" fill="#3b0764" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="4 3" />
          <text x="35" y="66" textAnchor="middle" fill="#e9d5ff" fontSize="28">♠</text>
        </g>

        {/* Card 3 (Right tilt, brightest) */}
        <g transform="translate(125, 25) rotate(16)">
          <rect width="72" height="112" rx="10" fill="#3b0764" stroke="#c084fc" strokeWidth="3" />
          <rect x="6" y="6" width="60" height="100" rx="7" fill="#581c87" stroke="#e9d5ff" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="36" cy="62" r="20" fill="#9333ea" opacity="0.3" filter="blur(4px)" />
          <text x="36" y="69" textAnchor="middle" fill="#ffffff" fontSize="32">♠</text>
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 4C. BHABHI LOBBY & IN-GAME DECORATIONS
// ============================================================================
export function LobbyCardsIllustration({ className = 'w-20 h-16' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-[0_8px_16px_rgba(139,92,246,0.35)]" fill="none">
        {/* Star Sparkle top right */}
        <polygon points="135,15 138,22 145,25 138,28 135,35 132,28 125,25 132,22" fill="#fbbf24" />

        {/* Card 1: Ace of Spades (left tilt) */}
        <g transform="translate(18, 15) rotate(-16)">
          <rect width="45" height="68" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="6" y="16" fill="#0f172a" fontSize="12" fontWeight="900" fontFamily="sans-serif">A</text>
          <text x="22" y="42" textAnchor="middle" fill="#0f172a" fontSize="20">♠</text>
        </g>

        {/* Card 2: Queen of Hearts (middle) */}
        <g transform="translate(56, 8) rotate(-2)">
          <rect width="45" height="68" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="6" y="16" fill="#ef4444" fontSize="12" fontWeight="900" fontFamily="sans-serif">Q</text>
          <text x="22" y="42" textAnchor="middle" fill="#ef4444" fontSize="20">♥</text>
        </g>

        {/* Card 3: Queen of Clubs (right tilt) */}
        <g transform="translate(94, 15) rotate(14)">
          <rect width="45" height="68" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="6" y="16" fill="#0f172a" fontSize="12" fontWeight="900" fontFamily="sans-serif">Q</text>
          <text x="22" y="42" textAnchor="middle" fill="#0f172a" fontSize="20">♣</text>
        </g>

        {/* Golden Crown in front */}
        <g transform="translate(52, 58)">
          <polygon
            points="5,35 12,18 28,26 44,18 51,35"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="2"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
          />
          <circle cx="12" cy="17" r="2.5" fill="#fef08a" />
          <circle cx="28" cy="25" r="2.5" fill="#fef08a" />
          <circle cx="44" cy="17" r="2.5" fill="#fef08a" />
          <rect x="7" y="32" width="42" height="6" rx="2" fill="#d97706" />
        </g>
      </svg>
    </div>
  );
}

export function DiscardPileIllustration({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(168,85,247,0.4)]" fill="none">
        {/* Card 1 */}
        <g transform="translate(15, 20) rotate(-14)">
          <rect width="40" height="58" rx="5" fill="#1e1035" stroke="#7e22ce" strokeWidth="1.5" />
          <text x="20" y="36" textAnchor="middle" fill="#a855f7" fontSize="18">♠</text>
        </g>
        {/* Card 2 */}
        <g transform="translate(28, 14) rotate(-3)">
          <rect width="40" height="58" rx="5" fill="#2e1065" stroke="#9333ea" strokeWidth="1.5" />
          <text x="20" y="36" textAnchor="middle" fill="#c084fc" fontSize="18">♠</text>
        </g>
        {/* Card 3 (Top) */}
        <g transform="translate(42, 20) rotate(12)">
          <rect width="42" height="60" rx="5" fill="#3b0764" stroke="#c084fc" strokeWidth="2" />
          <text x="21" y="38" textAnchor="middle" fill="#ffffff" fontSize="20">♠</text>
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 5. STYLIZED AVATAR PORTRAITS
// ============================================================================
export function StylizedAvatar({
  variant,
  className = 'w-12 h-12',
}: {
  variant: 'you' | 'aman' | 'simran' | 'rohan' | 'priya' | 'bot';
  className?: string;
}) {
  const configs = {
    you: { bg: '#064e3b', rim: '#10b981', emoji: '😎', label: 'You' },
    aman: { bg: '#451a03', rim: '#f59e0b', emoji: '🕶️', label: 'Aman' },
    simran: { bg: '#4c1d95', rim: '#c084fc', emoji: '👩', label: 'Simran' },
    rohan: { bg: '#082f49', rim: '#38bdf8', emoji: '🎧', label: 'Rohan' },
    priya: { bg: '#500724', rim: '#f43f5e', emoji: '✨', label: 'Priya' },
    bot: { bg: '#1e1b4b', rim: '#818cf8', emoji: '🤖', label: 'Bot' },
  }[variant];

  return (
    <div
      className={`rounded-full flex items-center justify-center border-2 shadow-lg transition-transform ${className}`}
      style={{
        backgroundColor: configs.bg,
        borderColor: configs.rim,
        boxShadow: `0 0 15px ${configs.rim}40`,
      }}
    >
      <span className="text-xl sm:text-2xl select-none">{configs.emoji}</span>
    </div>
  );
}
