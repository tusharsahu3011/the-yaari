import { NextRequest, NextResponse } from 'next/server';
import { getMaskedRoomState, getOrCreateRoom } from '@/lib/rooms/room-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  const searchParams = request.nextUrl.searchParams;
  const playerId = searchParams.get('playerId') || undefined;

  // Ensure room exists
  getOrCreateRoom(roomCode);
  const state = getMaskedRoomState(roomCode, playerId);

  if (!state) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  return NextResponse.json(state);
}

