"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import { PlaylistCard, PublicPlaylist } from '../../../components/PlaylistCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- Styled Components ---
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 4rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.accentColor};
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

// --- Page Component ---
const AllPlaylistsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me/playlists`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }
        const data: PublicPlaylist[] = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return <Container><Message>Loading your playlists...</Message></Container>;
  }

  return (
    <Container>
      <BackButton href="/library">
        <ChevronLeft size={20} /> Back to Library
      </BackButton>
      <Header>
        <PageTitle>My Playlists</PageTitle>
      </Header>
      {playlists.length > 0 ? (
        <PlaylistGrid>
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
            />
          ))}
        </PlaylistGrid>
      ) : (
        <Message>You haven&apos;t created any playlists yet.</Message>
      )}
    </Container>
  );
};

export default AllPlaylistsPage;
