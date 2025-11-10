import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/90 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-100 font-bold text-xl">
          <span className="w-3 h-3 rounded-full bg-sky-400"></span>
          MusicStream
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-slate-200">
          <NavLink to="/" className={({isActive})=>`hover:text-sky-300 ${isActive? 'text-sky-400' : ''}`}>Home</NavLink>
          <NavLink to="/search" className={({isActive})=>`hover:text-sky-300 ${isActive? 'text-sky-400' : ''}`}>Search</NavLink>
          <NavLink to="/profile" className={({isActive})=>`hover:text-sky-300 ${isActive? 'text-sky-400' : ''}`}>Profile</NavLink>
          <NavLink to="/admin" className={({isActive})=>`hover:text-sky-300 ${isActive? 'text-sky-400' : ''}`}>Admin</NavLink>
          <NavLink to="/login" className={({isActive})=>`hover:text-sky-300 ${isActive? 'text-sky-400' : ''}`}>Login</NavLink>
        </div>
      </nav>
    </header>
  );
}


