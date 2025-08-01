// src/app/discover/artist/[artistId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SongRow, TrackForQueue } from '../../../../components/SongRow';
import { useAuth } from '../../../../context/AuthContext';
import { UserPlus, UserCheck } from 'lucide-react';

// --- Styled Components ---
const Container = styled.div`
  max-width: 800px; margin: 4rem auto; padding: 2rem; color: ${({ theme }) => theme.text};
`;
const Header = styled.div`
  display: flex; flex-direction: column; align-items: center;
  gap: 1.5rem; margin-bottom: 3rem; text-align: center;
`;
const ArtistArtwork = styled.img`
  width: 150px; height: 150px; border-radius: 50%; object-fit: cover;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
`;
const ArtistName = styled.h1`
  font-size: 3rem; font-weight: 800; margin: 0;
`;
const ArtistBio = styled.p`
  font-size: 1rem; color: ${({ theme }) => theme.subtleText};
  max-width: 600px; line-height: 1.6;
`;
const SectionTitle = styled.h2`
  font-size: 2rem; font-weight: 700; color: ${({ theme }) => theme.text};
  margin-top: 3rem; margin-bottom: 1.5rem;
`;
const MusicList = styled.div`
  display: flex; flex-direction: column; gap: 0.25rem;
`;
const AlbumGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem; margin-top: 1.5rem;
`;
const AlbumCard = styled(Link)`
  display: flex; flex-direction: column; align-items: center;
  text-align: center; cursor: pointer; text-decoration: none; color: inherit;
`;
const AlbumCardArtwork = styled.img`
  width: 150px; height: 150px; border-radius: 0.5rem;
  object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;
const AlbumCardTitle = styled.p`
  font-weight: 600; color: ${({ theme }) => theme.text}; margin-top: 0.5rem;
  font-size: 0.95rem; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; width: 100%;
`;
const Message = styled.p`
  text-align: center; color: #9CA3AF;
`;
const FollowButton = styled.button<{ $isFollowing: boolean }>`
  display: inline-flex; align-items: center; justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme, $isFollowing }) => $isFollowing ? theme.accentColor : theme.borderColor};
  background-color: ${({ theme, $isFollowing }) => $isFollowing ? theme.accentColor : 'transparent'};
  color: ${({ theme, $isFollowing }) => $isFollowing ? 'white' : theme.text};

  &:hover {
    opacity: 0.8;
  }
`;

// --- Interfaces ---
interface ArtistDetail {
  id: number; // CORRECTED: The API sends ID as a number
  name: string;
  bio?: string;
  artwork?: string;
}
interface AlbumItem { id: string; title: string; artist: string; artwork: string; }

const ArtistDetailPage = () => {
  const params = useParams();
  const artistId = params.artistId as string;
  const { user } = useAuth();
  const router = useRouter();

  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [songs, setSongs] = useState<TrackForQueue[]>([]);
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId) return;
      setLoading(true);

      try {
        const [artistRes, tracksRes, albumsRes] = await Promise.all([
          fetch(`http://51.175.105.40:8080/api/artist/${artistId}`),
          fetch(`http://51.175.105.40:8080/api/artist/${artistId}/tracks`),
          fetch(`http://51.175.105.40:8080/api/artist/${artistId}/albums`)
        ]);

        if (!artistRes.ok) throw new Error(`Artist API error: ${artistRes.status}`);
        const artistData = await artistRes.json();
        const tracksData = await tracksRes.json();
        const albumsData = await albumsRes.json();

        setArtist(artistData);
        setAlbums(albumsData);
        const formattedSongs = tracksData.map((track: any) => ({ ...track, licensing: 'proprietary' }));
        setSongs(formattedSongs);

        if (user) {
          const idToken = await user.getIdToken();
          const [likesResponse, followsResponse] = await Promise.all([
            fetch('http://51.175.105.40:8080/api/me/likes/tracks', { headers: { 'Authorization': `Bearer ${idToken}` } }),
            fetch('http://51.175.105.40:8080/api/me/follows', { headers: { 'Authorization': `Bearer ${idToken}` } })
          ]);

          if (likesResponse.ok) {
            const likedTracks: TrackForQueue[] = await likesResponse.json();
            setLikedTrackIds(new Set(likedTracks.map(track => track.id)));
          }
          if (followsResponse.ok) {
            const followedArtists: ArtistDetail[] = await followsResponse.json();
            // CORRECTED: Compare string to string to fix the persistence bug
            setIsFollowing(followedArtists.some(a => String(a.id) === artistId));
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

  const handleFollowToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const previousFollowStatus = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('http://51.175.105.40:8080/api/follows', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artistId: artistId }),
      });
      if (!response.ok) {
        setIsFollowing(previousFollowStatus);
        alert('Failed to update follow status.');
      }
    } catch (error) {
      setIsFollowing(previousFollowStatus);
      alert('An error occurred.');
    }
  };

  if (loading) return <Container><Message>Loading artist...</Message></Container>;
  if (!artist) return <Container><Message>Artist not found.</Message></Container>;

  return (
    <Container>
      <Header>
        <ArtistArtwork src={artist.artwork || 'https://placehold.co/150x150/383434/F9FAFB?text=Artist'} alt={artist.name} />
        <ArtistName>{artist.name}</ArtistName>
        <FollowButton onClick={handleFollowToggle} $isFollowing={isFollowing}>
          {isFollowing ? <UserCheck size={20} /> : <UserPlus size={20} />}
          {isFollowing ? 'Following' : 'Follow'}
        </FollowButton>
        <ArtistBio>{artist.bio || 'No biography available.'}</ArtistBio>
      </Header>

      <SectionTitle>Popular Songs</SectionTitle>
      <MusicList>
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongRow key={song.id} track={song} queue={songs} isInitiallyLiked={likedTrackIds.has(song.id)} />
          ))
        ) : (
          <Message>No popular songs found for this artist.</Message>
        )}
      </MusicList>

      <SectionTitle>Albums</SectionTitle>
      <AlbumGrid>
        {albums.length > 0 ? (
          albums.map((album) => (
            <AlbumCard key={album.id} href={`/discover/album/${album.id}`}>
              <AlbumCardArtwork src={album.artwork || 'https://placehold.co/150x150/383434/F9FAFB?text=Album'} alt={album.title} />
              <AlbumCardTitle>{album.title}</AlbumCardTitle>
            </AlbumCard>
          ))
        ) : (
          <Message style={{ gridColumn: '1 / -1' }}>No albums found for this artist.</Message>
        )}
      </AlbumGrid>
    </Container>
  );
};

export default ArtistDetailPage;