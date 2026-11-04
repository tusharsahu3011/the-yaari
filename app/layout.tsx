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
  title: 'The Yaari by Coder Tushar — Stream & Play Multiplayer Party Games',
  description:
    'TheYaari by Coder Tushar: Prime Video style browser gaming hub. Stream and play classic desi card game Bhabhi (Get Away), Undercover, Spyfall, and more with dost & yaar.',
  icons: {
    icon: '/assets/brand/the-yaari-icon.png',
    apple: '/assets/brand/the-yaari-icon.png',
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
      <body className="min-h-full flex flex-col bg-[#00050d] text-gray-100 selection:bg-[#00a8e1] selection:text-black">
        <Suspense fallback={<div className="h-16 w-full bg-[#00050d]" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
