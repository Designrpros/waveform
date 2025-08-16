// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry";
import { ThemeLayoutClient } from '../components/ThemeLayoutClient';
import Script from "next/script"; // Import the Script component

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
        {/* The synchronous script has been removed from here */}
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeLayoutClient>
            {children}
          </ThemeLayoutClient>
        </StyledComponentsRegistry>
        {/* Add the Tailwind CSS script here using the Next.js Script component */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </body>
    </html>
  );
}