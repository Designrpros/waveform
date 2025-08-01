// src/components/GlobalPlayer.tsx
"use client";

import React, { useState, useRef, useEffect, memo } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { usePlayer, RepeatMode } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Shuffle, Repeat, Repeat1, Mic, ListMusic, Radio } from 'lucide-react';

// --- Helper Functions ---
function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// --- Styled Components (All definitions are now included) ---
const marqueeAnimation = keyframes`
  0% { transform: translateX(0); }
  15% { transform: translateX(0); }
  85% { transform: translateX(var(--marquee-transform)); }
  100% { transform: translateX(var(--marquee-transform)); }
`;
const MarqueeContainer = styled.div`
  overflow: hidden; white-space: nowrap; width: 100%;
`;
const MarqueeText = styled.p<{ $isExpanded?: boolean }>`
  display: inline-block;
  padding-right: 2rem;
  animation: ${marqueeAnimation} var(--marquee-duration, 10s) linear infinite;
  animation-play-state: var(--marquee-play-state, paused);
  font-weight: 600; color: ${({ theme }) => theme.text}; margin: 0;
  font-size: ${({ $isExpanded }) => ($isExpanded ? '2rem' : '1rem')};
`;
const WaveformCanvas = styled.canvas`
  width: 100%; height: 60px; cursor: pointer;
`;
const PlayerContainer = styled.div<{ $isExpanded: boolean }>`
  position: fixed; bottom: 0; left: 0; width: 100%;
  height: ${({ $isExpanded }) => ($isExpanded ? '100dvh' : '80px')}; // Use dvh for mobile viewport
  background-color: ${({ theme }) => theme.cardBg};
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  z-index: 1000; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
  transition: height 0.4s cubic-bezier(0.25, 1, 0.5, 1);
`;
const MiniPlayerBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem; height: 80px; cursor: pointer; flex-shrink: 0;
`;
const ExpandedSheet = styled.div<{ $offsetY: number, $view: 'player' | 'queue' }>`
  flex-grow: 1; display: flex;
  align-items: center; justify-content: space-around;
  padding: 1.5rem; overflow: hidden; position: relative;
`;
const PlayerView = styled.div<{ $isActive: boolean }>`
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: space-around;
    transition: transform 0.4s ease, opacity 0.4s ease;
    transform: translateX(${({ $isActive }) => $isActive ? '0' : '-100%'});
    opacity: ${({ $isActive }) => $isActive ? 1 : 0};
    visibility: ${({ $isActive }) => $isActive ? 'visible' : 'hidden'};
    position: absolute; top: 0; left: 0; padding: 5rem 1.5rem 1.5rem;
`;
const QueueView = styled.div<{ $isActive: boolean }>`
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    transition: transform 0.4s ease, opacity 0.4s ease;
    transform: translateX(${({ $isActive }) => $isActive ? '0' : '100%'});
    opacity: ${({ $isActive }) => $isActive ? 1 : 0};
    visibility: ${({ $isActive }) => $isActive ? 'visible' : 'hidden'};
    position: absolute; top: 0; left: 0; padding: 5rem 1.5rem 1.5rem;
`;
const QueueTitle = styled.h2`
  font-size: 1.5rem; text-align: center; margin-top: 0; margin-bottom: 1rem;
`;
const QueueList = styled.ul`
  list-style: none; padding: 0; flex-grow: 1; overflow-y: auto;
`;
const QueueItem = styled.li<{ $isCurrent: boolean }>`
  padding: 0.75rem; border-radius: 0.5rem; display: flex; gap: 1rem; align-items: center;
  cursor: pointer;
  background-color: ${({ $isCurrent, theme }) => $isCurrent ? theme.buttonHoverBg : 'transparent'};
  &:hover { background-color: ${({ theme }) => theme.buttonHoverBg}; }
`;
const QueueArtwork = styled.img`
  width: 40px; height: 40px; border-radius: 4px; object-fit: cover;
`;
const CloseButton = styled.button`
  position: absolute; top: 1.5rem; left: 1.5rem; background: none; border: none;
  color: ${({ theme }) => theme.text}; cursor: pointer; z-index: 1001;
`;
const TrackInfo = styled.div`
  display: flex; align-items: center; gap: 1rem; flex-grow: 1; min-width: 0;
`;
const Artwork = styled.img<{ $isExpanded?: boolean }>`
  width: ${({ $isExpanded }) => ($isExpanded ? 'clamp(200px, 40vmin, 350px)' : '50px')};
  height: ${({ $isExpanded }) => ($isExpanded ? 'clamp(200px, 40vmin, 350px)' : '50px')};
  border-radius: ${({ $isExpanded }) => ($isExpanded ? '1rem' : '4px')};
  object-fit: cover; box-shadow: ${({ $isExpanded }) => ($isExpanded ? '0 10px 30px rgba(0,0,0,0.2)' : 'none')};
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
`;
const TextInfo = styled.div<{ $isExpanded?: boolean }>`
  display: flex; flex-direction: column;
  text-align: ${({ $isExpanded }) => ($isExpanded ? 'center' : 'left')};
  margin-top: ${({ $isExpanded }) => ($isExpanded ? '1.5rem' : '0')};
  width: 100%; min-width: 0;
`;
const Artist = styled.p<{ $isExpanded?: boolean }>`
  font-size: ${({ $isExpanded }) => ($isExpanded ? '1.2rem' : '0.8rem')};
  color: ${({ theme }) => theme.subtleText}; margin: 0;
`;
const Controls = styled.div`
  display: flex; align-items: center; gap: 1rem;
`;
const ExpandedControls = styled.div`
  width: 100%; display: flex; flex-direction: column; gap: 1rem;
`;
const MainControls = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 2rem;
`;
const ControlButton = styled.button`
  background: none; border: none; color: ${({ theme }) => theme.text};
  cursor: pointer; transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.accentColor}; }
  &:disabled { color: ${({ theme }) => theme.borderColor}; cursor: not-allowed; }
`;
const PlayButton = styled(ControlButton)`
  background-color: ${({ theme }) => theme.text}; color: ${({ theme }) => theme.body};
  width: 60px; height: 60px; border-radius: 50%;
  &:hover { background-color: ${({ theme }) => theme.accentColor}; color: white; }
`;
const TimeText = styled.span`
  font-size: 0.8rem; color: ${({ theme }) => theme.subtleText}; min-width: 40px; text-align: center;
`;
const ProgressBarContainer = styled.div`
  width: 100%; display: flex; align-items: center; gap: 1rem;
`;
const ViewToggleContainer = styled.div`
  display: flex; justify-content: center; gap: 2rem;
  margin-top: 1.5rem;
`;

// --- Child Components ---
const MemoizedMarquee: React.FC<{ text: string, isExpanded?: boolean }> = memo(({ text, isExpanded }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [transform, setTransform] = useState(0);

    useEffect(() => {
        if (containerRef.current && textRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const textWidth = textRef.current.offsetWidth;
            const overflows = textWidth > containerWidth;
            setIsOverflowing(overflows);
            if (overflows) {
                setDuration(textWidth / 40);
                setTransform(-(textWidth + 32));
            } else {
                setDuration(0);
                setTransform(0);
            }
        }
    }, [text]);

    const style = {
        '--marquee-duration': `${duration}s`,
        '--marquee-transform': `${transform}px`,
        '--marquee-play-state': isOverflowing ? 'running' : 'paused',
    } as React.CSSProperties;

    return (
        <MarqueeContainer ref={containerRef}>
            <MarqueeText ref={textRef} $isExpanded={isExpanded} style={style}>
                {text}
                {isOverflowing && text}
            </MarqueeText>
        </MarqueeContainer>
    );
});
MemoizedMarquee.displayName = 'Marquee';

const MemoizedWaveform: React.FC = memo(() => {
    const { waveformSamples, trackProgress, duration, seek } = usePlayer();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context.scale(dpr, dpr);

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const barWidth = 2;
        const gap = 2;
        const numBars = Math.floor(width / (barWidth + gap));
        
        context.clearRect(0, 0, width, height);
        if (waveformSamples.length === 0) return;

        const step = waveformSamples.length / numBars;
        for (let i = 0; i < numBars; i++) {
            const sampleIndex = Math.floor(i * step);
            const sample = waveformSamples[sampleIndex] || 0;
            const x = i * (barWidth + gap);
            const barHeight = Math.max(1, sample * height);
            const y = (height - barHeight) / 2;
            const progress = duration > 0 ? trackProgress / duration : 0;
            context.fillStyle = (x / width < progress) ? theme.accentColor : theme.subtleText;
            context.fillRect(x, y, barWidth, barHeight);
        }
    }, [waveformSamples, trackProgress, duration, theme]);

    const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const seekRatio = clickX / rect.width;
        seek(duration * seekRatio);
    };

    return <WaveformCanvas ref={canvasRef} onClick={handleSeek} />;
});
MemoizedWaveform.displayName = 'Waveform';


// --- Main Player Component ---
export const GlobalPlayer = () => {
  const player = usePlayer();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState<'player' | 'queue'>('player');

  if (!player.currentTrack) return null;

  const RepeatIcon = (repeatMode: RepeatMode) => {
    switch (repeatMode) {
      case 'one': return Repeat1;
      case 'all': return Repeat;
      default: return Repeat;
    }
  };
  const CurrentRepeatIcon = RepeatIcon(player.repeatMode);

  return (
    <PlayerContainer $isExpanded={isExpanded}>
      {isExpanded && (
          <CloseButton onClick={() => { setIsExpanded(false); setTimeout(() => setActiveView('player'), 300); }}>
            <ChevronDown size={32} />
          </CloseButton>
      )}
      
      {isExpanded ? (
        <ExpandedSheet $offsetY={0} $view={activeView}>
            <PlayerView $isActive={activeView === 'player'}>
              <Artwork $isExpanded={true} src={player.currentTrack.artwork || '/assets/WaveForm.jpeg'} alt="Track artwork" />
              <TextInfo $isExpanded={true}>
                <MemoizedMarquee text={player.currentTrack.title} isExpanded={isExpanded} />
                <Artist $isExpanded={true}>{player.currentTrack.artist}</Artist>
              </TextInfo>
              <ExpandedControls>
                <MemoizedWaveform />
                <ProgressBarContainer>
                  <TimeText>{formatTime(player.trackProgress)}</TimeText>
                  <input type="range" style={{display: 'none'}} />
                  <TimeText>{formatTime(player.duration)}</TimeText>
                </ProgressBarContainer>
                <MainControls>
                  <ControlButton onClick={player.toggleShuffle} style={{ color: player.isShuffling ? theme.accentColor : 'inherit' }}>
                    <Shuffle size={24} />
                  </ControlButton>
                  <ControlButton onClick={player.playPrev} disabled={player.playbackQueue.length <= 1}><SkipBack size={32} /></ControlButton>
                  <PlayButton onClick={player.togglePlayPause}>
                    {player.isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </PlayButton>
                  <ControlButton onClick={player.playNext} disabled={player.playbackQueue.length <= 1}><SkipForward size={32} /></ControlButton>
                  <ControlButton onClick={player.cycleRepeatMode} style={{ color: player.repeatMode !== 'off' ? theme.accentColor : 'inherit' }}>
                    <CurrentRepeatIcon size={24} />
                  </ControlButton>
                </MainControls>
              </ExpandedControls>
              <ViewToggleContainer>
                <ControlButton onClick={() => player.startRadioFromTrack(player.currentTrack!)}><Radio size={24}/></ControlButton>
                <ControlButton onClick={() => alert('Lyrics view coming soon!')}><Mic size={24}/></ControlButton>
                <ControlButton onClick={() => setActiveView('queue')}><ListMusic size={24}/></ControlButton>
              </ViewToggleContainer>
            </PlayerView>
            <QueueView $isActive={activeView === 'queue'}>
                <QueueTitle>Up Next</QueueTitle>
                <QueueList>
                    {player.playbackQueue.map((track, index) => (
                        <QueueItem 
                            key={`${track.id}-${index}`} 
                            $isCurrent={track.id === player.currentTrack?.id}
                            onClick={() => player.playTrack(track, player.playbackQueue)}
                        >
                            <QueueArtwork src={track.artwork || '/assets/WaveForm.jpeg'} />
                            <div>
                                <p style={{fontWeight: 600, margin: 0}}>{track.title}</p>
                                <p style={{fontSize: '0.8rem', color: theme.subtleText, margin: 0}}>{track.artist}</p>
                            </div>
                        </QueueItem>
                    ))}
                </QueueList>
                 <ViewToggleContainer>
                    <ControlButton onClick={() => setActiveView('player')}><ChevronDown size={24}/></ControlButton>
                </ViewToggleContainer>
            </QueueView>
        </ExpandedSheet>
      ) : (
        <MiniPlayerBar onClick={() => setIsExpanded(true)}>
          <TrackInfo>
            <Artwork src={player.currentTrack.artwork || '/assets/WaveForm.jpeg'} alt="Track artwork" />
            <TextInfo>
              <MemoizedMarquee text={player.currentTrack.title} />
              <Artist>{player.currentTrack.artist}</Artist>
            </TextInfo>
          </TrackInfo>
          <Controls>
            <ControlButton onClick={(e) => { e.stopPropagation(); player.togglePlayPause(); }}>
              {player.isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </ControlButton>
          </Controls>
        </MiniPlayerBar>
      )}
    </PlayerContainer>
  );
};