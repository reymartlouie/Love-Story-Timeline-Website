import { useState, useEffect } from 'react';
import './styles/index.css';
import milestones from './milestones';

// Components
import {
  ParallaxBackground,
  ParticleHearts,
  TimelineItem,
  PhotoModal,
  ScatteredPhotos,
  MemoryCounter,
  MusicPlayer
} from './components';

// Your relationship start date
const START_DATE = new Date('2024-09-04T00:00:00');

export default function App() {
  const [loading, setLoading] = useState(true);
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
          setTimeout(() => setLoading(false), 500);
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

  // Loading screen
  if (loading) {
    return (
      <div className={`loading-screen ${progress === 100 ? 'fade-out' : ''}`}>
        <div className="loading-content">
          <div className="heart-container">
            <div className="heart"></div>
            <div className="heart-pulse"></div>
          </div>
          <h2 className="loading-text">Loading Our Story...</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">{progress}%</p>
        </div>
      </div>
    );
  }

  const specialMilestone = getSpecialMilestone();

  return (
    <div className="page">
      <ParallaxBackground />
      <ParticleHearts />

      {/* Hero Section */}
      <section className="hero">
        <ScatteredPhotos show={!loading} />
        <div className="hero-hearts-background">
          <span className="floating-heart-bg">💕</span>
          <span className="floating-heart-bg">💝</span>
          <span className="floating-heart-bg">❤️</span>
          <span className="floating-heart-bg">💖</span>
          <span className="floating-heart-bg">💗</span>
          <span className="floating-heart-bg">💕</span>
          <span className="floating-heart-bg">💝</span>
          <span className="floating-heart-bg">❤️</span>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Our Love Story</h1>
          <p className="hero-subtitle">Reymart & Keisha</p>
          <div className="hero-date">2024 — Death</div>

          <MemoryCounter timeStats={timeStats} specialMilestone={specialMilestone} />

          <MusicPlayer src="/audio/ilysb-stripped.mp3" autoPlay />

          <div className="scroll-indicator">
            <span className="key-hint">Space</span> to scroll
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <main className="timeline">
        {milestones.map(m => (
          <TimelineItem
            key={m.id}
            milestone={m}
            onImageClick={handleImageClick}
          />
        ))}
      </main>

      <footer>❤️ To be continue...</footer>

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
