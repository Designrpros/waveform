"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useCallback } from 'react';
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [fetchStatus, setFetchStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isPublicPlaylist, setIsPublicPlaylist] = useState(false);

  const fetchLibraryData = useCallback(async () => {
    if (!user) return;
    setFetchStatus('loading');
    try {
      const idToken = await user.getIdToken();
      const [playlistsRes, followsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`, { headers: { 'Authorization': `Bearer ${idToken}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me/follows`, { headers: { 'Authorization': `Bearer ${idToken}` } })
      ]);
      
      if (!playlistsRes.ok) throw new Error('Failed to fetch playlists.');
      if (!followsRes.ok) throw new Error('Failed to fetch followed artists.');
      
      const playlistsData = await playlistsRes.json();
      const followsData = await followsRes.json();
      
      setPlaylists(playlistsData);
      setFollowedArtists(followsData);
      setFetchStatus('success');
    } catch (error) {
      console.error(error);
      setFetchStatus('error');
    }
  }, [user]);
  
  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/login'); return; }
    fetchLibraryData();
  }, [user, loading, router, fetchLibraryData]);
  
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPlaylistName.trim()) return;
    try {
        const idToken = await user.getIdToken();
        const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newPlaylistName, isPublic: isPublicPlaylist }),
        });
        if (!response.ok) throw new Error('Failed to create playlist.');
        setNewPlaylistName('');
        setIsPublicPlaylist(false);
        setIsCreateModalOpen(false);
        await fetchLibraryData(); // Use await to ensure data is fresh
    } catch (error) {
        alert('Error creating playlist. Please try again.');
        console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>My Library - Waveform</title>
      </Head>
      <Container>
        <PageTitle>My Library</PageTitle>

        {fetchStatus === 'loading' && <Message>Loading your library...</Message>}
        {fetchStatus === 'error' && <Message>Could not load your library.</Message>}
        
        {fetchStatus === 'success' && (
          <>
            <SectionTitle>Playlists</SectionTitle>
            <GridContainer>
              <LibraryLinkCard href="/library/likes">
                <CardIcon><Heart size={48} /></CardIcon>
                <CardTitle>Liked Songs</CardTitle>
              </LibraryLinkCard>
              {playlists.map(playlist => (
                <LibraryLinkCard key={playlist.id} href={`/library/playlist/${playlist.id}`}>
                  {playlist.artwork ? <PlaylistArtwork src={playlist.artwork} alt={playlist.name} /> : <CardIcon><ListMusic size={48} /></CardIcon>}
                  <CardTitle>{playlist.name}</CardTitle>
                </LibraryLinkCard>
              ))}
              <LibraryButtonCard onClick={() => setIsCreateModalOpen(true)}>
                <CardIcon><PlusCircle size={48} /></CardIcon>
                <CardTitle>Create Playlist</CardTitle>
              </LibraryButtonCard>
            </GridContainer>

            <SectionTitle>Followed Artists</SectionTitle>
            {followedArtists.length > 0 ? (
                <GridContainer>
                    {followedArtists.map(artist => (
                        <LibraryLinkCard key={artist.id} href={`/discover/artist/${artist.id}`}>
                            <ArtistArtwork src={artist.artwork} alt={artist.name} />
                            <CardTitle>{artist.name}</CardTitle>
                        </LibraryLinkCard>
                    ))}
                </GridContainer>
            ) : (
                <Message>You are not following any artists yet.</Message>
            )}
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
