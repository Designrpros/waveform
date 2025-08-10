"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PlaylistCard, PublicPlaylist } from '../../../components/PlaylistCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

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

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  width: 300px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accentColor};
    background-color: ${({ theme }) => theme.cardBg};
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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

const AllPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/curated`);
        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }
        const data: PublicPlaylist[] = await response.json(); // Corrected: Add type for data
        setPlaylists(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter((playlist: PublicPlaylist) => // Corrected: Add type for playlist
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <BackButton href="/discover">
        <ChevronLeft size={20} /> Back to Discover
      </BackButton>
      <Header>
        <PageTitle>Featured Playlists</PageTitle>
        <SearchInput
          type="text"
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      {loading ? (
        <Message>Loading playlists...</Message>
      ) : filteredPlaylists.length > 0 ? (
        <PlaylistGrid>
          {filteredPlaylists.map((playlist: PublicPlaylist) => ( // Corrected: Add type for playlist
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isDiscovery={true}
            />
          ))}
        </PlaylistGrid>
      ) : (
        // Corrected: Escaped apostrophe
        <Message>There are no featured playlists right now. Check back soon!</Message>
      )}
    </Container>
  );
};

export default AllPlaylistsPage;
