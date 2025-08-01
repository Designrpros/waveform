// src/components/PlaylistCard.tsx
"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { ListMusic } from 'lucide-react';

// --- Styled Components ---
const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
  width: 180px;
  flex-shrink: 0;
`;
const ArtworkWrapper = styled.div`
  aspect-ratio: 1 / 1;
  width: 100%;
  background-color: ${({ theme }) => theme.buttonBg};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;
const ArtworkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Title = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.subtleText};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// --- Interface ---
export interface PublicPlaylist {
  id: string;
  name: string;
  creatorName: string;
  artwork?: string;
}

interface PlaylistCardProps {
  playlist: PublicPlaylist;
}

// --- Component ---
// CORRECTED: Wrapped component in React.forwardRef to accept a ref
export const PlaylistCard = React.forwardRef<HTMLAnchorElement, PlaylistCardProps>(
  ({ playlist }, ref) => {
    return (
      <CardContainer href={`/library/playlist/${playlist.id}`} ref={ref}>
        <ArtworkWrapper>
          {playlist.artwork ? (
            <ArtworkImage src={playlist.artwork} alt={playlist.name} />
          ) : (
            <ListMusic size={48} color="grey" />
          )}
        </ArtworkWrapper>
        <Title>{playlist.name}</Title>
        <Subtitle>By {playlist.creatorName}</Subtitle>
      </CardContainer>
    );
  }
);

PlaylistCard.displayName = 'PlaylistCard'; // Recommended for debugging