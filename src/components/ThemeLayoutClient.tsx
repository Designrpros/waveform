// src/components/ThemeLayoutClient.tsx
"use client";

import { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider, DefaultTheme } from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { PlayerProvider } from '../context/PlayerContext';
import { GlobalPlayer } from './GlobalPlayer';
import { AuthProvider } from '../context/AuthContext';

const lightTheme: DefaultTheme = {
  body: '#f0ecec',
  text: '#1F2937',
  subtleText: '#6B7280',
  cardBg: '#FFFFFF',
  headerBg: '#F0ECEC',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  buttonBg: 'rgba(0, 0, 0, 0.05)',
  buttonHoverBg: 'rgba(0, 0, 0, 0.1)',
  backgroundImage: 'url(/assets/MusicCircleLight.png)',
  imageOpacity: '1.0',
  accentGradient: 'linear-gradient(to right, #D45534, #7a2e1a)',
  accentColor: '#D45534',
  secondaryButtonBorderColor: 'rgba(0, 0, 0, 0.1)',
  primaryButtonTextColor: '#FFFFFF',
};
const darkTheme: DefaultTheme = {
  body: '#383434',
  text: '#F9FAFB',
  subtleText: '#9CA3AF',
  cardBg: '#383434',
  headerBg: '#383434',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  buttonBg: 'rgba(255, 255, 255, 0.05)',
  buttonHoverBg: 'rgba(255, 255, 255, 0.1)',
  backgroundImage: 'url(/assets/MusicCircle.png)',
  imageOpacity: '0.2',
  accentGradient: 'linear-gradient(to right, #D45534, #7a2e1a)',
  accentColor: '#D45534',
  secondaryButtonBorderColor: 'rgba(255, 255, 255, 0.1)',
  primaryButtonTextColor: '#FFFFFF',
};
const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; box-sizing: border-box; background-color: ${({ theme }) => theme.body} !important; color: ${({ theme }) => theme.text} !important; transition: background-color 0.3s ease, color 0.3s ease; font-family: 'Inter', sans-serif; }
`;
const PageWrapper = styled.div`
  min-height: 100vh; display: flex; flex-direction: column; position: relative; padding-bottom: 80px; 
  &::before { content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-image: ${({ theme }) => theme.backgroundImage}; background-size: cover; background-position: center; opacity: ${({ theme }) => theme.imageOpacity}; z-index: -2; transition: opacity 0.5s ease; }
`;


export function ThemeLayoutClient({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    const handleChange = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  if (!hasMounted) {
    return null;
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <AuthProvider>
        <PlayerProvider>
          <GlobalStyle />
          <PageWrapper>
            <Header currentThemeName={theme} toggleTheme={toggleTheme} />
            <main style={{ flexGrow: 1 }}>
              {children}
            </main>
            <Footer />
          </PageWrapper>
          <GlobalPlayer />
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}