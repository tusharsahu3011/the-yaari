'use client';

import React, { useState, useEffect } from 'react';
import {
  Vote,
  Clock,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Shield,
  EyeOff,
  HelpCircle,
  Check,
  Flame,
  ArrowRight,
  UserX,
} from 'lucide-react';
import { UndercoverPlayer, ROLE_INFO } from '@/game-engine/undercover';
import { soundManager } from '@/lib/audio/sound-effects';

interface VoteScreenProps {
  roundNumber: number;
  players: UndercoverPlayer[];
  votingMode: 'consensus' | 'ballot';
  onEliminatePlayer: (player: UndercoverPlayer) => void;
}

export function VoteScreen({
  roundNumber,
  players,
  votingMode,
  onEliminatePlayer,
}: VoteScreenProps) {
  const alivePlayers = players.filter((p) => !p.isEliminated);

  // Discussion countdown timer (90 seconds)
  const [discussionTime, setDiscussionTime] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Consensus Mode State
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);

  // Secret Ballot Mode State
  const [ballotVoterIndex, setBallotVoterIndex] = useState<number>(0);
  const [ballotVotes, setBallotVotes] = useState<Record<string, number>>({});
  const [isBallotVoterReady, setIsBallotVoterReady] = useState<boolean>(false);
  const [selectedBallotTargetId, setSelectedBallotTargetId] = useState<string | null>(null);

  // Elimination Reveal Modal State
  const [revealingPlayer, setRevealingPlayer] = useState<UndercoverPlayer | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && discussionTime > 0) {
      timer = setInterval(() => {
        setDiscussionTime((prev) => {
          if (prev <= 5 && prev > 1) soundManager.playTick();
          if (prev === 1) soundManager.playDramaticBoom();
          return prev - 1;
        });
      }, 1000);
    } else if (discussionTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, discussionTime]);

  // Consensus handlers
  const handleSelectConsensusSuspect = (playerId: string) => {
    soundManager.playSelect();
    setSelectedSuspectId(playerId);
  };

  const handleConfirmConsensusElimination = () => {
    if (!selectedSuspectId) return;
    const suspect = alivePlayers.find((p) => p.id === selectedSuspectId);
    if (!suspect) return;

    soundManager.playDramaticBoom();
    setRevealingPlayer(suspect);
  };

  // Secret Ballot handlers
  const handleCastBallotVote = () => {
    if (!selectedBallotTargetId) return;
    soundManager.playSelect();

    const updatedVotes = {
      ...ballotVotes,
      [selectedBallotTargetId]: (ballotVotes[selectedBallotTargetId] || 0) + 1,
    };
    setBallotVotes(updatedVotes);
    setSelectedBallotTargetId(null);

    if (ballotVoterIndex < alivePlayers.length - 1) {
      setBallotVoterIndex((prev) => prev + 1);
      setIsBallotVoterReady(false);
    } else {
      // All ballot votes cast! Tally highest
      let maxVotes = -1;
      let highestTargetId = alivePlayers[0].id;

      Object.entries(updatedVotes).forEach(([id, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          highestTargetId = id;
        }
      });

      const eliminated = alivePlayers.find((p) => p.id === highestTargetId) || alivePlayers[0];
      soundManager.playDramaticBoom();
      setRevealingPlayer(eliminated);
    }
  };

  const handleDismissReveal = () => {
    soundManager.playTap();
    const eliminated = revealingPlayer;
    setRevealingPlayer(null);
    if (eliminated) {
      onEliminatePlayer(eliminated);
    }
  };

  const currentBallotVoter = alivePlayers[ballotVoterIndex];

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header & Debate Timer */}
      <div className="flex items-center justify-between px-2 pb-3 border-b border-white/10 flex-wrap gap-2">
        <div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
            Round {roundNumber} Elimination
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            {votingMode === 'consensus' ? 'Deliberation & Consensus' : 'Secret Ballot Voting'}
          </h1>
        </div>

        {/* 90s Debate Countdown Timer */}
        <div className="flex items-center gap-2 bg-[#111827] border border-white/10 px-3 py-1.5 rounded-xl">
          <Clock className="w-4 h-4 text-rose-400" />
          <span
            className={`font-mono font-bold text-sm ${
              discussionTime <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'
            }`}
          >
            {Math.floor(discussionTime / 60)}:
            {discussionTime % 60 < 10 ? `0${discussionTime % 60}` : discussionTime % 60}
          </span>
          <button
            onClick={() => {
              soundManager.playTap();
              setIsTimerRunning(!isTimerRunning);
            }}
            className="text-gray-400 hover:text-white transition p-1"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MODE A: Consensus Voting */}
      {votingMode === 'consensus' && (
        <div className="space-y-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Select Suspect to Eliminate by Majority Vote
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alivePlayers.map((player) => {
                const isSelected = selectedSuspectId === player.id;
                return (
                  <button
                    key={player.id}
                    onClick={() => handleSelectConsensusSuspect(player.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition transform active:scale-[0.99] ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/10'
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{player.avatar}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{player.name}</div>
                        <div className="text-[11px] text-gray-400">Active Agent</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-rose-500 text-black">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm Elimination Button */}
          {selectedSuspectId && (
            <div className="animate-in fade-in duration-200">
              <button
                onClick={handleConfirmConsensusElimination}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-black font-black text-base flex items-center justify-center gap-2 transition shadow-xl shadow-rose-500/20 active:scale-[0.99]"
              >
                <UserX className="w-5 h-5" />
                <span>
                  Confirm Elimination of{' '}
                  {alivePlayers.find((p) => p.id === selectedSuspectId)?.name}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE B: Secret Ballot Voting */}
      {votingMode === 'ballot' && currentBallotVoter && (
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5 text-center">
          {!isBallotVoterReady ? (
            /* Pass to voter shield */
            <div className="space-y-4 py-6">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                Secret Ballot Handover
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Pass device to{' '}
                <span style={{ color: currentBallotVoter.color }}>
                  {currentBallotVoter.name}
                </span>
              </h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Only {currentBallotVoter.name} should look at the screen to cast their vote in complete privacy.
              </p>
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setIsBallotVoterReady(true);
                }}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition shadow-lg shadow-cyan-500/20"
              >
                I am {currentBallotVoter.name} — Ready to Vote
              </button>
            </div>
          ) : (
            /* Ballot voting UI */
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-gray-400">
                  Agent Voting: <strong className="text-white">{currentBallotVoter.name}</strong>
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {ballotVoterIndex + 1} / {alivePlayers.length}
                </span>
              </div>

              <div className="text-xs font-bold text-gray-300">
                Who do you suspect is an impostor?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {alivePlayers.map((player) => {
                  const isSelf = player.id === currentBallotVoter.id;
                  const isSelected = selectedBallotTargetId === player.id;

                  return (
                    <button
                      key={player.id}
                      disabled={isSelf}
                      onClick={() => {
                        soundManager.playSelect();
                        setSelectedBallotTargetId(player.id);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition ${
                        isSelf
                          ? 'opacity-30 bg-black/10 border-white/5 cursor-not-allowed'
                          : isSelected
                          ? 'bg-rose-950/40 border-rose-500 text-white'
                          : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{player.avatar}</span>
                        <div className="text-xs font-bold truncate">
                          {player.name} {isSelf && '(You)'}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleCastBallotVote}
                disabled={!selectedBallotTargetId}
                className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-30 text-black font-extrabold text-sm transition shadow-lg shadow-rose-500/20"
              >
                Submit Ballot Vote
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dramatic Unmasking Reveal Modal */}
      {revealingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#111827] border-2 border-white/20 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
            <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 uppercase tracking-widest">
              Unmasking Verdict
            </span>

            {/* Avatar & Name */}
            <div className="space-y-1">
              <div className="text-4xl">{revealingPlayer.avatar}</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {revealingPlayer.name}
              </h2>
              <div className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                Has been eliminated by the squad!
              </div>
            </div>

            {/* Revealed Role Card */}
            {(() => {
              const meta = ROLE_INFO[revealingPlayer.role];
              return (
                <div
                  className="p-5 rounded-2xl border space-y-2"
                  style={{
                    backgroundColor: meta.bg,
                    borderColor: meta.color,
                  }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: meta.color }}
                  >
                    True Identity:
                  </div>
                  <div
                    className="text-2xl sm:text-3xl font-black tracking-wide"
                    style={{ color: meta.color }}
                  >
                    {meta.name}
                  </div>
                  <p className="text-xs text-gray-300">{meta.description}</p>
                </div>
              );
            })()}

            {/* Dismiss action */}
            <button
              onClick={handleDismissReveal}
              className="w-full py-3.5 rounded-xl bg-white text-black font-black text-sm transition hover:bg-gray-200 shadow-xl"
            >
              Continue Mission
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
