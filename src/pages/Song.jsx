import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMusic } from '../context/MusicContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import Modal from '../components/Modal.jsx';

export default function Song() {
  const { id } = useParams();
  const { songs, playlists, addSongToPlaylist } = useMusic();
  const { playSong } = usePlayer();
  const song = songs.find((s) => s.id === Number(id));
  const [liked, setLiked] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  if (!song) return <p className="text-slate-400">Song not found.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {song.imageUrl ? (
        <img 
          src={song.imageUrl} 
          alt={song.title} 
          className="aspect-square w-full rounded-2xl object-cover"
          onError={(e) => {
            e.target.src = '';
            e.target.className = 'aspect-square w-full rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600';
          }}
        />
      ) : (
        <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600" />
      )}
      <h1 className="text-3xl font-bold">{song.title}</h1>
      <p className="text-slate-400">By {song.artist} • {song.duration}</p>
      <div className="flex gap-3">
        <button className="btn-primary" onClick={() => playSong(song)}>Play</button>
        <button
          className={`px-4 py-2 rounded-xl border transition ${liked ? 'bg-pink-500 text-slate-900 border-pink-400' : 'border-slate-600 hover:bg-slate-800'}`}
          onClick={() => setLiked((v) => !v)}
        >{liked ? 'Liked' : 'Like'}</button>
        <button className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800" onClick={() => setOpenAdd(true)}>Add to Playlist</button>
      </div>
      <Modal open={openAdd} title="Add to Playlist" onClose={() => { setOpenAdd(false); setSelectedPlaylist(''); }}>
        <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" value={selectedPlaylist} onChange={(e)=>setSelectedPlaylist(e.target.value)}>
          <option value="">Select a playlist</option>
          {playlists.map((p)=> (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800" onClick={() => { setOpenAdd(false); setSelectedPlaylist(''); }}>Cancel</button>
          <button className="btn-primary" disabled={!selectedPlaylist} onClick={() => { if (!selectedPlaylist) return; addSongToPlaylist(Number(selectedPlaylist), song.id); setOpenAdd(false); setSelectedPlaylist(''); }}>Add</button>
        </div>
      </Modal>
    </div>
  );
}


