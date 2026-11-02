'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Sparkles,
  Shield,
  EyeOff,
  HelpCircle,
  Clock,
  Vote,
  Edit3,
  Shuffle,
  ChevronRight,
  AlertTriangle,
  Utensils,
  Gamepad2,
  Compass,
  GraduationCap,
  Package,
  TreePine,
} from 'lucide-react';
import {
  getRecommendedRoles,
  RANDOM_AGENT_NAMES,
  AGENT_COLORS,
} from '@/game-engine/undercover';
import { UNDERCOVER_CATEGORIES, CategoryDef } from '@/game-engine/undercover/words';
import { soundManager } from '@/lib/audio/sound-effects';

export interface SetupMissionConfig {
  playerNames: string[];
  undercoverCount: number;
  hasMrWhite: boolean;
  category: string;
  customPair?: { civilian: string; undercover: string };
  turnTimerSeconds: number; // 0 for off
  votingMode: 'consensus' | 'ballot';
}

interface SetupScreenProps {
  onStartMission: (config: SetupMissionConfig) => void;
  defaultPlayers?: string[];
}

export function SetupScreen({ onStartMission, defaultPlayers }: SetupScreenProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(() => {
    if (defaultPlayers && defaultPlayers.length >= 3) return defaultPlayers;
    return ['Agent Maya', 'Agent Alex', 'Agent Jordan', 'Agent Liam'];
  });
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customCivilian, setCustomCivilian] = useState('');
  const [customUndercover, setCustomUndercover] = useState('');
  const [turnTimer, setTurnTimer] = useState<number>(30); // 30s
  const [votingMode, setVotingMode] = useState<'consensus' | 'ballot'>('consensus');

  // Role configuration with automatic recommendations
  const count = playerNames.length;
  const recommended = getRecommendedRoles(count);
  const [undercoverCount, setUndercoverCount] = useState<number>(recommended.undercovers);
  const [hasMrWhite, setHasMrWhite] = useState<boolean>(recommended.mrWhites > 0);

  // Auto-sync recommendations when player count changes unless manually customized
  useEffect(() => {
    const rec = getRecommendedRoles(playerNames.length);
    setUndercoverCount(rec.undercovers);
    setHasMrWhite(rec.mrWhites > 0);
  }, [playerNames.length]);

  const civilianCount = playerNames.length - undercoverCount - (hasMrWhite ? 1 : 0);
  const isValidConfig = playerNames.length >= 3 && civilianCount >= 1;

  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;
    if (playerNames.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      return; // No duplicate names
    }
    soundManager.playSelect();
    setPlayerNames([...playerNames, trimmed]);
    setNewPlayerName('');
  };

  const handleAddRandom = () => {
    const available = RANDOM_AGENT_NAMES.filter(
      (n) => !playerNames.some((p) => p.toLowerCase().includes(n.toLowerCase()))
    );
    const chosen = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : `Agent ${playerNames.length + 1}`;
    soundManager.playSelect();
    setPlayerNames([...playerNames, chosen]);
  };

  const handleRemovePlayer = (idx: number) => {
    if (playerNames.length <= 3) return;
    soundManager.playTap();
    setPlayerNames(playerNames.filter((_, i) => i !== idx));
  };

  const handleLaunch = () => {
    if (!isValidConfig) return;
    soundManager.playDramaticBoom();
    onStartMission({
      playerNames,
      undercoverCount,
      hasMrWhite,
      category: selectedCategory,
      customPair:
        selectedCategory === 'custom' && customCivilian && customUndercover
          ? { civilian: customCivilian, undercover: customUndercover }
          : undefined,
      turnTimerSeconds: turnTimer,
      votingMode,
    });
  };

  // Helper icon renderer for categories
  const renderCategoryIcon = (id: string) => {
    switch (id) {
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'tech_pop':
        return <Gamepad2 className="w-4 h-4 text-pink-400" />;
      case 'places':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'college':
        return <GraduationCap className="w-4 h-4 text-orange-400" />;
      case 'objects':
        return <Package className="w-4 h-4 text-sky-400" />;
      case 'nature':
        return <TreePine className="w-4 h-4 text-green-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* 1. Squad / Roster Manager */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Agent Squad Roster</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              {playerNames.length} Agents
            </span>
          </div>

          <button
            onClick={handleAddRandom}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition border border-white/10"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Quick Add Agent
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddPlayer();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter agent code name..."
            maxLength={20}
            className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
          />
          <button
            type="submit"
            disabled={!newPlayerName.trim()}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-sm flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add
          </button>
        </form>

        {/* Players Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {playerNames.map((name, idx) => {
            const color = AGENT_COLORS[idx % AGENT_COLORS.length];
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border transition group"
                style={{ borderColor: `${color}40` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-semibold text-white truncate">{name}</span>
                </div>
                {playerNames.length > 3 && (
                  <button
                    onClick={() => handleRemovePlayer(idx)}
                    className="text-gray-500 hover:text-rose-400 transition opacity-60 group-hover:opacity-100 p-1"
                    title="Remove player"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {playerNames.length < 3 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Undercover requires at least 3 players to launch.
          </div>
        )}
      </div>

      {/* 2. Role Configuration & Recommendations */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Mission Roles & Intel</h2>
          </div>
          <span className="text-xs text-gray-400">
            Civilian majority: <strong className="text-cyan-400">{civilianCount}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Civilians Indicator */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white">Civilians</div>
                <div className="text-[11px] text-gray-400">Word Majority</div>
              </div>
            </div>
            <span className="text-lg font-mono font-black text-cyan-300">{civilianCount}</span>
          </div>

          {/* Undercovers Modifier */}
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <EyeOff className="w-5 h-5 text-rose-400" />
              <div>
                <div className="text-xs font-bold text-white">Undercovers</div>
                <div className="text-[11px] text-gray-400">Slightly different word</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playTap();
                  if (undercoverCount > 1) setUndercoverCount(undercoverCount - 1);
                }}
                disabled={undercoverCount <= 1}
                className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold disabled:opacity-30 text-xs flex items-center justify-center transition"
              >
                -
              </button>
              <span className="text-lg font-mono font-black text-rose-300 w-4 text-center">
                {undercoverCount}
              </span>
              <button
                onClick={() => {
                  soundManager.playTap();
                  if (civilianCount > 2) setUndercoverCount(undercoverCount + 1);
                }}
                disabled={civilianCount <= 2}
                className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold disabled:opacity-30 text-xs flex items-center justify-center transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Mr. White Toggle */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-white">Mr. White</div>
                <div className="text-[11px] text-gray-400">No secret word</div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playSelect();
                setHasMrWhite(!hasMrWhite);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                hasMrWhite
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {hasMrWhite ? 'Active' : 'Off'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Selection */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Word Database & Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {UNDERCOVER_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playSelect();
                  setSelectedCategory(cat.id);
                }}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/10 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderCategoryIcon(cat.id)}
                    <span className="text-xs font-bold text-white">{cat.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight">
                    {cat.desc}
                  </p>
                </div>
                <div className="text-[10px] text-gray-500 font-mono mt-2 truncate">
                  {cat.sample}
                </div>
              </button>
            );
          })}

          {/* Custom Words Category Card */}
          <button
            onClick={() => {
              soundManager.playSelect();
              setSelectedCategory('custom');
            }}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedCategory === 'custom'
                ? 'bg-white/10 border-cyan-400 shadow-lg shadow-cyan-500/10'
                : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Custom Words</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                Type your own pair of secret words for custom inside jokes or themes!
              </p>
            </div>
            <div className="text-[10px] text-cyan-400 font-bold mt-2">Custom Input</div>
          </button>
        </div>

        {/* Custom Words Inputs */}
        {selectedCategory === 'custom' && (
          <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-cyan-300 mb-1">
                Civilian Word (Majority):
              </label>
              <input
                type="text"
                value={customCivilian}
                onChange={(e) => setCustomCivilian(e.target.value)}
                placeholder="e.g. Samosa"
                className="w-full bg-[#111827] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-300 mb-1">
                Undercover Word (Impostor):
              </label>
              <input
                type="text"
                value={customUndercover}
                onChange={(e) => setCustomUndercover(e.target.value)}
                placeholder="e.g. Kachori"
                className="w-full bg-[#111827] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Turn Timers & Voting Rules */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Timers & Voting Protocol</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Turn Timer Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              Agent Clue Timer:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 15, 30, 45].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    soundManager.playSelect();
                    setTurnTimer(sec);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    turnTimer === sec
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-black/30 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {sec === 0 ? 'Off' : `${sec}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Voting Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Vote className="w-4 h-4 text-emerald-400" />
              Elimination Protocol:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setVotingMode('consensus');
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  votingMode === 'consensus'
                    ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">Group Consensus</div>
                <div className="text-[10px] text-gray-400">Debate & tap suspect</div>
              </button>
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setVotingMode('ballot');
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  votingMode === 'ballot'
                    ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">Secret Ballot</div>
                <div className="text-[10px] text-gray-400">Pass phone & vote</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Start Mission Action Button */}
      <div className="pt-2">
        <button
          onClick={handleLaunch}
          disabled={!isValidConfig}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 hover:opacity-95 disabled:opacity-40 text-black font-black text-base sm:text-lg tracking-wide uppercase shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition transform active:scale-[0.99]"
        >
          <span>Launch Undercover Mission</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

