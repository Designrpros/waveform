"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AlbumCard } from '../../../components/AlbumCard';
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

const AlbumGrid = styled.div`
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

// --- Interfaces ---
interface Album {
  id: string;
  title: string;
  artistName: string;
  artwork: string;
}

const AllAlbumsPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://51.175.105.40:8080/api/albums/all');
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        // Corrected: Add type for data
        const data: Album[] = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album: Album) => // Corrected: Add type for album
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <BackButton href="/discover">
        <ChevronLeft size={20} /> Back to Discover
      </BackButton>
      <Header>
        <PageTitle>All Albums</PageTitle>
        <SearchInput
          type="text"
          placeholder="Search albums or artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      {loading ? (
        <Message>Loading albums...</Message>
      ) : filteredAlbums.length > 0 ? (
        <AlbumGrid>
          {filteredAlbums.map((album: Album) => ( // Corrected: Add type for album
            <AlbumCard
              key={album.id}
              id={album.id}
              title={album.title}
              artist={album.artistName}
              artwork={album.artwork}
            />
          ))}
        </AlbumGrid>
      ) : (
        // Corrected: Escaped apostrophe
        <Message>No albums found. Check back later or try a different search.</Message>
      )}
    </Container>
  );
};

export default AllAlbumsPage;
