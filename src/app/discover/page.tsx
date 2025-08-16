// src/app/discover/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Search, ChevronRight, X, Music, PlayCircle, Star, TrendingUp, User, Users, Disc3, ListMusic, Play, Pause, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePlayer } from '../../context/PlayerContext';
import { TrackForQueue } from '../../components/SongRow';

// --- Type Definitions ---
interface Genre { id: number; name: string; color: string; }
interface Artist { id: string; name: string; artwork: string; followers: number; }
interface Album { id: string; title: string; artist: string; artwork: string; year: number; }
interface Playlist { id: string; name: string; description: string; artwork: string; tracks: number; creatorName: string; }
interface SearchResults { tracks: TrackForQueue[]; artists: Artist[]; albums: Album[]; playlists: Playlist[]; }
type TrackFromApi = Omit<TrackForQueue, 'licensing'>;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const HeroSection = styled.section<{ $bgImage?: string }>`
  position: relative;
  overflow: hidden;
  background-image: url(${({ $bgImage }) => $bgImage || 'none'});
  background-color: #1a1a1a;
  background-size: cover;
  background-position: center;
  color: white;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.6) 70%, transparent);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 100%;
  padding: 4rem 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
`;

const PageSubtitle = styled.p`
    color: #D1D5DB;
    font-size: 1.25rem;
    margin-top: 0.25rem;
    margin-bottom: 2rem;
`;

const SearchBarContainer = styled.div`
  position: relative;
  max-width: 48rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 9999px;
  border: 1px solid #4B5563;
  transition: all 0.2s;
  &:focus-within {
    border-color: #a855f7;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  padding: 1rem 1rem 1rem 3.5rem;
  font-size: 1.125rem;
  color: white;
  &::placeholder {
    color: #9CA3AF;
  }
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1.25rem;
  color: #9CA3AF;
`;

const ClearSearchButton = styled.button`
  margin-right: 1rem;
  padding: 0.5rem;
  color: #9CA3AF;
  &:hover {
    color: white;
  }
`;

const FeaturedContent = styled.div`
    margin-top: 4rem;
`;

const HeroTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h2`
  font-size: 3.75rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  color: #D1D5DB;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeroButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  border: none;

  &.primary {
    background: ${({ theme }) => theme.accentGradient};
    color: white;
    &:hover {
      transform: scale(1.05);
    }
  }

  &.secondary {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;


const ContentContainer = styled.div`
  max-width: 100%;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const SectionTitleStyled = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.accentColor};
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const TrackGrid = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

const ArtistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 2rem;
`;

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const Message = styled.div`
    padding: 2rem;
    text-align: center;
    color: ${({ theme }) => theme.subtleText};
`;

const SearchResultsGrid = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

const SearchResultCategory = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const SearchResultCategoryTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const GenreCardStyled = styled.div<{ color: string }>`
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s;
    min-height: 120px;
    background-color: ${props => props.color};

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(0,0,0,0.2));
    }
    
    .content {
        position: relative;
        padding: 1.5rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title {
        color: white;
        font-weight: 700;
        font-size: 1.125rem;
        text-align: center;
        transition: transform 0.3s;
    }

    &:hover .title {
        transform: scale(1.1);
    }
`;

const ArtistCardStyled = styled.div`
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: scale(1.05);
    }

    .image-wrapper {
        position: relative;
        margin-bottom: 1rem;
    }

    img {
        width: 160px;
        height: 160px;
        border-radius: 9999px;
        object-fit: cover;
        margin-left: auto;
        margin-right: auto;
        border: 4px solid ${({ theme }) => theme.borderColor};
        transition: all 0.3s;
    }

    &:hover img {
        border-color: ${({ theme }) => theme.accentColor};
    }

    h3 {
        font-weight: 600;
        color: ${({ theme }) => theme.text};
        transition: color 0.2s;
    }
    
    &:hover h3 {
        color: ${({ theme }) => theme.accentColor};
    }
`;

const AlbumCardStyled = styled.div`
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        transform: scale(1.05);
    }

    .image-wrapper {
        position: relative;
        margin-bottom: 1rem;
    }

    img {
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 0.75rem;
        object-fit: cover;
    }

    h3 {
        font-weight: 600;
        color: ${({ theme }) => theme.text};
        transition: color 0.2s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    p {
        color: ${({ theme }) => theme.subtleText};
        font-size: 0.875rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &:hover h3 {
        color: ${({ theme }) => theme.accentColor};
    }
`;

const PlaylistCardStyled = styled(AlbumCardStyled)``;

const TrackRowStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    
    &:hover {
        background-color: ${({ theme }) => theme.buttonHoverBg};
    }

    .info-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        min-width: 0;
    }

    .image-wrapper {
        position: relative;
    }

    img {
        width: 3rem;
        height: 3rem;
        border-radius: 0.5rem;
        object-fit: cover;
    }

    .play-button {
        position: absolute;
        inset: 0;
        background-color: rgba(0,0,0,0.6);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.2s;
    }

    &:hover .play-button {
        opacity: 1;
    }

    .text-wrapper {
        flex: 1;
        min-width: 0;
    }

    h4 {
        font-weight: 600;
        color: ${({ theme }) => theme.text};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    p {
        color: ${({ theme }) => theme.subtleText};
        font-size: 0.875rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .like-button {
        padding: 0.5rem;
        border-radius: 9999px;
        transition: all 0.2s;
    }
`;

// --- Reusable Cards ---
const GenreCard = React.memo<{ genre: Genre }>(({ genre }) => (
    <Link href={`/discover/genre/${genre.id}`} passHref>
        <GenreCardStyled color={genre.color}>
            <div className="overlay" />
            <div className="content">
                <h3 className="title">{genre.name}</h3>
            </div>
        </GenreCardStyled>
    </Link>
));
GenreCard.displayName = 'GenreCard';

const ArtistCard = React.memo<{ artist: Artist }>(({ artist }) => (
    <Link href={`/discover/artist/${artist.id}`} passHref>
        <ArtistCardStyled>
            <div className="image-wrapper">
                <img src={artist.artwork} alt={artist.name} onError={(e) => { e.currentTarget.src = `https://placehold.co/160x160/1F2937/FFFFFF?text=${artist.name[0]}` }} />
            </div>
            <h3>{artist.name}</h3>
        </ArtistCardStyled>
    </Link>
));
ArtistCard.displayName = 'ArtistCard';

const AlbumCard = React.memo<{ album: Album }>(({ album }) => (
    <Link href={`/discover/album/${album.id}`} passHref>
        <AlbumCardStyled>
            <div className="image-wrapper">
                <img src={album.artwork} alt={album.title} onError={(e) => { e.currentTarget.src = `https://placehold.co/250x250/1F2937/FFFFFF?text=${album.title[0]}` }} />
            </div>
            <h3>{album.title}</h3>
            <p>{album.artist}</p>
        </AlbumCardStyled>
    </Link>
));
AlbumCard.displayName = 'AlbumCard';

const PlaylistCard = React.memo<{ playlist: Playlist }>(({ playlist }) => (
    <Link href={`/discover/playlist/${playlist.id}`} passHref>
        <PlaylistCardStyled>
            <div className="image-wrapper">
                <img src={playlist.artwork} alt={playlist.name} onError={(e) => { e.currentTarget.src = `https://placehold.co/280x280/1F2937/FFFFFF?text=${playlist.name[0]}` }} />
            </div>
            <h3>{playlist.name}</h3>
            <p>{playlist.creatorName}</p>
        </PlaylistCardStyled>
    </Link>
));
PlaylistCard.displayName = 'PlaylistCard';

const TrackRow = React.memo<{ track: TrackForQueue }>(({ track }) => {
    const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
    const [liked, setLiked] = useState(false);

    const handlePlayPause = () => {
        if (currentTrack?.id === track.id) {
            togglePlayPause();
        } else {
            playTrack(track, [track]);
        }
    };

    return (
        <TrackRowStyled>
            <div className="info-wrapper">
                <div className="image-wrapper">
                    <img src={track.artwork} alt={track.title} onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/6366f1/ffffff?text=${track.title[0]}` }} />
                    <button onClick={handlePlayPause} className="play-button" aria-label={isPlaying && currentTrack?.id === track.id ? 'Pause' : 'Play'}>
                        {isPlaying && currentTrack?.id === track.id ? <Pause size={16} color="white" /> : <Play size={16} color="white" style={{ marginLeft: '2px' }} />}
                    </button>
                </div>
                <div className="text-wrapper">
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                </div>
            </div>
            <div className="actions">
                <button onClick={() => setLiked(!liked)} className="like-button" style={{ color: liked ? '#ef4444' : '#9CA3AF' }} aria-label={liked ? 'Unlike' : 'Like'}>
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                </button>
            </div>
        </TrackRowStyled>
    );
});
TrackRow.displayName = 'TrackRow';


const DiscoverPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [topGenres, setTopGenres] = useState<Genre[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<TrackForQueue[]>([]);
  const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [curatedPlaylists, setCuratedPlaylists] = useState<Playlist[]>([]);
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playTrack } = usePlayer();

  const generateColor = (genreName: string) => {
    const genreColors = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];
    let hash = 0;
    for (let i = 0; i < genreName.length; i++) {
      hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return genreColors[Math.abs(hash) % genreColors.length];
  };

  useEffect(() => {
    const fetchDiscoverData = async () => {
      setStatus('loading');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const [tracksRes, playlistsRes, genresRes, artistsRes, albumsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/tracks/trending?limit=5`),
          fetch(`${API_BASE_URL}/playlists/curated`),
          fetch(`${API_BASE_URL}/genres`),
          fetch(`${API_BASE_URL}/artists/popular?limit=4`),
          fetch(`${API_BASE_URL}/albums/top?limit=6`)
        ]);

        if (tracksRes.ok) {
          const data: TrackFromApi[] = await tracksRes.json();
          setTrendingSongs(data.map(t => ({ ...t, licensing: 'proprietary' })));
        }
        if (playlistsRes.ok) setCuratedPlaylists(await playlistsRes.json());
        if (genresRes.ok) {
            const data: {id: number, name: string}[] = await genresRes.json();
            setTopGenres(data.slice(0, 6).map(g => ({...g, color: generateColor(g.name)})));
        }
        if (artistsRes.ok) setPopularArtists(await artistsRes.json());
        if (albumsRes.ok) setTopAlbums(await albumsRes.json());
        
        setStatus('success');
      } catch (error) {
        console.error("Error fetching discover data:", error);
        setStatus('error');
      }
    };
    fetchDiscoverData();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        if(response.ok) {
            const data = await response.json();
            const formattedData = {
                ...data,
                tracks: data.tracks.map((t: TrackFromApi) => ({...t, licensing: 'proprietary'}))
            }
            setSearchResults(formattedData);
        } else {
            setSearchResults({ tracks: [], artists: [], albums: [], playlists: [] });
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  }, []);

  const handlePlayPlaylist = async (playlistId: string) => {
    if (!playlistId) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`);
      if (!response.ok) throw new Error('Could not fetch playlist tracks.');
      const playlistData: { tracks: TrackForQueue[] } = await response.json();
      if (playlistData.tracks && playlistData.tracks.length > 0) {
        playTrack(playlistData.tracks[0], playlistData.tracks);
      } else {
        alert("This playlist is empty!");
      }
    } catch (error) {
      console.error("Failed to play playlist:", error);
      alert("Could not start playback for this playlist.");
    }
  };

  const clearSearch = useCallback(() => handleSearch(''), [handleSearch]);

  const featuredPlaylist = curatedPlaylists?.[0];

  return (
    <>
      <Head>
        <title>Discover Music - WaveForum.org</title>
        <meta name="description" content="Discover unique and independent music on WaveForum.org." />
      </Head>
      <PageWrapper>
        {searchQuery ? (
          <SearchResultsGrid>
            {isSearching ? (
              <Message><div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />Searching...</Message>
            ) : searchResults ? (
              <>
                {searchResults.tracks.length > 0 && (
                  <SearchResultCategory>
                    <SearchResultCategoryTitle><Music color="#a855f7" />Tracks</SearchResultCategoryTitle>
                    <div>{searchResults.tracks.map((track) => (<TrackRow key={track.id} track={track} />))}</div>
                  </SearchResultCategory>
                )}
                {searchResults.artists.length > 0 && (
                  <SearchResultCategory>
                    <SearchResultCategoryTitle><Users color="#3b82f6" />Artists</SearchResultCategoryTitle>
                    <ArtistGrid>{searchResults.artists.map(artist => (<ArtistCard key={artist.id} artist={artist} />))}</ArtistGrid>
                  </SearchResultCategory>
                )}
                {searchResults.albums.length > 0 && (
                  <SearchResultCategory>
                    <SearchResultCategoryTitle><Disc3 color="#22c55e" />Albums</SearchResultCategoryTitle>
                    <AlbumGrid>{searchResults.albums.map(album => (<AlbumCard key={album.id} album={album} />))}</AlbumGrid>
                  </SearchResultCategory>
                )}
                {searchResults.playlists.length > 0 && (
                  <SearchResultCategory>
                    <SearchResultCategoryTitle><ListMusic color="#ec4899" />Playlists</SearchResultCategoryTitle>
                    <AlbumGrid>{searchResults.playlists.map(playlist => (<PlaylistCard key={playlist.id} playlist={playlist} />))}</AlbumGrid>
                  </SearchResultCategory>
                )}
              </>
            ) : (
              <Message>No results found for "{searchQuery}"</Message>
            )}
          </SearchResultsGrid>
        ) : (
          <>
            <HeroSection $bgImage={featuredPlaylist?.artwork}>
                <HeroOverlay />
                <HeroContent>
                    <div>
                        <PageTitle>Discover Music</PageTitle>
                        <PageSubtitle>Explore a world of independent sound</PageSubtitle>
                        <SearchBarContainer>
                            <SearchInputWrapper>
                                <SearchIcon size={20} />
                                <SearchInput type="text" placeholder="Search songs, artists, albums, or playlists..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} />
                                {searchQuery && (<ClearSearchButton onClick={clearSearch} aria-label="Clear search"><X size={20} /></ClearSearchButton>)}
                            </SearchInputWrapper>
                        </SearchBarContainer>
                        {featuredPlaylist && (
                            <FeaturedContent>
                                <HeroTag><Star size={16} /> FEATURED PLAYLIST</HeroTag>
                                <HeroTitle>{featuredPlaylist.name}</HeroTitle>
                                <HeroDescription>{featuredPlaylist.description}</HeroDescription>
                                <HeroActions>
                                <HeroButton className="primary" onClick={() => handlePlayPlaylist(featuredPlaylist.id)}><PlayCircle size={24} />Listen Now</HeroButton>
                                <HeroButton as={Link} href={`/discover/playlist/${featuredPlaylist.id}`} className="secondary">View Playlist</HeroButton>
                                </HeroActions>
                            </FeaturedContent>
                        )}
                    </div>
                </HeroContent>
            </HeroSection>

            <ContentContainer>
              <section>
                <SectionHeader>
                    <SectionTitleStyled>Top Genres</SectionTitleStyled>
                    <ViewAllLink href="/discover/genre"><ChevronRight size={20} /></ViewAllLink>
                </SectionHeader>
                {topGenres && topGenres.length > 0 ? <GenreGrid>{topGenres.map(genre => <GenreCard key={genre.id} genre={genre} />)}</GenreGrid> : <Message>No genres available.</Message>}
              </section>
              <section>
                <SectionHeader><SectionTitleStyled><TrendingUp /> Trending Tracks</SectionTitleStyled><ViewAllLink href="/discover/track"><ChevronRight size={20} /></ViewAllLink></SectionHeader>
                {trendingSongs && trendingSongs.length > 0 ? <TrackGrid>{trendingSongs.map((track) => <TrackRow key={track.id} track={track} />)}</TrackGrid> : <Message>No trending tracks available.</Message>}
              </section>
              <section>
                <SectionHeader><SectionTitleStyled><Star /> Hot Selections</SectionTitleStyled><ViewAllLink href="/discover/public-playlists"><ChevronRight size={20} /></ViewAllLink></SectionHeader>
                {curatedPlaylists && curatedPlaylists.length > 0 ? <AlbumGrid>{curatedPlaylists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)}</AlbumGrid> : <Message>No curated playlists available.</Message>}
              </section>
              <section>
                <SectionHeader><SectionTitleStyled><Users /> Popular Artists</SectionTitleStyled><ViewAllLink href="/discover/artist"><ChevronRight size={20} /></ViewAllLink></SectionHeader>
                {popularArtists && popularArtists.length > 0 ? <ArtistGrid>{popularArtists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}</ArtistGrid> : <Message>No popular artists available.</Message>}
              </section>
              <section>
                <SectionHeader><SectionTitleStyled><Disc3 /> Top Albums</SectionTitleStyled><ViewAllLink href="/discover/album"><ChevronRight size={20} /></ViewAllLink></SectionHeader>
                {topAlbums && topAlbums.length > 0 ? <AlbumGrid>{topAlbums.map(album => <AlbumCard key={album.id} album={album} />)}</AlbumGrid> : <Message>No top albums available.</Message>}
              </section>
            </ContentContainer>
          </>
        )}
      </PageWrapper>
    </>
  );
};

export default DiscoverPage;
