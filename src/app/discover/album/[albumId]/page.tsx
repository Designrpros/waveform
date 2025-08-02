"use client";

import React, { useState, useEffect } from 'react'; // Corrected: Import hooks from 'react'
import styled from 'styled-components';
import { useParams } from 'next/navigation';
import { SongRow, TrackForQueue } from '../../../../components/SongRow';
import { useAuth } from '../../../../context/AuthContext';
import { LicenseInfo } from '../../../../components/LicenseInfo';

// --- Styled Components ---
const Container = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const Header = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Artwork = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  flex-shrink: 0;
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const AlbumTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
`;

const ArtistName = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.subtleText};
  margin: 0.5rem 0 0 0;
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.subtleText};
`;

// --- Interfaces to match API response ---
interface LocalTrack {
  id: string;
  title: string;
  track_number: number;
  audioPath: string;
}

interface Album {
  id: string;
  title: string;
  artistName: string;
  artwork: string;
  tracks: LocalTrack[];
  licensing: 'cc' | 'proprietary';
  cc_type?: string;
}

// --- Page Component ---
const AlbumPage = () => {
  const params = useParams();
  const albumId = params.albumId as string;
  const { user } = useAuth();

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [playbackQueue, setPlaybackQueue] = useState<TrackForQueue[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAlbumData = async () => {
      if (!albumId) return;
      setLoading(true);

      try {
        // Fetch album details
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/album/${albumId}`);
        if (!response.ok) throw new Error(`Album API error: ${response.status}`);
        const data: Album = await response.json();
        setAlbum(data);

        // Create the full queue required by SongRow and PlayerContext
        const queue: TrackForQueue[] = data.tracks.map(t => ({
          id: t.id,
          title: t.title,
          artist: data.artistName,
          audioPath: t.audioPath,
          artwork: data.artwork,
          licensing: data.licensing,
          cc_type: data.cc_type,
        }));
        setPlaybackQueue(queue);

        // If user is logged in, fetch their liked tracks
        if (user) {
          const idToken = await user.getIdToken();
          const likesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me/likes/tracks`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          if (likesResponse.ok) {
            // Corrected: Add type for likedTracks parameter
            const likedTracks: { id: string }[] = await likesResponse.json();
            setLikedTrackIds(new Set(likedTracks.map((track: { id: string }) => track.id)));
          }
        }
      } catch (error) {
        console.error("Failed to fetch album data:", error);
        setAlbum(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumData();
  }, [albumId, user]);

  if (loading) return <Container><Message>Loading album...</Message></Container>;
  if (!album) return <Container><Message>Album not found.</Message></Container>;

  return (
    <Container>
      <Header>
        <Artwork src={album.artwork} alt={`${album.title} artwork`} />
        <AlbumInfo>
          <AlbumTitle>{album.title}</AlbumTitle>
          <ArtistName>{album.artistName}</ArtistName>
          <LicenseInfo licensing={album.licensing} cc_type={album.cc_type} />
        </AlbumInfo>
      </Header>
      <TrackList>
        {playbackQueue.length > 0 ? (
          playbackQueue.map((track) => (
            <SongRow
              key={track.id}
              track={track}
              queue={playbackQueue}
              isInitiallyLiked={likedTrackIds.has(track.id)}
            />
          ))
        ) : (
          <Message>No tracks found for this album.</Message>
        )}
      </TrackList>
    </Container>
  );
};

export default AlbumPage;
