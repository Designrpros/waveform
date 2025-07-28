import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry";
import { ThemeLayoutClient } from '../components/ThemeLayoutClient';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // UPDATED: Reflects the broader ecosystem of Waveform (player) and WaveForum (artist portal)
  title: "Waveform.ink - Your Music Ecosystem | Player & Artist Portal",
  description: "Waveform.ink is your gateway to a unique music experience. Discover independent music with the Waveform app and empower artists with the WaveForum upload portal. Self-hosted content, Creative Commons, and proprietary music, all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>
          {/* ThemeLayoutClient wraps all page content and provides theming */}
          <ThemeLayoutClient>
            {children}
          </ThemeLayoutClient>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
