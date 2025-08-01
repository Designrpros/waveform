"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

// --- Interfaces ---
export interface Track {
  id: string;
  title: string;
  artist?: string;
  audioPath: string;
  artwork?: string;
}

export type RepeatMode = 'off' | 'one' | 'all';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  startRadioFromTrack: (track: Track) => void;
  trackProgress: number;
  seek: (time: number) => void;
  duration: number;
  isLoading: boolean;
  repeatMode: RepeatMode;
  isShuffling: boolean;
  cycleRepeatMode: () => void;
  toggleShuffle: () => void;
  waveformSamples: number[];
  playbackQueue: Track[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Define a type for the window object to include the vendor-prefixed AudioContext
interface WindowWithAudioContext extends Window {
  webkitAudioContext: typeof AudioContext;
}

// --- Web Audio API Helper ---
const analyzeAudio = async (audioPath: string): Promise<number[]> => {
  try {
    if (typeof window === 'undefined') return Array(200).fill(0.1);
    
    // Corrected: Cast to 'unknown' first for type safety
    const audioContext = new (window.AudioContext || (window as unknown as WindowWithAudioContext).webkitAudioContext)();
    const response = await fetch(audioPath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const rawData = audioBuffer.getChannelData(0);
    const samples = 200;
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]);
      }
      filteredData.push(sum / blockSize);
    }
    
    const max = Math.max(...filteredData);
    if (max === 0) return Array(200).fill(0);
    return filteredData.map(n => n / max);
  } catch (error) {
    console.error("Error analyzing audio:", error);
    return Array(200).fill(0.1);
  }
};


export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [shuffledQueue, setShuffledQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffling, setIsShuffling] = useState(false);
  const [waveformSamples, setWaveformSamples] = useState<number[]>([]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      return;
    }
    const currentPlaybackQueue = isShuffling ? shuffledQueue : queue;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= currentPlaybackQueue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }
    setCurrentIndex(nextIndex);
    setCurrentTrack(currentPlaybackQueue[nextIndex]);
  }, [currentIndex, queue, shuffledQueue, isShuffling, repeatMode]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    if (trackProgress > 3) {
        if (audioRef.current) audioRef.current.currentTime = 0;
        return;
    }
    const currentPlaybackQueue = isShuffling ? shuffledQueue : queue;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = repeatMode === 'all' ? currentPlaybackQueue.length - 1 : -1;
    }
    if (prevIndex !== -1) {
        setCurrentIndex(prevIndex);
        setCurrentTrack(currentPlaybackQueue[prevIndex]);
    }
  }, [currentIndex, queue, shuffledQueue, isShuffling, repeatMode, trackProgress]);

  useEffect(() => {
    if (!currentTrack) return;
    if (audioRef.current) { audioRef.current.pause(); }
    setIsLoading(true);
    setWaveformSamples([]);
    const newAudio = new Audio(currentTrack.audioPath);
    audioRef.current = newAudio;
    analyzeAudio(currentTrack.audioPath).then(setWaveformSamples);
    const onLoadedMetadata = () => { setDuration(newAudio.duration); setIsLoading(false); setIsPlaying(true); };
    const onTimeUpdate = () => { setTrackProgress(newAudio.currentTime); };
    const onEnded = () => { playNext(); };
    newAudio.addEventListener('loadedmetadata', onLoadedMetadata);
    newAudio.addEventListener('timeupdate', onTimeUpdate);
    newAudio.addEventListener('ended', onEnded);
    return () => {
      newAudio.removeEventListener('loadedmetadata', onLoadedMetadata);
      newAudio.removeEventListener('timeupdate', onTimeUpdate);
      newAudio.removeEventListener('ended', onEnded);
      newAudio.pause();
      audioRef.current = null;
    };
  }, [currentTrack, playNext]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play().catch(e => console.error("Playback Error:", e)) : audioRef.current.pause();
    }
  }, [isPlaying]);

  const playTrack = useCallback((track: Track, upcomingQueue: Track[] = []) => {
    const newQueue = upcomingQueue.length > 0 ? upcomingQueue : [track];
    setQueue(newQueue);
    if (isShuffling) {
        const shuffled = [...newQueue].sort(() => Math.random() - 0.5);
        setShuffledQueue(shuffled);
        const trackIndexInShuffled = shuffled.findIndex(t => t.id === track.id);
        setCurrentIndex(trackIndexInShuffled);
    } else {
        const trackIndex = newQueue.findIndex(t => t.id === track.id);
        setCurrentIndex(trackIndex);
    }
    setCurrentTrack(track);
    try {
        // Corrected: Use 'void' to indicate the promise is intentionally not awaited
        void fetch(`http://51.175.105.40:8080/api/track/${track.id}/play`, { method: 'POST' });
    } catch (error) { console.warn("Could not update play count:", error); }
  }, [isShuffling]);

  const startRadioFromTrack = useCallback(async (track: Track) => {
    try {
      const response = await fetch(`http://51.175.105.40:8080/api/radio/start/${track.id}`);
      if (!response.ok) throw new Error('Failed to fetch radio queue.');
      const radioQueue: Track[] = await response.json();
      const newQueue = [track, ...radioQueue];
      playTrack(track, newQueue);
    } catch (error) {
      console.error("Could not start radio:", error);
      alert("Could not start radio station. Please try again.");
    }
  }, [playTrack]);

  const togglePlayPause = useCallback(() => {
    if (!isLoading && currentTrack) {
      setIsPlaying(prev => !prev);
    }
  }, [isLoading, currentTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setTrackProgress(time);
    }
  }, []);

  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
        if (prev === 'off') return 'all';
        if (prev === 'all') return 'one';
        return 'off';
    });
  };

  const toggleShuffle = () => {
    setIsShuffling(prev => {
        const newShuffleState = !prev;
        if (newShuffleState) {
            const shuffled = [...queue].sort(() => Math.random() - 0.5);
            setShuffledQueue(shuffled);
            const newIndex = currentTrack ? shuffled.findIndex(t => t.id === currentTrack.id) : -1;
            setCurrentIndex(newIndex);
        } else {
            const newIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
            setCurrentIndex(newIndex);
        }
        return newShuffleState;
    });
  };
  
  const value = {
    currentTrack, isPlaying, playTrack, togglePlayPause, playNext, playPrev, startRadioFromTrack,
    trackProgress, seek, duration, isLoading,
    repeatMode, isShuffling, cycleRepeatMode, toggleShuffle, waveformSamples,
    playbackQueue: isShuffling ? shuffledQueue : queue,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
