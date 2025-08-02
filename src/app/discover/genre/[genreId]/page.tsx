"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';
import { SongRow, TrackForQueue } from '../../../../components/SongRow';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.accentGradient};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const TrackListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
interface Genre {
    id: string;
    name: string;
    tracks: TrackForQueue[];
}

const GenreDetailPage: NextPage = () => {
  const params = useParams();
  const genreId = params.genreId as string;
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (genreId) {
      const fetchGenreDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/genre/${genreId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch genre details');
          }
          const data: Genre = await response.json();
          setGenre(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchGenreDetails();
    }
  }, [genreId]);

  if (loading) return <Container><Message>Loading tracks...</Message></Container>;
  if (!genre) return <Container><Message>Genre not found.</Message></Container>;

  return (
    <>
      <Head>
        <title>{genre.name} Music - Waveform</title>
        <meta name="description" content={`Discover the best ${genre.name} tracks on Waveform.`} />
      </Head>
      <Container>
        <BackButton href="/discover/genre">
          <ChevronLeft size={20} /> Back to All Genres
        </BackButton>
        <Header>
          <PageTitle>{genre.name}</PageTitle>
        </Header>
        <TrackListContainer>
          {genre.tracks.length > 0 ? (
            genre.tracks.map((track) => (
              <SongRow
                key={track.id}
                track={track}
                queue={genre.tracks}
              />
            ))
          ) : (
            <Message>No tracks found in this genre yet.</Message>
          )}
        </TrackListContainer>
      </Container>
    </>
  );
};

export default GenreDetailPage;
