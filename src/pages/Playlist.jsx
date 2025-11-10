import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function Playlist() {
  const { id } = useParams();
  const { playlists, songs, removeSongFromPlaylist } = useMusic();
  const { playSong } = usePlayer();
  const playlist = playlists.find((p) => p.id === Number(id));

  const songList = useMemo(() => (playlist?.songs ?? []).map((sid) => songs.find((s) => s.id === sid)).filter(Boolean), [playlist, songs]);
  const totalSeconds = useMemo(() => songList.reduce((acc, s) => {
    const [m, sec] = s.duration.split(':').map(Number);
    return acc + m * 60 + sec;
  }, 0), [songList]);
  const duration = `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;

  if (!playlist) return <p className="text-slate-400">Playlist not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-slate-400">{songList.length} songs • {duration}</p>
        </div>
        {songList.length > 0 && (
          <button 
            className="btn-primary" 
            onClick={() => playSong(songList[0], songList)}
          >
            Play All
          </button>
        )}
      </div>
      <div className="space-y-3">
        {songList.map((s) => (
          <div key={s.id} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-slate-400">{s.artist} • {s.duration}</p>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn-primary px-3 py-2" 
                onClick={() => playSong(s)}
              >
                Play
              </button>
              <button 
                className="px-3 py-2 rounded-xl border border-slate-600 hover:bg-slate-800" 
                onClick={() => removeSongFromPlaylist(playlist.id, s.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {songList.length === 0 && <p className="text-slate-400">No songs in this playlist.</p>}
      </div>
    </div>
  );
}


