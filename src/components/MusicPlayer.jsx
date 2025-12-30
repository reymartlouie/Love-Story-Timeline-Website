import { useState, useRef, useEffect } from 'react';

const MusicPlayer = ({ src = '/audio/song.mp3', autoPlay = false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [autoPlayAttempted, setAutoPlayAttempted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Attempt autoplay when component mounts
  useEffect(() => {
    if (autoPlay && audioRef.current && !autoPlayAttempted) {
      setAutoPlayAttempted(true);

      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser - user needs to click
            setIsPlaying(false);
          });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, autoPlayAttempted]);

  // Space key triggers play (works with scroll hint)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isPlaying && audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked - user needs to interact first
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
      />

      <button
        className={`music-btn ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>

      <button
        className="volume-toggle"
        onClick={() => setShowVolume(!showVolume)}
        aria-label="Toggle volume"
      >
        {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
      </button>

      <div className={`volume-slider ${showVolume ? 'show' : ''}`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
