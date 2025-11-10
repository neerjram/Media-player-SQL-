export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm flex items-center justify-between">
        <p>© {new Date().getFullYear()} MusicStream</p>
        <p className="hidden sm:block">Built with React + TailwindCSS</p>
      </div>
    </footer>
  );
}





