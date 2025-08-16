// src/components/Header.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Sun, Moon, Menu, X, LogOut, User as UserIcon, Settings, Music, Compass, Library, Download, Feather } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../lib/firebase';

// --- Styled Components ---

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background-color: ${({ theme }) => theme.headerBg};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: background-color 0.3s ease;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem 1.5rem;
  gap: 1.5rem;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
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
  gap: 0.75rem;
`;

const ThemeToggleButton = styled.button`
  background: transparent;
  border: 1px solid transparent;
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

const MenuToggle = styled.button`
  display: flex;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  z-index: 101;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
`;

const MobileNav = styled.nav<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background-color: ${({ theme }) => theme.headerBg};
  padding: 6rem 1.5rem 2rem;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 100;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
`;

const mobileNavLinkStyles = css`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  padding: 0.75rem 1rem;
  width: 100%;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const MobileNavLink = styled(Link)`
  ${mobileNavLinkStyles}
`;

const MobileAuthButton = styled.button`
  ${mobileNavLinkStyles}
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const MobileMenuSeparator = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  margin: 1rem 0;
`;

interface HeaderProps {
  currentThemeName: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentThemeName, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const auth = getAuth(app);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavLinkClick = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleNavLinkClick();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderMobileNavLinks = () => {
    if (loading) return null;

    return (
      <>
        <MobileNavLink href="/discover" onClick={handleNavLinkClick}><Compass size={20} /> Discover</MobileNavLink>
        {user && <MobileNavLink href="/library" onClick={handleNavLinkClick}><Library size={20} /> My Library</MobileNavLink>}
        <MobileNavLink href="/for-artists" onClick={handleNavLinkClick}><Feather size={20} /> For Artists</MobileNavLink>
        <MobileNavLink href="/download" onClick={handleNavLinkClick}><Download size={20} /> Download</MobileNavLink>
        <MobileMenuSeparator/>
        {user ? (
          <MobileAuthButton onClick={handleLogout}><LogOut size={20} /> Logout</MobileAuthButton>
        ) : (
          <MobileNavLink href="/login" onClick={handleNavLinkClick}><UserIcon size={20} /> Login</MobileNavLink>
        )}
      </>
    );
  };

  return (
    <>
      <StyledHeader>
        <Container>
          <LogoContainer href="/" onClick={handleNavLinkClick}>
            <LogoImage src="/assets/WaveForm.jpeg" alt="WaveForm Logo" />
            <LogoText>WaveForum</LogoText>
          </LogoContainer>

          <HeaderActions>
            <ThemeToggleButton onClick={toggleTheme} aria-label="Toggle theme">
              {currentThemeName === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </ThemeToggleButton>

            <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MenuToggle>
          </HeaderActions>
        </Container>
      </StyledHeader>

      <MobileNav $isOpen={isMenuOpen}>
        {renderMobileNavLinks()}
      </MobileNav>

      <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </>
  );
};
