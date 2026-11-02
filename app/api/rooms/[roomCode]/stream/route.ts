import { NextRequest } from 'next/server';
import { getMaskedRoomState, subscribeToRoom } from '@/lib/rooms/room-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  const searchParams = request.nextUrl.searchParams;
  const playerId = searchParams.get('playerId') || undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial state immediately
      const initial = getMaskedRoomState(roomCode, playerId);
      if (initial) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));
      }

      // Subscribe to room updates
      const unsubscribe = subscribeToRoom(roomCode, () => {
        try {
          const updated = getMaskedRoomState(roomCode, playerId);
          if (updated) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(updated)}\n\n`));
          }
        } catch {
          // Stream might be closed
        }
      });

      // Heartbeat ping interval to keep connection alive
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          clearInterval(pingInterval);
          unsubscribe();
        }
      }, 15000);

      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        unsubscribe();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

