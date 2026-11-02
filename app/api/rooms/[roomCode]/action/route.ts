import { NextRequest, NextResponse } from 'next/server';
import {
  addBotToRoom,
  joinRoom,
  playRoomCard,
  removePlayerFromRoom,
  sendRoomChatMessage,
  startRoomGame,
  getMaskedRoomState,
} from '@/lib/rooms/room-manager';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  const body = await request.json();
  const { action, playerId } = body;

  if (!action || !playerId) {
    return NextResponse.json(
      { error: 'Missing action or playerId' },
      { status: 400 }
    );
  }

  let result: { success: boolean; error?: string } = { success: false };

  switch (action) {
    case 'join':
      result = joinRoom(roomCode, {
        id: playerId,
        name: body.name || 'Guest',
        avatar: body.avatar || '😎',
      });
      break;

    case 'add_bot':
      result = addBotToRoom(roomCode, playerId);
      break;

    case 'remove_player':
      result = removePlayerFromRoom(roomCode, body.targetPlayerId || playerId, playerId);
      break;

    case 'start_game':
      result = startRoomGame(roomCode, playerId);
      break;

    case 'play_card':
      if (!body.card) {
        return NextResponse.json({ error: 'Card data required' }, { status: 400 });
      }
      result = playRoomCard(roomCode, playerId, body.card);
      break;

    case 'send_chat':
      if (!body.text) {
        return NextResponse.json({ error: 'Message text required' }, { status: 400 });
      }
      result = sendRoomChatMessage(roomCode, playerId, body.text);
      break;

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Action failed' }, { status: 400 });
  }

  const updatedState = getMaskedRoomState(roomCode, playerId);
  return NextResponse.json({ success: true, state: updatedState });
}
