// src/app/discover/artist/[artistId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';
import { SongRow, TrackForQueue } from '../../../../components/SongRow';
import { useAuth } from '../../../../context/AuthContext';
import { AlbumCard, type Album as AlbumType } from '../../../../components/AlbumCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  max-width: 1024px; margin: 2rem auto; padding: 2rem;
`;
const Header = styled.div`
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; margin-bottom: 3rem;
`;
const ArtistArtwork = styled.img`
  width: 180px; height: 180px; border-radius: 50%; object-fit: cover;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;
const ArtistName = styled.h1`
  font-size: 3rem; font-weight: 800; color: ${({ theme }) => theme.text};
`;
const ArtistBio = styled.p`
  color: ${({ theme }) => theme.subtleText}; max-width: 600px; line-height: 1.6;
`;
const SectionTitle = styled.h2`
  font-size: 1.75rem; font-weight: 600; color: ${({ theme }) => theme.text};
  margin-top: 3rem; margin-bottom: 1.5rem;
`;
const TrackListContainer = styled.div`
  display: flex; flex-direction: column; gap: 0.25rem;
`;
const AlbumGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1.5rem;
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText}; margin-top: 2rem;
`;
const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem; color: ${({ theme }) => theme.accentColor}; 
  text-decoration: none; font-weight: 500; margin-bottom: 2rem;
  &:hover { color: ${({ theme }) => theme.text}; }
`;

// --- Interfaces ---
interface Artist { id: string; artist_name: string; bio: string; artwork: string; }

const ArtistDetailPage = () => {
  const params = useParams();
  const artistId = params.artistId as string;
  const { user } = useAuth();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<TrackForQueue[]>([]);
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistId) return;
    const fetchArtistData = async () => {
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        const [artistRes, tracksRes, albumsRes] = await Promise.all([
          fetch(`${API_BASE}/artist/${artistId}`),
          fetch(`${API_BASE}/artist/${artistId}/tracks`),
          fetch(`${API_BASE}/artist/${artistId}/albums`),
        ]);
        if (!artistRes.ok) throw new Error('Artist not found');
        
        const artistData = await artistRes.json();
        const tracksData = await tracksRes.ok ? await tracksRes.json() : [];
        const albumsData = await albumsRes.ok ? await albumsRes.json() : [];

        setArtist(artistData);
        setTracks(tracksData.map((t: TrackForQueue) => ({ ...t, artwork: t.artwork || artistData.artwork })));
        setAlbums(albumsData);

        if (user) {
          const idToken = await user.getIdToken();
          const likesRes = await fetch(`${API_BASE}/me/likes/tracks`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          if (likesRes.ok) {
            const likedData: {id: string}[] = await likesRes.json();
            setLikedTrackIds(new Set(likedData.map(t => t.id)));
          }
        }
      } catch (error) {
        console.error("Failed to fetch artist data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtistData();
  }, [artistId, user]);

  if (loading) return <Container><Message>Loading artist...</Message></Container>;
  if (!artist) return <Container><Message>Artist not found.</Message></Container>;

  return (
    <Container>
      <BackButton href="/discover/artist"><ChevronLeft size={20} /> All Artists</BackButton>
      <Header>
        <ArtistArtwork src={artist.artwork} alt={artist.artist_name} />
        <div>
          <ArtistName>{artist.artist_name}</ArtistName>
          {artist.bio && <ArtistBio>{artist.bio}</ArtistBio>}
        </div>
      </Header>

      <SectionTitle>Top Tracks</SectionTitle>
      {tracks.length > 0 ? (
        <TrackListContainer>
          {tracks.slice(0, 10).map(track => (
            <SongRow key={track.id} track={track} queue={tracks} isInitiallyLiked={likedTrackIds.has(track.id)} />
          ))}
        </TrackListContainer>
      ) : (
        <Message>No tracks found for this artist yet.</Message>
      )}

      <SectionTitle>Albums</SectionTitle>
      {albums.length > 0 ? (
        <AlbumGrid>
          {albums.map(album => (
            <AlbumCard key={album.id} album={{...album, artist: artist.artist_name}} />
          ))}
        </AlbumGrid>
      ) : (
        <Message>No albums found for this artist yet.</Message>
      )}
    </Container>
  );
};

export default ArtistDetailPage;