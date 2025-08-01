"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { SongRow, TrackForQueue } from '../../../components/SongRow';
import { useAuth } from '../../../context/AuthContext';

// --- Styled Components ---
const Container = styled.div`
  width: 100%; margin-left: auto; margin-right: auto; padding-left: 1.5rem; padding-right: 1.5rem; @media (min-width: 1024px) { max-width: 1024px; }
  padding-top: 4rem; padding-bottom: 4rem;
`;
const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem; color: ${({ theme }) => theme.accentColor}; text-decoration: none; font-weight: 500; margin-bottom: 2rem;
  &:hover { color: ${({ theme }) => theme.text}; }
  svg { transition: transform 0.2s; }
  &:hover svg { transform: translateX(-3px); }
`;
const PageHeader = styled.div`
  text-align: center; margin-bottom: 3rem;
`;
const PageTitle = styled.h1`
  font-size: 3rem; font-weight: 700; color: ${({ theme }) => theme.text}; margin-bottom: 0.5rem;
  @media (min-width: 640px) { font-size: 4rem; }
`;
const PageSubtitle = styled.p`
  font-size: 1.1rem; color: ${({ theme }) => theme.subtleText};
`;
const TrackList = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  @media (min-width: 768px) { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
  @media (min-width: 1024px) { grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); }
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText}; margin-top: 2rem; padding: 2rem; background-color: ${({ theme }) => theme.cardBg}; border: 1px solid ${({ theme }) => theme.borderColor}; border-radius: 8px;
`;
const Loader = styled.div`
  text-align: center; padding: 2rem;
`;

const PAGE_SIZE = 24;

const AllTracksPage: NextPage = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<TrackForQueue[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastTrackElementRef = useCallback((node: HTMLDivElement) => {
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
        if (user) {
          const idToken = await user.getIdToken();
          const likesResponse = await fetch('http://51.175.105.40:8080/api/me/likes/tracks', {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          if (likesResponse.ok) {
            const likedData: TrackForQueue[] = await likesResponse.json();
            setLikedTrackIds(new Set(likedData.map((t: TrackForQueue) => t.id)));
          }
        }
        const response = await fetch(`http://51.175.105.40:8080/api/tracks/trending?limit=${PAGE_SIZE}&offset=0`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: TrackForQueue[] = await response.json();
        setTracks(data.map((track: TrackForQueue) => ({ ...track, licensing: 'proprietary' } as TrackForQueue)));
        setHasMore(data.length === PAGE_SIZE);
      } catch (err: unknown) { // Corrected: Catch as unknown
        if (err instanceof Error) {
            setError(err.message || 'An unknown error occurred.');
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  useEffect(() => {
    if (offset === 0) return;
    const loadMoreTracks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://51.175.105.40:8080/api/tracks/trending?limit=${PAGE_SIZE}&offset=${offset}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: TrackForQueue[] = await response.json();
        setTracks(prevTracks => [...prevTracks, ...data.map((track: TrackForQueue) => ({ ...track, licensing: 'proprietary' } as TrackForQueue))]);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err: unknown) { // Corrected: Catch as unknown
        if (err instanceof Error) {
            setError(err.message || 'An unknown error occurred.');
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadMoreTracks();
  }, [offset]);

  const renderContent = () => {
    if (tracks.length === 0 && loading) return <Message>Loading tracks...</Message>;
    if (error) return <Message>Could not load tracks. {error}</Message>;
    if (tracks.length === 0) return <Message>No tracks available yet.</Message>;

    return (
      <>
        <TrackList>
          {tracks.map((track, index) => {
            if (tracks.length === index + 1) {
              return (
                <div ref={lastTrackElementRef} key={track.id}>
                  <SongRow track={track} queue={tracks} isInitiallyLiked={likedTrackIds.has(track.id)} />
                </div>
              );
            } else {
              return <SongRow key={track.id} track={track} queue={tracks} isInitiallyLiked={likedTrackIds.has(track.id)} />;
            }
          })}
        </TrackList>
        {loading && <Loader>Loading more...</Loader>}
        {!hasMore && tracks.length > 0 && <Message>You&apos;ve reached the end!</Message>}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>All Tracks - Waveform</title>
        <meta name="description" content="Browse all music tracks available on Waveform." />
      </Head>
      <Container>
        <BackButton href="/discover">
          <ChevronLeft size={20} /> Back to Discover
        </BackButton>
        <PageHeader>
          <PageTitle>All Tracks</PageTitle>
          <PageSubtitle>Explore every track uploaded to Waveform.</PageSubtitle>
        </PageHeader>
        {renderContent()}
      </Container>
    </>
  );
};

export default AllTracksPage;
