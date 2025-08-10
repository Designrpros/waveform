// src/app/discover/track/[trackId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../../../../context/PlayerContext';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const TrackArtwork = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 0.75rem;
  object-fit: cover;
  box-shadow: 0 12px 24px rgba(0,0,0,0.2);
  margin-bottom: 2rem;
`;

const TrackTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
`;

const TrackArtist = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 0.5rem;
`;

const TrackAlbum = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 0.25rem;
  & > a {
    text-decoration: underline;
    &:hover {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PlayButton = styled.button`
  background-color: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.body};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.accentColor};
    color: white;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.subtleText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

interface TrackDetail {
    id: string;
    title: string;
    artist: string;
    artwork: string;
    audioPath: string;
    albumId: string;
    albumTitle: string;
}

const TrackDetailPage = () => {
  const params = useParams();
  const trackId = params.trackId as string;

  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();

  useEffect(() => {
    const fetchTrackData = async () => {
      if (!trackId) return;
      setLoading(true);
      const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

      try {
        const response = await fetch(`${API_BASE_URL}/track/${trackId}`);
        if (!response.ok) throw new Error(`Track API error: ${response.status}`);
        
        const data: TrackDetail = await response.json();
        setTrack(data);

      } catch (error) {
        console.error("Failed to fetch track data:", error);
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [trackId]);


  const handlePlayPause = () => {
    if (track) {
      if (currentTrack?.id === track.id) {
        togglePlayPause();
      } else {
        const playerTrack = {
            id: track.id,
            title: track.title,
            artist: track.artist,
            audioPath: track.audioPath,
            artwork: track.artwork,
            licensing: 'proprietary' as const // Assuming default, as this page doesn't have license info
        };
        playTrack(playerTrack, [playerTrack]);
      }
    }
  };

  if (loading) return <Container><p>Loading track...</p></Container>;
  if (!track) return <Container><p>Track not found.</p></Container>;

  return (
    <Container>
      <TrackArtwork src={track.artwork || 'https://placehold.co/250x250/383434/F9FAFB?text=Track'} alt={track.title} />
      <TrackTitle>{track.title}</TrackTitle>
      <TrackArtist>{track.artist}</TrackArtist>
      {track.albumId && (
        <TrackAlbum>
          From Album: <Link href={`/discover/album/${track.albumId}`}>{track.albumTitle || track.albumId}</Link>
        </TrackAlbum>
      )}

      <Controls>
        <ActionButton><Heart size={28} /></ActionButton>
        <PlayButton onClick={handlePlayPause}>
          {(currentTrack?.id === track.id && isPlaying) ? <Pause size={32} /> : <Play size={32} />}
        </PlayButton>
        <ActionButton><MoreHorizontal size={28} /></ActionButton>
      </Controls>
    </Container>
  );
};

export default TrackDetailPage;