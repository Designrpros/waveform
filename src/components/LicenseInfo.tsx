// src/components/LicenseInfo.tsx
"use client";

import React from 'react';
import styled from 'styled-components';
import { Shield } from 'lucide-react';

const LicenseWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.buttonBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.subtleText};
`;

const LicenseLink = styled.a`
  color: ${({ theme }) => theme.text};
  text-decoration: underline;
  font-weight: 500;
  
  &:hover {
    color: ${({ theme }) => theme.accentColor};
  }
`;

interface LicenseInfoProps {
  licensing: 'cc' | 'proprietary';
  cc_type?: string;
}

export const LicenseInfo: React.FC<LicenseInfoProps> = ({ licensing, cc_type }) => {
  if (licensing === 'proprietary') {
    return (
      <LicenseWrapper>
        <Shield size={18} />
        <span>This release is under a Proprietary License. All Rights Reserved.</span>
      </LicenseWrapper>
    );
  }

  if (licensing === 'cc' && cc_type) {
    const licenseName = `CC ${cc_type.toUpperCase()} 4.0`;
    const licenseUrl = `https://creativecommons.org/licenses/${cc_type.toLowerCase()}/4.0`;

    return (
      <LicenseWrapper>
        <Shield size={18} />
        <span>
          Licensed under <LicenseLink href={licenseUrl} target="_blank" rel="noopener noreferrer">{licenseName}</LicenseLink>.
        </span>
      </LicenseWrapper>
    );
  }

  return null;
};