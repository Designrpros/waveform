// src/components/AddToPlaylistModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { TrackForQueue } from './SongRow';
import { Modal } from './Modal';
import { ListMusic } from 'lucide-react';

// --- Styled Components ---
const PlaylistList = styled.ul`
  list-style: none; padding: 0; max-height: 300px; overflow-y: auto;
`;
const PlaylistItem = styled.li`
  display: flex; align-items: center; gap: 1rem;
  padding: 0.75rem; border-radius: 0.5rem; cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: ${({ theme }) => theme.buttonHoverBg}; }
`;
const PlaylistArtwork = styled.img`
  width: 40px; height: 40px; border-radius: 4px; object-fit: cover;
`;
const Message = styled.p`
  color: ${({ theme }) => theme.subtleText}; text-align: center;
`;

interface Playlist {
  id: string;
  name: string;
  artwork?: string;
}

interface AddToPlaylistModalProps {
  track: TrackForQueue;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ track, isOpen, onClose }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (isOpen && user) {
      const fetchPlaylists = async () => {
        setStatus('loading');
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('http://51.175.105.40:8080/api/playlists', {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          if (!response.ok) throw new Error('Failed to fetch playlists.');
          const data = await response.json();
          setPlaylists(data);
          setStatus('success');
        } catch (error) {
          console.error(error);
          setStatus('error');
        }
      };
      fetchPlaylists();
    }
  }, [isOpen, user]);

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://51.175.105.40:8080/api/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId: track.id }),
      });
      if (!response.ok) throw new Error('Failed to add track.');
      alert(`Added "${track.title}" to the playlist!`);
      onClose();
    } catch (error) {
      alert('Error adding track. It might already be in the playlist.');
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
      {status === 'loading' && <Message>Loading playlists...</Message>}
      {status === 'error' && <Message>Could not load playlists.</Message>}
      {status === 'success' && (
        <PlaylistList>
          {playlists.length > 0 ? (
            playlists.map(p => (
              <PlaylistItem key={p.id} onClick={() => handleAddToPlaylist(p.id)}>
                {p.artwork ? <PlaylistArtwork src={p.artwork} /> : <ListMusic size={40} />}
                <span>{p.name}</span>
              </PlaylistItem>
            ))
          ) : (
            <Message>You don&apos;t have any playlists yet.</Message>
          )}
        </PlaylistList>
      )}
    </Modal>
  );
};