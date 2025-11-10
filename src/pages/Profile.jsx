import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext.jsx';
import Modal from '../components/Modal.jsx';

export default function Profile() {
  const [tab, setTab] = useState('liked');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [songQuery, setSongQuery] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const { songs, playlists, createPlaylist, addSongToPlaylist } = useMusic();
  const likedSongs = songs.slice(0, 3);
  const myPlaylists = playlists;
  const filteredSongs = useMemo(() => {
    const q = songQuery.toLowerCase();
    if (!q) return songs;
    return songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
  }, [songs, songQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-700" />
        <div>
          <h1 className="text-2xl font-bold">Guest User</h1>
          <p className="text-slate-400">Music lover</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className={`px-4 py-2 rounded-xl ${tab==='liked' ? 'bg-sky-400 text-slate-900' : 'bg-slate-800 border border-slate-700'}`} onClick={() => setTab('liked')}>Liked Songs</button>
        <button className={`px-4 py-2 rounded-xl ${tab==='playlists' ? 'bg-sky-400 text-slate-900' : 'bg-slate-800 border border-slate-700'}`} onClick={() => setTab('playlists')}>My Playlists</button>
      </div>

      {tab === 'liked' ? (
        <div className="space-y-3">
          {likedSongs.map((s)=> (
            <div key={s.id} className="card p-4">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-slate-400">{s.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-3">
            <button className="btn-primary" onClick={() => setShowNewPlaylist(true)}>Create Playlist</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPlaylists.map((p)=> (
              <Link key={p.id} to={`/playlist/${p.id}`} className="card p-4 block hover:text-sky-300">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-slate-400">{p.songs.length} songs</p>
              </Link>
            ))}
            {myPlaylists.length === 0 && <p className="text-slate-400">No playlists yet.</p>}
          </div>
          <Modal open={showNewPlaylist} title="Create Playlist" onClose={() => { setShowNewPlaylist(false); setPlaylistName(''); setSongQuery(''); setSelectedSongIds([]); }}>
            <div className="space-y-3">
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Playlist name" value={playlistName} onChange={(e)=>setPlaylistName(e.target.value)} />
              <div className="space-y-2">
                <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Search songs..." value={songQuery} onChange={(e)=>setSongQuery(e.target.value)} />
                <div className="max-h-56 overflow-auto border border-slate-800 rounded-xl divide-y divide-slate-800">
                  {filteredSongs.map(s => (
                    <label key={s.id} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800/60">
                      <input
                        type="checkbox"
                        className="accent-sky-400"
                        checked={selectedSongIds.includes(s.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedSongIds(prev => checked ? [...prev, s.id] : prev.filter(id => id !== s.id));
                        }}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="font-semibold">{s.title}</span>
                        <span className="text-slate-400">  • {s.artist} • {s.duration}</span>
                      </span>
                    </label>
                  ))}
                  {filteredSongs.length === 0 && (
                    <div className="px-3 py-4 text-slate-400">No songs match.</div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>{selectedSongIds.length} selected</span>
                <button className="px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800" onClick={() => setSelectedSongIds([])}>Clear</button>
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800" onClick={() => { setShowNewPlaylist(false); setPlaylistName(''); setSongQuery(''); setSelectedSongIds([]); }}>Cancel</button>
                <button
                  className="btn-primary"
                  disabled={!playlistName.trim()}
                  onClick={() => {
                    const n = playlistName.trim();
                    if (!n) return;
                    const pl = createPlaylist(n);
                    selectedSongIds.forEach(id => addSongToPlaylist(pl.id, id));
                    setPlaylistName('');
                    setSongQuery('');
                    setSelectedSongIds([]);
                    setShowNewPlaylist(false);
                  }}
                >Create</button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}


