import { Link } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  return (
    <Link to={`/artist/${artist.id}`} className="card p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-sky-300">🎤</div>
      <div className="min-w-0">
        <p className="font-semibold truncate">{artist.name}</p>
        <p className="text-sm text-slate-400 truncate">{artist.genre} • {artist.country}</p>
      </div>
    </Link>
  );
}





