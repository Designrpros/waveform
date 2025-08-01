// src/app/discover/public-playlists/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PlaylistCard, PublicPlaylist } from '../../../components/PlaylistCard';

// --- Styled Components ---
const Container = styled.div`
  max-width: 1024px;
  margin: 4rem auto;
  padding: 2rem;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 2rem auto;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.subtleText};
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

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 2rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
`;

const Loader = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
`;

const PAGE_SIZE = 20;

const AllPublicPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPlaylistElementRef = useCallback((node: HTMLAnchorElement | null) => {
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
        const response = await fetch(`http://51.175.105.40:8080/api/playlists/public?limit=${PAGE_SIZE}&offset=0`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setPlaylists(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err: any) {
        setError(err.message || "Failed to load public playlists.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (offset === 0) return;
    const loadMorePlaylists = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://51.175.105.40:8080/api/playlists/public?limit=${PAGE_SIZE}&offset=${offset}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setPlaylists(prev => [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err: any) {
        setError(err.message || "Failed to load more playlists.");
      } finally {
        setLoading(false);
      }
    };
    loadMorePlaylists();
  }, [offset]);

  const renderContent = () => {
    if (playlists.length === 0 && loading) {
      return <Message>Loading playlists...</Message>;
    }
    if (error) {
      return <Message>Error: {error}</Message>;
    }
    if (playlists.length === 0) {
      return <Message>No public playlists found.</Message>;
    }

    return (
      <PlaylistGrid>
        {playlists.map((playlist, index) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            ref={playlists.length === index + 1 ? lastPlaylistElementRef : null}
          />
        ))}
        {loading && offset > 0 && <Loader>Loading more...</Loader>}
      </PlaylistGrid>
    );
  };

  return (
    <Container>
      <Head>
        <title>Public Playlists - Waveform</title>
        <meta name="description" content="Discover public playlists created by the community." />
      </Head>
      <BackButton href="/discover">
        <ChevronLeft size={20} /> Back to Discover
      </BackButton>
      <PageHeader>
        <PageTitle>Public Playlists</PageTitle>
        <PageSubtitle>Explore playlists created and shared by the community.</PageSubtitle>
      </PageHeader>
      
      {renderContent()}

      {!hasMore && playlists.length > 0 && <Message>You've reached the end!</Message>}
    </Container>
  );
};

export default AllPublicPlaylistsPage;