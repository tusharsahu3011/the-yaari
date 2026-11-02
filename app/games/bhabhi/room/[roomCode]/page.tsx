'use client';

import React, { useState, useEffect, useRef, use, Suspense } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Users,
  Copy,
  Check,
  Bot,
  UserPlus,
  Play,
  Mic,
  MicOff,
  Send,
  Crown,
  Shield,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Flame,
  Zap,
  CheckCircle2,
  Trophy,
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
  HelpCircle,
  X,
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
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAvatar, setPlayerAvatar] = useState<string>('🤖');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'voice'>('chat');
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  // Initialize or load Guest Player Profile from localStorage
  useEffect(() => {
    let id = localStorage.getItem('gameshub_player_id');
    let name = localStorage.getItem('gameshub_player_name');
    let avatar = localStorage.getItem('gameshub_player_avatar');

    if (!id) {
      id = `usr-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('gameshub_player_id', id);
    }
    if (!name) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      name = `VibeSeeker_${rand}`;
      localStorage.setItem('gameshub_player_name', name);
    }
    if (!avatar) {
      avatar = '🤖';
      localStorage.setItem('gameshub_player_avatar', avatar);
    }

    setPlayerId(id);
    setPlayerName(name);
    setPlayerAvatar(avatar);

    // Join room via API
    fetch(`/api/rooms/${roomCode}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'join',
        playerId: id,
        name,
        avatar,
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

  // Trigger celebration confetti when self escapes or match ends
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
      if (!res.ok) {
        setErrorMsg(data.error || 'Action failed');
        soundManager.playTap();
      } else if (data.state) {
        setRoomState(data.state);
      }
    } catch (err) {
      setErrorMsg('Network error executing action');
    }
  };

  const handleStartGame = () => {
    soundManager.playDramaticBoom();
    executeAction('start_game');
  };

  const handleAddBot = () => {
    soundManager.playSelect();
    executeAction('add_bot');
  };

  const handlePlayCard = (card: Card) => {
    if (!roomState?.isYourTurn) return;
    soundManager.playCardSnap();
    executeAction('play_card', { card });
  };

  const handleSendChat = (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || inputMsg.trim();
    if (!textToSend) return;
    soundManager.playTap();
    executeAction('send_chat', { text: textToSend });
    if (!customText) setInputMsg('');
  };

  if (isJoining || !roomState) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 animate-spin mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Connecting to Room {roomCode}...</h2>
        <p className="text-xs text-gray-400 mt-1">Establishing real-time synchronization</p>
      </div>
    );
  }

  const isHost = roomState.hostId === playerId;
  const me = roomState.players.find((p) => p.id === playerId);
  const playableIdsSet = new Set(roomState.playableCardIds || []);
  const canStartGame = isHost && roomState.players.length >= 3;

  // ==========================================
  // VIEW 1: ROOM LOBBY (Image 2 visual parity)
  // ==========================================
  if (roomState.status === 'lobby') {
    // 6 Seat slots
    const totalSeats = 6;
    const seats = Array.from({ length: totalSeats }, (_, idx) => {
      return roomState.players[idx] || null;
    });

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
          <div className="md:col-span-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-900/30 shrink-0">
              👑
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

          <div className="md:col-span-4 bg-[#111827] border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Room Code
              </div>
              <div className="text-xl font-mono font-black text-white tracking-widest">
                {roomCode}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyInvite}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={copyInvite}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
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
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl">
                            {player.avatar}
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

                      <div className="flex items-center gap-1 text-gray-400">
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        <Volume2 className="w-3.5 h-3.5" />
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
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs text-gray-500">
                        #{idx + 1}
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
                  <span>{isMicOn ? 'Mic On' : 'Mic Off'}</span>
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`py-2 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-bold transition ${
                    isSpeakerOn
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'bg-white/5 text-gray-500 border border-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <span>Speaker</span>
                </button>

                <button
                  onClick={toggleMicrophone}
                  className="py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex flex-col items-center gap-1 text-[11px] font-bold transition"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                    <PhoneOff className="w-4 h-4" />
                  </div>
                  <span>Leave Voice</span>
                </button>
              </div>
            </div>

            {/* Lobby Chat Widget */}
            <div className="bg-[#0d1020] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-3 flex flex-col h-[280px]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Lobby Chat ({roomState.chatMessages.length})
                  </h3>
                </div>
              </div>

              {/* Chat Message Scroll */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {roomState.chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                    <MessageSquare className="w-8 h-8 opacity-30 mb-1" />
                    <span>No messages yet</span>
                    <span className="text-[10px] text-gray-600">Say hi to other players!</span>
                  </div>
                ) : (
                  roomState.chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`text-xs p-2 rounded-xl ${
                        msg.isSystem
                          ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20 text-[11px]'
                          : msg.senderId === playerId
                          ? 'bg-cyan-950/40 text-white ml-4 border border-cyan-500/30'
                          : 'bg-black/30 text-gray-200 mr-4 border border-white/5'
                      }`}
                    >
                      <div className="font-bold text-[10px] text-gray-400 mb-0.5">
                        {msg.senderName}
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={100}
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Image 2) */}
        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <button
            onClick={handleAddBot}
            disabled={roomState.players.length >= 6}
            className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <Bot className="w-4 h-4 text-purple-400" />
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
  // VIEW 2: ONLINE LIVE MATCH TABLE (Image 1 visual parity)
  // ====================================================
  const otherPlayers = roomState.players.filter((p) => p.id !== playerId);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-between p-2 sm:p-4 select-none space-y-4 min-h-[calc(100vh-4rem)]">
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
            <span>Chat ({roomState.chatMessages.length})</span>
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

      {/* 2. Main Match Arena: Left Overlay Panels, Center Table, Right Drawer (Image 1) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1">
        {/* Left Floating Info Boxes (Image 1) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
          {/* Game Progress Card */}
          <div className="p-4 rounded-2xl bg-[#0d1020] border border-white/10 space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>Game Progress</span>
            </div>
            <div className="text-xs font-bold text-white">{roomState.players.length} Players</div>
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
              Players: <strong className="text-white">{roomState.players.length}</strong>
            </div>
            <div className="text-[10px] text-gray-400 font-mono pt-1 border-t border-white/5">
              Rank Order:
              <div className="text-[9px] text-gray-500 mt-0.5">
                A &gt; K &gt; Q &gt; J &gt; 10 &gt; 9 &gt; 8 &gt; 7 &gt; 6 &gt; 5 &gt; 4 &gt; 3 &gt; 2
              </div>
            </div>

            <button
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className="w-full mt-2 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>🎁</span> Emojis
            </button>
          </div>
        </div>

        {/* Center Oval Table Arena (Image 1) */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          <div className="relative w-full h-[480px] sm:h-[520px] rounded-[52px] bg-gradient-to-b from-[#1b103a] via-[#130b2c] to-[#0c071e] border-4 border-[#8b5cf6]/70 shadow-[0_0_70px_rgba(139,92,246,0.35)] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
            {/* Top Center: Animated AI Dealer with Speech Bubble (Image 1 signature!) */}
            <div className="w-full flex flex-col items-center z-20">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border-2 border-purple-300 shadow-xl flex items-center justify-center text-2xl animate-bounce">
                  🤖
                </div>
                {/* Speech Bubble */}
                <div className="max-w-md bg-purple-950/80 border border-purple-400/50 rounded-2xl p-2.5 px-4 text-xs text-purple-200 shadow-xl backdrop-blur-md">
                  <strong className="text-purple-300 block mb-0.5 font-bold">🤖 AI Dealer:</strong>
                  {roomState.events[roomState.events.length - 1]?.message ||
                    'Chalo bhaiyon! Bhabhi ki mehfil shuru ho chuki hai! Ace of Spades kiske paas hai? Pehla waar usi ka! ♠️'}
                </div>
              </div>

              {/* Opponent Seats at the top */}
              <div className="w-full flex items-center justify-around px-2 mt-2">
                {otherPlayers.slice(0, 2).map((p) => {
                  const isTurn = roomState.currentTurnPlayerId === p.id;
                  return (
                    <div key={p.id} className="flex flex-col items-center">
                      <div className="flex -space-x-3 mb-1">
                        {[...Array(Math.min(5, p.cardCount))].map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-8 rounded bg-purple-900 border border-purple-400/40 shadow-sm"
                          />
                        ))}
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition shadow-lg ${
                          isTurn
                            ? 'border-cyan-400 bg-cyan-950 ring-4 ring-cyan-400/40 animate-pulse'
                            : 'border-white/20 bg-[#16122d]'
                        }`}
                      >
                        {p.avatar}
                      </div>
                      <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#16122d] border border-white/10 text-[11px] font-bold text-white flex items-center gap-1">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-purple-300">({p.cardCount})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle Section: Side Opponents & Played Trick Cards (Image 1) */}
            <div className="w-full flex items-center justify-between my-auto z-10 px-2 sm:px-4">
              {/* Left Opponent */}
              {otherPlayers[2] ? (
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition ${
                      roomState.currentTurnPlayerId === otherPlayers[2].id
                        ? 'border-cyan-400 ring-4 ring-cyan-400/40 animate-pulse'
                        : 'border-white/20 bg-[#16122d]'
                    }`}
                  >
                    {otherPlayers[2].avatar}
                  </div>
                  <div className="text-[11px] font-bold text-white mt-1">
                    {otherPlayers[2].name} ({otherPlayers[2].cardCount})
                  </div>
                </div>
              ) : (
                <div className="w-12" />
              )}

              {/* Center Played Trick Cards (Image 1) */}
              <div className="flex flex-col items-center space-y-2">
                {roomState.activeTrick?.leadSuit && (
                  <div className="px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 text-xs font-black shadow-lg flex items-center gap-1.5">
                    <span>Lead Suit:</span>
                    <span>{getSuitSymbol(roomState.activeTrick.leadSuit)}</span>
                    <span>{getSuitName(roomState.activeTrick.leadSuit)}</span>
                  </div>
                )}

                {/* Cards Grid */}
                <div className="flex items-center justify-center gap-2 min-h-[110px]">
                  {(!roomState.activeTrick || roomState.activeTrick.cards.length === 0) ? (
                    <div className="w-20 h-28 rounded-2xl border-2 border-dashed border-purple-400/30 flex items-center justify-center text-purple-300/40 text-[10px] font-bold">
                      AWAITING LEAD
                    </div>
                  ) : (
                    roomState.activeTrick.cards.map((item, idx) => (
                      <div
                        key={idx}
                        className={`transition-all duration-300 transform ${
                          idx === 0
                            ? 'ring-4 ring-cyan-400 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                            : ''
                        }`}
                      >
                        <PlayingCard card={item.card} size="md" />
                      </div>
                    ))
                  )}
                </div>

                {/* Current Trick Banner */}
                {roomState.activeTrick && roomState.activeTrick.cards.length > 0 && (
                  <div className="text-[11px] font-bold text-gray-300 bg-black/50 px-3 py-0.5 rounded-full border border-white/10">
                    Current Trick ({roomState.activeTrick.cards.length} cards)
                  </div>
                )}
              </div>

              {/* Right Opponent */}
              {otherPlayers[3] ? (
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition ${
                      roomState.currentTurnPlayerId === otherPlayers[3].id
                        ? 'border-cyan-400 ring-4 ring-cyan-400/40 animate-pulse'
                        : 'border-white/20 bg-[#16122d]'
                    }`}
                  >
                    {otherPlayers[3].avatar}
                  </div>
                  <div className="text-[11px] font-bold text-white mt-1">
                    {otherPlayers[3].name} ({otherPlayers[3].cardCount})
                  </div>
                </div>
              ) : (
                <div className="w-12" />
              )}
            </div>

            {/* Bottom: "You" Avatar in Green Ring */}
            <div className="w-full flex items-center justify-center z-10 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition shadow-lg ${
                    roomState.isYourTurn
                      ? 'border-emerald-400 bg-emerald-950 ring-4 ring-emerald-400/40 animate-pulse'
                      : 'border-white/20 bg-[#16122d]'
                  }`}
                >
                  {me?.avatar || '😎'}
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    <span>You</span>
                    {roomState.isYourTurn && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Your Turn
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono font-bold">
                    {me?.cardCount || 0} Cards
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Hand (Image 1 fanned cards) */}
          <div className="w-full overflow-x-auto pb-2 flex justify-center items-end px-2 min-h-[140px]">
            <div className="flex -space-x-5 sm:-space-x-6 hover:-space-x-2 transition-all duration-300 py-3">
              {(roomState.yourHand || []).map((card: Card) => {
                const isPlayable = roomState.isYourTurn && playableIdsSet.has(card.id);

                return (
                  <div
                    key={card.id}
                    onClick={() => handlePlayCard(card)}
                    className={`transition-all duration-200 cursor-pointer transform ${
                      isPlayable
                        ? 'hover:-translate-y-5 hover:scale-105 z-20'
                        : 'opacity-55 hover:opacity-75 z-0'
                    }`}
                  >
                    <PlayingCard card={card} size="md" isPlayable={isPlayable} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Drawer / Panel: Live Chat & Trick Log (Image 1) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0d1020] border border-white/10 rounded-3xl p-4 shadow-2xl flex flex-col h-[340px]">
            {/* Header Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveSideTab('chat')}
                  className={`text-xs font-bold transition px-2 py-0.5 rounded-lg ${
                    activeSideTab === 'chat'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Live Chat
                </button>
                <button
                  onClick={() => setActiveSideTab('voice')}
                  className={`text-xs font-bold transition px-2 py-0.5 rounded-lg ${
                    activeSideTab === 'voice'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Voice ({roomState.players.length})
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-2">
              {roomState.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-xs p-2 rounded-xl ${
                    msg.isSystem
                      ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20 text-[11px]'
                      : msg.senderId === playerId
                      ? 'bg-cyan-950/40 text-white ml-2 border border-cyan-500/30'
                      : 'bg-black/30 text-gray-200 mr-2 border border-white/5'
                  }`}
                >
                  <div className="font-bold text-[10px] text-gray-400 mb-0.5">
                    {msg.senderName}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-white/10">
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
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Trick Log History (Image 1) */}
          <div className="bg-[#0d1020] border border-white/10 rounded-3xl p-4 shadow-2xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white pb-1 border-b border-white/10">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trick Log</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Trick 1: Clean Sweep
                </span>
                <span className="text-gray-400">Highest: A♠️</span>
              </div>

              {roomState.activeTrick && (
                <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-300">
                  Trick in progress ({roomState.activeTrick.cards.length} cards played)
                </div>
              )}
            </div>
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
