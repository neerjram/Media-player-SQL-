import { songs as mockSongs, artists as mockArtists } from '../data/mockData.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const JIOSAAVN_API = 'https://saavnapi-nine.vercel.app';

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (e) {
    return null;
  }
}

function toDurationString(value) {
  if (!value && value !== 0) return '3:30';
  const num = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(num)) return String(value);
  const minutes = Math.floor(num / 60);
  const seconds = Math.floor(num % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function normalizeSongs(list) {
  if (!Array.isArray(list)) return mockSongs;
  return list.map((item, idx) => {
    // Handle JioSaavn API format
    const jiosaavnId = item.songid || item.e_songid || item.id;
    const id = Number(jiosaavnId || Date.now() + idx);
    const title = item.title || item.name || item.song || item.track || 'Unknown';
    
    // JioSaavn uses 'singers' field (comma-separated)
    let artist = 'Unknown';
    if (item.singers) {
      artist = item.singers.split(',')[0].trim(); // Take first artist
    } else if (item.artist?.name) {
      artist = item.artist.name;
    } else if (item.artist) {
      artist = item.artist;
    } else if (item.primaryArtists?.[0]?.name) {
      artist = item.primaryArtists[0].name;
    }
    
    // JioSaavn duration is in seconds as string
    let duration = '3:30';
    if (item.duration) {
      duration = item.duration.toString().includes(':') 
        ? item.duration 
        : toDurationString(Number(item.duration));
    } else if (item.more_info?.duration) {
      duration = toDurationString(item.more_info.duration);
    }
    
    return { 
      id, 
      title, 
      artist, 
      duration, 
      plays: Number(item.plays || item.play_count || 0), 
      likes: Number(item.likes || item.like_count || 0),
      // Store additional JioSaavn data for future use
      imageUrl: item.image_url || item.album_art || item.thumbnail,
      downloadUrl: item.url || item.download_url,
      album: item.album,
    };
  });
}

function normalizeArtists(list) {
  if (!Array.isArray(list)) return mockArtists;
  return list.map((item, idx) => ({
    id: Number(item.id ?? item._id ?? Date.now() + idx),
    name: item.name ?? item.title ?? 'Unknown',
    genre: item.genre ?? item.primaryGenre ?? 'Unknown',
    country: item.country ?? 'Unknown',
  }));
}

export async function getNewReleases() {
  // Try custom backend first
  if (BASE_URL) {
    const data = await safeFetch(`${BASE_URL}/songs/new`);
    if (data) {
      const arr = Array.isArray(data) ? data : (data.songs || data.results || data.data || []);
      const norm = normalizeSongs(arr);
      if (norm.length) return norm;
    }
  }
  
  // Try JioSaavn API for trending songs
  try {
    const jiosaavnData = await safeFetch(`${JIOSAAVN_API}/result/?query=trending`);
    if (jiosaavnData) {
      // JioSaavn returns array or object with results
      const arr = Array.isArray(jiosaavnData) 
        ? jiosaavnData 
        : (jiosaavnData.results || jiosaavnData.songs || jiosaavnData.data || []);
      const norm = normalizeSongs(arr);
      if (norm.length) return norm;
    }
  } catch (e) {
    console.warn('JioSaavn API failed:', e);
  }
  
  // Dev fallback: try a static JSON under public/api
  const local = await safeFetch(`/api/songs/new.json`);
  if (local) {
    const arr = Array.isArray(local) ? local : (local.songs || local.results || local.data || []);
    const norm = normalizeSongs(arr);
    if (norm.length) return norm;
  }
  return mockSongs;
}

export async function searchAll(query) {
  const q = (query || '').toLowerCase();
  if (!q) return { songs: mockSongs, artists: mockArtists };
  
  // Try custom backend first
  if (BASE_URL) {
    const data = await safeFetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (data) {
      const songs = normalizeSongs(data.songs || data.tracks || data.results || data.data || []);
      const artists = normalizeArtists(data.artists || []);
      return { songs: songs.length ? songs : mockSongs, artists: artists.length ? artists : mockArtists };
    }
  }
  
  // Try JioSaavn API for search
  try {
    const jiosaavnData = await safeFetch(`${JIOSAAVN_API}/result/?query=${encodeURIComponent(query)}`);
    if (jiosaavnData) {
      // JioSaavn returns array or object with results
      const arr = Array.isArray(jiosaavnData) 
        ? jiosaavnData 
        : (jiosaavnData.results || jiosaavnData.songs || jiosaavnData.data || []);
      const songs = normalizeSongs(arr);
      
      // Extract unique artists from songs
      const artistMap = new Map();
      songs.forEach(song => {
        if (song.artist && song.artist !== 'Unknown') {
          if (!artistMap.has(song.artist)) {
            artistMap.set(song.artist, {
              id: Date.now() + artistMap.size,
              name: song.artist,
              genre: 'Various',
              country: 'Unknown',
            });
          }
        }
      });
      const artists = Array.from(artistMap.values());
      
      return { 
        songs: songs.length ? songs : mockSongs, 
        artists: artists.length ? artists : mockArtists 
      };
    }
  } catch (e) {
    console.warn('JioSaavn API search failed:', e);
  }
  
  // Fallback to local search
  return {
    songs: mockSongs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)),
    artists: mockArtists.filter(a => a.name.toLowerCase().includes(q)),
  };
}


