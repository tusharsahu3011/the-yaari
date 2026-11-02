'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  BookOpen,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Users,
  Smartphone,
  Globe,
} from 'lucide-react';
import {
  UndercoverGameState,
  UndercoverPlayer,
  initUndercoverGame,
  advanceSecretView,
  submitMrWhiteWordGuess,
  evaluateWinConditions,
} from '@/game-engine/undercover';
import { soundManager } from '@/lib/audio/sound-effects';
import { RulesModal } from './RulesModal';
import { SetupScreen, SetupMissionConfig } from './SetupScreen';
import { RevealScreen } from './RevealScreen';
import { TurnPhaseScreen } from './TurnPhaseScreen';
import { VoteScreen } from './VoteScreen';
import { MrWhiteGuessModal } from './MrWhiteGuessModal';
import { GameOverScreen } from './GameOverScreen';

export function UndercoverGameApp() {
  const [gameMode, setGameMode] = useState<'pass_and_play' | 'online'>('pass_and_play');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Pass & Play Game Engine State
  const [gameState, setGameState] = useState<UndercoverGameState | null>(null);
  const [lastConfig, setLastConfig] = useState<SetupMissionConfig | null>(null);
  const [eliminatedCandidate, setEliminatedCandidate] = useState<UndercoverPlayer | null>(null);
  const [isMrWhiteModalOpen, setIsMrWhiteModalOpen] = useState<boolean>(false);

  // Sound toggle handler
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.setSoundEnabled(nextState);
    if (nextState) soundManager.playSelect();
  };

  // 1. Launch Mission from Setup
  const handleStartMission = (config: SetupMissionConfig) => {
    setLastConfig(config);
    const configs = config.playerNames.map((name, idx) => ({
      id: `agent-${idx + 1}-${Date.now().toString(36)}`,
      name,
    }));

    const initial = initUndercoverGame(configs, {
      undercoverCount: config.undercoverCount,
      mrWhiteCount: config.hasMrWhite ? 1 : 0,
      category: config.category,
      customPair: config.customPair,
    });

    setGameState(initial);
  };

  // 2. Secret View progression
  const handleNextPlayerReveal = () => {
    if (!gameState) return;
    const next = advanceSecretView(gameState, gameState.revealPlayerIndex);
    setGameState(next);
  };

  const handleCompleteAllReveals = () => {
    if (!gameState) return;
    // Set all players as having viewed
    const next: UndercoverGameState = {
      ...gameState,
      phase: 'describing',
      revealPlayerIndex: gameState.players.length,
      currentDescriberIndex: 0,
    };
    setGameState(next);
  };

  // 3. Move from Clues to Voting
  const handleProceedToVoting = () => {
    if (!gameState) return;
    setGameState({
      ...gameState,
      phase: 'voting',
      votes: {},
    });
  };

  // 4. Eliminate player from voting
  const handleEliminatePlayer = (player: UndercoverPlayer) => {
    if (!gameState) return;

    // Check if eliminated player is Mr. White
    if (player.role === 'mr_white') {
      setEliminatedCandidate(player);
      setIsMrWhiteModalOpen(true);
      return;
    }

    // Normal elimination for civilian or undercover
    processElimination(player);
  };

  const processElimination = (player: UndercoverPlayer) => {
    if (!gameState) return;

    const updatedPlayers = gameState.players.map((p) =>
      p.id === player.id
        ? { ...p, isEliminated: true, eliminatedRound: gameState.roundNumber }
        : p
    );

    const evaluated = evaluateWinConditions({
      ...gameState,
      players: updatedPlayers,
      eliminatedPlayerId: player.id,
    });

    setGameState(evaluated);
  };

  // 5. Mr. White guess callback
  const handleMrWhiteGuessResult = (isCorrect: boolean) => {
    setIsMrWhiteModalOpen(false);
    if (!gameState || !eliminatedCandidate) return;

    if (isCorrect) {
      // Mr. White stole the win!
      setGameState({
        ...gameState,
        winner: 'mr_white',
        phase: 'game_over',
        winReason: `🎩 ${eliminatedCandidate.name} (Mr. White) correctly deduced the secret word "${gameState.wordPair.civilianWord}" and pulled off the ultimate heist!`,
      });
    } else {
      // Mr. White elimination stands; check remaining status
      processElimination(eliminatedCandidate);
    }
    setEliminatedCandidate(null);
  };

  // 6. Reset & Play Again
  const handlePlayAgain = () => {
    if (lastConfig) {
      handleStartMission(lastConfig);
    } else {
      setGameState(null);
    }
  };

  const handleNewMission = () => {
    setGameState(null);
  };

  return (
    <div className="w-full flex flex-col items-center max-w-5xl">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Catalogue</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-xl">🕵️</span>
            <div>
              <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                UNDERCOVER
              </h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">
                Social Deduction & Deception Game
              </p>
            </div>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Rules button */}
          <button
            onClick={() => {
              soundManager.playSelect();
              setIsRulesOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Rules Dossier</span>
          </button>

          {/* Sound toggle button */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset / Setup button */}
          {gameState && (
            <button
              onClick={() => {
                soundManager.playTap();
                setGameState(null);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition"
              title="Reset to Setup"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex justify-center">
        {/* Phase 1: Setup */}
        {!gameState && (
          <SetupScreen onStartMission={handleStartMission} />
        )}

        {/* Phase 2: Confidential Role Reveal */}
        {gameState && gameState.phase === 'role_reveal' && (
          <RevealScreen
            players={gameState.players}
            currentIndex={gameState.revealPlayerIndex}
            onNextPlayer={handleNextPlayerReveal}
            onCompleteAllReveals={handleCompleteAllReveals}
          />
        )}

        {/* Phase 3: Clue Turn Phase */}
        {gameState && gameState.phase === 'describing' && (
          <TurnPhaseScreen
            roundNumber={gameState.roundNumber}
            players={gameState.players}
            timerDurationSeconds={lastConfig?.turnTimerSeconds || 30}
            onProceedToVoting={handleProceedToVoting}
          />
        )}

        {/* Phase 4: Voting & Elimination */}
        {gameState && gameState.phase === 'voting' && (
          <VoteScreen
            roundNumber={gameState.roundNumber}
            players={gameState.players}
            votingMode={lastConfig?.votingMode || 'consensus'}
            onEliminatePlayer={handleEliminatePlayer}
          />
        )}

        {/* Phase 5: Game Over Debrief */}
        {gameState && gameState.phase === 'game_over' && (
          <GameOverScreen
            winner={gameState.winner}
            winReason={gameState.winReason}
            players={gameState.players}
            wordPair={gameState.wordPair}
            onPlayAgain={handlePlayAgain}
            onNewMission={handleNewMission}
          />
        )}
      </div>

      {/* Mr. White Guess Modal */}
      {isMrWhiteModalOpen && eliminatedCandidate && gameState && (
        <MrWhiteGuessModal
          player={eliminatedCandidate}
          civilianWord={gameState.wordPair.civilianWord}
          onSubmitResult={handleMrWhiteGuessResult}
        />
      )}

      {/* Rules Dossier Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}

