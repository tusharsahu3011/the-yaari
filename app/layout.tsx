import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React, { Suspense } from 'react';
import { Navbar } from '@/components/platform/Navbar';
import { Footer } from '@/components/platform/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Games.CoderTushar.in — Modern Browser Gaming Platform',
  description:
    'Play classic card games and social multiplayer games in your browser. Solo vs smart AI bots or real-time multiplayer with friends. Flagship: Bhabhi (Thulla / Get Away).',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090b11] text-gray-100 selection:bg-purple-600 selection:text-white">
        <Suspense fallback={<div className="h-24 w-full" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col w-full pt-24 sm:pt-28">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
