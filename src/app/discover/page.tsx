"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, ChevronRight, X as XIcon } from 'lucide-react';
import Link from 'next/link';
import { SongRow, TrackForQueue } from '../../components/SongRow';
import { useAuth } from '../../context/AuthContext';
import { PlaylistCard, PublicPlaylist } from '../../components/PlaylistCard';

// --- Helper function to assign colors to genres ---
const genreColors = [
  '#6495ED', '#9370DB', '#3CB371', '#FFA07A', '#6A5ACD', '#FF6347', '#4682B4',
  '#DA70D6', '#FFD700', '#87CEFA', '#7B68EE', '#B0C4DE', '#FF8C00', '#008080',
  '#BDB76B', '#F08080'
];

const generateColor = (genreName: string) => {
  let hash = 0;
  for (let i = 0; i < genreName.length; i++) {
    hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return genreColors[Math.abs(hash) % genreColors.length];
};

// --- Styled Components ---
const Section = styled.section`
  padding-top: 4rem; padding-bottom: 4rem; position: relative;
`;
const Container = styled.div`
  width: 100%; margin-left: auto; margin-right: auto; padding-left: 1.5rem; padding-right: 1.5rem; @media (min-width: 1024px) { max-width: 1024px; }
`;
const SectionTitle = styled.h2`
  font-size: 2.25rem; font-weight: 700; color: ${({ theme }) => theme.text}; text-align: center; margin-bottom: 1rem; @media (min-width: 640px) { font-size: 3rem; }
`;
const SectionSubtitle = styled.p`
  margin-top: 1rem; color: ${({ theme }) => theme.subtleText}; text-align: center; max-width: 48rem; margin-left: auto; margin-right: auto;
`;
const SearchBarContainer = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 9999px; padding: 0.75rem 1.5rem; margin: 2rem auto; max-width: 600px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.3s ease;
  position: relative;
  &:focus-within {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.accentColor};
  }
`;
const SearchInput = styled.input`
  flex-grow: 1; border: none; background: transparent; outline: none; font-size: 1.1rem; color: ${({ theme }) => theme.text}; &::placeholder { color: ${({ theme }) => theme.subtleText}; }
`;
const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.subtleText}; min-width: 20px; min-height: 20px;
`;
const ClearSearchButton = styled.button`
  background: none; border: none; color: ${({ theme }) => theme.subtleText}; cursor: pointer; padding: 0.25rem; display: flex; align-items: center; justify-content: center;
  &:hover { color: ${({ theme }) => theme.text}; }
`;
const MusicItemRowContainer = styled.div`
  display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-radius: 8px; border-bottom: 1px solid ${({ theme }) => theme.borderColor}; cursor: pointer; transition: background-color 0.2s ease; text-decoration: none; color: inherit;
  &:hover { background-color: ${({ theme }) => theme.buttonHoverBg}; }
`;
const MusicRowArtwork = styled.img`
  width: 50px; height: 50px; border-radius: 0.5rem; object-fit: cover; flex-shrink: 0;
`;
const MusicRowTextContent = styled.div`
  flex-grow: 1; display: flex; flex-direction: column; overflow: hidden;
`;
const MusicRowTitle = styled.h4`
  font-size: 1rem; font-weight: 600; color: ${({ theme }) => theme.text}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const MusicRowSubtitle = styled.p`
  font-size: 0.875rem; color: ${({ theme }) => theme.subtleText}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const YouTubeMusicGenreCardContainer = styled(Link)<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  border-radius: 0.75rem;
  display: flex; align-items: center; justify-content: center; text-align: center;
  font-weight: bold; color: white; font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 1rem; min-width: 120px; min-height: 80px; flex-shrink: 0;
  text-decoration: none; margin-top: 5px;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;
const HorizontalScrollContainer = styled.div`
  display: flex; flex-direction: row; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; gap: 1.5rem; scroll-snap-type: x mandatory; scrollbar-width: none; &::-webkit-scrollbar { display: none; } padding-left: 1.5rem; padding-right: 1.5rem; margin-left: -1.5rem; margin-right: -1.5rem;
`;
const VerticalChunk = styled.div`
  display: flex; flex-direction: column; gap: 0.25rem; flex-shrink: 0; width: 280px; scroll-snap-align: start; @media (max-width: 768px) { width: 250px; }
`;
const Message = styled.p`
  text-align: center; color: ${({ theme }) => theme.subtleText}; margin-top: 2rem; padding: 2rem; background-color: ${({ theme }) => theme.cardBg}; border: 1px solid ${({ theme }) => theme.borderColor}; border-radius: 8px;
`;
const SectionHeaderWithLink = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 4rem; margin-bottom: 1.5rem; padding: 0 1.5rem;
  margin-left: -1.5rem; margin-right: -1.5rem;
  h3 { font-size: 1.75rem; font-weight: 600; color: ${({ theme }) => theme.text}; margin: 0; }
  a {
    display: flex; align-items: center; gap: 0.25rem; font-size: 1rem;
    color: ${({ theme }) => theme.accentColor}; text-decoration: none; font-weight: 500; transition: color 0.2s;
    &:hover { color: ${({ theme }) => theme.text}; }
    svg { transition: transform 0.2s; }
    &:hover svg { transform: translateX(3px); }
  }
`;
const SearchResultsContainer = styled.div`
  margin-top: 2rem; display: flex; flex-direction: column; gap: 2rem;
`;
const SearchResultCategory = styled.div``;
const SearchResultTitle = styled.h3`
  font-size: 1.5rem; font-weight: 600; color: ${({ theme }) => theme.text}; margin-bottom: 1rem;
`;

// --- Interfaces ---
interface MusicItem { id: string; title?: string; name?: string; artist?: string; artwork?: string; songs?: number; creatorName?: string; }
interface GenreItem { id: number; name: string; color: string; }
interface SearchResults {
  tracks: TrackForQueue[];
  albums: MusicItem[];
  artists: MusicItem[];
  playlists: PublicPlaylist[];
}
// Corrected: Use a 'type' alias instead of an empty interface
type TrackFromApi = Omit<TrackForQueue, 'licensing'>;


// --- Helper Components ---
const MusicItemRow: React.FC<{ item: MusicItem; type: 'album' | 'artist' | 'playlist' }> = ({ item, type }) => {
    const href = type === 'album' ? `/discover/album/${item.id}` :
                 type === 'artist' ? `/discover/artist/${item.id}` :
                 `/library/playlist/${item.id}`;

    const titleToDisplay = item.name || item.title || 'Unknown Title';
    const subtitleToDisplay = type === 'artist' ? `${item.songs || 0} Songs` :
                              type === 'playlist' ? item.creatorName || 'Playlist' :
                              item.artist || 'Unknown Artist';

    return (
        <Link href={href} passHref>
            <MusicItemRowContainer>
                <MusicRowArtwork src={item.artwork || `https://placehold.co/50x50/383434/F9FAFB?text=${titleToDisplay.substring(0,1)}`} alt={titleToDisplay} />
                <MusicRowTextContent>
                    <MusicRowTitle>{titleToDisplay}</MusicRowTitle>
                    <MusicRowSubtitle>{subtitleToDisplay}</MusicRowSubtitle>
                </MusicRowTextContent>
            </MusicItemRowContainer>
        </Link>
    );
};
const YouTubeMusicGenreCard: React.FC<{ genre: GenreItem }> = ({ genre }) => {
    return ( <YouTubeMusicGenreCardContainer href={`/discover/genre/${genre.id}`} $color={genre.color}>{genre.name}</YouTubeMusicGenreCardContainer> );
};
function chunked<T>(array: T[], size: number): T[][] { if (!Array.isArray(array)) return []; const chunkedArray: T[][] = []; for (let i = 0; i < array.length; i += size) { chunkedArray.push(array.slice(i, i + size)); } return chunkedArray; }
const safeFetch = async (url: string, endpointName: string, options?: RequestInit) => { 
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${endpointName} API error: ${response.status}`); 
  try { return await response.json(); } catch (e) { console.error(`Failed to parse JSON from ${endpointName}:`, e); throw new Error(`Could not parse data from ${endpointName}.`); } 
};

// --- Page Component ---
const DiscoverPage: NextPage = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [topGenres, setTopGenres] = useState<GenreItem[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<TrackForQueue[]>([]);
  const [popularArtists, setPopularArtists] = useState<MusicItem[]>([]);
  const [topAlbums, setTopAlbums] = useState<MusicItem[]>([]);
  const [publicPlaylists, setPublicPlaylists] = useState<PublicPlaylist[]>([]);
  const [curatedPlaylists, setCuratedPlaylists] = useState<PublicPlaylist[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('loading');
      try {
        const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
        const [albums, artists, tracks, genres, publicPl, curatedPl] = await Promise.all([
          safeFetch(`${API_BASE_URL}/albums/top`, 'Top Albums'),
          safeFetch(`${API_BASE_URL}/artists/popular`, 'Popular Artists'),
          safeFetch(`${API_BASE_URL}/tracks/trending`, 'Trending Tracks'),
          safeFetch(`${API_BASE_URL}/genres`, 'Genres'),
          safeFetch(`${API_BASE_URL}/playlists/public`, 'Public Playlists'),
          safeFetch(`${API_BASE_URL}/playlists/curated`, 'Curated Playlists')
        ]);
        setTopAlbums(albums);
        setPopularArtists(artists);
        const formattedTracks = tracks.map((track: TrackFromApi) => ({ ...track, licensing: 'proprietary' as const }));
        setTrendingSongs(formattedTracks);
        const formattedGenres = genres.map((genre: { id: number; name: string }) => ({ ...genre, color: generateColor(genre.name) }));
        setTopGenres(formattedGenres);
        setPublicPlaylists(publicPl);
        setCuratedPlaylists(curatedPl);
        
        if (user) {
          const idToken = await user.getIdToken();
          const likedTracks: TrackForQueue[] = await safeFetch(
            `${API_BASE_URL}/me/likes/tracks`, 
            'Liked Tracks', 
            { headers: { 'Authorization': `Bearer ${idToken}` } }
          );
          setLikedTrackIds(new Set(likedTracks.map(track => track.id)));
        } else {
            setLikedTrackIds(new Set());
        }

        setStatus('success');
      } catch (error: unknown) {
        if (error instanceof Error) {
            setErrorMessage(error.message || 'An unknown error occurred.');
        } else {
            setErrorMessage('An unknown error occurred.');
        }
        setStatus('error');
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
        const data = await safeFetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`, 'Search');
        setSearchResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults({ tracks: [], albums: [], artists: [], playlists: [] });
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };
  
  const renderSearchResults = () => {
    if (isSearching) return <Message>Searching...</Message>;
    if (!searchResults) return null;
    const { tracks, albums, artists, playlists } = searchResults;
    const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0 || playlists.length > 0;

    if (!hasResults) return <Message>No results found for &quot;{searchQuery}&quot;.</Message>;

    return (
      <SearchResultsContainer>
        {playlists.length > 0 && (
          <SearchResultCategory>
            <SearchResultTitle>Playlists</SearchResultTitle>
            {playlists.map(item => <MusicItemRow key={item.id} item={item as MusicItem} type="playlist" />)}
          </SearchResultCategory>
        )}
        {tracks.length > 0 && (
          <SearchResultCategory>
            <SearchResultTitle>Tracks</SearchResultTitle>
            {tracks.map(item => <SongRow key={item.id} track={item} queue={tracks} isInitiallyLiked={likedTrackIds.has(item.id)} />)}
          </SearchResultCategory>
        )}
        {albums.length > 0 && (
          <SearchResultCategory>
            <SearchResultTitle>Albums</SearchResultTitle>
            {albums.map(item => <MusicItemRow key={item.id} item={item} type="album" />)}
          </SearchResultCategory>
        )}
        {artists.length > 0 && (
          <SearchResultCategory>
            <SearchResultTitle>Artists</SearchResultTitle>
            {artists.map(item => <MusicItemRow key={item.id} item={item} type="artist" />)}
          </SearchResultCategory>
        )}
      </SearchResultsContainer>
    );
  };

  const renderDefaultContent = () => {
    if (status === 'loading') return <Message>Loading music...</Message>;
    if (status === 'error') return <Message>Could not load music data. {errorMessage}</Message>;
    return (
      <>

       <SectionHeaderWithLink>
          <h3>Top Genres</h3>
          <Link href="/discover/genre">View All <ChevronRight size={20} /></Link>
        </SectionHeaderWithLink>
        {topGenres.length > 0 ? (
          <HorizontalScrollContainer>
            {topGenres.map(genre => <YouTubeMusicGenreCard key={genre.id} genre={genre} />)}
          </HorizontalScrollContainer>
        ) : <Message>No genres available yet.</Message>}

        {curatedPlaylists.length > 0 && (
            <>
                <SectionHeaderWithLink>
                    <h3>Featured Playlists</h3>
                    <Link href="/discover/playlists">
                      View All <ChevronRight size={20} />
                    </Link>
                </SectionHeaderWithLink>
                <HorizontalScrollContainer>
                    {curatedPlaylists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} isDiscovery={true} />)}
                </HorizontalScrollContainer>
            </>
        )}

        <SectionHeaderWithLink>
          <h3>Public Playlists</h3>
          <Link href="/discover/public-playlists"> 
            View All <ChevronRight size={20} />
          </Link>
        </SectionHeaderWithLink>
        {publicPlaylists.length > 0 ? (
          <HorizontalScrollContainer>
            {publicPlaylists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} isDiscovery={true} />)}
          </HorizontalScrollContainer>
        ) : <Message>No public playlists available yet.</Message>}

        <SectionHeaderWithLink>
          <h3>Trending Tracks</h3>
          <Link href="/discover/track">View All <ChevronRight size={20} /></Link>
        </SectionHeaderWithLink>
        <HorizontalScrollContainer>
          {chunked(trendingSongs, 3).map((chunk, i) => (
            <VerticalChunk key={`track-chunk-${i}`}>
              {chunk.map(item => (
                  <SongRow key={item.id} track={item} queue={trendingSongs} isInitiallyLiked={likedTrackIds.has(item.id)} />
              ))}
            </VerticalChunk>
          ))}
        </HorizontalScrollContainer>

        <SectionHeaderWithLink>
          <h3>Popular Artists</h3>
          <Link href="/discover/artist">View All <ChevronRight size={20} /></Link>
        </SectionHeaderWithLink>
        <HorizontalScrollContainer>
          {chunked(popularArtists, 3).map((chunk, i) => (
            <VerticalChunk key={`artist-chunk-${i}`}>
              {chunk.map(item => (
                  <MusicItemRow key={item.id} item={item} type="artist"/>
              ))}
            </VerticalChunk>
          ))}
        </HorizontalScrollContainer>

        <SectionHeaderWithLink>
          <h3>Top Albums</h3>
          <Link href="/discover/album">View All <ChevronRight size={20} /></Link>
        </SectionHeaderWithLink>
        <HorizontalScrollContainer>
          {chunked(topAlbums, 3).map((chunk, i) => (
            <VerticalChunk key={`album-chunk-${i}`}>
              {chunk.map(item => (
                  <MusicItemRow key={item.id} item={item} type="album"/>
              ))}
            </VerticalChunk>
          ))}
        </HorizontalScrollContainer>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Discover Music - Waveform</title>
        <meta name="description" content="Discover unique and independent music on Waveform." />
      </Head>
      <Container>
        <Section>
          <SectionTitle>Discover Music</SectionTitle>
          <SectionSubtitle>Explore a world of independent sound. Find your next favorite track.</SectionSubtitle>
          <SearchBarContainer>
            <SearchIcon />
            <SearchInput 
              type="text" 
              placeholder="Search songs, artists, albums, or playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <ClearSearchButton onClick={handleClearSearch}>
                <XIcon size={20} />
              </ClearSearchButton>
            )}
          </SearchBarContainer>
          
          {searchResults ? renderSearchResults() : renderDefaultContent()}
          
        </Section>
      </Container>
    </>
  );
};

export default DiscoverPage;
