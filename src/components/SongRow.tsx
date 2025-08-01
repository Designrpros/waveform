"use client";

import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { Heart, MoreHorizontal, Shield, X, Plus, Radio } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { AddToPlaylistModal } from './AddToPlaylistModal';

// --- Styled Components ---
const SongRowContainer = styled.div<{ $isPlaying: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: ${({ $isPlaying, theme }) => $isPlaying ? theme.buttonHoverBg : 'transparent'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const Artwork = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 0.25rem;
  object-fit: cover;
  flex-shrink: 0;
`;

const Info = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.subtleText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  position: relative; // Required for menu positioning
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.subtleText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const MoreMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  width: 180px;
  overflow: hidden;
  padding: 0.5rem;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 0.25rem;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;


// --- Modal Components ---
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px); z-index: 2000;
  display: flex; align-items: center; justify-content: center;
`;
const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 1rem; padding: 2rem; width: 90%;
  max-width: 500px; position: relative;
`;
const CloseButton = styled.button`
  position: absolute; top: 1rem; right: 1rem; background: none;
  border: none; color: ${({ theme }) => theme.subtleText};
  cursor: pointer; &:hover { color: ${({ theme }) => theme.text}; }
`;
const ModalTitle = styled.h3`
  font-size: 1.5rem; margin-top: 0; margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;
const ModalText = styled.p`
  color: ${({ theme }) => theme.subtleText}; line-height: 1.6;
`;
const ModalLink = styled.a`
  color: ${({ theme }) => theme.accentColor}; text-decoration: underline;
`;


// --- Component Definition ---
export interface TrackForQueue {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  audioPath: string;
  licensing: 'cc' | 'proprietary';
  cc_type?: string;
}

interface SongRowProps {
  track: TrackForQueue;
  queue?: TrackForQueue[];
  isInitiallyLiked?: boolean;
}

export const SongRow: React.FC<SongRowProps> = ({ track, queue, isInitiallyLiked = false }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, startRadioFromTrack } = usePlayer();
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useEffect(() => {
    setIsLiked(isInitiallyLiked);
  }, [isInitiallyLiked]);

  const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;

  const handlePlayPause = () => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      const playbackQueue = queue || [track];
      playTrack(track, playbackQueue);
    }
  };
  
  const handleLikeToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const previousLikeStatus = isLiked;
    setIsLiked(!isLiked);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://51.175.105.40:8080/api/likes`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: track.id,
          contentType: 'track',
        }),
      });
      if (!response.ok) {
        setIsLiked(previousLikeStatus);
        alert('Failed to update like status. Please try again.');
      }
    } catch (error) {
      console.error("Like toggle error:", error);
      setIsLiked(previousLikeStatus);
      alert('An error occurred. Please try again.');
    }
  };

  const handleAddToPlaylistClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsAddToPlaylistModalOpen(true);
    setIsMoreMenuOpen(false);
  };

  const handleStartRadio = () => {
    startRadioFromTrack(track);
    setIsMoreMenuOpen(false);
  };

  // Corrected: Replaced 'Function' with a specific type '() => void'
  const stopPropagationAnd = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <>
      <SongRowContainer $isPlaying={isThisTrackPlaying} onClick={handlePlayPause}>
        <Artwork 
          src={track.artwork || `https://placehold.co/50x50/383434/F9FAFB?text=${track.title.substring(0,1)}`} 
          alt={track.title} 
        />
        <Info>
          <Title>{track.title}</Title>
          <Artist>{track.artist}</Artist>
        </Info>
        <Actions>
          <ActionButton onClick={stopPropagationAnd(() => setIsModalOpen(true))} title="View License">
            <Shield size={20} />
          </ActionButton>
          <ActionButton onClick={stopPropagationAnd(handleLikeToggle)} title="Like">
            <Heart 
              size={20} 
              fill={isLiked ? theme.accentColor : 'none'} 
              color={isLiked ? theme.accentColor : 'currentColor'}
            />
          </ActionButton>
          
          <ActionButton onClick={stopPropagationAnd(() => setIsMoreMenuOpen(prev => !prev))} title="More">
            <MoreHorizontal size={20} />
          </ActionButton>

          {isMoreMenuOpen && (
            <MoreMenu onMouseLeave={() => setIsMoreMenuOpen(false)}>
              <MenuItem onClick={stopPropagationAnd(handleAddToPlaylistClick)}>
                <Plus size={16} /> Add to Playlist
              </MenuItem>
              <MenuItem onClick={stopPropagationAnd(handleStartRadio)}>
                <Radio size={16} /> Start Radio
              </MenuItem>
            </MoreMenu>
          )}
        </Actions>
      </SongRowContainer>
      
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsModalOpen(false)}><X /></CloseButton>
            <ModalTitle>License Information</ModalTitle>
            {track.licensing === 'proprietary' ? ( <ModalText> This track is released under a <strong>Proprietary License</strong>. All rights are reserved by the artist and Waveform.ink. </ModalText> ) : ( <ModalText> This track is licensed under the{' '} <ModalLink href={`https://creativecommons.org/licenses/${track.cc_type?.toLowerCase()}/4.0`} target="_blank" rel="noopener noreferrer"> Creative Commons {`CC ${track.cc_type?.toUpperCase()}`} 4.0 </ModalLink> {' '}license. </ModalText> )}
          </ModalContent>
        </ModalOverlay>
      )}
      
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        track={track}
      />
    </>
  );
};
