import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Get audio URL from song (JioSaavn downloadUrl or fallback)
  const getAudioUrl = (song) => {
    if (!song) return null;
    // Check for JioSaavn download URL (normalized field)
    if (song.downloadUrl) {
      console.log('Using downloadUrl:', song.downloadUrl);
      return song.downloadUrl;
    }
    // Check for url field (JioSaavn original format)
    if (song.url) {
      console.log('Using url field:', song.url);
      return song.url;
    }
    // For mock songs, we can't play them without a real URL
    console.warn('No audio URL available for song:', song.title, song);
    return null;
  };

  // Play a song
  const playSong = useCallback((song, queueList = null) => {
    if (!song) {
      console.warn('No song provided to playSong');
      return;
    }
    
    const audioUrl = getAudioUrl(song);
    console.log('Playing song:', song.title, 'URL:', audioUrl);
    
    if (!audioUrl) {
      alert(`Cannot play "${song.title}" - No audio URL available.\n\nPlease search for songs using the Search page - those songs from JioSaavn API will have playable audio URLs.`);
      return;
    }

    const newQueue = queueList || [song];
    const index = newQueue.findIndex(s => s.id === song.id);
    
    setCurrentSong(song);
    setQueue(newQueue);
    setCurrentIndex(index >= 0 ? index : 0);
    setIsPlaying(true); // Auto-play when song is selected
  }, []);

  // Add song to queue
  const addToQueue = useCallback((song) => {
    if (!song) return;
    setQueue(prev => {
      if (prev.find(s => s.id === song.id)) return prev;
      return [...prev, song];
    });
  }, []);

  // Play next song
  const playNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
      setIsPlaying(true);
    }
  }, [currentIndex, queue]);

  // Play previous song
  const playPrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
      setIsPlaying(true);
    }
  }, [currentIndex, queue]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Update audio source when song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      const audioUrl = getAudioUrl(currentSong);
      if (audioUrl) {
        const audio = audioRef.current;
        // Reset current time
        setCurrentTime(0);
        setDuration(0);
        
        // Set up error handler
        const handleError = (e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
          alert(`Failed to load audio: ${audio.error?.message || 'Unknown error'}`);
        };
        
        // Set up load handler
        const handleLoadedData = () => {
          console.log('Audio loaded successfully');
        };
        
        audio.addEventListener('error', handleError);
        audio.addEventListener('loadeddata', handleLoadedData);
        
        // Set source and load
        audio.src = audioUrl;
        audio.load();
        
        // If already playing, start playback after load
        if (isPlaying) {
          audio.play().catch(err => {
            console.error('Playback failed:', err);
            setIsPlaying(false);
            alert(`Playback failed: ${err.message}`);
          });
        }
        
        return () => {
          audio.removeEventListener('error', handleError);
          audio.removeEventListener('loadeddata', handleLoadedData);
        };
      } else {
        console.warn('No audio URL for current song');
        setIsPlaying(false);
      }
    }
  }, [currentSong]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    const audio = audioRef.current;
    const audioUrl = getAudioUrl(currentSong);
    
    if (!audioUrl) {
      setIsPlaying(false);
      return;
    }
    
    if (isPlaying) {
      // Ensure src is set
      if (audio.src !== audioUrl && audio.src !== window.location.href + audioUrl) {
        audio.src = audioUrl;
        audio.load();
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Playing:', currentSong.title);
          })
          .catch(err => {
            console.error('Playback failed:', err);
            setIsPlaying(false);
            alert(`Cannot play audio: ${err.message || 'Please check browser console for details'}`);
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => {
      playNext();
    });

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [playNext]);

  // Set volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Seek to time
  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const value = {
    currentSong,
    queue,
    isPlaying,
    currentTime,
    duration,
    volume,
    playSong,
    addToQueue,
    playNext,
    playPrevious,
    togglePlayPause,
    setVolume,
    setCurrentTime: seekTo,
    audioRef,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio 
        ref={audioRef} 
        preload="metadata" 
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Audio element error:', e);
          setIsPlaying(false);
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
