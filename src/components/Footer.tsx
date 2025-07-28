"use client"; // This explicitly marks this as a Client Component

import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import Link from 'next/link';

// --- Styled Components specific to Footer ---
const StyledFooter = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.borderColor};
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

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <FooterContent>
        <p>&copy; {new Date().getFullYear()} Waveform.ink. All rights reserved.</p>
        <FooterLinks>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
        </FooterLinks>
      </FooterContent>
    </StyledFooter>
  );
};
