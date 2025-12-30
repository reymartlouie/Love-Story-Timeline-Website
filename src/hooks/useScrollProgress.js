import { useState, useEffect } from 'react';

const useScrollProgress = (startFade = 0, endFade = 500) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeRange = endFade - startFade;
      const currentProgress = Math.min(Math.max((scrollY - startFade) / fadeRange, 0), 1);
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [startFade, endFade]);

  return progress;
};

export default useScrollProgress;
