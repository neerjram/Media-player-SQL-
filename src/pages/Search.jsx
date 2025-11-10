import { useEffect, useMemo, useState } from 'react';
import { useMusic } from '../context/MusicContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { searchAll } from '../services/api.js';
import SearchBar from '../components/SearchBar.jsx';
import SongCard from '../components/SongCard.jsx';
import ArtistCard from '../components/ArtistCard.jsx';

export default function Search() {
  const { songs, artists } = useMusic();
  const { playSong } = usePlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ songs: [], artists: [] });

  const lower = query.toLowerCase();
  const filteredSongs = useMemo(() => songs.filter(s => s.title.toLowerCase().includes(lower) || s.artist.toLowerCase().includes(lower)), [songs, lower]);
  const filteredArtists = useMemo(() => artists.filter(a => a.name.toLowerCase().includes(lower)), [artists, lower]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!query) {
        setResults({ songs: filteredSongs, artists: filteredArtists });
        return;
      }
      const api = await searchAll(query);
      if (!cancelled) setResults(api);
    })();
    return () => { cancelled = true; };
  }, [query, filteredSongs, filteredArtists]);

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} />

      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Songs</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.songs.map((s) => (
            <SongCard key={s.id} song={s} onPlay={playSong} />
          ))}
          {results.songs.length === 0 && <p className="text-slate-400">No songs found.</p>}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Artists</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.artists.map((a) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
          {results.artists.length === 0 && <p className="text-slate-400">No artists found.</p>}
        </div>
      </div>
    </div>
  );
}


