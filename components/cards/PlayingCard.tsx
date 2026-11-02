'use client';

import React from 'react';
import { Card, getRankLabel, getSuitColor, getSuitSymbol } from '@/game-engine/bhabhi';

export interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  isPlayable?: boolean;
  isThullaCandidate?: boolean;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export function PlayingCard({
  card,
  faceDown = false,
  isPlayable = false,
  isThullaCandidate = false,
  isSelected = false,
  size = 'md',
  onClick,
  className = '',
}: PlayingCardProps) {
  // Size dimensions
  const sizeClasses = {
    sm: 'w-12 h-18 text-xs rounded-md shadow-sm',
    md: 'w-16 h-24 sm:w-20 sm:h-28 text-sm sm:text-base rounded-xl shadow-md',
    lg: 'w-24 h-36 sm:w-28 sm:h-40 text-lg sm:text-xl rounded-2xl shadow-xl',
  }[size];

  if (faceDown || !card) {
    return (
      <div
        className={`relative select-none flex items-center justify-center border border-indigo-400/30 overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 ${sizeClasses} ${className}`}
      >
        {/* Ornate back pattern */}
        <div className="absolute inset-1 border border-indigo-500/20 rounded-[6px] flex items-center justify-center opacity-70">
          <div className="w-full h-full bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
        </div>
        <div className="relative w-5 h-5 rounded-full border border-purple-400/40 flex items-center justify-center bg-purple-900/50">
          <span className="text-[10px] text-purple-300 font-bold">♠</span>
        </div>
      </div>
    );
  }

  const isRed = getSuitColor(card.suit) === 'red';
  const suitSymbol = getSuitSymbol(card.suit);
  const rankLabel = getRankLabel(card.rank);
  const isAceOfSpades = card.suit === 'S' && card.rank === 14;

  const colorClass = isRed ? 'text-red-600' : 'text-slate-900';

  let interactionStyles = '';
  if (isPlayable) {
    if (isThullaCandidate) {
      interactionStyles =
        'cursor-pointer ring-2 ring-rose-500 shadow-lg shadow-rose-600/40 hover:-translate-y-2 hover:shadow-rose-600/70 active:scale-95 transition-all duration-200';
    } else {
      interactionStyles =
        'cursor-pointer ring-2 ring-emerald-400 shadow-md shadow-emerald-500/30 hover:-translate-y-2 hover:shadow-emerald-500/60 active:scale-95 transition-all duration-200';
    }
  } else if (onClick) {
    interactionStyles = 'cursor-pointer hover:-translate-y-1 transition-all duration-200';
  } else {
    interactionStyles = 'opacity-85';
  }

  if (isSelected) {
    interactionStyles += ' -translate-y-3 ring-4 ring-amber-400 shadow-xl shadow-amber-400/40';
  }

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`relative select-none flex flex-col justify-between p-1.5 sm:p-2 bg-gradient-to-b from-white via-slate-50 to-gray-100 border border-slate-300/80 ${sizeClasses} ${interactionStyles} ${className}`}
    >
      {/* Top Left Rank & Suit */}
      <div className={`flex flex-col items-center leading-none font-bold ${colorClass}`}>
        <span className="text-xs sm:text-sm tracking-tight">{rankLabel}</span>
        <span className="text-xs sm:text-sm mt-0.5">{suitSymbol}</span>
      </div>

      {/* Center Art / Suit Symbol */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none ${colorClass}`}
      >
        {isAceOfSpades ? (
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-4xl text-slate-950 font-black scale-125">
              ♠
            </span>
            <span className="text-[7px] sm:text-[9px] uppercase font-extrabold tracking-widest text-slate-800 -mt-0.5">
              Lead
            </span>
          </div>
        ) : card.rank >= 11 ? (
          <div className="flex flex-col items-center opacity-85">
            <span className="text-xl sm:text-3xl font-serif font-black">{rankLabel}</span>
            <span className="text-xs sm:text-base -mt-1">{suitSymbol}</span>
          </div>
        ) : (
          <span className="text-xl sm:text-3xl opacity-90">{suitSymbol}</span>
        )}
      </div>

      {/* Bottom Right Rank & Suit (Inverted) */}
      <div
        className={`flex flex-col items-center leading-none font-bold rotate-180 self-end ${colorClass}`}
      >
        <span className="text-xs sm:text-sm tracking-tight">{rankLabel}</span>
        <span className="text-xs sm:text-sm mt-0.5">{suitSymbol}</span>
      </div>

      {/* Thulla indicator badge */}
      {isThullaCandidate && isPlayable && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-rose-600 text-[9px] font-black uppercase text-white rounded-full shadow-md animate-pulse whitespace-nowrap">
          Thulla!
        </div>
      )}
    </div>
  );
}

