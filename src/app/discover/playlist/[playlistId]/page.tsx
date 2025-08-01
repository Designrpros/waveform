// src/app/discover/playlist/[playlistId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { SongRow, TrackForQueue } from '../../../../components/SongRow';
import { ChevronLeft, Globe } from 'lucide-react';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  max-width: 800px; margin: 4rem auto; padding: 2rem; color: ${({ theme }) => theme.text};
`;
const Header = styled.div`
  text-align: center; margin-bottom: 3rem;
`;
const PlaylistTitle = styled.h1`
  font-size: 3rem; font-weight: 800; margin: 0;
  display: flex; align-items: center; justify-content: center; gap: 1rem;
`;
const PublicBadge = styled.span`
  display: inline-flex; align-items: center; gap: 0.25rem;
  font-size: 0.9rem; font-weight: 500;
  padding: 0.25rem 0.5rem; border-radius: 9999px;
  background-color: ${({ theme }) => theme.buttonHoverBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.subtleText};
`;
const PlaylistDescription = styled.p`
  font-size: 1.125rem; color: ${({ theme }) => theme.subtleText};
  margin-top: 0.5rem; max-width: 600px; margin-left: auto; margin-right: auto;
`;
const TrackListContainer = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText};
`;
const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem; color: ${({ theme }) => theme.accentColor}; 
  text-decoration: none; font-weight: 500; margin-bottom: 2rem;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

// --- Interfaces ---
interface Playlist {
  id: string; name: string; description?: string; isPublic: boolean; isOwner: boolean;
}
interface PlaylistDetails extends Playlist {
  tracks: TrackForQueue[];
}

const PlaylistDetailPage = () => {
  const params = useParams();
  const playlistId = params.playlistId as string;
  const { user, loading } = useAuth();
  const router = useRouter();

  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (loading) return;

    const fetchPlaylistDetails = async () => {
      setStatus('loading');
      try {
        const idToken = await user?.getIdToken();
        
        // Build the request options conditionally
        const requestOptions: RequestInit = {};
        if (idToken) {
            requestOptions.headers = { 'Authorization': `Bearer ${idToken}` };
        }

        const [playlistResponse, likesResponse] = await Promise.all([
            fetch(`http://51.175.105.40:8080/api/playlists/${playlistId}`, requestOptions),
            user ? fetch('http://51.175.105.40:8080/api/me/likes/tracks', requestOptions) : Promise.resolve(null)
        ]);
        
        if (!playlistResponse.ok) {
            // If not found, and the user is not logged in, redirect them to log in
            if (playlistResponse.status === 404 && !user) {
                router.push('/login');
                return;
            }
            throw new Error('Failed to fetch playlist details.');
        }
        const data = await playlistResponse.json();
        setPlaylist(data);

        if (likesResponse && likesResponse.ok) {
            const likedTracks: TrackForQueue[] = await likesResponse.json();
            setLikedTrackIds(new Set(likedTracks.map(track => track.id)));
        }

        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    if (playlistId) {
      fetchPlaylistDetails();
    }
  }, [playlistId, user, loading, router]);

  const renderContent = () => {
    if (status === 'loading') return <Message>Loading playlist...</Message>;
    if (status === 'error' || !playlist) return <Message>Could not load playlist details.</Message>;
    
    return (
      <>
        <Header>
          <PlaylistTitle>
            {playlist.name}
            {playlist.isPublic && (
                <PublicBadge><Globe size={14}/> Public</PublicBadge>
            )}
          </PlaylistTitle>
          {playlist.description && <PlaylistDescription>{playlist.description}</PlaylistDescription>}
        </Header>
        <TrackListContainer>
          {playlist.tracks.length > 0 ? (
            playlist.tracks.map(track => (
              <SongRow
                key={track.id}
                track={track}
                queue={playlist.tracks}
                isInitiallyLiked={likedTrackIds.has(track.id)}
              />
            ))
          ) : (
            <Message>This playlist is empty. Add some tracks!</Message>
          )}
        </TrackListContainer>
      </>
    );
  };

  return (
    <Container>
      {/* CORRECTED: Back button now points to discover page */}
      <BackButton href="/discover"><ChevronLeft size={20} /> Back to Discover</BackButton>
      {renderContent()}
    </Container>
  );
};

export default PlaylistDetailPage;