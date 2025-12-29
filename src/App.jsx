import { useState, useEffect, useRef } from 'react';
import './App.css';
import milestones from './milestones';

const useIntersectionObserver = (options) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, options);

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [options]);

  return [ref, visible];
};

// Parallax Background Component
const ParallaxBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="parallax-container">
      <div 
        className="parallax-layer layer-1" 
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      <div 
        className="parallax-layer layer-2" 
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div 
        className="parallax-layer layer-3" 
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />
    </div>
  );
};

// Particle Hearts Component
const ParticleHearts = () => {
  const [particles, setParticles] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const nextId = useRef(0);

  // Generate initial floating hearts
  useEffect(() => {
    const hearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      size: 20 + Math.random() * 30,
      emoji: ['💕', '💝', '❤️', '💖', '💗'][Math.floor(Math.random() * 5)]
    }));
    setFloatingHearts(hearts);
  }, []);

  const createBurst = (x, y) => {
    const burstParticles = Array.from({ length: 12 }, () => ({
      id: nextId.current++,
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      velocity: 2 + Math.random() * 3,
      emoji: ['💕', '💝', '❤️', '💖', '💗'][Math.floor(Math.random() * 5)],
      size: 15 + Math.random() * 15
    }));

    setParticles(prev => [...prev, ...burstParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !burstParticles.find(bp => bp.id === p.id)));
    }, 2000);
  };

  // Handle clicks at document level so page content remains clickable
  useEffect(() => {
    const handleClick = (e) => {
      createBurst(e.clientX, e.clientY);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="particle-hearts-container">
      {/* Floating background hearts */}
      {floatingHearts.map(heart => (
        <div
          key={heart.id}
          className="floating-particle-heart"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`
          }}
        >
          {heart.emoji}
        </div>
      ))}

      {/* Burst particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="burst-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size}px`,
            '--angle': `${particle.angle}rad`,
            '--velocity': particle.velocity
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

const TimelineItem = ({ milestone, onImageClick }) => {
  const [ref, show] = useIntersectionObserver({ threshold: 0.2 });
  const itemClass = 'timeline-item ' + milestone.position + (show ? ' show' : '');

  return (
    <div ref={ref} className={itemClass}>
      <div className="timeline-content">
        <h2>{milestone.title}</h2>
        <p className="date">{milestone.date}</p>
        <img
          src={milestone.imageUrl}
          alt={milestone.title}
          onClick={() => onImageClick(milestone)}
        />
        <p>{milestone.description}</p>
      </div>
    </div>
  );
};

// Photo Gallery Modal Component
const PhotoModal = ({ isOpen, onClose, milestones, currentIndex, setCurrentIndex }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);

  const currentMilestone = milestones[currentIndex];

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < milestones.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen || !currentMilestone) return null;

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-content">
        <div className="modal-counter">
          {currentIndex + 1} / {milestones.length}
        </div>

        <button className="modal-close" onClick={handleClose}>
          ×
        </button>

        <button
          className="modal-nav prev"
          onClick={goToPrev}
          disabled={currentIndex === 0}
        >
          ‹
        </button>

        <div
          className={`modal-image-container ${isDragging ? 'grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            className="modal-image"
            src={currentMilestone.imageUrl}
            alt={currentMilestone.title}
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`
            }}
            draggable={false}
          />
        </div>

        <button
          className="modal-nav next"
          onClick={goToNext}
          disabled={currentIndex === milestones.length - 1}
        >
          ›
        </button>

        <div className="modal-info">
          <h3>{currentMilestone.title}</h3>
          <p>{currentMilestone.date}</p>
        </div>

        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
          >
            −
          </button>
          <button
            className="zoom-btn"
            onClick={handleZoomIn}
            disabled={zoom >= 4}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// Scattered Photos Component for Hero Section
const ScatteredPhotos = ({ show }) => {
  const photos = [
    { src: '/images/stolen.JPG', position: 'top-right', delay: 0.2, rotation: 12 },
    { src: '/images/official.JPG', position: 'right', delay: 0.5, rotation: -8 },
    { src: '/images/acquiantance.JPG', position: 'bottom-right', delay: 0.8, rotation: 15 },
    { src: '/images/valentines_day.jpg', position: 'bottom', delay: 1.1, rotation: -12 },
    { src: '/images/late_birthday_celebration.JPG', position: 'top', delay: 1.4, rotation: 6 },
  ];

  if (!show) return null;

  return (
    <div className="scattered-photos">
      {photos.map((photo, index) => (
        <div
          key={index}
          className={`scattered-photo ${photo.position}`}
          style={{
            '--delay': `${photo.delay}s`,
            '--rotation': `${photo.rotation}deg`,
          }}
        >
          <img src={photo.src} alt="" />
        </div>
      ))}
    </div>
  );
};

const MemoryCounter = ({ timeStats, specialMilestone }) => {
  return (
    <div className="memory-counter">
      <div className="counter-grid">
        <div className="counter-item">
          <div className="counter-value">{timeStats.years}</div>
          <div className="counter-label">Year{timeStats.years !== 1 ? 's' : ''}</div>
        </div>
        <div className="counter-item">
          <div className="counter-value">{timeStats.months % 12}</div>
          <div className="counter-label">Month{(timeStats.months % 12) !== 1 ? 's' : ''}</div>
        </div>
        <div className="counter-item">
          <div className="counter-value">{timeStats.days}</div>
          <div className="counter-label">Day{timeStats.days !== 1 ? 's' : ''}</div>
        </div>
        <div className="counter-item">
          <div className="counter-value">{timeStats.hours}</div>
          <div className="counter-label">Hour{timeStats.hours !== 1 ? 's' : ''}</div>
        </div>
        <div className="counter-item">
          <div className="counter-value">{timeStats.minutes}</div>
          <div className="counter-label">Minute{timeStats.minutes !== 1 ? 's' : ''}</div>
        </div>
        <div className="counter-item">
          <div className="counter-value">{timeStats.seconds}</div>
          <div className="counter-label">Second{timeStats.seconds !== 1 ? 's' : ''}</div>
        </div>
      </div>
      {specialMilestone && (
        <div className="special-milestone">
          {specialMilestone}
        </div>
      )}
    </div>
  );
};

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

  // Your relationship start date - UPDATE THIS DATE!
  const startDate = new Date('2024-09-04T00:00:00');

  // Calculate time together
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now - startDate;
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      // Calculate months and years
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      
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
    
    if (days === 365 || days === 730 || days === 1095) return `🎊 ${years} Year${years > 1 ? 's' : ''} Together!`;
    if (days === 1000) return '🎉 1000 Days of Love!';
    if (days === 500) return '💫 500 Days Milestone!';
    if (days === 100) return '✨ 100 Days Together!';
    if (months > 0 && months % 6 === 0) return `💝 ${months} Months & Counting!`;
    
    return null;
  };

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
            <div className="progress-fill" style={{ width: progress + '%' }}></div>
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
      
      <section className="hero">
        <ScatteredPhotos show={!loading} />
        <div className="hero-content">
          <div className="hero-hearts">
            <span className="floating-heart">💕</span>
            <span className="floating-heart">💝</span>
            <span className="floating-heart">❤️</span>
          </div>
          <h1 className="hero-title">Our Love Story</h1>
          <p className="hero-subtitle">Reymart & Keisha</p>
          <div className="hero-date">2024 — death</div>

          <MemoryCounter timeStats={timeStats} specialMilestone={specialMilestone} />

          <div className="scroll-indicator">
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </section>

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