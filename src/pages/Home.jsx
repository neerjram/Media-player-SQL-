import { useEffect, useMemo, useState } from 'react';
import { useMusic } from '../context/MusicContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { getNewReleases } from '../services/api.js';
import SongCard from '../components/SongCard.jsx';
import ArtistCard from '../components/ArtistCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';

export default function Home() {
  const { songs, artists, playlists } = useMusic();
  const { playSong } = usePlayer();
  const [releases, setReleases] = useState([]);
  useEffect(() => { getNewReleases().then(setReleases); }, []);
  const trending = useMemo(() => (releases.length ? releases : songs).slice(0, 6), [releases, songs]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Songs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((s) => (
            <SongCard key={s.id} song={s} onPlay={playSong} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Top Artists</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((a) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Playlists</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      </section>
    </div>
  );
}


