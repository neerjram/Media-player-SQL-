import { useState } from 'react';
import { useMusic } from '../context/MusicContext.jsx';
import Modal from '../components/Modal.jsx';

export default function Admin() {
  const { songs, artists, addSong, addArtist } = useMusic();
  const [songForm, setSongForm] = useState({ title: '', artist: '', duration: '' });
  const [artistForm, setArtistForm] = useState({ name: '', genre: '', country: '' });
  const [lastAddedSong, setLastAddedSong] = useState(null);
  const [lastAddedArtist, setLastAddedArtist] = useState(null);
  const [showSongForm, setShowSongForm] = useState(false);
  const [showArtistForm, setShowArtistForm] = useState(false);

  const handleAddSong = () => {
    if (!songForm.title || !songForm.artist || !songForm.duration) return;
    const created = addSong(songForm);
    setLastAddedSong(created);
    setSongForm({ title: '', artist: '', duration: '' });
    setShowSongForm(false);
  };

  const handleAddArtist = () => {
    if (!artistForm.name) return;
    const created = addArtist(artistForm);
    setLastAddedArtist(created);
    setArtistForm({ name: '', genre: '', country: '' });
    setShowArtistForm(false);
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Add Song</h2>
        <button className="btn-primary" onClick={() => setShowSongForm(true)}>Add Song</button>
        <Modal open={showSongForm} title="Add Song" onClose={() => { setShowSongForm(false); setSongForm({ title:'', artist:'', duration:'' }); }}>
          <div className="grid sm:grid-cols-3 gap-3">
            <input className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Title" value={songForm.title} onChange={e=>setSongForm({...songForm, title:e.target.value})}/>
            <input className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Artist" value={songForm.artist} onChange={e=>setSongForm({...songForm, artist:e.target.value})}/>
            <input className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Duration (m:ss)" value={songForm.duration} onChange={e=>setSongForm({...songForm, duration:e.target.value})}/>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800" onClick={() => { setShowSongForm(false); setSongForm({ title:'', artist:'', duration:'' }); }}>Cancel</button>
            <button className="btn-primary" onClick={handleAddSong}>Save Song</button>
          </div>
        </Modal>
        {lastAddedSong && (
          <div className="mt-3 p-3 rounded-xl border border-slate-700 bg-slate-800/60">
            <p className="text-slate-300"><span className="font-semibold">Added Song:</span> {lastAddedSong.title} • {lastAddedSong.artist} • {lastAddedSong.duration}</p>
          </div>
        )}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr><th className="py-2">Title</th><th>Artist</th><th>Duration</th></tr>
            </thead>
            <tbody>
              {songs.map(s => (
                <tr key={s.id} className="border-t border-slate-800">
                  <td className="py-2">{s.title}</td>
                  <td>{s.artist}</td>
                  <td>{s.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Add Artist</h2>
        <button className="btn-primary" onClick={() => setShowArtistForm(true)}>Add Artist</button>
        <Modal open={showArtistForm} title="Add Artist" onClose={() => { setShowArtistForm(false); setArtistForm({ name:'', genre:'', country:'' }); }}>
          <div className="grid sm:grid-cols-3 gap-3">
            <input className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Name" value={artistForm.name} onChange={e=>setArtistForm({...artistForm, name:e.target.value})}/>
            <input className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Genre" value={artistForm.genre} onChange={e=>setArtistForm({...artistForm, genre:e.target.value})}/>
            <input className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" placeholder="Country" value={artistForm.country} onChange={e=>setArtistForm({...artistForm, country:e.target.value})}/>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800" onClick={() => { setShowArtistForm(false); setArtistForm({ name:'', genre:'', country:'' }); }}>Cancel</button>
            <button className="btn-primary" onClick={handleAddArtist}>Save Artist</button>
          </div>
        </Modal>
        {lastAddedArtist && (
          <div className="mt-3 p-3 rounded-xl border border-slate-700 bg-slate-800/60">
            <p className="text-slate-300"><span className="font-semibold">Added Artist:</span> {lastAddedArtist.name} {lastAddedArtist.genre && `• ${lastAddedArtist.genre}`} {lastAddedArtist.country && `• ${lastAddedArtist.country}`}</p>
          </div>
        )}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr><th className="py-2">Name</th><th>Genre</th><th>Country</th></tr>
            </thead>
            <tbody>
              {artists.map(a => (
                <tr key={a.id} className="border-t border-slate-800">
                  <td className="py-2">{a.name}</td>
                  <td>{a.genre}</td>
                  <td>{a.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


