// src/app/discover/genre/[genreId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useParams } from 'next/navigation';
import { usePlayer } from '../../../../context/PlayerContext';
import { useAuth } from '../../../../context/AuthContext'; // <-- IMPORT useAuth
import { SongRow, TrackForQueue } from '../../../../components/SongRow'; // <-- IMPORT SongRow

// --- Styled Components ---
const Container = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  text-align: center;
`;
const GenreTitle = styled.h1<{ $color?: string }>`
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  color: ${({ $color }) => $color || 'inherit'};
`;
const GenreDescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 0.5rem;
  max-width: 600px;
`;
const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-top: 3rem;
  margin-bottom: 1.5rem;
`;
const TrackListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
`;

// --- Interfaces ---
interface GenreItem {
  id: number;
  name: string;
  color?: string;
  description?: string;
}

// Helper to assign colors consistently
const genreColors = [ '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8CD', '#F08A5D', '#B5EAD7', '#C7D3D4', '#FFD700', '#ADD8E6', '#DDA0DD', '#A9A9A9', '#8B4513', '#DAA520', '#006400', '#FF8C00' ];
const generateColor = (genreName: string) => {
  let hash = 0;
  for (let i = 0; i < genreName.length; i++) {
    hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return genreColors[Math.abs(hash) % genreColors.length];
};

const GenreDetailPage = () => {
  const params = useParams();
  const genreId = params.genreId as string;
  const theme = useTheme();
  const { user } = useAuth(); // <-- NEW: Get user

  const [genre, setGenre] = useState<GenreItem | null>(null);
  const [tracks, setTracks] = useState<TrackForQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set()); // <-- NEW: State for liked tracks

  useEffect(() => {
    const fetchData = async () => {
      if (!genreId) return;
      setLoading(true);

      try {
        const API_BASE_URL = 'http://51.175.105.40:8080/api';
        
        // Fetch genre details and tracks for that genre in parallel
        const [genresResponse, tracksResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/genres`),
            fetch(`${API_BASE_URL}/tracks/genre/${genreId}`) // Assuming an endpoint like this exists or will be created
        ]);

        if (!genresResponse.ok) throw new Error(`Genres API error: ${genresResponse.status}`);
        const allGenres: { id: number; name: string }[] = await genresResponse.json();
        const foundGenre = allGenres.find(g => String(g.id) === genreId);

        if (foundGenre) {
          setGenre({
            ...foundGenre,
            color: generateColor(foundGenre.name),
            description: `Explore the vibrant sounds of ${foundGenre.name} music.`,
          });
        } else {
          setGenre(null);
        }

        if (!tracksResponse.ok) throw new Error(`Tracks by genre API error: ${tracksResponse.status}`);
        const genreTracks: TrackForQueue[] = await tracksResponse.json();
        const formattedTracks = genreTracks.map(track => ({
          ...track,
          licensing: track.licensing || 'proprietary',
        }));
        setTracks(formattedTracks);
        
        // If user is logged in, fetch their liked tracks
        if (user) {
            const idToken = await user.getIdToken();
            const likesResponse = await fetch(`${API_BASE_URL}/me/likes/tracks`, {
              headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (likesResponse.ok) {
              const likedTracks: TrackForQueue[] = await likesResponse.json();
              setLikedTrackIds(new Set(likedTracks.map(track => track.id)));
            }
        }

      } catch (error) {
        console.error('Failed to fetch data for genre page:', error);
        setGenre(null);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [genreId, user]); // <-- Add user to dependency array

  if (loading) return <Container><Message>Loading genre...</Message></Container>;
  if (!genre) return <Container><Message>Genre not found.</Message></Container>;

  return (
    <Container>
      <Header>
        <GenreTitle $color={genre.color}>{genre.name}</GenreTitle>
        <GenreDescription>{genre.description}</GenreDescription>
      </Header>

      <SectionTitle>Songs in {genre.name}</SectionTitle>
      <TrackListContainer>
        {tracks.length > 0 ? (
          tracks.map(track => (
            <SongRow
              key={track.id}
              track={track}
              queue={tracks}
              isInitiallyLiked={likedTrackIds.has(track.id)} // <-- Pass liked status
            />
          ))
        ) : (
          <Message>No songs found for this genre.</Message>
        )}
      </TrackListContainer>
    </Container>
  );
};

export default GenreDetailPage;