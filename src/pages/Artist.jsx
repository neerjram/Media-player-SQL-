import { useParams, Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';

export default function Artist() {
  const { id } = useParams();
  const { artists, songs } = useMusic();
  const artist = artists.find((a) => a.id === Number(id));
  const artistSongs = songs.filter((s) => s.artist === artist?.name);

  if (!artist) return <p className="text-slate-400">Artist not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-3xl">🎤</div>
        <div>
          <h1 className="text-3xl font-bold">{artist.name}</h1>
          <p className="text-slate-400">{artist.genre} • {artist.country}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Songs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artistSongs.map((s) => (
            <Link key={s.id} to={`/song/${s.id}`} className="card p-4 hover:text-sky-300">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-slate-400">{s.duration}</p>
            </Link>
          ))}
          {artistSongs.length === 0 && <p className="text-slate-400">No songs found.</p>}
        </div>
      </div>
    </div>
  );
}


