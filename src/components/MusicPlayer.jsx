import { useState, useRef, useEffect } from 'react';

const defaultPlaylist = [
  { src: '/audio/Nobody-else.mp3', title: 'Nobody-else' }
];

const MusicPlayer = ({ playlist = defaultPlaylist, shouldPlay = false }) => {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);

  const currentTrack = playlist[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Trigger play when shouldPlay becomes true
  useEffect(() => {
    if (shouldPlay && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [shouldPlay]);

  // When track changes, play if was playing
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
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
        src={currentTrack.src}
        loop
        preload="metadata"
        onEnded={nextTrack}
      />

      {/* Title Section */}
      <div className="player-section player-title-section">
        <span className="player-title">
          {currentTrack.title}
        </span>
      </div>

      {/* Play/Pause Section */}
      <div className="player-section player-control-section">
        <button
          className={`player-btn play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>

      {/* Prev/Next Section */}
      <div className="player-section player-nav-section">
        <button
          className="player-btn nav-btn"
          onClick={prevTrack}
          aria-label="Previous track"
        >
          ‹
        </button>
        <button
          className="player-btn nav-btn"
          onClick={nextTrack}
          aria-label="Next track"
        >
          ›
        </button>
      </div>

      {/* Volume Section */}
      <div className="player-section player-volume-section">
        <button
          className={`volume-toggle ${volume === 0 ? 'muted' : ''}`}
          onClick={() => setShowVolume(!showVolume)}
          aria-label="Toggle volume"
        >
          <svg className="volume-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            {volume > 0 && (
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            )}
            {volume >= 0.5 && (
              <path d="M18.07 5.93a9 9 0 0 1 0 12.14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            )}
            {volume === 0 && (
              <path d="M16 9l6 6m0-6l-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            )}
          </svg>
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
    </div>
  );
};

export default MusicPlayer;
