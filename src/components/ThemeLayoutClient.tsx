"use client"; // This explicitly marks this as a Client Component

import { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider, DefaultTheme } from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';

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
    /* FIX: Ensure these are set by the theme and not overridden by external CSS */
    background-color: ${({ theme }) => theme.body} !important; /* Added !important for debugging purposes */
    color: ${({ theme }) => theme.text} !important; /* Added !important for debugging purposes */
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

// --- Styled Components specific to Layout ---
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

  /* Layer 2: DessertTree background, covers the screen */
  &::after {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: url('/assets/DessertTree.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.15;
    z-index: -1;
    pointer-events: none;
  }
`;

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
`;

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: ${({ theme }) => theme.headerBg};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: background-color 0.3s ease;
`;

const HeaderContent = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoImage = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ThemeToggleButton = styled.button`
    background: ${({ theme }) => theme.buttonBg};
    border: 1px solid ${({ theme }) => theme.borderColor};
    color: ${({ theme }) => theme.subtleText};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${({ theme }) => theme.buttonHoverBg};
        color: ${({ theme }) => theme.text};
    }
`;

const DownloadButton = styled(Link)`
  border-radius: 9999px;
  background: ${({ theme }) => theme.accentGradient};
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const StyledFooter = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

const FooterContent = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const FooterLinks = styled.div`
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    @media (min-width: 640px) {
        margin-top: 0;
    }
`;

const FooterLink = styled(Link)`
    transition: color 0.2s;
    text-decoration: none;
    color: ${({ theme }) => theme.subtleText};
    &:hover {
        color: ${({ theme }) => theme.text};
    }
`;


interface ThemeLayoutClientProps {
  children: React.ReactNode;
}

export function ThemeLayoutClient({ children }: ThemeLayoutClientProps) {
  // State to manage the current theme
  const [theme, setTheme] = useState('dark'); 

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
        <StyledHeader>
          <HeaderContent>
            <LogoContainer>
              <Link href="/">
                <LogoImage src="/assets/WaveForm.jpeg" alt="WaveForm Logo" />
              </Link>
              <Link href="/">
                <LogoText>WaveForm</LogoText>
              </Link>
            </LogoContainer>
            <HeaderActions>
                <ThemeToggleButton onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </ThemeToggleButton>
                <DownloadButton href="#">Download</DownloadButton> {/* Placeholder, replace with actual app store link */}
            </HeaderActions>
          </HeaderContent>
        </StyledHeader>
        <main>
          {children} {/* This is where your page content will be rendered */}
        </main>
        <StyledFooter>
          <FooterContent>
            <p>&copy; {new Date().getFullYear()} WaveForm. All rights reserved.</p>
            <FooterLinks>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
            </FooterLinks>
          </FooterContent>
        </StyledFooter>
      </PageWrapper>
    </ThemeProvider>
  );
}