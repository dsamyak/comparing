import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState(0);
  const narrationRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrationRef.current = narrate(
        wonderNarration(),
        true
      );
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [stage, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(() => onComplete());
      setTimeout(() => onComplete(), 1000);
    } else {
      setTimeout(() => onComplete(), 600);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {/* Simple starfield effect reusing CSS classes */}
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="wonder-particle" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 10}s`,
            fontSize: `${0.5 + Math.random() * 1.5}rem`,
            color: 'white'
          }}>⭐</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-rockets-container ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-rocket-item">
            <img src="/assets/images/rocket_a_1780392590329.png" className="wonder-rocket-img" alt="Rocket A" />
            <div className="wonder-rocket-badge">
              <span className="wonder-rocket-number">3,847</span>
            </div>
            <div className="wonder-rocket-label">Sarah's Fuel</div>
          </div>
          
          <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`} style={{ marginBottom: '80px', transform: stage >= 1 ? 'scale(0.8)' : 'scale(0)' }}>
            <span className="wonder-qmark-icon">?</span>
            <div className="wonder-qmark-glow" />
          </div>

          <div className="wonder-rocket-item">
            <img src="/assets/images/rocket_b_1780392641310.png" className="wonder-rocket-img" alt="Rocket B" />
            <div className="wonder-rocket-badge">
              <span className="wonder-rocket-number">4,219</span>
            </div>
            <div className="wonder-rocket-label">John's Fuel</div>
          </div>
        </div>

        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <h2 className="wonder-question-text">Which rocket has more fuel?</h2>
          <p className="wonder-subtext">Mission Control says only the bigger number gets to launch!</p>
        </div>
        
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Find Out!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
