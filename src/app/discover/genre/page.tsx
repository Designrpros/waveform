"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- Helper function to assign colors to genres ---
const genreColors = [
  '#6495ED', '#9370DB', '#3CB371', '#FFA07A', '#6A5ACD',
  '#FF6347', '#4682B4', '#DA70D6', '#FFD700', '#87CEFA',
  '#7B68EE', '#B0C4DE', '#FF8C00', '#008080', '#BDB76B', '#F08080'
];

const generateColor = (genreName: string) => {
  let hash = 0;
  for (let i = 0; i < genreName.length; i++) {
    hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return genreColors[Math.abs(hash) % genreColors.length];
};

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
  @media (min-width: 640px) {
    font-size: 4rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem; color: ${({ theme }) => theme.subtleText};
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const YouTubeMusicGenreCardContainer = styled(Link)<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 1rem;
  min-width: 120px;
  min-height: 80px;
  flex-shrink: 0;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText}; margin-top: 2rem; padding: 2rem; background-color: ${({ theme }) => theme.cardBg}; border: 1px solid ${({ theme }) => theme.borderColor}; border-radius: 8px;
`;

// --- Interfaces ---
interface GenreItem { id: number; name: string; color: string; }

// --- Helper Components ---
const YouTubeMusicGenreCard: React.FC<{ genre: GenreItem }> = ({ genre }) => {
    return (
        <YouTubeMusicGenreCardContainer href={`/discover/genre/${genre.id}`} $color={genre.color}>
            {genre.name}
        </YouTubeMusicGenreCardContainer>
    );
};

// --- Page Component ---
const AllGenresPage: NextPage = () => {
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllGenres = async () => {
      setStatus('loading');
      try {
        const response = await fetch(`http://51.175.105.40:8080/api/genres`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: { id: number; name: string }[] = await response.json();
        
        const formattedGenres = data.map(genre => ({
          ...genre,
          color: generateColor(genre.name)
        }));
        setGenres(formattedGenres);
        setStatus('success');
      } catch (error: unknown) { // Corrected: Catch as unknown
        if (error instanceof Error) {
            setErrorMessage(error.message || 'An unknown error occurred.');
        } else {
            setErrorMessage('An unknown error occurred.');
        }
        setStatus('error');
      }
    };

    fetchAllGenres();
  }, []);

  const renderContent = () => {
    if (status === 'loading') return <Message>Loading genres...</Message>;
    if (status === 'error') return <Message>Could not load genres. {errorMessage}</Message>;
    if (genres.length === 0) return <Message>No genres available yet. Upload music to create new genres!</Message>;

    return (
      <GenreGrid>
        {genres.map(genre => (
          <YouTubeMusicGenreCard key={genre.id} genre={genre} />
        ))}
      </GenreGrid>
    );
  };

  return (
    <>
      <Head>
        <title>All Genres - Waveform</title>
        <meta name="description" content="Browse all music genres available on Waveform." />
      </Head>
      <Container>
        <BackButton href="#" onClick={() => router.back()}>
          <ChevronLeft size={20} /> Back to Discover
        </BackButton>
        <PageHeader>
          <PageTitle>All Genres</PageTitle>
          <PageSubtitle>Explore every musical style available on Waveform.</PageSubtitle>
        </PageHeader>
        {renderContent()}
      </Container>
    </>
  );
};

export default AllGenresPage;
