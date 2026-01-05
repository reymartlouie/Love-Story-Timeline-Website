import { useState, useEffect } from 'react';
import './styles/index.css';
import milestones from './milestones';
import useScrollProgress from './hooks/useScrollProgress';

// Components
import {
  ParallaxBackground,
  ParticleHearts,
  TimelineItem,
  PhotoModal,
  ScatteredPhotos,
  MemoryCounter,
  MusicPlayer,
  LoveLetter
} from './components';

// Your relationship start date
const START_DATE = new Date('2024-09-04T00:00:00');

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showLetter, setShowLetter] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeStats, setTimeStats] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    months: 0,
    years: 0
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll progress for hero fade effect (must be before early returns)
  const scrollProgress = useScrollProgress(0, 400);
  const heroOpacity = 1 - scrollProgress * 0.8;
  const heroScale = 1 - scrollProgress * 0.1;
  const heroBlur = scrollProgress * 10;

  const handleImageClick = (milestone) => {
    const index = milestones.findIndex(m => m.id === milestone.id);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  // Calculate time together
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now - START_DATE;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let years = now.getFullYear() - START_DATE.getFullYear();
      let months = now.getMonth() - START_DATE.getMonth();

      if (months < 0) {
        years--;
        months += 12;
      }

      setTimeStats({
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        months: years * 12 + months,
        years
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            setShowLetter(true);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Check for special milestones
  const getSpecialMilestone = () => {
    const { days, months, years } = timeStats;

    if (days === 365 || days === 730 || days === 1095) {
      return `🎊 ${years} Year${years > 1 ? 's' : ''} Together!`;
    }
    if (days === 1000) return '🎉 1000 Days of Love!';
    if (days === 500) return '💫 500 Days Milestone!';
    if (days === 100) return '✨ 100 Days Together!';
    if (months > 0 && months % 6 === 0) return `💝 ${months} Months & Counting!`;

    return null;
  };

  // Handle love letter completion
  const handleLetterComplete = () => {
    setShowLetter(false);
    setShowMain(true);
  };

  // Handle music play trigger from letter
  const handlePlayMusic = () => {
    setShouldPlayMusic(true);
  };

  // Loading screen
  if (loading) {
    return (
      <div className={`loading-screen ${progress === 100 ? 'fade-out' : ''}`}>
        <div className="loading-content">
          <div className="heart-container">
            <div className="heart"></div>
            <div className="heart-pulse"></div>
          </div>
          <h2 className="loading-text">Loading...</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">{progress}%</p>
        </div>
      </div>
    );
  }

  // Love letter screen
  if (showLetter) {
    return (
      <LoveLetter
        onComplete={handleLetterComplete}
        onPlayMusic={handlePlayMusic}
      />
    );
  }

  // Main content
  if (!showMain) return null;

  const specialMilestone = getSpecialMilestone();

  return (
    <div className="page">
      <ParallaxBackground />
      <ParticleHearts />

      {/* Hero Section */}
      <section className="hero">
        <div
          className="scattered-photos-wrapper"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            filter: `blur(${heroBlur}px)`,
            pointerEvents: 'none'
          }}
        >
          <ScatteredPhotos show={true} />
        </div>
        <div
          className="hero-hearts-background"
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            filter: `blur(${heroBlur}px)`
          }}
        >
          <span className="floating-heart-bg">💕</span>
          <span className="floating-heart-bg">💝</span>
          <span className="floating-heart-bg">❤️</span>
          <span className="floating-heart-bg">💖</span>
          <span className="floating-heart-bg">💗</span>
          <span className="floating-heart-bg">💕</span>
          <span className="floating-heart-bg">💝</span>
          <span className="floating-heart-bg">❤️</span>
        </div>
        <div
          className="hero-content"
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            filter: `blur(${heroBlur}px)`
          }}
        >
          <h1 className="hero-title">Our Love Story</h1>
          <p className="hero-subtitle">Reymart & Keisha</p>
          <div className="hero-date">2024 — Death</div>

          <MemoryCounter timeStats={timeStats} specialMilestone={specialMilestone} />

          <MusicPlayer
                playlist={[
                  { src: '/audio/tenerif-sea.mp3', title: 'tenerif-sea' },
                  { src: '/audio/ilysb-stripped.mp3', title: 'ilysb' }
                ]}
                shouldPlay={shouldPlayMusic}
              />

          <div className="scroll-indicator">
            Space to explore
          </div>
          <div className="swipe-indicator">
            Swipe to explore
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <main className="timeline">
        <h1 className="timeline-title">Our Milestone</h1>
        <div className="timeline-items">
          {milestones.map(m => (
            <TimelineItem
              key={m.id}
              milestone={m}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
      </main>

      <footer className="apple-footer">
        <div className="footer-card">
          <span className="footer-text">Crafting Memories</span>
          <span className="wave-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </div>
      </footer>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        milestones={milestones}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />
    </div>
  );
}
