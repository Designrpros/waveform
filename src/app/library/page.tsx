// src/app/library/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Heart, ListMusic, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '../../components/Modal';

// --- Styled Components ---
const Container = styled.div`
  width: 100%; margin-left: auto; margin-right: auto;
  padding: 2rem 1.5rem 4rem;
  @media (min-width: 1024px) { max-width: 1024px; }
`;
const PageTitle = styled.h1`
  font-size: 3rem; font-weight: 700; color: ${({ theme }) => theme.text};
  margin-bottom: 2rem; text-align: center;
`;
const SectionTitle = styled.h2`
  font-size: 1.75rem; font-weight: 600; color: ${({ theme }) => theme.text};
  margin-top: 3rem; margin-bottom: 1.5rem;
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;
const cardStyles = `
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.cardBg};
  border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.borderColor};
  border-radius: 0.75rem; padding: 1.5rem; text-decoration: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; aspect-ratio: 1 / 1;
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }
`;
const LibraryLinkCard = styled(Link)`${cardStyles}`;
const LibraryButtonCard = styled.button`
  ${cardStyles}
  appearance: none;
`;
const CardIcon = styled.div`
  color: ${({ theme }) => theme.accentColor}; margin-bottom: 1rem;
`;
const CardTitle = styled.p`
  font-weight: 600; color: ${({ theme }) => theme.text};
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText};
  margin-top: 2rem; padding: 2rem; background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor}; border-radius: 8px;
`;
const PlaylistArtwork = styled.img`
  width: 100%; height: 100%; object-fit: cover; border-radius: 0.75rem;
`;
const ArtistArtwork = styled.img`
    width: 120px; height: 120px; object-fit: cover; border-radius: 50%;
    margin-bottom: 1rem;
`;
const Form = styled.form` display: flex; flex-direction: column; gap: 1rem; `;
const Input = styled.input`
  width: 100%; padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem; background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text}; font-size: 1rem;
`;
const Button = styled.button`
  padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600;
  cursor: pointer; border: none; background: ${({ theme }) => theme.accentGradient};
  color: ${({ theme }) => theme.primaryButtonTextColor};
`;
const CheckboxContainer = styled.label`
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.9rem; color: ${({ theme }) => theme.subtleText};
  cursor: pointer;
`;

interface Playlist { id: string; name: string; artwork?: string; }
interface Artist { id: string; name: string; artwork?: string; }

const LibraryPage: NextPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  
  const [playlistsStatus, setPlaylistsStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [artistsStatus, setArtistsStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isPublicPlaylist, setIsPublicPlaylist] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchLibraryData = async () => {
      const idToken = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${idToken}` };

      setPlaylistsStatus('loading');
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`, { headers })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch playlists.');
          return res.json();
        })
        .then(data => {
          setPlaylists(data);
          setPlaylistsStatus('success');
        })
        .catch(error => {
          console.error(error);
          setPlaylistsStatus('error');
        });

      setArtistsStatus('loading');
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me/follows`, { headers })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch followed artists.');
          return res.json();
        })
        .then(data => {
          setFollowedArtists(data);
          setArtistsStatus('success');
        })
        .catch(error => {
          console.error(error);
          setArtistsStatus('error');
        });
    };
    
    fetchLibraryData();
  }, [user, authLoading, router]);
  
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPlaylistName.trim()) return;
    try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newPlaylistName, isPublic: isPublicPlaylist }),
        });
        if (!response.ok) throw new Error('Failed to create playlist.');
        
        const headers = { 'Authorization': `Bearer ${idToken}` };
        const playlistsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`, { headers });
        const playlistsData = await playlistsRes.json();
        setPlaylists(playlistsData);

        setNewPlaylistName('');
        setIsPublicPlaylist(false);
        setIsCreateModalOpen(false);
    } catch (error) {
        alert('Error creating playlist. Please try again.');
        console.error(error);
    }
  };

  const renderPlaylists = () => {
    if (playlistsStatus === 'loading') return <Message>Loading playlists...</Message>;
    if (playlistsStatus === 'error') return <Message>Could not load your playlists.</Message>;
    
    // *** THIS IS THE FIX ***
    // Ensure playlists is an array before trying to map over it.
    if (!Array.isArray(playlists)) {
        // You can either return null or a message indicating no playlists.
        return (
            <GridContainer>
                <LibraryLinkCard href="/library/likes">
                    <CardIcon><Heart size={48} /></CardIcon>
                    <CardTitle>Liked Songs</CardTitle>
                </LibraryLinkCard>
                <LibraryButtonCard onClick={() => setIsCreateModalOpen(true)}>
                    <CardIcon><PlusCircle size={48} /></CardIcon>
                    <CardTitle>Create Playlist</CardTitle>
                </LibraryButtonCard>
            </GridContainer>
        );
    }

    return (
      <GridContainer>
        <LibraryLinkCard href="/library/likes">
          <CardIcon><Heart size={48} /></CardIcon>
          <CardTitle>Liked Songs</CardTitle>
        </LibraryLinkCard>
        {playlists.map(playlist => (
          <LibraryLinkCard key={playlist.id} href={`/library/playlist/${playlist.id}`}>
            {playlist.artwork ? <PlaylistArtwork src={playlist.artwork} alt={playlist.name} onError={(e) => e.currentTarget.src = 'https://placehold.co/180x180/383434/FFFFFF?text=P'} /> : <CardIcon><ListMusic size={48} /></CardIcon>}
            <CardTitle>{playlist.name}</CardTitle>
          </LibraryLinkCard>
        ))}
        <LibraryButtonCard onClick={() => setIsCreateModalOpen(true)}>
          <CardIcon><PlusCircle size={48} /></CardIcon>
          <CardTitle>Create Playlist</CardTitle>
        </LibraryButtonCard>
      </GridContainer>
    );
  };

  const renderFollowedArtists = () => {
    if (artistsStatus === 'loading') return <Message>Loading followed artists...</Message>;
    if (artistsStatus === 'error') return <Message>Could not load your followed artists.</Message>;
    if (!Array.isArray(followedArtists) || followedArtists.length === 0) {
        return <Message>You are not following any artists yet.</Message>;
    }
    return (
      <GridContainer>
        {followedArtists.map(artist => (
            <LibraryLinkCard key={artist.id} href={`/discover/artist/${artist.id}`}>
                <ArtistArtwork src={artist.artwork} alt={artist.name} onError={(e) => e.currentTarget.src = 'https://placehold.co/120x120/383434/FFFFFF?text=A'}/>
                <CardTitle>{artist.name}</CardTitle>
            </LibraryLinkCard>
        ))}
      </GridContainer>
    );
  };

  return (
    <>
      <Head>
        <title>My Library - WaveForum.org</title>
      </Head>
      <Container>
        <PageTitle>My Library</PageTitle>

        {authLoading ? (
            <Message>Loading your library...</Message>
        ) : (
          <>
            <SectionTitle>Playlists</SectionTitle>
            {renderPlaylists()}

            <SectionTitle>Followed Artists</SectionTitle>
            {renderFollowedArtists()}
          </>
        )}
      </Container>
      
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Playlist">
        <Form onSubmit={handleCreatePlaylist}>
          <Input type="text" placeholder="My Awesome Playlist" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} required />
          <CheckboxContainer>
            <input type="checkbox" checked={isPublicPlaylist} onChange={(e) => setIsPublicPlaylist(e.target.checked)} />
            Make playlist public
          </CheckboxContainer>
          <Button type="submit">Create</Button>
        </Form>
      </Modal>
    </>
  );
};

export default LibraryPage;