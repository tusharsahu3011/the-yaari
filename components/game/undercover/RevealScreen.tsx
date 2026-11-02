'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  EyeOff,
  HelpCircle,
  Eye,
  Lock,
  ArrowRight,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import { UndercoverPlayer, ROLE_INFO } from '@/game-engine/undercover';
import { soundManager } from '@/lib/audio/sound-effects';

interface RevealScreenProps {
  players: UndercoverPlayer[];
  currentIndex: number;
  onNextPlayer: () => void;
  onCompleteAllReveals: () => void;
}

export function RevealScreen({
  players,
  currentIndex,
  onNextPlayer,
  onCompleteAllReveals,
}: RevealScreenProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [hasRevealedCurrent, setHasRevealedCurrent] = useState(false);
  const isHoldingRef = useRef(false);

  const currentPlayer = players[currentIndex];
  const isLast = currentIndex === players.length - 1;
  const roleMeta = ROLE_INFO[currentPlayer.role];

  const startHold = (e?: React.SyntheticEvent | Event) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    if (!isHoldingRef.current) {
      isHoldingRef.current = true;
      setIsHolding(true);
      setHasRevealedCurrent(true);
      soundManager.playPeek();
    }
  };

  const endHold = (e?: React.SyntheticEvent | Event) => {
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setIsHolding(false);
    }
  };

  // Foolproof global listeners for releasing hold anywhere
  useEffect(() => {
    const handleGlobalRelease = () => {
      if (isHoldingRef.current) {
        isHoldingRef.current = false;
        setIsHolding(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    window.addEventListener('touchcancel', handleGlobalRelease);
    window.addEventListener('pointerup', handleGlobalRelease);
    window.addEventListener('pointercancel', handleGlobalRelease);

    return () => {
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      window.removeEventListener('touchcancel', handleGlobalRelease);
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('pointercancel', handleGlobalRelease);
    };
  }, []);

  // Keyboard Spacebar hold support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isHoldingRef.current) {
        e.preventDefault();
        startHold();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        endHold();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleAdvance = () => {
    soundManager.playTap();
    isHoldingRef.current = false;
    setIsHolding(false);
    setHasRevealedCurrent(false);

    if (isLast) {
      soundManager.playDramaticBoom();
      onCompleteAllReveals();
    } else {
      onNextPlayer();
    }
  };

  return (
    <div className="w-full max-w-lg space-y-6 text-center">
      {/* Progress header */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-gray-400 font-mono">
          Agent {currentIndex + 1} of {players.length}
        </span>
        <div className="flex gap-1.5">
          {players.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? 'w-4 bg-emerald-400'
                  : i === currentIndex
                  ? 'w-6 bg-cyan-400'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Target Agent Callout */}
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Confidential Handover
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
          <span>Pass Device to</span>
          <span style={{ color: currentPlayer.color }}>{currentPlayer.name}</span>
        </h1>
        <p className="text-xs text-gray-400">
          Make sure no other eyes are watching your screen!
        </p>
      </div>

      {/* Privacy Shield & Hold to Reveal Card */}
      <div className="relative min-h-[300px] flex items-center justify-center">
        {/* Revealed Content (visible while holding) */}
        <div
          className={`w-full bg-[#111827] border rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-200 select-none ${
            isHolding ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
          style={{ borderColor: roleMeta.color }}
        >
          {/* Role Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
               style={{ backgroundColor: roleMeta.bg, color: roleMeta.color, border: `1px solid ${roleMeta.border}` }}>
            {currentPlayer.role === 'civilian' && <Shield className="w-4 h-4" />}
            {currentPlayer.role === 'undercover' && <EyeOff className="w-4 h-4" />}
            {currentPlayer.role === 'mr_white' && <HelpCircle className="w-4 h-4" />}
            <span>{roleMeta.name}</span>
          </div>

          {/* Word Display or Mr. White Warning */}
          {currentPlayer.role === 'mr_white' ? (
            <div className="space-y-2 py-4">
              <div className="text-3xl font-black text-purple-300 tracking-wider">
                NO SECRET WORD
              </div>
              <p className="text-xs text-purple-200/80 max-w-xs mx-auto">
                You are Mr. White! You have no word. Listen carefully to others, bluff with versatile clues, and try to deduce the secret word!
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                Your Secret Word:
              </div>
              <div
                className="text-3xl sm:text-4xl font-black tracking-wide"
                style={{ color: roleMeta.color }}
              >
                {currentPlayer.secretWord}
              </div>
              <p className="text-xs text-gray-300 max-w-xs mx-auto leading-relaxed">
                {roleMeta.description}
              </p>
            </div>
          )}

          <div className="text-[11px] text-gray-500 font-mono">
            Release to conceal immediately
          </div>
        </div>

        {/* Concealed Privacy Shield Overlay (visible when NOT holding) */}
        {!isHolding && (
          <div
            onMouseDown={startHold}
            onTouchStart={startHold}
            className="absolute inset-0 w-full bg-gradient-to-b from-[#151c2e] to-[#0c121e] border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-cyan-500/40 transition group select-none shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
              <Fingerprint className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                Press & Hold to Reveal Word
              </div>
              <p className="text-xs text-gray-400">
                Hold your finger or press Spacebar. Lifting conceals immediately.
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/5 text-[11px] text-gray-400 font-mono">
              Biometric Privacy Shield Active
            </div>
          </div>
        )}
      </div>

      {/* Advance to Next Player Button */}
      {hasRevealedCurrent && (
        <div className="pt-2 animate-in fade-in duration-200">
          <button
            onClick={handleAdvance}
            className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-xl shadow-cyan-500/20"
          >
            <span>{isLast ? 'Begin Clue Round' : 'Next Agent'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
