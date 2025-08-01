// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry";
import { ThemeLayoutClient } from '../components/ThemeLayoutClient';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Waveform.ink - Your Music, Your Way",
  description: "Discover unique and independent music on Waveform.ink.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeLayoutClient>
            {children}
          </ThemeLayoutClient>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}