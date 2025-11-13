import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showLine, setShowLine] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  const fullText = 'Made by Anton Kristensen';

  useEffect(() => {
    let currentIndex = 0;
    let typingInterval;
    
    // Start typing animation after a brief delay
    const typingTimer = setTimeout(() => {
      typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          // Hide cursor when text is complete
          setTimeout(() => {
            setShowCursor(false);
            // Show line after cursor disappears
            setTimeout(() => {
              setShowLine(true);
              // Hide splash screen shortly after line appears
              setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                  setShow(false);
                  onComplete();
                }, 300);
              }, 400);
            }, 200);
          }, 300);
        }
      }, 60); // Speed of typing (60ms per character - faster)

      return () => {
        if (typingInterval) clearInterval(typingInterval);
      };
    }, 200); // Reduced initial delay

    return () => {
      clearTimeout(typingTimer);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [onComplete, fullText]);

  if (!show) return null;

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-background-effects">
        <div className="splash-gradient-orb orb-1"></div>
        <div className="splash-gradient-orb orb-2"></div>
        <div className="splash-gradient-orb orb-3"></div>
      </div>
      <div className="splash-content">
        <div className="splash-text-wrapper">
          <div className="splash-text">
            {displayedText}
            {showCursor && <span className="cursor">|</span>}
          </div>
          <div className={`splash-line ${showLine ? 'visible' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}

