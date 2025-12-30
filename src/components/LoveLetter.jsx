import { useState, useEffect } from 'react';

const LoveLetter = ({ onComplete, onPlayMusic }) => {
  const [stage, setStage] = useState(0); // 0: initial, 1: message revealed
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle progression (both keyboard and touch)
  const handleProgress = () => {
    if (stage === 0) {
      // First interaction: reveal message + play music
      setStage(1);
      onPlayMusic?.();
    } else if (stage === 1) {
      // Second interaction: exit to hero
      setIsExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleProgress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, onComplete, onPlayMusic]);

  return (
    <div
      className={`love-letter-screen ${isExiting ? 'fade-out' : ''}`}
      onClick={handleProgress}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleProgress();
      }}
    >
      <div className="love-letter-container">
        <div className="letter-envelope">
          <div className="letter-paper">
            {stage === 0 ? (
              <div className="letter-prompt">
                <div className="letter-icon">💌</div>
                <p>You have a message...</p>
                <div className="space-hint">
                  {isMobile ? (
                    <>Tap anywhere to open</>
                  ) : (
                    <>Press <span className="key">Space</span> to open</>
                  )}
                </div>
              </div>
            ) : (
              <div className="letter-message">
                <p className="message-text">
                  Hope this website reach you, know that you're loved and cherished, I wish to spend my whole life with you, I love you so much baby jang ko.
                </p>
                <div className="message-signature">— With all my heart ❤️</div>
                <div className="space-hint continue">
                  {isMobile ? (
                    <>Tap anywhere to continue</>
                  ) : (
                    <>Press <span className="key">Space</span> to continue</>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveLetter;
