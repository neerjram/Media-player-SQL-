import { Link } from 'react-router-dom';

export default function PlaylistCard({ playlist }) {
  return (
    <Link to={`/playlist/${playlist.id}`} className="card p-4 block">
      <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 mb-3"></div>
      <p className="font-semibold">{playlist.name}</p>
      <p className="text-sm text-slate-400">{playlist.songs.length} songs</p>
    </Link>
  );
}





