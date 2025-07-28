"use client";

import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Sun, Moon, Menu, X } from 'lucide-react'; // Added Menu and X icons
import Link from 'next/link';

// --- Styled Components specific to Header ---
const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: ${({ theme }) => theme.headerBg};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: background-color 0.3s ease;
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

const NavLinks = styled.nav<{ $isOpen: boolean }>`
    /* Default to hidden on mobile, flex on desktop */
    display: none; /* Hidden by default */
    gap: 1.5rem;
    margin-right: 1rem;

    @media (min-width: 769px) {
        display: flex; /* Show on desktop */
        flex-direction: row;
        position: static;
        height: auto;
        width: auto;
        padding: 0;
        transform: translateX(0);
        box-shadow: none;
    }

    /* Mobile Menu Overlay styles when open */
    @media (max-width: 768px) {
        flex-direction: column;
        position: fixed;
        top: 0;
        right: 0;
        width: 70%; /* Adjust as needed */
        max-width: 300px;
        height: 100vh;
        background-color: ${({ theme }) => theme.headerBg};
        backdrop-filter: blur(20px);
        padding: 2rem;
        padding-top: 5rem; /* Space for close button */
        transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
        transition: transform 0.3s ease-in-out;
        z-index: 100;
        box-shadow: -5px 0 15px rgba(0,0,0,0.2);
        display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')}; /* Control visibility with prop */
        align-items: flex-start;
        gap: 1.5rem;

        a {
            font-size: 1.2rem;
            padding: 0.5rem 0;
            width: 100%;
        }
    }
`;

const NavLink = styled(Link)`
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.subtleText};
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
        color: ${({ theme }) => theme.text};
    }
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

  @media (max-width: 768px) {
    display: none; /* Hide on mobile, show inside menu */
  }
`;

const MobileDownloadButton = styled(DownloadButton)`
  /* Override desktop styles for mobile */
  @media (max-width: 768px) {
    display: flex; /* Show only inside mobile menu */
    width: 100%;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
  }
`;

const MenuToggle = styled.button`
    display: none; /* Hidden by default on desktop */
    background: none;
    border: none;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    z-index: 101; /* Ensure it's above the overlay */

    @media (max-width: 768px) {
        display: flex; /* Show only on mobile */
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
    }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
    transition: opacity 0.3s ease-in-out;
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
`;


interface HeaderProps {
  currentThemeName: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentThemeName, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when a navigation link is clicked
  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <StyledHeader>
      <HeaderContent>
        <LogoContainer>
          <Link href="/" onClick={handleNavLinkClick}>
            <LogoImage src="/assets/WaveForm.jpeg" alt="WaveForm Logo" />
          </Link>
          <Link href="/" onClick={handleNavLinkClick}>
            <LogoText>Waveform.ink</LogoText>
          </Link>
        </LogoContainer>
        <HeaderActions>
            {/* Desktop Nav Links */}
            <NavLinks $isOpen={isMenuOpen}>
                {/* UPDATED: Links now point to dedicated pages */}
                <NavLink href="/discover" onClick={handleNavLinkClick}>Discover Music</NavLink>
                <NavLink href="/for-artists" onClick={handleNavLinkClick}>For Artists</NavLink>
                <NavLink href="/download" onClick={handleNavLinkClick}>Download App</NavLink>
            </NavLinks>

            {/* Hamburger/Close Icon for Mobile */}
            <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MenuToggle>

            <ThemeToggleButton onClick={toggleTheme}>
                {currentThemeName === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </ThemeToggleButton>
        </HeaderActions>
      </HeaderContent>
      {/* Overlay for mobile menu */}
      <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </StyledHeader>
  );
};
