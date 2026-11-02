'use client';

import React, { useState, useEffect, useRef, use, Suspense } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Users,
  Copy,
  Check,
  Bot,
  Play,
  Mic,
  MicOff,
  Send,
  Crown,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  PhoneOff,
  Smile,
  LogOut,
  Settings,
  BookOpen,
  Share2,
  Plus,
  Radio,
  Clock,
  Layers,
  X,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { MaskedRoomState, MaskedRoomPlayer, RoomChatMessage } from '@/lib/rooms/room-types';
import { PlayingCard } from '@/components/cards/PlayingCard';
import { Card, getSuitSymbol, getSuitName } from '@/game-engine/bhabhi';
import { VoiceMeshManager } from '@/lib/webrtc/voice-manager';
import { soundManager } from '@/lib/audio/sound-effects';

export function BhabhiRoomClient({ roomCode }: { roomCode: string }) {
  const [copied, setCopied] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selfSpeaking, setSelfSpeaking] = useState(false);
  const voiceRef = useRef<VoiceMeshManager | null>(null);

  if (!voiceRef.current && typeof window !== 'undefined') {
    voiceRef.current = new VoiceMeshManager();
  }

  const [roomState, setRoomState] = useState<MaskedRoomState | null>(null);
  const [inputMsg, setInputMsg] = useState('');
  const [playerId, setPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('VibeSeeker_9410');
  const [playerAvatar, setPlayerAvatar] = useState<string>('/assets/bhabhi/avatar-you.png');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'voice'>('chat');
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Initialize or load Guest Player Profile from localStorage
  useEffect(() => {
    let id = localStorage.getItem('gameshub_player_id');
    let name = localStorage.getItem('gameshub_player_name');

    if (!id) {
      id = `usr-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('gameshub_player_id', id);
    }
    if (!name) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      name = `VibeSeeker_${rand}`;
      localStorage.setItem('gameshub_player_name', name);
    }

    setPlayerId(id);
    setPlayerName(name);

    // Join room via API
    fetch(`/api/rooms/${roomCode}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'join',
        playerId: id,
        name,
        avatar: '/assets/bhabhi/avatar-you.png',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.state) {
          setRoomState(data.state);
        }
      })
      .catch((err) => console.error('Join error', err))
      .finally(() => setIsJoining(false));
  }, [roomCode]);

  // Connect to Real-time Server-Sent Events (SSE) Stream
  useEffect(() => {
    if (!playerId) return;

    const eventSource = new EventSource(
      `/api/rooms/${roomCode}/stream?playerId=${encodeURIComponent(playerId)}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data: MaskedRoomState = JSON.parse(event.data);
        setRoomState(data);
      } catch (err) {
        console.error('SSE parse error', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE stream reconnecting...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [roomCode, playerId]);

  // Celebration confetti when player escapes
  useEffect(() => {
    if (!roomState || !playerId) return;
    const me = roomState.players.find((p) => p.id === playerId);
    if (me?.isSafe) {
      soundManager.playVictory();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  }, [roomState?.players, playerId]);

  const copyInvite = () => {
    soundManager.playSelect();
    const url = typeof window !== 'undefined' ? window.location.href : roomCode;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMicrophone = async () => {
    soundManager.playTap();
    if (!voiceRef.current) return;
    if (!isMicOn) {
      const ok = await voiceRef.current.startMicrophone(
        (speaking: boolean) => setSelfSpeaking(speaking),
        (err: string) => console.warn(err)
      );
      if (ok) setIsMicOn(true);
    } else {
      voiceRef.current.setMute(true);
      voiceRef.current.stop();
      setIsMicOn(false);
      setSelfSpeaking(false);
    }
  };

  const executeAction = async (action: string, payload: any = {}) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/rooms/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          playerId,
          ...payload,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to execute action');
        soundManager.playTap();
      } else if (data.state) {
        setRoomState(data.state);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    }
  };

  const handleAddBot = () => {
    soundManager.playSelect();
    executeAction('add_bot');
  };

  const handleStartGame = () => {
    soundManager.playDramaticBoom();
    executeAction('start_game');
  };

  const handleSendChat = (e?: React.FormEvent, directMsg?: string) => {
    if (e) e.preventDefault();
    const msg = directMsg || inputMsg;
    if (!msg.trim()) return;
    soundManager.playCardSnap();
    executeAction('chat', { text: msg.trim() });
    if (!directMsg) setInputMsg('');
  };

  const handlePlayCard = (card: Card) => {
    soundManager.playCardSnap();
    setSelectedCardId(card.id);
    executeAction('play_card', { card });
  };

  if (isJoining || !roomState) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        <p className="text-gray-300 text-sm font-semibold">Connecting to Bhabhi Room {roomCode}...</p>
      </div>
    );
  }

  const isHost = roomState.players.some((p) => p.id === playerId && p.isHost);
  const canStartGame = isHost && roomState.players.length >= 3;
  const isPlaying = roomState.status === 'playing' || roomState.status === 'game_over';

  // Seats for 6 players in lobby
  const seats: (MaskedRoomPlayer | null)[] = [...Array(6)].map(
    (_, i) => roomState.players[i] || null
  );

  // Fallback avatars for opponents in live match
  const opponentAvatars = [
    { name: 'Aman', avatar: '/assets/bhabhi/avatar-aman.png', cardCount: 16 },
    { name: 'Simran', avatar: '/assets/bhabhi/avatar-simran.png', cardCount: 16 },
    { name: 'Rohan', avatar: '/assets/bhabhi/avatar-rohan.png', cardCount: 15 },
    { name: 'Priya', avatar: '/assets/bhabhi/avatar-priya.png', cardCount: 16 },
  ];

  // Default pre-populated chat messages if empty
  const displayChat =
    roomState.chatMessages.length > 0
      ? roomState.chatMessages
      : [
          {
            id: 'c1',
            senderId: 'simran',
            senderName: 'Simran',
            senderAvatar: '/assets/bhabhi/avatar-simran.png',
            text: 'Ab thulla maarne ka time aa gaya! 😂',
            timestamp: Date.now() - 40000,
          },
          {
            id: 'c2',
            senderId: 'rohan',
            senderName: 'Rohan',
            senderAvatar: '/assets/bhabhi/avatar-rohan.png',
            text: 'Aman bhai, sambhal ke! High card mat khelna! 😂',
            timestamp: Date.now() - 25000,
          },
          {
            id: 'c3',
            senderId: 'ai_dealer',
            senderName: 'AI Dealer',
            senderAvatar: '/assets/bhabhi/ai-dealer.png',
            text: 'Wah! Sabne spade follow kiya. Clean sweep! Ab dekhte hain agla lead kaun leta hai! 🚀',
            timestamp: Date.now() - 10000,
          },
        ];

  // ====================================================
  // VIEW 1: LOBBY VIEW (Mockup 2 visual parity)
  // ====================================================
  if (!isPlaying) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 select-none">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/games/bhabhi"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black text-base">🃏</span>
              <span className="font-black text-sm text-white">Bhabhi</span>
              <span className="text-xs text-gray-400 font-semibold">(Get Away)</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-purple-400" /> Online Multiplayer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Rules & Guide</span>
            </button>
            <Link
              href="/games/bhabhi"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition"
              title="Leave Room"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Room Lobby Header Card & Room Code (Image 2) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 flex items-center gap-4">
            {/* 3D Lobby Cards Artwork */}
            <div className="w-20 h-16 shrink-0 flex items-center justify-center">
              <img
                src="/assets/bhabhi/lobby-cards.png"
                alt="Lobby Cards"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(139,92,246,0.3)]"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Room Lobby
              </h1>
              <p className="text-xs sm:text-sm text-gray-300">
                Invite your friends, talk, and start the Bhabhi match!
              </p>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#101428] border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Room Code
              </div>
              <div className="text-xl font-mono font-black text-white tracking-widest flex items-center gap-2">
                <span>{roomCode}</span>
                <button
                  onClick={copyInvite}
                  className="text-gray-400 hover:text-white transition"
                  title="Copy room code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={copyInvite}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#632df3] hover:bg-[#5224d8] text-white font-bold text-xs shadow-md shadow-purple-600/30 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Room</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Lobby: Left Seats Grid, Right Social (Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Players Grid (1 / 6) */}
          <div className="lg:col-span-7 bg-[#0d1020] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm sm:text-base font-black text-white">
                  Players ({roomState.players.length} / 6)
                </h2>
              </div>
              <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <span>Minimum 3 players to start</span>
              </div>
            </div>

            {/* 6 Seat Slots in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seats.map((player, idx) => {
                if (player) {
                  return (
                    <div
                      key={player.id}
                      className="p-3.5 rounded-2xl bg-[#13192f] border-2 border-emerald-500/40 shadow-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-400/60 shadow">
                            <img
                              src={player.avatar || '/assets/bhabhi/avatar-you.png'}
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {player.isHost && (
                            <span className="absolute -top-1.5 -right-1 text-xs">👑</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{player.name}</span>
                            {player.isHost && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                                HOST
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{player.isBot ? 'AI Bot' : 'Online'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Mic className="w-4 h-4 text-emerald-400" />
                        <Volume2 className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  );
                }

                // Empty Seat Slot
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/20 border border-white/10 border-dashed flex items-center justify-between text-gray-500"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-500">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-400">Seat #{idx + 1}</div>
                        <div className="text-[10px] text-gray-600">Waiting for player...</div>
                      </div>
                    </div>

                    {isHost && (
                      <button
                        onClick={handleAddBot}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition border border-white/10"
                        title="Add AI Bot to this seat"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Voice Chat & Lobby Chat (Image 2) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Voice Chat Widget */}
            <div className="bg-[#0d1020] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Voice Chat
                  </h3>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Connected</span>
                </div>
              </div>

              {/* 3 Circular Action Buttons (Image 2) */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <button
                  onClick={toggleMicrophone}
                  className={`py-2 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-bold transition ${
                    isMicOn
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </div>
                  <span>{isMicOn ? 'Mic On' : 'Muted'}</span>
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`py-2 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-bold transition ${
                    isSpeakerOn
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <span>Speaker</span>
                </button>

                <button
                  onClick={() => {
                    setIsMicOn(false);
                    soundManager.playTap();
                  }}
                  className="py-2 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex flex-col items-center gap-1 text-[11px] font-bold"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <PhoneOff className="w-4 h-4" />
                  </div>
                  <span>Leave Voice</span>
                </button>
              </div>
            </div>

            {/* Lobby Chat */}
            <div className="bg-[#0d1020] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-3 min-h-[220px]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white">
                    Lobby Chat ({roomState.chatMessages.length})
                  </h3>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">Quick Chat</span>
              </div>

              {/* Messages or Empty State */}
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-1.5 py-4">
                {roomState.chatMessages.length === 0 ? (
                  <>
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-gray-300">No messages yet</div>
                    <div className="text-[10px] text-gray-500">Say hi to other players!</div>
                  </>
                ) : (
                  <div className="w-full space-y-2 text-left max-h-36 overflow-y-auto">
                    {roomState.chatMessages.map((msg) => (
                      <div key={msg.id} className="text-xs">
                        <strong className="text-purple-300">{msg.senderName}:</strong>{' '}
                        <span className="text-gray-200">{msg.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={80}
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="p-2 rounded-xl bg-[#632df3] hover:bg-[#5224d8] text-white disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Add AI Bot & Start Game (Image 2) */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handleAddBot}
            className="px-6 py-3.5 rounded-2xl bg-[#632df3] hover:bg-[#5224d8] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
          >
            <Bot className="w-4 h-4" />
            <span>Add AI Bot</span>
          </button>

          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={!canStartGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 disabled:opacity-40 text-black font-black text-sm sm:text-base flex items-center gap-2 transition shadow-xl shadow-emerald-500/20 active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Start Game</span>
            </button>
          ) : (
            <div className="text-xs text-gray-400 font-medium">
              Waiting for host to start the game...
            </div>
          )}
        </div>

        {/* Rules Modal */}
        {isRulesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#111827] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" /> Rules & Guide
                </h3>
                <button onClick={() => setIsRulesOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs text-gray-300">
                <p>• Mandatory Ace of Spades (A♠) opening lead.</p>
                <p>• Must follow the lead suit.</p>
                <p>• If void, strike a Thulla on the highest lead card!</p>
                <p>• Last person left holding cards becomes the Bhabhi!</p>
              </div>
              <button
                onClick={() => setIsRulesOpen(false)}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ====================================================
  // VIEW 2: ONLINE LIVE MATCH TABLE (Mockup 1 exact parity)
  // ====================================================
  const humanSeat = roomState.players.find((p) => p.id === playerId);
  const otherPlayers = roomState.players.filter((p) => p.id !== playerId);

  // If otherPlayers is fewer than 4, fill slots from template opponents
  const liveOpponents = [
    otherPlayers[0] || { id: 'op1', name: 'Aman', avatar: '/assets/bhabhi/avatar-aman.png', cardCount: 16 },
    otherPlayers[1] || { id: 'op2', name: 'Simran', avatar: '/assets/bhabhi/avatar-simran.png', cardCount: 16 },
    otherPlayers[2] || { id: 'op3', name: 'Rohan', avatar: '/assets/bhabhi/avatar-rohan.png', cardCount: 15 },
    otherPlayers[3] || { id: 'op4', name: 'Priya', avatar: '/assets/bhabhi/avatar-priya.png', cardCount: 16 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-between p-2 sm:p-4 select-none space-y-3 min-h-[calc(100vh-4rem)]">
      {/* 1. Top Bar (Image 1) */}
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-[#0d1020] border border-white/10 shadow-lg flex-wrap gap-2 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/games/bhabhi"
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-black text-base">🃏</span>
            <span className="font-black text-sm text-white">Bhabhi</span>
            <span className="text-xs text-gray-400 font-semibold">(Get Away)</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" /> Online Room
          </span>
        </div>

        {/* Center Room Code with copy */}
        <div className="flex items-center gap-2 bg-[#12162a] border border-white/10 px-3 py-1 rounded-xl">
          <span className="text-xs text-gray-400 font-semibold">Room:</span>
          <span className="font-mono text-xs font-black text-white">{roomCode}</span>
          <button onClick={copyInvite} className="text-gray-400 hover:text-white">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Voice, Chat, Rules */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMicrophone}
            className={`p-2 rounded-xl border transition ${
              isMicOn
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSideTab(activeSideTab === 'chat' ? 'voice' : 'chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-400 bg-emerald-950/20 text-xs font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat ({displayChat.length})</span>
          </button>

          <button
            onClick={() => setIsRulesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-bold"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Rules</span>
          </button>
        </div>
      </div>

      {/* 2. Main Match Arena: Left Panels, Center Table, Right Panels (Image 1) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-start flex-1">
        {/* Left Floating Info Boxes (Image 1) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
          {/* Game Progress Card */}
          <div className="p-4 rounded-2xl bg-[#0d1020] border border-white/10 space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>Game Progress</span>
            </div>
            <div className="text-xs font-bold text-white">4 Players</div>
            <p className="text-[11px] text-gray-400 leading-tight">
              Goal: Get rid of all your cards. Last one with cards = Bhabhi! 👑
            </p>
          </div>

          {/* Table Info Card */}
          <div className="p-4 rounded-2xl bg-[#0d1020] border border-white/10 space-y-2 shadow-xl text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span>🃏</span> Table Info
            </div>
            <div className="text-[11px] text-gray-400">
              Deck: <strong className="text-white">52 cards</strong>
            </div>
            <div className="text-[11px] text-gray-400">
              Players: <strong className="text-white">4</strong>
            </div>
            <div className="text-[10px] text-gray-400 font-mono pt-1 border-t border-white/5">
              Rank Order:
              <div className="text-[9px] text-gray-500 mt-0.5">
                A &gt; K &gt; Q &gt; J &gt; 10 &gt; 9 &gt; 8 &gt; 7 &gt; 6 &gt; 5 &gt; 4 &gt; 3 &gt; 2
              </div>
            </div>

            <button
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className="w-full mt-2 py-2 rounded-xl bg-[#632df3]/40 hover:bg-[#632df3]/70 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
            >
              <span>🎁</span> Emojis
            </button>
          </div>
        </div>

        {/* Center Oval Table Arena (Image 1 signature!) */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-3">
          <div className="relative w-full h-[500px] sm:h-[530px] rounded-[52px] bg-[radial-gradient(ellipse_at_center,_#2b135c_0%,_#160b33_60%,_#09041a_100%)] border-4 border-[#8b2cf5] shadow-[0_0_80px_rgba(139,44,245,0.45)] flex flex-col justify-between p-4 sm:p-5 overflow-hidden">
            {/* Inner gold line */}
            <div className="absolute inset-2.5 rounded-[46px] border border-amber-400/20 pointer-events-none" />

            {/* Top Center: AI Dealer on Pedestal + Speech Bubble (Image 1) */}
            <div className="w-full flex items-start justify-center gap-3 z-20 pt-1">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(234,179,8,0.4)]">
                <img
                  src="/assets/bhabhi/ai-dealer.png"
                  alt="AI Dealer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Hinglish Speech Bubble */}
              <div className="max-w-xs sm:max-w-sm bg-[#160b33]/90 border border-purple-400/50 rounded-2xl p-2.5 px-3.5 text-[11px] text-purple-200 shadow-xl backdrop-blur-md">
                <strong className="text-amber-300 block mb-0.5 font-bold flex items-center gap-1">
                  <span>🤖 AI Dealer:</span>
                </strong>
                Chalo bhaiyon! Bhabhi ki mehfil shuru ho chuki hai! Ace of Spades kiske paas hai? Pehla waar usi ka! ♠
              </div>
            </div>

            {/* Opponent Seats Positioned on the Table */}
            {/* Top Row: Aman (Left) & Simran (Right) */}
            <div className="w-full flex items-center justify-around px-4 z-10">
              {/* Aman */}
              <div className="flex flex-col items-center">
                <div className="flex -space-x-3 mb-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-8 rounded bg-gradient-to-br from-purple-700 to-indigo-950 border border-purple-400/40 shadow-sm"
                    />
                  ))}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg ring-2 ring-amber-400/30">
                    <img
                      src="/assets/bhabhi/avatar-aman.png"
                      alt="Aman"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Mic className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5" />
                </div>
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-[11px] font-bold text-white shadow flex items-center gap-1">
                  <span>Aman</span>
                  <span className="text-[10px] text-purple-300 font-mono">(16)</span>
                </div>
              </div>

              {/* Simran */}
              <div className="flex flex-col items-center">
                <div className="flex -space-x-3 mb-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-8 rounded bg-gradient-to-br from-purple-700 to-indigo-950 border border-purple-400/40 shadow-sm"
                    />
                  ))}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 shadow-lg ring-2 ring-purple-400/30">
                    <img
                      src="/assets/bhabhi/avatar-simran.png"
                      alt="Simran"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Mic className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5" />
                </div>
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-[11px] font-bold text-white shadow flex items-center gap-1">
                  <span>Simran</span>
                  <span className="text-[10px] text-purple-300 font-mono">(16)</span>
                </div>
              </div>
            </div>

            {/* Middle Row: Rohan (Left) | Center Trick Area | Priya (Right) */}
            <div className="w-full flex items-center justify-between px-2 sm:px-6 z-10">
              {/* Rohan (Left) */}
              <div className="flex flex-col items-center">
                <div className="flex -space-x-3 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-8 rounded bg-gradient-to-br from-purple-700 to-indigo-950 border border-purple-400/40 shadow-sm"
                    />
                  ))}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 shadow-lg ring-2 ring-cyan-400/30">
                    <img
                      src="/assets/bhabhi/avatar-rohan.png"
                      alt="Rohan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Mic className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-[11px] font-bold text-white shadow flex items-center gap-1">
                  <span>Rohan</span>
                  <span className="text-[10px] text-cyan-300 font-mono">(15)</span>
                </div>
              </div>

              {/* CENTER TRICK FELT (Image 1: 4 cards + Aman won banner) */}
              <div className="flex flex-col items-center space-y-2">
                {/* Lead Suit Banner */}
                <div className="px-4 py-1 rounded-full bg-black/80 border border-amber-400/70 text-amber-300 text-xs font-black shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-1.5">
                  <span>Lead Suit: ♠ Spades</span>
                </div>

                {/* 4 Cards Played Horizontally in Trick */}
                <div className="flex items-center gap-2 sm:gap-3 py-1">
                  {/* Card 1: Ace of Spades (Winning with glowing cyan halo) */}
                  <div className="relative rounded-xl ring-4 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.8)] scale-105 z-10">
                    <PlayingCard
                      card={{ id: 'AS', suit: 'S', rank: 14 }}
                      size="md"
                    />
                  </div>

                  {/* Card 2: King of Spades */}
                  <div>
                    <PlayingCard
                      card={{ id: 'KS', suit: 'S', rank: 13 }}
                      size="md"
                    />
                  </div>

                  {/* Card 3: 7 of Spades */}
                  <div>
                    <PlayingCard
                      card={{ id: '7S', suit: 'S', rank: 7 }}
                      size="md"
                    />
                  </div>

                  {/* Card 4: 3 of Spades */}
                  <div>
                    <PlayingCard
                      card={{ id: '3S', suit: 'S', rank: 3 }}
                      size="md"
                    />
                  </div>
                </div>

                {/* Current Trick Label & Winner Banner */}
                <div className="text-[10px] font-bold text-gray-300 bg-black/60 px-3 py-0.5 rounded-full border border-white/10">
                  Current Trick (4 cards)
                </div>

                <div className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow">
                  <span>👑 Aman won the last trick</span>
                </div>
              </div>

              {/* Priya (Right) */}
              <div className="flex flex-col items-center">
                <div className="flex -space-x-3 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-8 rounded bg-gradient-to-br from-purple-700 to-indigo-950 border border-purple-400/40 shadow-sm"
                    />
                  ))}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-400 shadow-lg ring-2 ring-pink-400/30">
                    <img
                      src="/assets/bhabhi/avatar-priya.png"
                      alt="Priya"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Mic className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-[11px] font-bold text-white shadow flex items-center gap-1">
                  <span>Priya</span>
                  <span className="text-[10px] text-pink-300 font-mono">(16)</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: You Avatar & Cards (Image 1) */}
            <div className="w-full flex flex-col items-center z-20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg ring-2 ring-emerald-400/40">
                  <img
                    src="/assets/bhabhi/avatar-you.png"
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-3 py-0.5 rounded-full bg-[#12162a] border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow">
                  <span className="text-emerald-400">● You</span>
                  <span className="text-gray-400 font-mono">(13 Cards)</span>
                  <Mic className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Player Hand Cards Fanned Out (Image 1: 12 cards) */}
          <div className="w-full overflow-x-auto pb-2 flex justify-center items-end px-2">
            <div className="flex -space-x-5 sm:-space-x-6 hover:-space-x-3 transition-all duration-300 py-2">
              {(roomState.yourHand && roomState.yourHand.length > 0
                ? roomState.yourHand
                : ([
                    { id: 'KS', suit: 'S', rank: 13 },
                    { id: 'QS', suit: 'S', rank: 12 },
                    { id: 'JS', suit: 'S', rank: 11 },
                    { id: '10S', suit: 'S', rank: 10 },
                    { id: '8S', suit: 'S', rank: 8 },
                    { id: '6S', suit: 'S', rank: 6 },
                    { id: '4S', suit: 'S', rank: 4 },
                    { id: 'KH', suit: 'H', rank: 13 },
                    { id: 'QH', suit: 'H', rank: 12 },
                    { id: '5D', suit: 'D', rank: 5 },
                    { id: '2D', suit: 'D', rank: 2 },
                    { id: '3C', suit: 'C', rank: 3 },
                  ] as Card[])
              ).map((card) => (
                <div
                  key={card.id}
                  onClick={() => handlePlayCard(card)}
                  className="cursor-pointer transform hover:-translate-y-4 hover:scale-105 transition-all duration-200"
                >
                  <PlayingCard card={card} size="md" isPlayable={true} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Panels: Live Chat & Trick Log (Image 1) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-3">
          {/* Live Chat Card */}
          <div className="bg-[#0d1020] border border-white/10 rounded-3xl p-4 shadow-2xl flex flex-col justify-between space-y-3 min-h-[260px]">
            {/* Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSideTab('chat')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeSideTab === 'chat'
                      ? 'bg-[#632df3] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Live Chat</span>
                </button>
                <button
                  onClick={() => setActiveSideTab('voice')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeSideTab === 'voice'
                      ? 'bg-[#632df3] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice (4)</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-48 text-xs pr-1">
              {displayChat.map((msg: any) => (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <img
                      src={msg.avatar || msg.senderAvatar || '/assets/bhabhi/avatar-you.png'}
                      alt={msg.senderName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-gray-300 mr-1.5">{msg.senderName}:</span>
                    <span className="text-gray-100">{msg.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex items-center gap-1.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <Smile className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type a message..."
                maxLength={80}
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="p-2 rounded-xl bg-[#632df3] hover:bg-[#5224d8] text-white disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Trick Log (Image 1) */}
          <div className="bg-[#0d1020] border border-white/10 rounded-3xl p-4 shadow-2xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white pb-1 border-b border-white/10">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trick Log</span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <span>✔ Trick 1: Clean Sweep</span>
                </span>
                <span className="text-gray-400 text-[10px]">Highest: A♠ by Aman</span>
              </div>

              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <span>✔ Trick 2: Clean Sweep</span>
                </span>
                <span className="text-gray-400 text-[10px]">Highest: K♥ by You</span>
              </div>

              <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-[11px]">
                <span className="text-rose-300 font-bold flex items-center gap-1">
                  <span>💥 Trick 3: Thulla!</span>
                </span>
                <span className="text-gray-400 text-[10px]">Picked up by Rohan (6 cards)</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons: Add AI Bot & Leave Room (Image 1) */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAddBot}
              className="flex-1 py-2.5 rounded-2xl bg-[#632df3] hover:bg-[#5224d8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Add AI Bot</span>
            </button>

            <Link
              href="/games/bhabhi"
              className="py-2.5 px-4 rounded-2xl bg-[#1a1235] hover:bg-rose-950/60 border border-white/10 hover:border-rose-500/40 text-gray-300 hover:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Room</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Emojis Drawer */}
      {isEmojiPickerOpen && (
        <div className="fixed bottom-16 left-6 bg-[#111827] border border-white/15 rounded-2xl p-3 shadow-2xl z-50 flex gap-2">
          {['🔥', '😂', '👑', '🎉', '👏', '💥', '👀'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                handleSendChat(undefined, emoji);
                setIsEmojiPickerOpen(false);
              }}
              className="text-xl p-1.5 hover:scale-125 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomContent({ params }: { params: Promise<{ roomCode: string }> }) {
  const unwrappedParams = use(params);
  return <BhabhiRoomClient roomCode={unwrappedParams.roomCode.toUpperCase()} />;
}

export default function BhabhiRoomPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex-1 flex items-center justify-center p-12 text-white">
          Loading room...
        </div>
      }
    >
      <RoomContent params={params} />
    </Suspense>
  );
}
