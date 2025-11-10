import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Player from './components/Player.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Song from './pages/Song.jsx';
import Artist from './pages/Artist.jsx';
import Playlist from './pages/Playlist.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      <Navbar />
      <main className="pt-16 px-4 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/song/:id" element={<Song />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
      <Player />
    </div>
  );
}





