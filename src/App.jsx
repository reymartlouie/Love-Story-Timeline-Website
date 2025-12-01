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

const TimelineItem = ({ milestone }) => {
  const [ref, show] = useIntersectionObserver({ threshold: 0.2 });
  const itemClass = 'timeline-item ' + milestone.position + (show ? ' show' : '');

  return (
    <div ref={ref} className={itemClass}>
      <div className="timeline-content">
        <h2>{milestone.title}</h2>
        <p className="date">{milestone.date}</p>
        <img src={milestone.imageUrl} alt={milestone.title} />
        <p>{milestone.description}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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
          <div className="hero-date">2024 — madeds</div>
          <div className="scroll-indicator">
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </section>

      <main className="timeline">
        {milestones.map(m => <TimelineItem key={m.id} milestone={m} />)}
      </main>

      <footer>❤️ To be continue...</footer>
    </div>
  );
}