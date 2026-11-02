'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Shield,
  EyeOff,
  HelpCircle,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  UndercoverPlayer,
  UndercoverWinner,
  ROLE_INFO,
  WordPair,
} from '@/game-engine/undercover';
import { soundManager } from '@/lib/audio/sound-effects';

interface GameOverScreenProps {
  winner: UndercoverWinner;
  winReason?: string;
  players: UndercoverPlayer[];
  wordPair: WordPair;
  onPlayAgain: () => void;
  onNewMission: () => void;
}

export function GameOverScreen({
  winner,
  winReason,
  players,
  wordPair,
  onPlayAgain,
  onNewMission,
}: GameOverScreenProps) {
  useEffect(() => {
    soundManager.playVictory();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#f43f5e', '#a855f7', '#10b981', '#f59e0b'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
        });
      }, 350);

      return () => clearTimeout(timer);
    } catch (e) {}
  }, []);

  const getWinnerPresentation = () => {
    switch (winner) {
      case 'civilians':
        return {
          title: 'CIVILIANS TRIUMPH!',
          subtitle: 'The infiltrators were unmasked and justice has been served.',
          color: '#06b6d4',
          bg: 'rgba(6, 182, 212, 0.15)',
          border: 'border-cyan-500/50',
          icon: <Shield className="w-10 h-10 text-cyan-400" />,
        };
      case 'undercover':
        return {
          title: 'UNDERCOVER OPERATIVES WIN!',
          subtitle: 'The undercover agents blended in seamlessly and outlasted the civilians.',
          color: '#f43f5e',
          bg: 'rgba(244, 63, 94, 0.15)',
          border: 'border-rose-500/50',
          icon: <EyeOff className="w-10 h-10 text-rose-400" />,
        };
      case 'mr_white':
        return {
          title: 'MR. WHITE STOLE THE WIN!',
          subtitle: 'Against all odds with no secret word, Mr. White executed the ultimate heist!',
          color: '#a855f7',
          bg: 'rgba(168, 85, 247, 0.15)',
          border: 'border-purple-500/50',
          icon: <HelpCircle className="w-10 h-10 text-purple-400" />,
        };
      default:
        return {
          title: 'MISSION DEBRIEF',
          subtitle: winReason || 'The mission has concluded.',
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'border-emerald-500/50',
          icon: <Trophy className="w-10 h-10 text-emerald-400" />,
        };
    }
  };

  const meta = getWinnerPresentation();

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* 1. Winner Showcase Card */}
      <div
        className={`bg-[#111827] border-2 ${meta.border} rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden`}
        style={{ backgroundColor: meta.bg }}
      >
        <div className="w-20 h-20 rounded-full bg-black/40 border border-white/10 mx-auto flex items-center justify-center shadow-lg">
          {meta.icon}
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest font-black text-gray-400">
            Debriefing Verdict
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black tracking-wide"
            style={{ color: meta.color }}
          >
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            {winReason || meta.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Confidential Word Pair Unveiling */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          The Secret Words Revealed
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Civilian Secret Word
            </div>
            <div className="text-xl font-black text-white">{wordPair.civilianWord}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
              Undercover Secret Word
            </div>
            <div className="text-xl font-black text-white">{wordPair.undercoverWord}</div>
          </div>
        </div>
      </div>

      {/* 3. Full Squad Roster Unmasked Table */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Agent Identities Unmasked
        </div>

        <div className="divide-y divide-white/5">
          {players.map((player) => {
            const role = ROLE_INFO[player.role];
            const isWinner =
              (winner === 'civilians' && player.role === 'civilian') ||
              (winner === 'undercover' && player.role === 'undercover') ||
              (winner === 'mr_white' && player.role === 'mr_white');

            return (
              <div
                key={player.id}
                className="flex items-center justify-between py-3 px-1 gap-2 flex-wrap"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{player.avatar}</span>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {isWinner && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          Winner
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {player.isEliminated
                        ? `Eliminated (Round ${player.eliminatedRound || 1})`
                        : 'Survived'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className="text-xs font-black uppercase px-2.5 py-1 rounded-full inline-block"
                      style={{
                        backgroundColor: role.bg,
                        color: role.color,
                        border: `1px solid ${role.border}`,
                      }}
                    >
                      {role.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => {
            soundManager.playTap();
            onPlayAgain();
          }}
          className="py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-cyan-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again (Same Squad)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            onNewMission();
          }}
          className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition border border-white/10"
        >
          <Users className="w-4 h-4" />
          <span>New Mission Setup</span>
        </button>
      </div>
    </div>
  );
}

