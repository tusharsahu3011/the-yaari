'use client';

import React, { useState, Suspense, use } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { PlayerConfig } from '@/game-engine/bhabhi';
import { BhabhiGameTable } from '@/components/game/BhabhiGameTable';

interface ChatMsg {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export function BhabhiRoomClient({ roomCode }: { roomCode: string }) {
  const [copied, setCopied] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Room players state
  const [players, setPlayers] = useState<PlayerConfig[]>([
    { id: 'player-host', name: 'You (Host)', isBot: false, avatar: '👑' },
    { id: 'bot-1', name: 'Bot Rohit', isBot: true, botDifficulty: 'smart', avatar: '🤖' },
    { id: 'bot-2', name: 'Bot Priya', isBot: true, botDifficulty: 'normal', avatar: '🦊' },
  ]);

  // Chat state
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'System',
      text: `Room ${roomCode} created! Share this code with friends to join.`,
      timestamp: 'Just now',
      isSystem: true,
    },
    {
      id: '2',
      sender: 'Bot Rohit',
      text: 'Good luck everyone! I won\'t hesitate to Thulla anyone who plays high.',
      timestamp: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const copyInvite = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addBot = () => {
    if (players.length >= 6) return;
    const botNum = players.filter((p) => p.isBot).length + 1;
    const botAvatars = ['🐼', '🦁', '🐯', '🦅', '🐺'];
    const newBot: PlayerConfig = {
      id: `bot-${Date.now()}`,
      name: `Bot ${['Kabir', 'Simran', 'Arjun', 'Meera'][botNum - 1] || 'Player'}`,
      isBot: true,
      botDifficulty: botNum % 2 === 0 ? 'smart' : 'normal',
      avatar: botAvatars[(botNum - 1) % botAvatars.length],
    };
    setPlayers([...players, newBot]);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'System',
        text: `${newBot.name} joined the room.`,
        timestamp: 'Just now',
        isSystem: true,
      },
    ]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 3) return; // Keep at least 3 players
    setPlayers(players.filter((p) => p.id !== id));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'You',
        text: inputMsg.trim(),
        timestamp: 'Just now',
      },
    ]);
    setInputMsg('');
  };

  if (isPlaying) {
    return (
      <div className="w-full flex-1 flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 py-2 flex items-center justify-between text-xs text-gray-400">
          <button
            onClick={() => setIsPlaying(false)}
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Waiting Lobby
          </button>
          <span className="font-mono uppercase bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
            Room: {roomCode}
          </span>
        </div>
        <BhabhiGameTable initialPlayers={players} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
      {/* Top Breadcrumb & Room Header */}
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
                {players.length}/6 Players
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Share the room code or invite link. Game starts when host is ready.
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

      {/* Main Grid: Player Seats (Left) & Chat / Voice (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-8">
        {/* Left Column: Seats & Controls (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-white">Player Seats</h3>
            {players.length < 6 && (
              <button
                onClick={addBot}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition"
              >
                <UserPlus className="w-4 h-4" />
                Fill with Bot
              </button>
            )}
          </div>

          {/* Seats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Occupied Seats */}
            {players.map((p, idx) => (
              <div
                key={p.id}
                className="relative p-4 rounded-2xl bg-[#121626] border border-white/10 shadow-md flex flex-col items-center text-center space-y-2 group"
              >
                {/* Host Crown */}
                {idx === 0 && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" /> Host
                  </div>
                )}

                {/* Remove Bot button */}
                {p.isBot && players.length > 3 && (
                  <button
                    onClick={() => removePlayer(p.id)}
                    title="Remove Bot"
                    className="absolute top-2 right-2 text-gray-500 hover:text-rose-400 text-xs p-1"
                  >
                    ✕
                  </button>
                )}

                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                  {p.avatar}
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-white max-w-[120px] truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {p.isBot ? 'AI Bot' : 'Human Player'}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  Ready
                </span>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: 6 - players.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                onClick={addBot}
                className="p-4 rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/40 flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] cursor-pointer group transition"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-purple-600/20 flex items-center justify-center text-gray-500 group-hover:text-purple-300 transition">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-200">
                  + Add Bot / Wait Player
                </span>
              </div>
            ))}
          </div>

          {/* Launch Controls */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-base">Ready to deal cards?</h4>
              <p className="text-xs text-gray-300">
                Minimum 3 players required. All moves will be server-validated.
              </p>
            </div>
            <button
              onClick={() => setIsPlaying(true)}
              disabled={players.length < 3}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-900/40 hover:brightness-110 active:scale-95 transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Game Now ({players.length} Players)
            </button>
          </div>
        </div>

        {/* Right Column: Chat & Voice Panel (1 col) */}
        <div className="flex flex-col rounded-3xl bg-[#121626] border border-white/10 overflow-hidden h-[460px]">
          {/* Voice Bar */}
          <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isMicOn ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-xs font-bold text-white">Voice Channel</span>
            </div>
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isMicOn
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/50'
                  : 'bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              {isMicOn ? 'Mic Live' : 'Muted'}
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl ${
                  m.isSystem
                    ? 'bg-purple-950/40 border border-purple-500/20 text-purple-200 text-[11px]'
                    : m.sender === 'You'
                    ? 'bg-indigo-600/30 border border-indigo-500/30 text-white ml-4'
                    : 'bg-white/5 border border-white/5 text-gray-200 mr-4'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1 opacity-80 text-[10px]">
                  <span>{m.sender}</span>
                  <span className="text-gray-400">{m.timestamp}</span>
                </div>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={sendMessage} className="p-2 border-t border-white/10 bg-black/30 flex gap-2">
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
