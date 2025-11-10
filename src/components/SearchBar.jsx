export default function SearchBar({ value, onChange, placeholder = 'Search songs, artists, albums...' }) {
  return (
    <div className="w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
      />
    </div>
  );
}





