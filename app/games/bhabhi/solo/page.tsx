'use client';

import React from 'react';
import { BhabhiGameTable } from '@/components/game/BhabhiGameTable';

export default function BhabhiSoloPage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <BhabhiGameTable />
    </div>
  );
}
