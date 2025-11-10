import { Link } from 'react-router-dom';

export default function SongCard({ song, onPlay }) {
  return (
    <div className="card p-4 flex gap-4 items-center">
      {song.imageUrl ? (
        <img 
          src={song.imageUrl} 
          alt={song.title} 
          className="w-16 h-16 rounded-xl object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className={`w-16 h-16 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-slate-900 font-bold ${song.imageUrl ? 'hidden' : ''}`}
      >
        ♪
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/song/${song.id}`} className="block font-semibold truncate hover:text-sky-300">{song.title}</Link>
        <p className="text-sm text-slate-400 truncate">{song.artist} • {song.duration}</p>
      </div>
      <button className="btn-primary" onClick={() => onPlay?.(song)}>Play</button>
    </div>
  );
}



