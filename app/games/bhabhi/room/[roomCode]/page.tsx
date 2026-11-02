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
} from 'lucide-react';
import { MaskedRoomState, MaskedRoomPlayer, RoomChatMessage } from '@/lib/rooms/room-types';
import { PlayingCard } from '@/components/cards/PlayingCard';
import { Card, getSuitSymbol, getSuitName } from '@/game-engine/bhabhi';
import { VoiceMeshManager } from '@/lib/webrtc/voice-manager';

export function BhabhiRoomClient({ roomCode }: { roomCode: string }) {
  const [copied, setCopied] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [selfSpeaking, setSelfSpeaking] = useState(false);
  const voiceRef = useRef<VoiceMeshManager | null>(null);

  if (!voiceRef.current && typeof window !== 'undefined') {
    voiceRef.current = new VoiceMeshManager();
  }
  const [roomState, setRoomState] = useState<MaskedRoomState | null>(null);
  const [inputMsg, setInputMsg] = useState('');
  const [playerId, setPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAvatar, setPlayerAvatar] = useState<string>('😎');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);

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
      name = `Player ${Math.floor(100 + Math.random() * 900)}`;
      localStorage.setItem('gameshub_player_name', name);
    }
    if (!avatar) {
      const avatars = ['😎', '🤠', '🦊', '🐱', '🦁', '🚀', '⭐'];
      avatar = avatars[Math.floor(Math.random() * avatars.length)];
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
    if (!roomState) return;
    const me = roomState.players.find((p) => p.id === playerId);
    if (me?.isSafe && me.safeRank === 1) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    }
    if (roomState.status === 'game_over') {
      confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 } });
    }
  }, [roomState?.status, roomState?.players, playerId]);

  // Clean up voice manager on unmount
  useEffect(() => {
    return () => {
      voiceRef.current?.stop();
    };
  }, []);

  const toggleMicrophone = async () => {
    if (!voiceRef.current) return;
    if (!isMicOn) {
      const success = await voiceRef.current.startMicrophone(
        (speaking) => setSelfSpeaking(speaking),
        (err) => setErrorMsg(err)
      );
      if (success) {
        setIsMicOn(true);
        voiceRef.current.setMute(false);
      }
    } else {
      voiceRef.current.setMute(true);
      setIsMicOn(false);
      setSelfSpeaking(false);
    }
  };

  const copyInvite = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const executeAction = async (action: string, extra: Record<string, any> = {}) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/rooms/${roomCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          playerId,
          ...extra,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Action failed');
      } else if (data.state) {
        setRoomState(data.state);
      }
    } catch (err) {
      setErrorMsg('Network error executing action');
    }
  };

  const handleStartGame = () => {
    executeAction('start_game');
  };

  const handleAddBot = () => {
    executeAction('add_bot');
  };

  const handleRemovePlayer = (targetId: string) => {
    executeAction('remove_player', { targetPlayerId: targetId });
  };

  const handlePlayCard = (card: Card) => {
    if (!roomState?.isYourTurn) return;
    executeAction('play_card', { card });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    executeAction('send_chat', { text: inputMsg.trim() });
    setInputMsg('');
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

  // 1. LIVE GAMEPLAY VIEW
  if (roomState.status === 'playing' || roomState.status === 'game_over') {
    const otherPlayers = roomState.players.filter((p) => p.id !== playerId);

    return (
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between p-2 sm:p-4 bg-[#090b11] select-none">
        {/* Error banner */}
        {errorMsg && (
          <div className="fixed top-20 z-50 px-4 py-2 rounded-xl bg-rose-950 border border-rose-500 text-rose-200 text-xs font-semibold shadow-2xl animate-bounce">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Top Status Bar */}
        <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-sm sm:text-base text-white">
              Room {roomCode}
            </span>
            {roomState.activeTrick && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-semibold border border-purple-500/30">
                Trick #{roomState.activeTrick.trickNumber}
              </span>
            )}
            {roomState.activeTrick?.leadSuit && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-semibold border border-indigo-500/40 flex items-center gap-1">
                Lead: {getSuitSymbol(roomState.activeTrick.leadSuit)}{' '}
                {getSuitName(roomState.activeTrick.leadSuit)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMicrophone}
              className={`p-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isMicOn
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/50'
                  : 'bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              {isMicOn ? 'Mic On' : 'Muted'}
            </button>
            <button
              onClick={copyInvite}
              className="p-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>

        {/* Central Card Table Felt */}
        <div className="relative w-full max-w-5xl h-[480px] sm:h-[520px] rounded-3xl felt-table border-4 border-[#032e23] flex flex-col justify-between p-4 shadow-2xl overflow-hidden my-auto">
          {/* Discard Pile indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <span>Discarded: </span>
            <span className="font-bold text-white">{roomState.discardCount} cards</span>
          </div>

          {/* Opponents Seats (Distributed top and sides) */}
          <div className="w-full flex items-center justify-around px-4">
            {otherPlayers.map((p) => {
              const isTurn = roomState.currentTurnPlayerId === p.id;
              return (
                <div key={p.id} className="flex flex-col items-center">
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl border-2 transition-all duration-300 ${
                      isTurn
                        ? 'border-amber-400 bg-amber-950/50 ring-4 ring-amber-400/40 scale-105'
                        : p.isSafe
                        ? 'border-emerald-500 bg-emerald-950/40 opacity-75'
                        : 'border-white/10 bg-slate-900/80'
                    }`}
                  >
                    <span>{p.avatar}</span>
                    {isTurn && (
                      <div className="absolute -top-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-black text-[9px] uppercase tracking-wider animate-bounce">
                        Turn
                      </div>
                    )}
                    {p.isSafe && (
                      <div className="absolute -bottom-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] uppercase tracking-wider">
                        Safe #{p.safeRank}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white mt-1 max-w-[90px] truncate text-center">
                    {p.name}
                  </span>
                  {!p.isSafe && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      {p.cardCount} cards
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Center Trick Arena */}
          <div className="self-center relative w-64 sm:w-80 h-44 sm:h-52 rounded-2xl bg-black/25 border border-white/10 flex flex-col items-center justify-center p-2">
            {/* Last event alert */}
            {roomState.lastResolution && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                {roomState.lastResolution.type === 'THULLA' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-700/60 animate-bounce whitespace-nowrap">
                    <Flame className="w-3.5 h-3.5" />
                    THULLA STRUCK! 💥
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-700/60 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5" />
                    Clean Sweep ✨
                  </div>
                )}
              </div>
            )}

            {/* Trick Cards Played */}
            <div className="flex items-center justify-center -space-x-4 sm:-space-x-6 min-h-[110px]">
              {roomState.activeTrick?.cards.length === 0 ? (
                <div className="text-center text-xs text-emerald-200/50 italic px-4 py-6 border border-dashed border-emerald-500/20 rounded-xl">
                  Awaiting trick lead...
                </div>
              ) : (
                roomState.activeTrick?.cards.map((played, idx) => (
                  <div
                    key={`${played.card.id}-${idx}`}
                    className="flex flex-col items-center transition-transform hover:scale-110 hover:z-30"
                  >
                    <PlayingCard card={played.card} size="sm" isThullaCandidate={played.isThulla} />
                    <span className="text-[10px] font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded mt-1">
                      {roomState.players[played.playerIndex]?.name.split(' ')[0]}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Turn Prompt Banner */}
            <div className="mt-2 text-center">
              {roomState.isYourTurn ? (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-full shadow animate-pulse">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {roomState.canStrikeThulla
                    ? '⚡ Strike a THULLA!'
                    : '👉 YOUR TURN! Pick a playable card below.'}
                </div>
              ) : (
                <div className="text-[11px] text-gray-300">
                  Waiting for other players...
                </div>
              )}
            </div>
          </div>

          {/* Bottom Center: Safe message for user */}
          <div className="self-center">
            {me?.isSafe && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                You Got Away! Escaped Safe (Rank #{me.safeRank})
              </div>
            )}
          </div>
        </div>

        {/* Human Player Hand Section */}
        <div className="w-full max-w-6xl mt-3 flex flex-col items-center z-20">
          <div className="w-full flex items-center justify-between mb-2 px-2 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-base">{playerAvatar}</span>
              <span className="font-bold text-white text-sm">Your Hand</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 font-medium">
                {roomState.yourHand?.length || 0} cards remaining
              </span>
            </div>

            {roomState.isYourTurn && (
              <div className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Tap any highlighted card to play
              </div>
            )}
          </div>

          {/* Hand Cards */}
          <div className="w-full overflow-x-auto pb-4 pt-2 px-4 flex items-center justify-start sm:justify-center -space-x-4 sm:-space-x-5 min-h-[140px] rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            {!roomState.yourHand || roomState.yourHand.length === 0 ? (
              <div className="text-center py-6 text-sm text-emerald-400 font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Your hand is empty! You have safely escaped!
              </div>
            ) : (
              roomState.yourHand.map((card) => {
                const isPlayable = playableIdsSet.has(card.id);
                return (
                  <PlayingCard
                    key={card.id}
                    card={card}
                    size="md"
                    isPlayable={isPlayable}
                    isThullaCandidate={roomState.canStrikeThulla && isPlayable}
                    onClick={() => handlePlayCard(card)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Game Over Modal */}
        {roomState.status === 'game_over' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-[#181d30] to-[#0c0f1a] border border-white/20 shadow-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/40 -mt-12 mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Match Finished!</h2>
              <div className="w-full p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 my-4 flex items-center gap-3">
                <div className="text-left flex-1">
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                    The Official Bhabhi (Loser)
                  </span>
                  <h3 className="font-extrabold text-base text-rose-100">
                    {roomState.bhabhiPlayerName || 'Opponent'}
                  </h3>
                </div>
                <div className="text-2xl">👑</div>
              </div>
              <button
                onClick={() => executeAction('start_game')}
                className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition"
              >
                Rematch / New Game
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. WAITING LOBBY VIEW
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
      {/* Error banner */}
      {errorMsg && (
        <div className="w-full mb-4 px-4 py-2 rounded-xl bg-rose-950 border border-rose-500 text-rose-200 text-xs font-semibold shadow-md">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Top Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/games/bhabhi"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition border border-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                Bhabhi Waiting Lobby
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-bold text-xs border border-purple-500/30">
                {roomState.players.length}/6 Players
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Live synchronized room. Host starts when everyone is ready.
            </p>
          </div>
        </div>

        {/* Room Code Badge & Copy */}
        <div className="flex items-center gap-2 bg-[#121626] border border-purple-500/30 rounded-2xl p-2 px-4 shadow-lg">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              Room Code
            </span>
            <div className="text-xl font-mono font-black tracking-widest text-white">
              {roomCode}
            </div>
          </div>
          <button
            onClick={copyInvite}
            className="ml-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Main Grid: Seats (Left) & Chat/Voice (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-8">
        {/* Left Column: Seats & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-white">Player Seats</h3>
            {isHost && roomState.players.length < 6 && (
              <button
                onClick={handleAddBot}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition"
              >
                <UserPlus className="w-4 h-4" />
                Fill with Bot
              </button>
            )}
          </div>

          {/* Seats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {roomState.players.map((p) => {
              const isMe = p.id === playerId;
              const canRemove = isHost && p.id !== playerId;
              return (
                <div
                  key={p.id}
                  className={`relative p-4 rounded-2xl bg-[#121626] border shadow-md flex flex-col items-center text-center space-y-2 group ${
                    isMe ? 'border-purple-500/60 ring-2 ring-purple-500/20' : 'border-white/10'
                  }`}
                >
                  {p.isHost && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40 flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" /> Host
                    </div>
                  )}

                  {canRemove && (
                    <button
                      onClick={() => handleRemovePlayer(p.id)}
                      title="Remove Player / Bot"
                      className="absolute top-2 right-2 text-gray-500 hover:text-rose-400 text-xs p-1"
                    >
                      ✕
                    </button>
                  )}

                  <div
                    className={`relative w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-2xl shadow-inner transition-all ${
                      isMe && selfSpeaking
                        ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-500/50 scale-105'
                        : ''
                    }`}
                  >
                    {p.avatar}
                    {isMe && isMicOn && (
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#121626] ${
                          selfSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'
                        }`}
                      />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-white max-w-[120px] truncate">
                      {p.name} {isMe && '(You)'}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {p.isBot ? 'AI Bot' : 'Human Player'}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                    Ready
                  </span>
                </div>
              );
            })}

            {/* Empty Slots */}
            {Array.from({ length: 6 - roomState.players.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                onClick={isHost ? handleAddBot : undefined}
                className={`p-4 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] transition ${
                  isHost
                    ? 'hover:border-purple-500/40 cursor-pointer group'
                    : 'opacity-50 cursor-default'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 transition">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  {isHost ? '+ Add Bot / Wait Player' : 'Waiting for Player'}
                </span>
              </div>
            ))}
          </div>

          {/* Launch Controls */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-base">
                {isHost ? 'Start the match' : 'Waiting for host to start'}
              </h4>
              <p className="text-xs text-gray-300">
                Minimum 3 players required (currently {roomState.players.length}). All moves are
                server-validated.
              </p>
            </div>
            {isHost ? (
              <button
                onClick={handleStartGame}
                disabled={roomState.players.length < 3}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Game ({roomState.players.length} Players)
              </button>
            ) : (
              <div className="px-5 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs font-semibold">
                ⏳ Waiting for host...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat & Voice */}
        <div className="flex flex-col rounded-3xl bg-[#121626] border border-white/10 overflow-hidden h-[460px]">
          <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isMicOn ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-xs font-bold text-white">Voice Channel</span>
            </div>
            <button
              onClick={toggleMicrophone}
              className={`p-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isMicOn
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/50'
                  : 'bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              {isMicOn ? 'Mic Live' : 'Muted'}
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {roomState.chatMessages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl ${
                  m.isSystem
                    ? 'bg-purple-950/40 border border-purple-500/20 text-purple-200 text-[11px]'
                    : m.senderId === playerId
                    ? 'bg-indigo-600/30 border border-indigo-500/30 text-white ml-4'
                    : 'bg-white/5 border border-white/5 text-gray-200 mr-4'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1 opacity-80 text-[10px]">
                  <span>{m.senderName}</span>
                  <span className="text-gray-400">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-2 border-t border-white/10 bg-black/30 flex gap-2">
            <input
              type="text"
              placeholder="Send message to room..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RoomContent({ paramsPromise }: { paramsPromise: Promise<{ roomCode: string }> }) {
  const { roomCode } = use(paramsPromise);
  return <BhabhiRoomClient roomCode={roomCode} />;
}

export default function BhabhiRoomPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex-1 flex items-center justify-center py-20 text-gray-400 text-sm">
          Loading Room...
        </div>
      }
    >
      <RoomContent paramsPromise={params} />
    </Suspense>
  );
}
