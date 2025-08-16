// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry";
import { ThemeLayoutClient } from '../components/ThemeLayoutClient';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WaveForum.org - Your Music, Your Way",
  description: "Discover unique and independent music on WaveForum.org.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* ADD THIS SCRIPT FOR TAILWIND CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
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
