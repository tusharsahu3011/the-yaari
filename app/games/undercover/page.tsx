'use client';

import React from 'react';
import Link from 'next/link';
import { UndercoverPassAndPlay } from '@/components/game/UndercoverPassAndPlay';
import { Sparkles, Users, ArrowLeft, BookOpen, ShieldAlert } from 'lucide-react';

export default function UndercoverGamePage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <Link
          href="/games"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games Catalogue
        </Link>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
          🕵️ Social Deduction
        </span>
      </div>

      <UndercoverPassAndPlay />
    </div>
  );
}
