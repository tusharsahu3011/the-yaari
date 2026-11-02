'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BhabhiGameTable } from '@/components/game/BhabhiGameTable';
import { PlayerConfig } from '@/game-engine/bhabhi';

function SoloGameWrapper() {
  const searchParams = useSearchParams();
  const playerCount = Math.min(6, Math.max(3, Number(searchParams.get('players')) || 4));
  const difficulty = (searchParams.get('difficulty') || 'normal') as 'easy' | 'normal' | 'smart';

  const botNames = [
    { name: 'Bot Rohit', avatar: '🤖' },
    { name: 'Bot Priya', avatar: '🦊' },
    { name: 'Bot Aman', avatar: '🐼' },
    { name: 'Bot Simran', avatar: '🦁' },
    { name: 'Bot Kabir', avatar: '🐯' },
  ];

  const players: PlayerConfig[] = [
    { id: 'human-1', name: 'You', isBot: false, avatar: '😎' },
  ];

  for (let i = 0; i < playerCount - 1; i++) {
    players.push({
      id: `bot-${i + 1}`,
      name: `${botNames[i].name} (${difficulty})`,
      isBot: true,
      botDifficulty: difficulty,
      avatar: botNames[i].avatar,
    });
  }

  return <BhabhiGameTable initialPlayers={players} />;
}

export default function BhabhiSoloPage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading game table...</div>}>
        <SoloGameWrapper />
      </Suspense>
    </div>
  );
}
