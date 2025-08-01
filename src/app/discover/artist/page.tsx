// src/app/discover/artist/page.tsx
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
const ArtistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem; margin-top: 1.5rem;
  @media (min-width: 640px) { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
`;
const ArtistCard = styled(Link)`
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
const ArtistCardArtwork = styled.img`
  width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1); flex-shrink: 0;
`;
const ArtistCardName = styled.p`
  font-weight: 600; color: ${({ theme }) => theme.text}; margin-top: 0.75rem;
  font-size: 1.1rem; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; width: 100%;
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
interface ArtistItem { id: string; name: string; artwork?: string; songs?: number; }

const PAGE_SIZE = 20;

const AllPopularArtistsPage = () => {
  const [artists, setArtists] = useState<ArtistItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastArtistElementRef = useCallback((node: HTMLAnchorElement) => {
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
            const response = await fetch(`http://51.175.105.40:8080/api/artists/popular?limit=${PAGE_SIZE}&offset=0`);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            setArtists(data);
            setHasMore(data.length === PAGE_SIZE);
        } catch (err: any) {
            setError(err.message || "Failed to load popular artists.");
        } finally {
            setLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (offset === 0) return;
    const loadMoreArtists = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://51.175.105.40:8080/api/artists/popular?limit=${PAGE_SIZE}&offset=${offset}`);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            setArtists(prev => [...prev, ...data]);
            setHasMore(data.length === PAGE_SIZE);
        } catch (err: any) {
            setError(err.message || "Failed to load more artists.");
        } finally {
            setLoading(false);
        }
    };
    loadMoreArtists();
  }, [offset]);

  if (artists.length === 0 && loading) return <Container><Message>Loading popular artists...</Message></Container>;
  if (error) return <Container><Message>Error: {error}</Message></Container>;

  return (
    <Container>
      <Head>
        <title>All Popular Artists - Waveform</title>
        <meta name="description" content="Discover all popular artists on Waveform." />
      </Head>
      <PageTitle>All Popular Artists</PageTitle>
      <ArtistGrid>
        {artists.map((artist, index) => (
          <ArtistCard key={artist.id} href={`/discover/artist/${artist.id}`} ref={artists.length === index + 1 ? lastArtistElementRef : null}>
            <ArtistCardArtwork src={artist.artwork || `https://placehold.co/120x120/383434/F9FAFB?text=${artist.name.substring(0,1)}`} alt={artist.name} />
            <ArtistCardName>{artist.name}</ArtistCardName>
          </ArtistCard>
        ))}
        {loading && <Loader>Loading more...</Loader>}
      </ArtistGrid>
      {!hasMore && artists.length > 0 && <Message>You've reached the end!</Message>}
    </Container>
  );
};

export default AllPopularArtistsPage;