export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-lg mx-4 rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="px-3 py-1 rounded-lg border border-slate-600 hover:bg-slate-800" onClick={onClose}>Close</button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}





