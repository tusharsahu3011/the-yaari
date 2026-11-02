'use client';

import React, { useState, useEffect } from 'react';
import {
  Mic,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Vote,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { UndercoverPlayer } from '@/game-engine/undercover';
import { soundManager } from '@/lib/audio/sound-effects';

interface TurnPhaseScreenProps {
  roundNumber: number;
  players: UndercoverPlayer[];
  timerDurationSeconds: number; // 0 for off
  onProceedToVoting: () => void;
}

export function TurnPhaseScreen({
  roundNumber,
  players,
  timerDurationSeconds,
  onProceedToVoting,
}: TurnPhaseScreenProps) {
  const alivePlayers = players.filter((p) => !p.isEliminated);

  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(0);
  const [completedSpeakerIds, setCompletedSpeakerIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(timerDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(timerDurationSeconds > 0);

  const currentSpeaker = alivePlayers[activeSpeakerIndex];
  const allSpeakersFinished = completedSpeakerIds.length >= alivePlayers.length;

  // Countdown timer effect
  useEffect(() => {
    if (timerDurationSeconds === 0) return;

    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            soundManager.playTick();
          } else if (prev === 1) {
            soundManager.playDramaticBoom();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeLeft, timerDurationSeconds]);

  const handleNextSpeaker = () => {
    soundManager.playTap();
    if (currentSpeaker && !completedSpeakerIds.includes(currentSpeaker.id)) {
      setCompletedSpeakerIds((prev) => [...prev, currentSpeaker.id]);
    }

    if (activeSpeakerIndex < alivePlayers.length - 1) {
      setActiveSpeakerIndex((prev) => prev + 1);
      setTimeLeft(timerDurationSeconds);
      setIsTimerRunning(timerDurationSeconds > 0);
    }
  };

  const handleResetTimer = () => {
    soundManager.playTap();
    setTimeLeft(timerDurationSeconds);
    setIsTimerRunning(false);
  };

  const handleToggleTimer = () => {
    soundManager.playTap();
    setIsTimerRunning(!isTimerRunning);
  };

  const handleStartVoting = () => {
    soundManager.playDramaticBoom();
    onProceedToVoting();
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Round & Phase Header */}
      <div className="flex items-center justify-between px-2 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            Round {roundNumber}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">Clue Phase</h1>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Agents Spoken</div>
          <div className="text-sm font-mono font-bold text-cyan-400">
            {completedSpeakerIds.length} / {alivePlayers.length}
          </div>
        </div>
      </div>

      {/* Active Speaker Spotlight Card */}
      {!allSpeakersFinished && currentSpeaker ? (
        <div
          className="bg-[#111827] border rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden"
          style={{ borderColor: `${currentSpeaker.color}60` }}
        >
          {/* Subtle background glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentSpeaker.color }}
          />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
            <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Agent Spotlight
          </div>

          {/* Speaker Avatar & Name */}
          <div className="space-y-2">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black shadow-lg border-2"
              style={{
                backgroundColor: `${currentSpeaker.color}20`,
                borderColor: currentSpeaker.color,
                color: currentSpeaker.color,
              }}
            >
              {currentSpeaker.avatar}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {currentSpeaker.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
              Give <strong className="text-white">one brief clue</strong> describing your word without giving it away!
            </p>
          </div>

          {/* Timer Widget (if enabled) */}
          {timerDurationSeconds > 0 && (
            <div className="inline-flex items-center gap-4 px-4 py-2 rounded-2xl bg-black/40 border border-white/10">
              <Clock className="w-4 h-4 text-cyan-400" />
              <div
                className={`text-2xl font-mono font-black ${
                  timeLeft <= 5 ? 'text-rose-400 animate-bounce' : 'text-white'
                }`}
              >
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={handleToggleTimer}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Next Speaker Button */}
          <div>
            <button
              onClick={handleNextSpeaker}
              className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-xl shadow-cyan-500/20 active:scale-[0.99]"
            >
              <span>Done Speaking (Next Agent)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* All turns completed -> Ready for Voting Card */
        <div className="bg-[#111827] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">All Clues Given!</h2>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Every agent has shared their clue for Round {roundNumber}. Deliberate on suspects and cast your vote!
            </p>
          </div>

          <button
            onClick={handleStartVoting}
            className="w-full max-w-sm mx-auto py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-black font-black text-base flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-500/20 active:scale-[0.99]"
          >
            <Vote className="w-5 h-5" />
            <span>Proceed to Deliberation & Voting</span>
          </button>
        </div>
      )}

      {/* Agents Roster Checklist */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Agent Turn Status
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {alivePlayers.map((player, idx) => {
            const hasSpoken = completedSpeakerIds.includes(player.id);
            const isSpeakingNow = idx === activeSpeakerIndex && !allSpeakersFinished;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
                  isSpeakingNow
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : hasSpoken
                    ? 'bg-black/40 border-emerald-500/30 opacity-70'
                    : 'bg-black/20 border-white/10 opacity-40'
                }`}
              >
                <span className="text-base">{player.avatar}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{player.name}</div>
                  <div className="text-[10px] text-gray-400">
                    {isSpeakingNow ? 'Speaking now' : hasSpoken ? 'Clue given' : 'Waiting'}
                  </div>
                </div>
                {hasSpoken && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
