// src/components/Header.tsx
"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { Sun, Moon, Library } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';

// --- Styled Components ---
const StyledHeader = styled.header`
  position: sticky; top: 0; z-index: 50;
  background-color: ${({ theme }) => theme.headerBg};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: background-color 0.3s ease;
`;
const Container = styled.div`
  width: 100%; margin-left: auto; margin-right: auto;
  padding-left: 1.5rem; padding-right: 1.5rem;
  @media (min-width: 1024px) { max-width: 1024px; }
`;
const HeaderContent = styled(Container)`
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 1rem; padding-bottom: 1rem;
`;
const LogoContainer = styled(Link)`
  display: flex; align-items: center; gap: 0.75rem;
  text-decoration: none;
`;
const LogoImage = styled.img`
  height: 2.5rem; width: 2.5rem; border-radius: 0.5rem;
`;
const LogoText = styled.span`
  font-size: 1.5rem; font-weight: 700; color: ${({ theme }) => theme.text};
`;
const HeaderActions = styled.div`
  display: flex; align-items: center; gap: 1.5rem;
`;
const NavLinks = styled.nav`
  display: none;
  @media (min-width: 769px) {
    display: flex; align-items: center; gap: 1.5rem;
  }
`;
const NavLink = styled(Link)`
  font-size: 1rem; font-weight: 500; color: ${({ theme }) => theme.subtleText};
  text-decoration: none; transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.text}; }
`;
const ThemeToggleButton = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.subtleText};
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.buttonHoverBg};
    color: ${({ theme }) => theme.text};
  }
`;
const ActionButton = styled.button`
  font-size: 1rem; font-weight: 500; background: none; border: none;
  color: ${({ theme }) => theme.subtleText}; cursor: pointer; padding: 0;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

interface HeaderProps {
  currentThemeName: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentThemeName, toggleTheme }) => {
  const { user, loading } = useAuth();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <StyledHeader>
      <HeaderContent>
        <LogoContainer href="/">
          <LogoImage src="/assets/WaveForm.jpeg" alt="WaveForm Logo" />
          <LogoText>Waveform.ink</LogoText>
        </LogoContainer>
        <HeaderActions>
          <NavLinks>
            <NavLink href="/for-artists">For Artists</NavLink>
            <NavLink href="/download">Download</NavLink>
            <NavLink href="/discover">Discover</NavLink>
            {user && <NavLink href="/library">My Library</NavLink>}
          </NavLinks>

          {!loading && (
            <>
              {user ? (
                <ActionButton onClick={handleLogout}>Logout</ActionButton>
              ) : (
                <NavLink href="/login">Login</NavLink>
              )}
            </>
          )}

          <ThemeToggleButton onClick={toggleTheme} title="Toggle theme">
            {currentThemeName === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </ThemeToggleButton>
        </HeaderActions>
      </HeaderContent>
    </StyledHeader>
  );
};