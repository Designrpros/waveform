// src/app/library/likes/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { SongRow, TrackForQueue } from '../../../components/SongRow';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  width: 100%; margin-left: auto; margin-right: auto;
  padding: 2rem 1.5rem 4rem;
  @media (min-width: 1024px) { max-width: 1024px; }
`;
const Header = styled.div`
  text-align: center; margin-bottom: 3rem;
`;
const PageTitle = styled.h1`
  font-size: 3rem; font-weight: 700; color: ${({ theme }) => theme.text};
`;
const TrackListContainer = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText};
  margin-top: 2rem; padding: 2rem; background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor}; border-radius: 8px;
`;
const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem; color: ${({ theme }) => theme.accentColor}; 
  text-decoration: none; font-weight: 500; margin-bottom: 2rem;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

const LikedSongsPage: NextPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [likedTracks, setLikedTracks] = useState<TrackForQueue[]>([]);
  const [fetchStatus, setFetchStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Wait until the initial authentication check is complete.
    if (loading) {
      setFetchStatus('loading');
      return;
    }

    // If auth check is done and there's no user, redirect to login.
    if (!user) {
      router.push('/login');
      return;
    }

    // If we have a user, proceed to fetch their liked tracks.
    const fetchLikedTracks = async () => {
      setFetchStatus('loading');
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me/likes/tracks`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (!response.ok) throw new Error('Failed to fetch liked tracks.');
        const data = await response.json();
        setLikedTracks(data);
        setFetchStatus('success');
      } catch (error) {
        console.error(error);
        setFetchStatus('error');
      }
    };
    
    fetchLikedTracks();
  }, [user, loading, router]);

  const renderContent = () => {
    if (fetchStatus === 'loading') return <Message>Loading your liked songs...</Message>;
    if (fetchStatus === 'error') return <Message>Could not load liked tracks. Please try again.</Message>;
    if (likedTracks.length === 0) return <Message>You haven&apos;t liked any tracks yet.</Message>;
    
    return (
      <TrackListContainer>
        {likedTracks.map(track => (
          <SongRow
            key={track.id}
            track={track}
            queue={likedTracks}
            isInitiallyLiked={true}
          />
        ))}
      </TrackListContainer>
    );
  };

  return (
    <>
      <Head>
        <title>Liked Songs - Waveform</title>
      </Head>
      <Container>
        <BackButton href="/library"><ChevronLeft size={20} /> Back to Library</BackButton>
        <Header>
          <PageTitle>Liked Songs</PageTitle>
        </Header>
        {renderContent()}
      </Container>
    </>
  );
};

export default LikedSongsPage;