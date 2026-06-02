import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';
import PlaceValueLadder from './PlaceValueLadder';

const STORY_SLIDES = [
  {
    image: '/assets/images/sarah_pilot_1780392466795.png',
    title: "Mission Control Needs You",
    text: "Sarah's fuel reads 3,847. John's reads 4,219. Mission Control announces only the pilot with the bigger number gets to launch!",
    highlight: '"Which is bigger: 3,847 or 4,219?"',
    mascotText: "We have to compare the numbers! 🚀",
  },
  {
    image: '/assets/images/mike_fuel_engineer_1780392563372.png',
    title: "The Fuel Engineer's Advice",
    text: 'Mike the fuel engineer says "Bigger number = more fuel = longer flight!" But how do you know which is bigger when the numbers are so huge?',
    highlight: '"How do we compare them?"',
    mascotText: "Hmm... maybe we look at the digits? 🤔",
  },
  {
    customRender: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '20px' }}>
        <PlaceValueLadder numbers={[3847, 4219]} highlightDiff={true} />
      </div>
    ),
    title: "The Place Value Ladder",
    text: 'Priya pulls up the Place Value Ladder! She compares the THOUSANDS digit first. 4 thousands is more than 3 thousands. John wins!',
    highlight: '"Compare the thousands first!"',
    mascotText: "Place value is the secret! 💡",
  },
  {
    image: '/assets/images/priya_mission_control_1780392548784.png',
    title: "A New Challenge",
    text: "But wait! Lena, Omar, and Aiko also want to race! Now we have to ORDER all their fuel readings from least to greatest.",
    highlight: '"Ordering numbers: Least to Greatest"',
    mascotText: "We can use the ladder again! 🪜",
  },
  {
    image: '/assets/images/rocket_a_1780392590329.png',
    title: "Blast Off!",
    text: 'Using the Place Value Ladder, Mission Control orders all the rockets. The race begins and the rockets blast off into space!',
    highlight: '"You are ready to compare and order!"',
    mascotText: "Let's practice at the observatory! ✨",
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const narrationRef = useRef(null);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  // Preload audio
  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) {
        preloadNarration(getStoryNarration(slide + 1));
      }
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section">
          {s.customRender ? s.customRender() : (
            <img src={s.image} alt={s.title} className="story-image" onError={(e) => { e.target.style.display = 'none'; }} />
          )}
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>🚀</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 180 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
