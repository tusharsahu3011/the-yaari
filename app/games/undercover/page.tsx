'use client';

import React from 'react';
import { UndercoverGameApp } from '@/components/game/undercover/UndercoverGameApp';

export default function UndercoverGamePage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6">
      <UndercoverGameApp />
    </div>
  );
}
