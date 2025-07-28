// src/app/discover/mockData.ts

// Define interfaces for consistency
interface MusicItem {
    id: string;
    title: string;
    artist?: string;
    artwork?: string;
    songs?: number;
}

interface GenreItem {
    id: string;
    title: string;
    color: string;
}

// --- Mock Data for Discovery Page ---

export const mockTopGenres: GenreItem[] = [
    { id: 'g1', title: 'Electronic', color: '#FF6F61' },
    { id: 'g2', title: 'Acoustic', color: '#6B5B95' },
    { id: 'g3', title: 'Experimental', color: '#88B04B' },
    { id: 'g4', title: 'Folk', color: '#F7CAC9' },
    { id: 'g5', title: 'Instrumental', color: '#92A8CD' },
    { id: 'g6', title: 'Ambient', color: '#F08A5D' },
    { id: 'g7', title: 'Hip-Hop', color: '#B5EAD7' },
    { id: 'g8', title: 'Rock', color: '#C7D3D4' },
    { id: 'g9', title: 'Pop', color: '#FFD700' },
    { id: 'g10', title: 'Jazz', color: '#ADD8E6' },
    { id: 'g11', title: 'Classical', color: '#DDA0DD' },
    { id: 'g12', title: 'Metal', color: '#A9A9A9' },
    { id: 'g13', title: 'Blues', color: '#8B4513' },
    { id: 'g14', title: 'Country', color: '#DAA520' },
    { id: 'g15', title: 'Reggae', color: '#006400' },
    { id: 'g16', title: 'World', color: '#FF8C00' },
];

export const mockTrendingSongs: MusicItem[] = [
    { id: 'ts1', title: 'Echoes of Dawn', artist: 'Aurora Bloom', artwork: 'https://placehold.co/50x50/d45534/FFFFFF?text=E1' },
    { id: 'ts2', title: 'City Lights', artist: 'Urban Pulse', artwork: 'https://placehold.co/50x50/7a2e1a/FFFFFF?text=C2' },
    { id: 'ts3', title: 'Forest Whisper', artist: 'Mystic Grove', artwork: 'https://placehold.co/50x50/9CA3AF/1F2937?text=F3' },
    { id: 'ts4', title: 'Rhythmic Journey', artist: 'Beat Nomad', artwork: 'https://placehold.co/50x50/6B7280/F9FAFB?text=R4' },
    { id: 'ts5', title: 'Starlight Serenade', artist: 'Cosmic Harmonies', artwork: 'https://placehold.co/50x50/1F2937/F9FAFB?text=S5' },
    { id: 'ts6', title: 'Desert Mirage', artist: 'Sandy Tunes', artwork: 'https://placehold.co/50x50/d45534/FFFFFF?text=D6' },
    { id: 'ts7', title: 'Ocean Breeze', artist: 'Aqua Flow', artwork: 'https://placehold.co/50x50/2196F3/FFFFFF?text=O7' },
    { id: 'ts8', title: 'Mountain Peak', artist: 'Summit Sounds', artwork: 'https://placehold.co/50x50/4CAF50/FFFFFF?text=M8' },
    { id: 'ts9', title: 'Urban Echo', artist: 'City Beat', artwork: 'https://placehold.co/50x50/FFC107/1F2937?text=U9' },
    { id: 'ts10', title: 'Silent Night', artist: 'Dreamscape', artwork: 'https://placehold.co/50x50/8A2BE2/FFFFFF?text=S10' },
    { id: 'ts11', title: 'Crimson Tide', artist: 'Red Wave', artwork: 'https://placehold.co/50x50/DC143C/FFFFFF?text=C11' },
    { id: 'ts12', title: 'Golden Fields', artist: 'Sun Harvest', artwork: 'https://placehold.co/50x50/FFD700/1F2937?text=G12' },
    { id: 'ts13', title: 'Lunar Dance', artist: 'Night Bloom', artwork: 'https://placehold.co/50x50/4B0082/FFFFFF?text=L13' },
    { id: 'ts14', title: 'Electric Dreams', artist: 'Circuit Breaker', artwork: 'https://placehold.co/50x50/800000/FFFFFF?text=E14' },
    { id: 'ts15', title: 'Whispering Winds', artist: 'Nature Echo', artwork: 'https://placehold.co/50x50/008080/FFFFFF?text=W15' },
    { id: 'ts16', title: 'Cosmic Drift', artist: 'Star Voyager', artwork: 'https://placehold.co/50x50/8B0000/FFFFFF?text=C16' },
    { id: 'ts17', title: 'Rainy Days', artist: 'Cloudy Tunes', artwork: 'https://placehold.co/50x50/4682B4/FFFFFF?text=R17' },
    { id: 'ts18', title: 'Sunny Shores', artist: 'Beach Vibes', artwork: 'https://placehold.co/50x50/F4A460/1F2937?text=S18' },
    { id: 'ts19', title: 'Midnight Bloom', artist: 'Nocturne', artwork: 'https://placehold.co/50x50/36454F/FFFFFF?text=M19' },
    { id: 'ts20', title: 'Stellar Dust', artist: 'Galaxy Glide', artwork: 'https://placehold.co/50x50/708090/FFFFFF?text=S20' },
    { id: 'ts21', title: 'River Flow', artist: 'Water Spirit', artwork: 'https://placehold.co/50x50/6A5ACD/FFFFFF?text=R21' },
    { id: 'ts22', title: 'Desert Bloom', artist: 'Oasis Sounds', artwork: 'https://placehold.co/50x50/CD853F/FFFFFF?text=D22' },
    { id: 'ts23', title: 'Cloudburst', artist: 'Sky Echo', artwork: 'https://placehold.co/50x50/87CEEB/FFFFFF?text=C23' },
    { id: 'ts24', title: 'Firefly Dance', artist: 'Summer Night', artwork: 'https://placehold.co/50x50/FF4500/FFFFFF?text=F24' },
];

export const mockPopularArtists: MusicItem[] = [
    { id: 'pa1', title: 'Luna Echo', artwork: 'https://placehold.co/50x50/FF6F61/FFFFFF?text=LE', songs: 12 },
    { id: 'pa2', title: 'The Sound Weavers', artwork: 'https://placehold.co/50x50/6B5B95/FFFFFF?text=TSW', songs: 8 },
    { id: 'pa3', title: 'Silent Bloom', artwork: 'https://placehold.co/50x50/88B04B/FFFFFF?text=SB', songs: 15 },
    { id: 'pa4', title: 'Pixel Orchestra', artwork: 'https://placehold.co/50x50/F7CAC9/1F2937?text=PO', songs: 9 },
    { id: 'pa5', title: 'Rhythm Alchemist', artwork: 'https://placehold.co/50x50/92A8CD/FFFFFF?text=RA', songs: 10 },
    { id: 'pa6', title: 'Synth Sorcerer', artwork: 'https://placehold.co/50x50/F08A5D/FFFFFF?text=SS', songs: 7 },
    { id: 'pa7', title: 'Echo Chamber', artwork: 'https://placehold.co/50x50/B5EAD7/1F2937?text=EC', songs: 11 },
    { id: 'pa8', title: 'Quantum Beats', artwork: 'https://placehold.co/50x50/C7D3D4/1F2937?text=QB', songs: 14 },
    { id: 'pa9', title: 'Dream Weaver', artwork: 'https://placehold.co/50x50/FFD700/1F2937?text=DW', songs: 6 },
    { id: 'pa10', title: 'Night Rider', artwork: 'https://placehold.co/50x50/ADD8E6/1F2937?text=NR', songs: 13 },
    { id: 'pa11', title: 'Cosmic Traveler', artwork: 'https://placehold.co/50x50/4B0082/FFFFFF?text=CT', songs: 9 },
    { id: 'pa12', title: 'The Groove Master', artwork: 'https://placehold.co/50x50/800000/FFFFFF?text=GM', songs: 18 },
    { id: 'pa13', title: 'Melody Maker', artwork: 'https://placehold.co/50x50/008080/FFFFFF?text=MM', songs: 10 },
    { id: 'pa14', title: 'Sonic Sculptor', artwork: 'https://placehold.co/50x50/8B0000/FFFFFF?text=SS', songs: 11 },
    { id: 'pa15', title: 'Vibe Architect', artwork: 'https://placehold.co/50x50/4682B4/FFFFFF?text=VA', songs: 16 },
    { id: 'pa16', title: 'Beat Crafter', artwork: 'https://placehold.co/50x50/F4A460/1F2937?text=BC', songs: 14 },
    { id: 'pa17', title: 'Harmonic Flow', artwork: 'https://placehold.co/50x50/5F9EA0/FFFFFF?text=HF', songs: 10 },
    { id: 'pa18', title: 'Riff Rider', artwork: 'https://placehold.co/50x50/D2B48C/1F2937?text=RR', songs: 12 },
    { id: 'pa19', title: 'Bass Baron', artwork: 'https://placehold.co/50x50/8B008B/FFFFFF?text=BB', songs: 9 },
    { id: 'pa20', title: 'Synth Siren', artwork: 'https://placehold.co/50x50/FFC0CB/1F2937?text=SS', songs: 14 },
];

export const mockTopAlbums: MusicItem[] = [
    { id: 'ta1', title: 'Ambient Dreams', artist: 'Dream Weaver', artwork: 'https://placehold.co/50x50/92A8CD/FFFFFF?text=AD' },
    { id: 'ta2', title: 'Electric Echoes', artist: 'Synth Rider', artwork: 'https://placehold.co/50x50/F08A5D/FFFFFF?text=EE' },
    { id: 'ta3', title: 'Folk Tales', artist: 'Storyteller', artwork: 'https://placehold.co/50x50/B5EAD7/1F2937?text=FT' },
    { id: 'ta4', title: 'Instrumental Journeys', artist: 'Pathfinder', artwork: 'https://placehold.co/50x50/C7D3D4/1F2937?text=IJ' },
    { id: 'ta5', title: 'Cosmic Dust', artist: 'Star Gazer', artwork: 'https://placehold.co/50x50/2196F3/FFFFFF?text=CD' },
    { id: 'ta6', title: 'Echo Chamber', artist: 'Sound Architect', artwork: 'https://placehold.co/50x50/4CAF50/FFFFFF?text=EC' },
    { id: 'ta7', title: 'Urban Rhythms', artist: 'City Beat', artwork: 'https://placehold.co/50x50/FFC107/1F2937?text=UR' },
    { id: 'ta8', title: 'Deep Forest', artist: 'Nature Sounds', artwork: 'https://placehold.co/50x50/8A2BE2/FFFFFF?text=DF' },
    { id: 'ta9', title: 'Crimson Sky', artist: 'Red Horizon', artwork: 'https://placehold.co/50x50/DC143C/FFFFFF?text=CS' },
    { id: 'ta10', title: 'Golden Dawn', artist: 'Sun Seeker', artwork: 'https://placehold.co/50x50/FFD700/1F2937?text=GD' },
    { id: 'ta11', title: 'Blue Lagoon', artist: 'Oceanic', artwork: 'https://placehold.co/50x50/00BFFF/FFFFFF?text=BL' },
    { id: 'ta12', title: 'Green Valley', artist: 'Forest Echo', artwork: 'https://placehold.co/50x50/32CD32/FFFFFF?text=GV' },
    { id: 'ta13', title: 'Nightfall Serenade', artist: 'Moonlight', artwork: 'https://placehold.co/50x50/191970/FFFFFF?text=NS' },
    { id: 'ta14', title: 'Sunrise Symphony', artist: 'Morning Dew', artwork: 'https://placehold.co/50x50/FFDAB9/1F2937?text=SS' },
    { id: 'ta15', title: 'Whispering Pines', artist: 'Woodland', artwork: 'https://placehold.co/50x50/556B2F/FFFFFF?text=WP' },
    { id: 'ta16', title: 'Stellar Drift', artist: 'Galaxy', artwork: 'https://placehold.co/50x50/4B0082/FFFFFF?text=SD' },
    { id: 'ta17', title: 'Urban Pulse', artist: 'City Beat', artwork: 'https://placehold.co/50x50/FF6347/FFFFFF?text=UP' },
    { id: 'ta18', title: 'Echoes of Time', artist: 'Ancient Rhythms', artwork: 'https://placehold.co/50x50/20B2AA/FFFFFF?text=ET' },
    { id: 'ta19', title: 'Sonic Bloom', artist: 'Garden Sounds', artwork: 'https://placehold.co/50x50/9ACD32/FFFFFF?text=SB' },
    { id: 'ta20', title: 'Rhythm Nation', artist: 'Groove Collective', artwork: 'https://placehold.co/50x50/FF69B4/FFFFFF?text=RN' },
];

export const mockFeaturedSongs: MusicItem[] = [
    { id: 'fs1', title: 'Journey\'s End', artist: 'Wanderer', artwork: 'https://placehold.co/200x200/d45534/FFFFFF?text=J1' },
    { id: 'fs2', title: 'Silent Bloom', artist: 'Mystic Grove', artwork: 'https://placehold.co/200x200/7a2e1a/FFFFFF?text=S2' },
    { id: 'fs3', title: 'Neon Dreams', artist: 'City Lights', artwork: 'https://placehold.co/200x200/9CA3AF/1F2937?text=N3' },
    { id: 'fs4', title: 'Desert Wind', artist: 'Sandy Tunes', artwork: 'https://placehold.co/200x200/6B7280/F9FAFB?text=D4' },
    { id: 'fs5', title: 'Starfall', artist: 'Cosmic Harmonies', artwork: 'https://placehold.co/200x200/1F2937/F9FAFB?text=S5' },
    { id: 'fs6', title: 'Rainy City', artist: 'Urban Pulse', artwork: 'https://placehold.co/200x200/d45534/FFFFFF?text=R6' },
    { id: 'fs7', title: 'Mountain Echo', artist: 'Summit Sounds', artwork: 'https://placehold.co/200x200/2196F3/FFFFFF?text=M7' },
    { id: 'fs8', title: 'Forest Path', artist: 'Nature Echo', artwork: 'https://placehold.co/200x200/4CAF50/FFFFFF?text=F8' },
    { id: 'fs9', title: 'Lunar Glow', artist: 'Night Bloom', artwork: 'https://placehold.co/200x200/FFC107/1F2937?text=L9' },
    { id: 'fs10', title: 'Electric Horizon', artist: 'Synth Rider', artwork: 'https://placehold.co/200x200/8A2BE2/FFFFFF?text=E10' },
    { id: 'fs11', title: 'Crimson Sunset', artist: 'Red Wave', artwork: 'https://placehold.co/200x200/DC143C/FFFFFF?text=C11' },
    { id: 'fs12', title: 'Golden Hour', artist: 'Sun Harvest', artwork: 'https://placehold.co/200x200/FFD700/1F2937?text=G12' },
    { id: 'fs13', title: 'Blue Serenade', artist: 'Oceanic', artwork: 'https://placehold.co/200x200/00BFFF/FFFFFF?text=B13' },
    { id: 'fs14', title: 'Green Canopy', artist: 'Forest Echo', artwork: 'https://placehold.co/200x200/32CD32/FFFFFF?text=G14' },
    { id: 'fs15', title: 'Nightfall Waltz', artist: 'Moonlight', artwork: 'https://placehold.co/200x200/191970/FFFFFF?text=N15' },
    { id: 'fs16', title: 'Sunrise Overture', artist: 'Morning Dew', artwork: 'https://placehold.co/200x200/FFDAB9/1F2937?text=S16' },
    { id: 'fs17', title: 'Whispering Leaves', artist: 'Woodland', artwork: 'https://placehold.co/200x200/556B2F/FFFFFF?text=W17' },
    { id: 'fs18', title: 'Stellar Symphony', artist: 'Galaxy', artwork: 'https://placehold.co/200x200/4B0082/FFFFFF?text=S18' },
];
