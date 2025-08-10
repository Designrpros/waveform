// src/app/discover/album/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AlbumCard, type Album as AlbumType } from '../../../components/AlbumCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  max-width: 1200px; margin: 2rem auto; padding: 2rem;
`;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
`;
const PageTitle = styled.h1`
  font-size: 2.5rem; font-weight: 800; color: ${({ theme }) => theme.text};
`;
const SearchInput = styled.input`
  padding: 0.75rem 1rem; border-radius: 9999px; border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.buttonBg}; color: ${({ theme }) => theme.text};
  font-size: 1rem; width: 300px; transition: all 0.2s ease;
  &:focus {
    outline: none; border-color: ${({ theme }) => theme.accentColor}; background-color: ${({ theme }) => theme.cardBg};
  }
`;
const AlbumGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem;
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText}; margin-top: 4rem;
`;
const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem; color: ${({ theme }) => theme.accentColor};
  text-decoration: none; font-weight: 500; margin-bottom: 2rem;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

const AllAlbumsPage = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        // CORRECTED: This now points to the correct endpoint for top albums
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/top`);
        if (!response.ok) throw new Error('Failed to fetch albums');
        const data: AlbumType[] = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredAlbums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </AlbumGrid>
      ) : (
        <Message>No albums found. Check back later or try a different search.</Message>
      )}
    </Container>
  );
};

export default AllAlbumsPage;