"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { Search, Play, Heart, Download, MoreHorizontal, Music, User, Hash, Sparkles, Cloud } from 'lucide-react'; // All icons imported
// Import mock data
import { mockTopGenres, mockTrendingSongs, mockPopularArtists, mockTopAlbums, mockFeaturedSongs } from './mockData';

// --- Reused & Adapted Styled Components from Homepage for Consistency ---
const Section = styled.section`
  padding-top: 4rem; /* Slightly less padding than homepage sections */
  padding-bottom: 4rem;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 1rem;
  @media (min-width: 640px) {
    font-size: 3rem;
  }
`;

const SectionSubtitle = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
`;

// --- New Styled Components for Music Discovery UI ---

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 9999px; /* Pill shape */
  padding: 0.75rem 1.5rem;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').replace(', transparent)', '').split(', ')[0]}; /* Use start color of gradient */
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  &::placeholder {
    color: ${({ theme }) => theme.subtleText};
  }
`;

const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.subtleText};
  min-width: 20px;
  min-height: 20px;
`;

const FilterTabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  background-color: ${({ theme, $isActive }) => $isActive ? theme.accentGradient.split(', ')[0] : theme.buttonBg};
  color: ${({ theme, $isActive }) => $isActive ? 'white' : theme.text};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $isActive }) => $isActive ? theme.accentGradient.split(', ')[1] : theme.buttonHoverBg};
  }
`;

// This MusicGrid is now for the individual cards within a vertical chunk
const MusicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Responsive grid */
  gap: 1.5rem;
  margin-top: 3rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const MusicCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const MusicArtwork = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  object-fit: cover;
`;

const MusicTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%; /* Ensure ellipsis works */
`;

const MusicSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.subtleText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.subtleText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const CategoryCard = styled(MusicCard)`
  padding: 1rem;
  min-height: 100px;
  justify-content: center;
  ${MusicArtwork} {
    display: none; /* No artwork for simple category cards */
  }
`;

const CategoryTitle = styled(MusicTitle)`
  font-size: 1.1rem;
`;

// --- Helper Component: FeatureIconWrapper (defined at top level for scope) ---
const FeatureIconWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: ${({ theme }) => theme.accentGradient};
  color: white;
  margin-left: auto; /* Center the icon wrapper */
  margin-right: auto; /* Center the icon wrapper */
`;

// --- Helper Component: MusicItemRow (for list views, mimicking SwiftUI's row look) ---
const MusicItemRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const MusicRowArtwork = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
`;

const MusicRowTextContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MusicRowTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MusicRowSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.subtleText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MusicRowActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

// --- Helper Component: MusicItemRowSkeleton (mimicking SwiftUI's skeleton view) ---
const MusicItemRowSkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const SkeletonArtwork = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.subtleText.replace(')', ', 0.3)')}; /* Use theme color with opacity */
  flex-shrink: 0;
`;

const SkeletonTextLine = styled.div`
  height: 16px;
  background-color: ${({ theme }) => theme.subtleText.replace(')', ', 0.3)')};
  border-radius: 4px;
  margin-bottom: 4px;
`;

const SkeletonTextContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SkeletonAction = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.subtleText.replace(')', ', 0.2)')};
  flex-shrink: 0;
`;

// --- Helper Component: YouTubeMusicGenreCard (mimicking SwiftUI's genre card) ---
const YouTubeMusicGenreCardContainer = styled.div<{ $color: string }>`
  /* Removed fixed width and height */
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
  transition: transform 0.2s ease;
  padding: 1rem; /* Added padding to fit content */
  min-width: 120px; /* Ensure minimum size */
  min-height: 80px; /* Ensure minimum size */
  flex-shrink: 0; /* Prevent cards from shrinking in horizontal scroll */

  &:hover {
    transform: translateY(-5px);
  }
`;

interface MusicItem {
    id: string;
    title: string;
    artist?: string; // Optional for artists
    artwork?: string;
    songs?: number; // For artist count
}

interface GenreItem {
    id: string;
    title: string;
    color: string;
}

// --- Helper Component: MusicItemRow (React version) ---
const MusicItemRow: React.FC<{ item: MusicItem; onPlay?: () => void; onNavigate?: () => void }> = ({ item, onPlay, onNavigate }) => {
    return (
        <MusicItemRowContainer onClick={onNavigate || onPlay}>
            <MusicRowArtwork src={item.artwork || `https://placehold.co/50x50/383434/F9FAFB?text=${item.title.substring(0,1)}`} alt={item.title} />
            <MusicRowTextContent>
                <MusicRowTitle>{item.title}</MusicRowTitle>
                <MusicRowSubtitle>{item.artist || (item.songs !== undefined ? `${item.songs} Songs` : '')}</MusicRowSubtitle>
            </MusicRowTextContent>
            <MusicRowActions>
                {onPlay && <ActionButton onClick={(e) => { e.stopPropagation(); onPlay(); }}><Play size={18} /></ActionButton>}
                <ActionButton><Heart size={18} /></ActionButton>
                <ActionButton><MoreHorizontal size={18} /></ActionButton>
            </MusicRowActions>
        </MusicItemRowContainer>
    );
};

// --- Helper Component: MusicItemRowSkeleton (React version) ---
const MusicItemRowSkeleton: React.FC = () => {
    return (
        <MusicItemRowSkeletonContainer>
            <SkeletonArtwork />
            <SkeletonTextContent>
                <SkeletonTextLine style={{ width: '80%' }} />
                <SkeletonTextLine style={{ width: '60%' }} />
            </SkeletonTextContent>
            <SkeletonAction />
            <SkeletonAction />
            <SkeletonAction />
        </MusicItemRowSkeletonContainer>
    );
};

// --- Helper Component: YouTubeMusicGenreCard (React version) ---
const YouTubeMusicGenreCard: React.FC<{ genre: GenreItem; onNavigate?: () => void }> = ({ genre, onNavigate }) => {
    return (
        <YouTubeMusicGenreCardContainer $color={genre.color} onClick={onNavigate}>
            {genre.title}
        </YouTubeMusicGenreCardContainer>
    );
};

// --- New Styled Component: HorizontalScrollContainer ---
const HorizontalScrollContainer = styled.div`
  display: flex;
  overflow-x: auto; /* Enable horizontal scrolling */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  padding-bottom: 1rem; /* Space for scrollbar */
  gap: 1.5rem; /* Gap between vertical chunks or individual cards */
  scroll-snap-type: x mandatory; /* Optional: snap to chunks */

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Webkit (Chrome, Safari) */
  }

  /* Add padding to the horizontal scroll container itself, not individual chunks */
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-left: -1.5rem; /* Compensate for Container's padding */
  margin-right: -1.5rem; /* Compensate for Container's padding */


  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.subtleText.replace(')', ', 0.5)')};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.borderColor};
    border-radius: 10px;
  }
`;

// --- New Styled Component: VerticalChunk ---
const VerticalChunk = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* Gap between songs/artists/albums in a vertical chunk */
  flex-shrink: 0; /* Prevent items from shrinking */
  width: 280px; /* Fixed width for each vertical chunk */
  scroll-snap-align: start; /* Optional: snap to start of chunk */
  
  @media (max-width: 768px) {
    width: 250px; /* Slightly smaller chunks on mobile */
  }
`;

// --- Utility function to chunk an array ---
function chunked<T>(array: T[], size: number): T[][] {
  const chunkedArray: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
}


// --- Main Discover Page Component ---
const DiscoverPage: NextPage = () => {
  // Access theme object
  const theme = useTheme();

  // --- State Management (Simulating ViewModel) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All', 'Songs', 'Artists', 'Albums', 'Playlists'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulated data for home screen sections
  const [topGenres, setTopGenres] = useState<GenreItem[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<MusicItem[]>([]);
  const [popularArtists, setPopularArtists] = useState<MusicItem[]>([]);
  const [topAlbums, setTopAlbums] = useState<MusicItem[]>([]); // Added topAlbums

  // Simulated search results
  const [searchResults, setSearchResults] = useState<MusicItem[]>([]);
  const [mainArtist, setMainArtist] = useState<MusicItem | null>(null); // For main artist in search

  // Simulate initial data loading (like youtubeMusicViewModel.loadInitialData)
  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setTopGenres(mockTopGenres); // Use mock data
      setTrendingSongs(mockTrendingSongs); // Use mock data
      setPopularArtists(mockPopularArtists); // Use mock data
      setTopAlbums(mockTopAlbums); // Use mock data
      setIsLoading(false);
    }, 1500); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  // Simulate search functionality
  useEffect(() => {
    if (searchQuery.length > 2) { // Only search if query is long enough
      setIsLoading(true);
      setErrorMessage(null);
      const timer = setTimeout(() => {
        const queryLower = searchQuery.toLowerCase();
        const allMockItems = [
          ...mockTrendingSongs,
          ...mockPopularArtists,
          ...mockTopAlbums,
          ...mockFeaturedSongs // Include featured songs in search pool if applicable
        ];

        const filteredResults = allMockItems.filter(item =>
          item.title.toLowerCase().includes(queryLower) ||
          (item.artist && item.artist.toLowerCase().includes(queryLower))
        );

        // Simulate a "main artist" if search matches an artist directly
        const matchedArtist = mockPopularArtists.find(artist => artist.title.toLowerCase() === queryLower);
        setMainArtist(matchedArtist || null);

        setSearchResults(filteredResults);
        setIsLoading(false);
        if (filteredResults.length === 0 && !matchedArtist) {
          setErrorMessage("No results found for your search.");
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setMainArtist(null);
      setErrorMessage(null);
    }
  }, [searchQuery, selectedFilter]); // Re-run search when query or filter changes

  const handlePlaySong = (song: MusicItem) => {
    console.log(`Playing song: ${song.title} by ${song.artist}`);
    // In a real app, this would trigger audio player logic
  };

  const handleNavigateToDetail = (item: MusicItem | GenreItem) => {
    console.log(`Navigating to detail for: ${item.title}`);
    // In a real app, this would trigger Next.js router.push('/details-page/${item.id}')
  };


  return (
    <>
      <Head>
        <title>Discover Music - Waveform.ink</title>
        <meta name="description" content="Discover unique and independent music on Waveform.ink. Explore our curated library of Creative Commons and proprietary tracks." />
      </Head>
      <Container>
        <Section>
          <SectionTitle>Discover Music</SectionTitle>
          <SectionSubtitle>
            Explore a world of independent sound. Find your next favorite track.
          </SectionSubtitle>

          <SearchBarContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search songs, artists, albums, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBarContainer>

          {searchQuery.length > 0 && ( // Show filter bar only when searching
            <FilterTabBar>
              {['All', 'Songs', 'Artists', 'Albums', 'Playlists'].map(filter => (
                <FilterButton
                  key={filter}
                  $isActive={selectedFilter === filter}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </FilterButton>
              ))}
            </FilterTabBar>
          )}

          {isLoading ? (
            // Skeleton view for search results or initial load
            <div style={{ padding: '0 1.5rem' }}>
              {Array.from({ length: 10 }).map((_, index) => (
                <MusicItemRowSkeleton key={index} />
              ))}
            </div>
          ) : errorMessage ? (
            <div style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>
              <p>{errorMessage}</p>
            </div>
          ) : searchQuery.length > 0 ? (
            // Display actual search results
            <div style={{ padding: '0 1.5rem' }}>
              {mainArtist && (
                <MusicItemRow
                  item={{ id: mainArtist.id, title: mainArtist.title, artist: 'Main Artist', artwork: mainArtist.artwork }}
                  onNavigate={() => handleNavigateToDetail(mainArtist)}
                  onPlay={() => handlePlaySong(mainArtist)}
                />
              )}
              {searchResults.length > 0 ? (
                searchResults.map(item => (
                  <MusicItemRow
                    key={item.id}
                    item={item}
                    onNavigate={() => handleNavigateToDetail(item)}
                    onPlay={() => handlePlaySong(item)}
                  />
                ))
              ) : (
                // Corrected inline style syntax for theme access
                <div style={{ textAlign: 'center', color: theme.subtleText, padding: '2rem' }}>
                  <p>No results found for "{searchQuery}". Try a different search term.</p>
                </div>
              )}
            </div>
          ) : (
            // Home screen content
            <>
              {topGenres.length > 0 && (
                <SectionTitle style={{ textAlign: 'left', marginTop: '4rem', marginBottom: '2rem' }}>Top Genres</SectionTitle>
              )}
              {/* Horizontal Scroll for Top Genres */}
              <HorizontalScrollContainer>
                {topGenres.map(genre => (
                  <YouTubeMusicGenreCard
                    key={genre.id}
                    genre={genre}
                    onNavigate={() => handleNavigateToDetail(genre)}
                  />
                ))}
              </HorizontalScrollContainer>

              {trendingSongs.length > 0 && (
                <SectionTitle style={{ textAlign: 'left', marginTop: '4rem', marginBottom: '2rem' }}>Trending Tracks</SectionTitle>
              )}
              {/* Horizontal Scroll for Trending Songs */}
              <HorizontalScrollContainer>
                {chunked(trendingSongs, 3).map((songChunk, index) => (
                  <VerticalChunk key={index}>
                    {songChunk.map(song => (
                      <MusicItemRow
                        key={song.id}
                        item={song}
                        onNavigate={() => handleNavigateToDetail(song)}
                        onPlay={() => handlePlaySong(song)}
                      />
                    ))}
                  </VerticalChunk>
                ))}
              </HorizontalScrollContainer>

              {popularArtists.length > 0 && (
                <SectionTitle style={{ textAlign: 'left', marginTop: '4rem', marginBottom: '2rem' }}>Popular Artists</SectionTitle>
              )}
              {/* Horizontal Scroll for Popular Artists */}
              <HorizontalScrollContainer>
                {chunked(popularArtists, 3).map((artistChunk, index) => (
                  <VerticalChunk key={index}>
                    {artistChunk.map(artist => (
                      <MusicItemRow
                        key={artist.id}
                        item={artist}
                        onNavigate={() => handleNavigateToDetail(artist)}
                        onPlay={() => handlePlaySong(artist)}
                      />
                    ))}
                  </VerticalChunk>
                ))}
              </HorizontalScrollContainer>

              {topAlbums.length > 0 && (
                <SectionTitle style={{ textAlign: 'left', marginTop: '4rem', marginBottom: '2rem' }}>Top Albums</SectionTitle>
              )}
              {/* Horizontal Scroll for Top Albums */}
              <HorizontalScrollContainer>
                {chunked(topAlbums, 3).map((albumChunk, index) => (
                  <VerticalChunk key={index}>
                    {albumChunk.map(album => (
                      <MusicItemRow
                        key={album.id}
                        item={album}
                        onNavigate={() => handleNavigateToDetail(album)}
                        onPlay={() => handlePlaySong(album)}
                      />
                    ))}
                  </VerticalChunk>
                ))}
              </HorizontalScrollContainer>
            </>
          )}
        </Section>
      </Container>
    </>
  );
};

export default DiscoverPage;
