'use client';

import React, { useState } from 'react';
import { HelpCircle, Sparkles, Send, AlertTriangle, Trophy, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UndercoverPlayer, checkMrWhiteGuess } from '@/game-engine/undercover';
import { soundManager } from '@/lib/audio/sound-effects';

interface MrWhiteGuessModalProps {
  player: UndercoverPlayer;
  civilianWord: string;
  onSubmitResult: (isCorrect: boolean) => void;
}

export function MrWhiteGuessModal({
  player,
  civilianWord,
  onSubmitResult,
}: MrWhiteGuessModalProps) {
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = guess.trim();
    if (!clean) return;

    const correct = checkMrWhiteGuess(clean, civilianWord);
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#a855f7', '#ec4899', '#38bdf8', '#fbbf24'],
        });
      } catch (e) {}
    } else {
      soundManager.playEliminated();
    }
  };

  const handleFinish = () => {
    soundManager.playTap();
    onSubmitResult(isCorrect);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111827] border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-purple-500/20">
        <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center">
          <HelpCircle className="w-8 h-8" />
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 uppercase tracking-widest">
          Final Gambit
        </span>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {player.name} is Mr. White!
          </h2>
          <p className="text-xs text-gray-300 max-w-xs mx-auto">
            You were eliminated with no secret word. However, you have{' '}
            <strong className="text-purple-300">ONE final guess</strong> at the Civilians&apos; secret word. If you guess right, you steal the entire victory!
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your word deduction..."
              autoFocus
              className="w-full bg-black/50 border border-purple-500/40 rounded-xl px-4 py-3 text-sm text-center text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-bold tracking-wide"
            />
            <button
              type="submit"
              disabled={!guess.trim()}
              className="w-full py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-purple-500/30"
            >
              <Send className="w-4 h-4" />
              <span>Submit Word Guess</span>
            </button>
          </form>
        ) : (
          /* Result feedback */
          <div className="space-y-4 animate-in zoom-in-95">
            {isCorrect ? (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500 space-y-2">
                <div className="flex items-center justify-center gap-2 text-purple-300 font-black text-lg">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  HEIST SUCCESSFUL!
                </div>
                <p className="text-xs text-gray-200">
                  Brilliant deduction! The secret word was indeed{' '}
                  <strong className="text-white text-sm">&quot;{civilianWord}&quot;</strong>. Mr. White steals the entire game!
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                <div className="flex items-center justify-center gap-2 text-rose-300 font-black text-lg">
                  <XCircle className="w-6 h-6" />
                  DEDUCTION FAILED!
                </div>
                <p className="text-xs text-gray-300">
                  Your guess &quot;{guess}&quot; was incorrect. The secret word was safe from the impostor!
                </p>
              </div>
            )}

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl bg-white text-black font-black text-sm hover:bg-gray-200 transition shadow-xl"
            >
              Continue Mission Debrief
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
