'use client';

import React from 'react';
import { X, Shield, EyeOff, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { ROLE_INFO } from '@/game-engine/undercover';
import { soundManager } from '@/lib/audio/sound-effects';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-300">🕵️</span>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">Undercover Dossier</h2>
              <p className="text-xs text-gray-400">Rules of engagement & role intel</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">The 3 Secret Roles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Civilian */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Shield className="w-4 h-4" />
                Civilian
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                You receive the majority secret word (e.g., <em>Coffee</em>). Describe your word subtly without revealing it outright to impostors.
              </p>
              <div className="text-[11px] font-semibold text-cyan-300 bg-cyan-900/40 px-2 py-1 rounded">
                Victory: Vote out all impostors!
              </div>
            </div>

            {/* Undercover */}
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <EyeOff className="w-4 h-4" />
                Undercover
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                You receive a subtly different word (e.g., <em>Tea</em>). Blend in with civilian clues, deduce their word, and deflect suspicion.
              </p>
              <div className="text-[11px] font-semibold text-rose-300 bg-rose-900/40 px-2 py-1 rounded">
                Victory: Equal or outnumber civilians!
              </div>
            </div>

            {/* Mr. White */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <HelpCircle className="w-4 h-4" />
                Mr. White
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                You receive <strong>NO word</strong>! Bluff through every turn by echoing others. If voted out, you get 1 final guess at the Civilians&apos; word!
              </p>
              <div className="text-[11px] font-semibold text-purple-300 bg-purple-900/40 px-2 py-1 rounded">
                Victory: Survive to end OR guess civilian word!
              </div>
            </div>
          </div>
        </div>

        {/* Gameplay Flow */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Mission Phases</h3>
          <ol className="space-y-2 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">1</span>
              <div>
                <strong className="text-white">Confidential Briefing:</strong> Players take turns holding the device to view their secret role and word in absolute privacy.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">2</span>
              <div>
                <strong className="text-white">Clue Giving:</strong> Starting with the first agent, each player says one brief clue or sentence describing their word.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">3</span>
              <div>
                <strong className="text-white">Deliberation & Voting:</strong> Debate who seems suspicious. Cast your vote (either consensus or secret ballot) to eliminate the top suspect.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">4</span>
              <div>
                <strong className="text-white">The Reveal & Heist:</strong> The eliminated player is unmasked. If Mr. White is voted out, they get ONE guess to steal the win!
              </div>
            </li>
          </ol>
        </div>

        {/* Tactical Tips */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Tactical Pro-Tips
          </div>
          <p>
            • Civilians: Give clues that only another civilian would understand. Don&apos;t be too obvious or Mr. White will figure out your word!
          </p>
          <p>
            • Undercovers: Listen carefully to early clues. If you suspect your word is slightly off, adapt your descriptions immediately.
          </p>
          <p>
            • Mr. White: Say ambiguous, poetic, or versatile clues (&quot;It brings people together&quot;, &quot;Popular in the morning&quot;) until you deduce the topic.
          </p>
        </div>

        {/* Dismiss Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition shadow-lg shadow-emerald-500/20"
          >
            Understood, Agent
          </button>
        </div>
      </div>
    </div>
  );
}

