"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

// --- Styled Components ---
const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: transparent;
  border-radius: 0.5rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;
  padding: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const ArtworkWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Artwork = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0.25rem;
`;

const Title = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.subtleText};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// --- Component Props and Types ---
export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
}

interface AlbumCardProps {
  album: Album;
}

// --- Component ---
export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <CardContainer href={`/discover/album/${album.id}`}>
      <ArtworkWrapper>
        <Artwork src={album.artwork} alt={`${album.title} by ${album.artist}`} />
      </ArtworkWrapper>
      <InfoContainer>
        <Title>{album.title}</Title>
        <Artist>{album.artist}</Artist>
      </InfoContainer>
    </CardContainer>
  );
};
