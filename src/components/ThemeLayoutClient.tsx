"use client"; // This explicitly marks this as a Client Component

import { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider, DefaultTheme } from 'styled-components';
import { Header } from './Header'; // Import the new Header component
import { Footer } from './Footer'; // Import the new Footer component

// --- Type Definition for Styled Components Theme ---
declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    subtleText: string;
    cardBg: string;
    headerBg: string;
    borderColor: string;
    buttonBg: string;
    buttonHoverBg: string;
    backgroundImage: string;
    imageOpacity: string;
    accentGradient: string;
  }
}

// --- Theme Definition ---
const lightTheme: DefaultTheme = {
  body: '#f0ecec',
  text: '#1F2937',
  subtleText: '#6B7280',
  cardBg: 'rgba(255, 255, 255, 0.6)',
  headerBg: 'rgba(240, 236, 236, 0.7)',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  buttonBg: 'rgba(0, 0, 0, 0.05)',
  buttonHoverBg: 'rgba(0, 0, 0, 0.1)',
  backgroundImage: 'url(/assets/MusicCircleLight.png)',
  imageOpacity: '1.0',
  accentGradient: 'linear-gradient(to right, #d45534, #7a2e1a)', // New Red Gradient
};

const darkTheme: DefaultTheme = {
  body: '#383434',
  text: '#F9FAFB',
  subtleText: '#9CA3AF',
  cardBg: 'rgba(56, 52, 52, 0.6)',
  headerBg: 'rgba(56, 52, 52, 0.5)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  buttonBg: 'rgba(255, 255, 255, 0.05)',
  buttonHoverBg: 'rgba(255, 255, 255, 0.1)',
  backgroundImage: 'url(/assets/MusicCircle.png)',
  imageOpacity: '0.2',
  accentGradient: 'linear-gradient(to right, #d45534, #7a2e1a)', // New Red Gradient
};

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.body} !important;
    color: ${({ theme }) => theme.text} !important;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

// --- Styled Components specific to Layout (remaining) ---
const PageWrapper = styled.div`
  min-height: 100vh;
  position: relative;
  
  /* Layer 1: MusicCircle background */
  &::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: ${({ theme }) => theme.backgroundImage};
    background-size: cover;
    background-position: center;
    opacity: ${({ theme }) => theme.imageOpacity};
    z-index: -2;
    transition: opacity 0.5s ease;
  }
`;

interface ThemeLayoutClientProps {
  children: React.ReactNode;
}

export function ThemeLayoutClient({ children }: ThemeLayoutClientProps) {
  // State to manage the current theme
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); 

  useEffect(() => {
    // Only access window during client-side rendering
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Set initial theme based on system preference
      setTheme(mediaQuery.matches ? 'dark' : 'light');

      // Listen for changes in system theme preference
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange); // Cleanup listener
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Determine the current theme object
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle /> {/* Applies global styles based on the theme */}
      <PageWrapper>
        {/* Render the Header component */}
        <Header currentThemeName={theme} toggleTheme={toggleTheme} />
        <main>
          {children} {/* This is where your page content will be rendered */}
        </main>
        {/* Render the Footer component */}
        <Footer />
      </PageWrapper>
    </ThemeProvider>
  );
}
