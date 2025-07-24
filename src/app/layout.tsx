import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry"; // Ensure this path is correct
import { ThemeLayoutClient } from '../components/ThemeLayoutClient'; // Adjust path if you placed it elsewhere

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WaveForm - Your Music, Your Way",
  description: "WaveForm brings your music library to life with offline downloads, iCloud sync, and a seamless native experience on iOS and macOS.",
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