// src/app/discover/album/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  max-width: 1024px; margin: 4rem auto; padding: 2rem; color: ${({ theme }) => theme.text};
  @media (max-width: 768px) { padding: 1rem; margin: 2rem auto; }
`;
const PageTitle = styled.h1`
  font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; text-align: center;
  @media (max-width: 768px) { font-size: 2rem; margin-bottom: 1.5rem; }
`;
const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem; margin-top: 1.5rem;
  @media (min-width: 640px) { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
`;
const AlbumCard = styled(Link)`
  display: flex; flex-direction: column; align-items: center; text-align: center;
  cursor: pointer; text-decoration: none; color: inherit; padding: 1rem;
  border-radius: 0.75rem; background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;
const AlbumCardArtwork = styled.img`
  width: 120px; height: 120px; border-radius: 0.5rem; object-fit: cover;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1); flex-shrink: 0;
`;
const AlbumCardTitle = styled.p`
  font-weight: 600; color: ${({ theme }) => theme.text}; margin-top: 0.75rem;
  font-size: 1.1rem; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; width: 100%;
`;
const AlbumCardArtist = styled.p`
  font-size: 0.9rem; color: ${({ theme }) => theme.subtleText};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText}; margin-top: 2rem;
  padding: 2rem; background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor}; border-radius: 8px;
`;
const Loader = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 2rem;
`;

// --- Interfaces ---
interface AlbumItem { id: string; title: string; artist: string; artwork: string; }

const PAGE_SIZE = 20;

const AllTopAlbumsPage = () => {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastAlbumElementRef = useCallback((node: HTMLAnchorElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + PAGE_SIZE);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  useEffect(() => {
    const fetchInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://51.175.105.40:8080/api/albums/top?limit=${PAGE_SIZE}&offset=0`);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            setAlbums(data);
            setHasMore(data.length === PAGE_SIZE);
        } catch (err: any) {
            setError(err.message || "Failed to load top albums.");
        } finally {
            setLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (offset === 0) return;
    const loadMoreAlbums = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://51.175.105.40:8080/api/albums/top?limit=${PAGE_SIZE}&offset=${offset}`);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            setAlbums(prev => [...prev, ...data]);
            setHasMore(data.length === PAGE_SIZE);
        } catch (err: any) {
            setError(err.message || "Failed to load more albums.");
        } finally {
            setLoading(false);
        }
    };
    loadMoreAlbums();
  }, [offset]);

  if (albums.length === 0 && loading) return <Container><Message>Loading top albums...</Message></Container>;
  if (error) return <Container><Message>Error: {error}</Message></Container>;

  return (
    <Container>
      <Head>
        <title>All Top Albums - Waveform</title>
        <meta name="description" content="Discover all top albums on Waveform." />
      </Head>
      <PageTitle>All Top Albums</PageTitle>
      <AlbumGrid>
        {albums.map((album, index) => (
          <AlbumCard key={album.id} href={`/discover/album/${album.id}`} ref={albums.length === index + 1 ? lastAlbumElementRef : null}>
            <AlbumCardArtwork src={album.artwork || `https://placehold.co/120x120/383434/F9FAFB?text=${album.title.substring(0,1)}`} alt={album.title} />
            <AlbumCardTitle>{album.title}</AlbumCardTitle>
            <AlbumCardArtist>{album.artist}</AlbumCardArtist>
          </AlbumCard>
        ))}
        {loading && <Loader>Loading more...</Loader>}
      </AlbumGrid>
      {!hasMore && albums.length > 0 && <Message>You've reached the end!</Message>}
    </Container>
  );
};

export default AllTopAlbumsPage;