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

const PhotoGalleryModal = ({ isOpen, currentIndex, milestones, onClose, onNavigate }) => {
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

  // Close handler with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
      if (e.key === '+' || e.key === '=') handleZoom('in');
      if (e.key === '-') handleZoom('out');
      if (e.key === '0') handleZoomReset();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleZoom = (direction) => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
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
      handleZoom('in');
    } else {
      handleZoom('out');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={handleClose} title="Close (Esc)">
          ×
        </button>

        {/* Counter */}
        <div className="modal-counter">
          {currentIndex + 1} / {milestones.length}
        </div>

        {/* Navigation Buttons */}
        <button 
          className="modal-nav prev" 
          onClick={() => onNavigate('prev')}
          disabled={currentIndex === 0}
          title="Previous (←)"
        >
          ‹
        </button>
        <button 
          className="modal-nav next" 
          onClick={() => onNavigate('next')}
          disabled={currentIndex === milestones.length - 1}
          title="Next (→)"
        >
          ›
        </button>

        {/* Image Container */}
        <div 
          className={`modal-image-container ${isDragging ? 'grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            src={currentMilestone.imageUrl}
            alt={currentMilestone.title}
            className="modal-image"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            draggable={false}
          />
        </div>

        {/* Image Info */}
        <div className="modal-info">
          <h3>{currentMilestone.title}</h3>
          <p>{currentMilestone.date}</p>
        </div>

        {/* Zoom Controls */}
        <div className="zoom-controls">
          <button 
            className="zoom-btn" 
            onClick={() => handleZoom('out')}
            title="Zoom Out (-)"
            disabled={zoom <= 0.5}
          >
            −
          </button>
          <button 
            className="zoom-btn" 
            onClick={handleZoomReset}
            title="Reset Zoom (0)"
          >
            ⟲
          </button>
          <button 
            className="zoom-btn" 
            onClick={() => handleZoom('in')}
            title="Zoom In (+)"
            disabled={zoom >= 3}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ milestone, onClick }) => {
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
          onClick={onClick}
          title="Click to view full size"
        />
        <p>{milestone.description}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const navigateImage = (direction) => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < milestones.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
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

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-hearts">
            <span className="floating-heart">💕</span>
            <span className="floating-heart">💝</span>
            <span className="floating-heart">❤️</span>
          </div>
          <h1 className="hero-title">Our Love Story</h1>
          <p className="hero-subtitle">Reymart & Keisha</p>
          <div className="hero-date">2024 — death</div>
          <div className="scroll-indicator">
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </section>

      <main className="timeline">
        {milestones.map((m, index) => (
          <TimelineItem 
            key={m.id} 
            milestone={m}
            onClick={() => openModal(index)}
          />
        ))}
      </main>

      <footer>❤️ To be continue...</footer>

      <PhotoGalleryModal
        isOpen={modalOpen}
        currentIndex={currentImageIndex}
        milestones={milestones}
        onClose={closeModal}
        onNavigate={navigateImage}
      />
    </div>
  );
}