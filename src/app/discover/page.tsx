// src/app/discover/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ChevronRight, X, Music, PlayCircle, Heart, Play, Pause, Users, Disc3, ListMusic, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { usePlayer } from '../../context/PlayerContext';
import { TrackForQueue } from '../../components/SongRow';

// Type definitions
interface Genre {
  id: number;
  name: string;
  color: string;
}

interface Artist {
  id: string;
  name: string;
  artwork: string;
  followers: number;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  year: number;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  artwork: string;
  tracks: number;
  creatorName: string;
}

interface SearchResults {
  tracks: TrackForQueue[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

type TrackFromApi = Omit<TrackForQueue, 'licensing'>;


const DiscoverPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [likedTracks, setLikedTracks] = useState(new Set<string>());
  
  const [topGenres, setTopGenres] = useState<Genre[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<TrackForQueue[]>([]);
  const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [curatedPlaylists, setCuratedPlaylists] = useState<Playlist[]>([]);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();

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
        
      } catch (error) {
        console.error("Error fetching discover data:", error);
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

  const toggleLike = useCallback((trackId: string) => {
    setLikedTracks(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(trackId)) newLiked.delete(trackId);
      else newLiked.add(trackId);
      return newLiked;
    });
  }, []);

  const handlePlayPause = useCallback((track: TrackForQueue) => {
    if (currentTrack?.id === track.id) {
        togglePlayPause();
    } else {
        const queue = searchResults?.tracks.length ? searchResults.tracks : trendingSongs || [];
        playTrack(track, queue);
    }
  }, [currentTrack, playTrack, searchResults, trendingSongs, togglePlayPause]);

  const clearSearch = useCallback(() => handleSearch(''), [handleSearch]);

  const GenreCard = React.memo<{ genre: Genre }>(({ genre }) => (
    <Link href={`/discover/genre/${genre.id}`} passHref>
        <div className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ backgroundColor: genre.color, minHeight: '120px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
            <div className="relative p-6 h-full flex items-center justify-center">
                <h3 className="text-white font-bold text-lg text-center group-hover:scale-110 transition-transform duration-300">{genre.name}</h3>
            </div>
        </div>
    </Link>
  ));
  GenreCard.displayName = 'GenreCard';

  const TrackRow = React.memo<{ track: TrackForQueue }>(({ track }) => (
    <div className="group flex items-center gap-4 p-4 rounded-lg hover:bg-gray-900/50 transition-all duration-200">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <img src={track.artwork} alt={track.title} className="w-12 h-12 rounded-lg object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/6366f1/ffffff?text=${track.title[0]}` }} />
          <button onClick={() => handlePlayPause(track)} className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200" aria-label={isPlaying && currentTrack?.id === track.id ? 'Pause' : 'Play'}>
            {isPlaying && currentTrack?.id === track.id ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white ml-0.5" />}
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{track.title}</h4>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => toggleLike(track.id)} className={`p-2 rounded-full transition-all duration-200 ${likedTracks.has(track.id) ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'}`} aria-label={likedTracks.has(track.id) ? 'Unlike' : 'Like'}>
          <Heart size={18} fill={likedTracks.has(track.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  ));
  TrackRow.displayName = 'TrackRow';

  const ArtistCard = React.memo<{ artist: Artist }>(({ artist }) => (
    <Link href={`/discover/artist/${artist.id}`} passHref>
        <div className="group text-center cursor-pointer transition-all duration-300 hover:scale-105">
        <div className="relative mb-4">
            <img src={artist.artwork} alt={artist.name} className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-gray-800 group-hover:border-purple-500 transition-all duration-300" loading="lazy" onError={(e) => { e.currentTarget.src = `https://placehold.co/160x160/1F2937/FFFFFF?text=${artist.name[0]}` }} />
        </div>
        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-200">{artist.name}</h3>
        </div>
    </Link>
  ));
  ArtistCard.displayName = 'ArtistCard';

  const AlbumCard = React.memo<{ album: Album }>(({ album }) => (
    <Link href={`/discover/album/${album.id}`} passHref>
        <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
        <div className="relative mb-4">
            <img src={album.artwork} alt={album.title} className="w-full aspect-square rounded-xl object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = `https://placehold.co/250x250/1F2937/FFFFFF?text=${album.title[0]}` }} />
        </div>
        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-200 truncate">{album.title}</h3>
        <p className="text-gray-400 text-sm truncate">{album.artist}</p>
        </div>
    </Link>
  ));
  AlbumCard.displayName = 'AlbumCard';

  const PlaylistCard = React.memo<{ playlist: Playlist }>(({ playlist }) => (
    <Link href={`/discover/playlist/${playlist.id}`} passHref>
        <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
        <div className="relative mb-4">
            <img src={playlist.artwork} alt={playlist.name} className="w-full aspect-square rounded-xl object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = `https://placehold.co/280x280/1F2937/FFFFFF?text=${playlist.name[0]}` }} />
        </div>
        <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors duration-200 truncate">{playlist.name}</h3>
        <p className="text-gray-400 text-sm truncate">{playlist.creatorName}</p>
        </div>
    </Link>
  ));
  PlaylistCard.displayName = 'PlaylistCard';

  const featuredPlaylist = curatedPlaylists?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-full px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Discover Music
              </h1>
              <p className="text-gray-400 text-lg mt-1">Explore a world of independent sound</p>
            </div>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-gray-800/50 rounded-full border border-gray-700 focus-within:border-purple-500 transition-all duration-200">
              <Search className="ml-6 text-gray-400" size={20} />
              <input type="text" placeholder="Search songs, artists, albums, or playlists..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="flex-1 bg-transparent px-4 py-4 text-lg text-white placeholder-gray-400 focus:outline-none" />
              {searchQuery && (<button onClick={clearSearch} className="mr-4 p-2 text-gray-400 hover:text-white transition-colors duration-200"><X size={20} /></button>)}
            </div>
          </div>
        </div>
      </div>

      {searchQuery ? (
        <div className="px-8 py-8">
          {isSearching ? (
            <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div><p className="text-gray-400">Searching...</p></div>
          ) : searchResults ? (
            <div className="space-y-12">
              {searchResults.tracks.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6"><Music className="text-purple-500" size={24} /><h2 className="text-2xl font-bold">Tracks</h2></div>
                  <div className="grid gap-2">{searchResults.tracks.map((track) => (<TrackRow key={track.id} track={track} />))}</div>
                </section>
              )}
              {searchResults.artists.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6"><Users className="text-blue-500" size={24} /><h2 className="text-2xl font-bold">Artists</h2></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">{searchResults.artists.map(artist => (<ArtistCard key={artist.id} artist={artist} />))}</div>
                </section>
              )}
              {searchResults.albums.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6"><Disc3 className="text-green-500" size={24} /><h2 className="text-2xl font-bold">Albums</h2></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">{searchResults.albums.map(album => (<AlbumCard key={album.id} album={album} />))}</div>
                </section>
              )}
              {searchResults.playlists.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6"><ListMusic className="text-pink-500" size={24} /><h2 className="text-2xl font-bold">Playlists</h2></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">{searchResults.playlists.map(playlist => (<PlaylistCard key={playlist.id} playlist={playlist} />))}</div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-20"><Music className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-400 text-lg">No results found for &quot;{searchQuery}&quot;</p></div>
          )}
        </div>
      ) : (
        <>
          {featuredPlaylist && (
            <div className="relative h-[60vh] overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${featuredPlaylist.artwork})` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="relative h-full flex items-center px-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4"><Star size={16} />FEATURED PLAYLIST</div>
                  <h2 className="text-6xl font-bold mb-4">{featuredPlaylist.name}</h2>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">{featuredPlaylist.description}</p>
                  <div className="flex items-center gap-4">
                    <Link href={`/discover/playlist/${featuredPlaylist.id}`} passHref>
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-full flex items-center gap-3 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-2xl"><PlayCircle size={24} />Listen Now</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-12 space-y-16">
            <section>
              <div className="flex items-center justify-between mb-8"><h2 className="text-3xl font-bold">Top Genres</h2><Link href="/discover/genre" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">View All<ChevronRight size={20} /></Link></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">{topGenres.map(genre => (<GenreCard key={genre.id} genre={genre} />))}</div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-3"><TrendingUp className="text-red-500" size={28} /><h2 className="text-3xl font-bold">Trending Tracks</h2></div><Link href="/discover/track" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">View All<ChevronRight size={20} /></Link></div>
              <div className="bg-gray-900/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-800"><div className="space-y-2">{trendingSongs.map((track) => <TrackRow key={track.id} track={track} />)}</div></div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-3"><Users className="text-blue-500" size={28} /><h2 className="text-3xl font-bold">Popular Artists</h2></div><Link href="/discover/artist" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">View All<ChevronRight size={20} /></Link></div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">{popularArtists.map(artist => (<ArtistCard key={artist.id} artist={artist} />))}</div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-3"><Disc3 className="text-green-500" size={28} /><h2 className="text-3xl font-bold">Top Albums</h2></div><Link href="/discover/album" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">View All<ChevronRight size={20} /></Link></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">{topAlbums.map(album => (<AlbumCard key={album.id} album={album} />))}</div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-3"><ListMusic className="text-pink-500" size={28} /><h2 className="text-3xl font-bold">Curated Playlists</h2></div><Link href="/discover/public-playlists" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">View All<ChevronRight size={20} /></Link></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">{curatedPlaylists.map(playlist => (<PlaylistCard key={playlist.id} playlist={playlist} />))}</div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default DiscoverPage;
