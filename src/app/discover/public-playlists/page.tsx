// src/app/discover/public-playlists/page.tsx
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

// --- Page Component ---
const AllPublicPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const fetchPlaylists = async () => {
      setStatus('loading');
      let response: Response | undefined;
      try {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/public`);
        if (!response.ok) {
          // Throw an error to be caught and logged below
          throw new Error(`Server responded with ${response.status}`);
        }
        const data: PublicPlaylist[] = await response.json();
        setPlaylists(data);
        setStatus('success');
      } catch (error) {
        console.error("--- DEBUG: Fetch Public Playlists FAILED ---");
        // If the fetch failed, the response object will have details
        if (response) {
          console.error(`Backend responded with Status: ${response.status} ${response.statusText}`);
          // Attempt to get the raw text body of the error response from the server
          const responseBody = await response.text();
          console.error("Backend Response Body:", responseBody);
        }
        // Also log the generic error object for more context
        console.error("Caught error object:", error);
        setStatus('error');
      }
    };
    fetchPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter((playlist: PublicPlaylist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (status === 'loading') {
      return <Message>Loading playlists...</Message>;
    }
    if (status === 'error') {
      return <Message>Could not load public playlists. Please check the console for details.</Message>;
    }
    if (filteredPlaylists.length > 0) {
      return (
        <PlaylistGrid>
          {filteredPlaylists.map((playlist: PublicPlaylist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isDiscovery={true}
            />
          ))}
        </PlaylistGrid>
      );
    }
    return <Message>There aren&apos;t any public playlists yet. Be the first to create one!</Message>;
  };

  return (
    <Container>
      <BackButton href="/discover">
        <ChevronLeft size={20} /> Back to Discover
      </BackButton>
      <Header>
        <PageTitle>Public Playlists</PageTitle>
        <SearchInput
          type="text"
          placeholder="Search public playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      {renderContent()}
    </Container>
  );
};

export default AllPublicPlaylistsPage;