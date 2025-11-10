import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { songs as seedSongs, artists as seedArtists, playlists as seedPlaylists } from '../data/mockData.js';
import http from '../services/http.js';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState(seedSongs);
  const [artists, setArtists] = useState(seedArtists);
  const [playlists, setPlaylists] = useState(seedPlaylists);

  // Load initial data from backend if available
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (import.meta.env.VITE_API_BASE_URL) {
          const [songsRes, artistsRes, playlistsRes] = await Promise.allSettled([
            http.get('/songs/new'),
            http.get('/artists'),
            http.get('/playlists'),
          ]);
          if (mounted && songsRes.status === 'fulfilled' && Array.isArray(songsRes.value.data)) {
            setSongs(songsRes.value.data.map(s => ({
              ...s,
              duration: typeof s.duration === 'number' ? `${Math.floor(s.duration/60)}:${String(s.duration%60).padStart(2,'0')}` : s.duration
            })));
          }
          if (mounted && artistsRes.status === 'fulfilled' && Array.isArray(artistsRes.value.data)) {
            setArtists(artistsRes.value.data);
          }
          if (mounted && playlistsRes.status === 'fulfilled' && Array.isArray(playlistsRes.value.data)) {
            setPlaylists(playlistsRes.value.data);
          }
        }
      } catch {
        // ignore; fallback to seeds
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const addSong = async (song) => {
    if (import.meta.env.VITE_API_BASE_URL) {
      const res = await http.post('/songs', {
        title: song.title, artist: song.artist, duration: song.duration?.includes(':') ? (Number(song.duration.split(':')[0])*60 + Number(song.duration.split(':')[1])) : Number(song.duration)
      });
      const created = res.data;
      const normalized = { ...created, duration: typeof created.duration === 'number' ? `${Math.floor(created.duration/60)}:${String(created.duration%60).padStart(2,'0')}` : created.duration };
      setSongs((prev) => [...prev, normalized]);
      return normalized;
    }
    const newSong = { id: Date.now(), plays: 0, likes: 0, ...song };
    setSongs((prev) => [...prev, newSong]);
    return newSong;
  };

  const addArtist = async (artist) => {
    if (import.meta.env.VITE_API_BASE_URL) {
      const res = await http.post('/artists', artist);
      setArtists((prev) => [...prev, res.data]);
      return res.data;
    }
    const newArtist = { id: Date.now(), ...artist };
    setArtists((prev) => [...prev, newArtist]);
    return newArtist;
  };

  const createPlaylist = async (name, user = 'Guest') => {
    if (import.meta.env.VITE_API_BASE_URL) {
      const res = await http.post('/playlists', { name, user });
      const created = { ...res.data, songs: [] };
      setPlaylists((prev) => [created, ...prev]);
      return created;
    }
    const newPlaylist = { id: Date.now(), name, songs: [], user };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const addSongToPlaylist = async (playlistId, songId) => {
    if (import.meta.env.VITE_API_BASE_URL) {
      await http.post(`/playlists/${playlistId}/songs`, { songId });
    }
    setPlaylists((prev) => prev.map((p) => {
      if (p.id !== playlistId) return p;
      if (p.songs.includes(songId)) return p;
      return { ...p, songs: [...p.songs, songId] };
    }));
  };

  const removeSongFromPlaylist = async (playlistId, songId) => {
    if (import.meta.env.VITE_API_BASE_URL) {
      await http.delete(`/playlists/${playlistId}/songs/${songId}`);
    }
    setPlaylists((prev) => prev.map((p) => p.id === playlistId ? { ...p, songs: p.songs.filter((id) => id !== songId) } : p));
  };

  const value = useMemo(() => ({
    songs,
    artists,
    playlists,
    addSong,
    addArtist,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  }), [songs, artists, playlists]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}


