'use client';

import React from 'react';
import { SpyfallGameApp } from '@/components/game/spyfall/SpyfallGameApp';

export default function SpyfallGamePage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6">
      <SpyfallGameApp />
    </div>
  );
}

