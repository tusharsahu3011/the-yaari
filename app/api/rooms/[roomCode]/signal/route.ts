import { NextRequest, NextResponse } from 'next/server';

interface SignalMessage {
  id: string;
  fromId: string;
  toId: string;
  type: 'offer' | 'answer' | 'candidate';
  payload: any;
  timestamp: number;
}

// In-memory signals store per room
declare global {
  var __gameshub_signals: Map<string, SignalMessage[]> | undefined;
}

if (!globalThis.__gameshub_signals) {
  globalThis.__gameshub_signals = new Map();
}

const signalsMap = globalThis.__gameshub_signals;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  const searchParams = request.nextUrl.searchParams;
  const playerId = searchParams.get('playerId');

  if (!playerId) {
    return NextResponse.json({ error: 'playerId required' }, { status: 400 });
  }

  const code = roomCode.toUpperCase();
  const roomSignals = signalsMap.get(code) || [];

  // Filter signals addressed to this player
  const mySignals = roomSignals.filter((s) => s.toId === playerId);

  // Remove delivered signals
  signalsMap.set(
    code,
    roomSignals.filter((s) => s.toId !== playerId)
  );

  return NextResponse.json({ signals: mySignals });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  const body = await request.json();
  const { fromId, toId, type, payload } = body;

  if (!fromId || !toId || !type || !payload) {
    return NextResponse.json({ error: 'Invalid signal payload' }, { status: 400 });
  }

  const code = roomCode.toUpperCase();
  const roomSignals = signalsMap.get(code) || [];

  roomSignals.push({
    id: `sig-${Date.now()}-${Math.random()}`,
    fromId,
    toId,
    type,
    payload,
    timestamp: Date.now(),
  });

  // Keep max 100 signals
  if (roomSignals.length > 100) {
    roomSignals.shift();
  }
  signalsMap.set(code, roomSignals);

  return NextResponse.json({ success: true });
}

