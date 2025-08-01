"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const ArtistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const ArtistCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const ArtistArtwork = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const ArtistName = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
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

// --- Interfaces ---
interface Artist {
  id: string;
  name: string;
  artwork: string;
}

const AllArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://51.175.105.40:8080/api/artists/all');
        if (!response.ok) {
          throw new Error('Failed to fetch artists');
        }
        const data: Artist[] = await response.json(); // Corrected: Add type for data
        setArtists(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist: Artist) => // Corrected: Add type for artist
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <BackButton href="/discover">
        <ChevronLeft size={20} /> Back to Discover
      </BackButton>
      <Header>
        <PageTitle>All Artists</PageTitle>
        <SearchInput
          type="text"
          placeholder="Search artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      {loading ? (
        <Message>Loading artists...</Message>
      ) : filteredArtists.length > 0 ? (
        <ArtistGrid>
          {filteredArtists.map((artist: Artist) => ( // Corrected: Add type for artist
            <ArtistCard key={artist.id} href={`/discover/artist/${artist.id}`}>
              <ArtistArtwork src={artist.artwork} alt={artist.name} />
              <ArtistName>{artist.name}</ArtistName>
            </ArtistCard>
          ))}
        </ArtistGrid>
      ) : (
        // Corrected: Escaped apostrophe
        <Message>No artists found. Check back later or try a different search.</Message>
      )}
    </Container>
  );
};

export default AllArtistsPage;
