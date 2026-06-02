import React, { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import { celebrate, cheer, say } from '../utils/audio';
import PlaceValueLadder from './PlaceValueLadder';
import NumberDial from './NumberDial';
import { simulateStation1Intro, simulateStation2Intro, simulateStation3Intro } from '../utils/narration';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const STATIONS = [
  { id: 0, title: 'Number Comparator', subtitle: 'Compare Two Numbers', icon: '⚖️' },
  { id: 1, title: 'Number Line Rocket', subtitle: 'Estimate Magnitude', icon: '🚀' },
  { id: 2, title: 'Ordering Tower', subtitle: 'Sort Multiple Numbers', icon: '🏢' },
];

// ═══════════════════════════════════════════════════
// STATION 1: Number Comparator
// ═══════════════════════════════════════════════════
function Station1({ audioEnabled, onNext }) {
  const [numA, setNumA] = useState(3847);
  const [numB, setNumB] = useState(4219);
  const narRef = useRef(null);

  const comparison = numA > numB ? '>' : numA < numB ? '<' : '=';

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioEnabled) {
        let msg = '';
        if (numA > numB) msg = `${numA} is greater than ${numB}!`;
        else if (numA < numB) msg = `${numA} is less than ${numB}!`;
        else msg = `They are exactly equal!`;
        narRef.current?.cancel();
        narRef.current = narrate([say(msg)], true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [numA, numB, audioEnabled]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>⚖️ Place Value Comparator</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Adjust the dials to change the fuel numbers. Watch the ladder!
      </p>

      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
        <NumberDial value={numA} onChange={setNumA} label="Rocket A" />
        <div style={{ fontSize: '4rem', color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>
          {comparison}
        </div>
        <NumberDial value={numB} onChange={setNumB} label="Rocket B" />
      </div>

      <PlaceValueLadder numbers={[numA, numB]} highlightDiff={true} />

      <div style={{ marginTop: 24, animation: 'bounceIn 0.5s' }}>
        <button className="btn btn-primary" onClick={onNext}>
          Next Station →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Number Line Rocket
// ═══════════════════════════════════════════════════
function Station2({ audioEnabled, onNext }) {
  const [target, setTarget] = useState(() => randInt(1000, 9000));
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const narRef = useRef(null);

  useEffect(() => {
    setTarget(randInt(1000, 9000));
    setValue(5000);
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled, round]);

  const handleRelease = () => {
    const diff = Math.abs(value - target);
    if (diff < 500) {
      setDone(true);
      setValue(target); // snap
      sounds?.correct?.();
      if (audioEnabled) {
        narRef.current?.cancel();
        narRef.current = narrate([celebrate("Perfect landing!")], true);
      }
    } else {
      if (audioEnabled) {
        narRef.current?.cancel();
        narRef.current = narrate([say(value < target ? "Too low! Aim higher." : "Too high! Aim lower.")], true);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>🚀 Number Line Landing</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Drag the rocket to land close to <strong style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>{target}</strong>!
      </p>

      <div style={{ position: 'relative', width: '100%', padding: '40px 20px', margin: '40px 0', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
        {/* Track */}
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', position: 'relative', width: '100%' }}>
           <div style={{ position: 'absolute', left: 0, top: '20px', color: 'var(--text-muted)' }}>0</div>
           <div style={{ position: 'absolute', right: 0, top: '20px', color: 'var(--text-muted)' }}>10,000</div>
           <div style={{ position: 'absolute', left: '50%', top: '20px', color: 'var(--text-muted)', transform: 'translateX(-50%)' }}>5,000</div>
        </div>

        {/* Custom Range Slider replacing default track */}
        <input 
          type="range" 
          min="0" max="10000" 
          value={value} 
          onChange={(e) => !done && setValue(parseInt(e.target.value))}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          style={{
            position: 'absolute', top: '30px', left: '20px', width: 'calc(100% - 40px)',
            opacity: 0, cursor: 'pointer', zIndex: 10, height: '40px'
          }}
          disabled={done}
        />
        
        {/* Rocket Thumb */}
        <div style={{
          position: 'absolute', top: '15px', left: `calc(20px + (100% - 40px) * ${value / 10000})`,
          transform: 'translateX(-50%)',
          fontSize: '3rem', pointerEvents: 'none', transition: 'left 0.1s ease',
          filter: done ? 'drop-shadow(0 0 20px var(--green))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
        }}>
          🚀
        </div>
        <div style={{
          position: 'absolute', top: '-15px', left: `calc(20px + (100% - 40px) * ${value / 10000})`,
          transform: 'translateX(-50%)', fontWeight: 'bold', color: 'var(--gold)',
          fontFamily: 'var(--font-display)', pointerEvents: 'none'
        }}>
          {value}
        </div>
      </div>

      {done && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`} onClick={() => round < 2 ? setRound(r => r + 1) : onNext()}>
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: Ordering Tower
// ═══════════════════════════════════════════════════

function SortableItem({ id, value }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '16px 24px', margin: '8px 0', background: 'rgba(30, 30, 100, 0.9)',
    border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px',
    fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 'bold',
    cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>☰</span>
      <span>{value}</span>
      <span style={{ fontSize: '1rem', color: 'transparent' }}>☰</span>
    </div>
  );
}

function Station3({ audioEnabled, onComplete }) {
  const [items, setItems] = useState([]);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState('ascending');
  const narRef = useRef(null);

  useEffect(() => {
    const newItems = Array.from({ length: 4 }, () => ({
      id: Math.random().toString(36).substring(7),
      value: randInt(1000, 9999)
    }));
    setItems(newItems);
    setMode(Math.random() > 0.5 ? 'ascending' : 'descending');
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled, round]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkOrder = () => {
    const values = items.map(i => i.value);
    const sorted = [...values].sort((a, b) => mode === 'ascending' ? a - b : b - a);
    const isCorrect = values.every((v, i) => v === sorted[i]);

    if (isCorrect) {
      setDone(true);
      sounds?.correct?.();
      if (audioEnabled) {
        narRef.current?.cancel();
        narRef.current = narrate([celebrate(`Great job ordering from ${mode === 'ascending' ? 'least to greatest' : 'greatest to least'}!`)], true);
      }
    } else {
      sounds?.wrong?.();
      if (audioEnabled) {
        narRef.current?.cancel();
        narRef.current = narrate([say("Not quite right. Try again!")], true);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>🏢 Ordering Tower</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Drag the cards to order them from <strong style={{ color: 'var(--gold)' }}>{mode === 'ascending' ? 'Least to Greatest (Ascending)' : 'Greatest to Least (Descending)'}</strong>!
      </p>

      <div style={{ maxWidth: '300px', margin: '0 auto 24px' }}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} value={item.value} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {!done && (
        <button className="btn btn-secondary" onClick={checkOrder}>Check Order</button>
      )}

      {done && (
        <div style={{ marginTop: 24, animation: 'bounceIn 0.5s' }}>
          {round < 2 ? (
            <button className="btn btn-outline" onClick={() => setRound(r => r + 1)}>Try Another →</button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={() => { narRef.current?.cancel(); stopNarration(); onComplete(); }}>🎉 Complete Simulation!</button>
          )}
        </div>
      )}

      <div style={{ marginTop: 24, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Main SimulatePhase
// ═══════════════════════════════════════════════════
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore and discover — no wrong answers!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ maxWidth: 800, width: '100%', animation: 'slideUp 0.4s ease' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
