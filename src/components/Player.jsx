import { usePlayer } from '../context/PlayerContext.jsx';

export default function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    playNext,
    playPrevious,
    setVolume,
    setCurrentTime,
  } = usePlayer();

  const formatTime = (seconds) => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    setCurrentTime(newTime);
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center text-slate-400">
          <p>No song playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Progress bar */}
        <div className="mb-2">
          <div 
            className="h-1 bg-slate-700 rounded-full cursor-pointer relative group"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-sky-400 rounded-full transition-all"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
            <div 
              className="absolute top-0 left-0 h-full w-1 bg-sky-300 opacity-0 group-hover:opacity-100 transition"
              style={{ left: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentSong.imageUrl && (
              <img 
                src={currentSong.imageUrl} 
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{currentSong.title}</p>
              <p className="truncate text-sm text-slate-400">{currentSong.artist}</p>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-800 disabled:opacity-50"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              ⏮
            </button>
            <button 
              className="btn-primary px-6"
              onClick={togglePlayPause}
              disabled={!currentSong?.downloadUrl && !currentSong?.url}
              title={(!currentSong?.downloadUrl && !currentSong?.url) ? 'No audio URL available' : ''}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button 
              className="px-3 py-2 rounded-lg border border-slate-600 hover:bg-slate-800 disabled:opacity-50"
              onClick={playNext}
              disabled={!currentSong}
            >
              ⏭
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2 w-24">
            <span className="text-slate-400">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}