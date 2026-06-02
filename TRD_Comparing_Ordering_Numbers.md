# Technical Requirements Document (TRD)
## Comparing & Ordering Numbers — Whole Numbers Up to 10,000
### Intellia SG | Grade 3 Math | React Simulation Module

---

**Document Version:** 1.0  
**Date:** June 2026  
**Tech Lead:** Intellia SG Engineering  
**Repository Pattern Reference:** github.com/dsamyak/equal  
**Deployment Target:** https://intelliasg.com/courses/grade-3-math  

---

## 1. Architecture Overview

The module is a **self-contained React application** embedded within the Intellia SG course platform. It follows the same repository structure and architectural patterns established in the `equal` reference repo.

```
compare-numbers/
├── public/
│   └── assets/
│       └── audio/           # Pre-generated ElevenLabs .mp3 files
├── scripts/
│   ├── generate_audio.js    # ElevenLabs offline audio generation
│   └── clean_audio.js       # Orphan audio cleanup
├── src/
│   ├── components/          # UI components per phase
│   │   ├── wonder/
│   │   ├── story/
│   │   ├── simulate/
│   │   ├── play/
│   │   └── reflect/
│   ├── utils/
│   │   ├── audio.js         # Playback engine (getAudioUrl, speak, narrate, preloadNarration)
│   │   ├── audioMap.js      # Auto-generated text→mp3 mapping (DO NOT EDIT MANUALLY)
│   │   ├── narration.js     # Phase→narration script mapping
│   │   └── questions.js     # Random question generator
│   ├── hooks/
│   │   ├── useGameState.js  # XP, stars, level progress
│   │   └── useNarration.js  # Audio phase controller
│   ├── App.jsx              # Root phase router
│   └── main.jsx
├── .env.local               # VITE_ELEVENLABS_API_KEY
├── vite.config.js
└── package.json
```

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS + CSS Variables | 3.x |
| Animations | Framer Motion | 11.x |
| State Management | React Context + useReducer | (built-in) |
| Audio | ElevenLabs API + HTML5 Audio | — |
| Drag & Drop | @dnd-kit/core | 6.x |
| Icons | Lucide React | latest |
| Fonts | Google Fonts (Fredoka One, Nunito) | — |
| Deployment | Vite build → static hosting on Intellia CDN | — |

---

## 3. Component Architecture

### 3.1 App.jsx — Phase Router

```jsx
// Phase constants
const PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect'];

export default function App() {
  const [phase, setPhase] = useState('wonder');
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      <NarrationProvider>
        <AnimatePresence mode="wait">
          {phase === 'wonder'   && <WonderPhase   onComplete={() => setPhase('story')}    />}
          {phase === 'story'    && <StoryPhase     onComplete={() => setPhase('simulate')} />}
          {phase === 'simulate' && <SimulatePhase  onComplete={() => setPhase('play')}     />}
          {phase === 'play'     && <PlayPhase      onComplete={() => setPhase('reflect')}  />}
          {phase === 'reflect'  && <ReflectPhase   onComplete={() => {/* show completion */}} />}
        </AnimatePresence>
        <PhaseNav current={phase} phases={PHASES} />
        <AudioToggle />
      </NarrationProvider>
    </GameContext.Provider>
  );
}
```

### 3.2 Phase Components

Each phase is a full-screen `<motion.section>` with:
- `initial={{ opacity: 0, y: 30 }}` / `animate={{ opacity: 1, y: 0 }}` / `exit={{ opacity: 0, y: -30 }}`
- `transition={{ duration: 0.4, ease: 'easeInOut' }}`
- Auto-triggered narration on mount via `useNarration` hook

---

## 4. Phase 1 — Wonder Component (`src/components/wonder/`)

### WonderPhase.jsx

```jsx
function WonderPhase({ onComplete }) {
  const { narrate } = useNarration();

  useEffect(() => {
    narrate(wonderNarration()); // Fires ElevenLabs audio sequence
  }, []);

  return (
    <motion.section className="wonder-phase">
      <StarfieldBackground />
      <RocketPair leftFuel={3847} rightFuel={4219} />
      <QuestionBubble text="Which rocket has more fuel?" />
      <PulsingQuestionMark />
      <ContinueButton onClick={onComplete} label="Let's Find Out!" />
    </motion.section>
  );
}
```

**`RocketPair` Component:**
- Two animated SVG rockets with fuel gauges
- Numbers display with a counting-up animation (0 → target value over 1.5s)
- Question marks overlay the comparison symbol position

---

## 5. Phase 2 — Story Component (`src/components/story/`)

### StoryPhase.jsx

Multi-beat narrative. State: `currentBeat` (0–4).

```jsx
const STORY_BEATS = [
  { character: 'sarah', text: "My fuel gauge says 3,847!", emotion: 'excited' },
  { character: 'john',  text: "Mine says 4,219! But which is more?", emotion: 'curious' },
  { character: 'priya', text: "Use the Place Value Ladder! Compare the THOUSANDS digit first.", emotion: 'wise' },
  { character: 'mike',  text: "Look — 4 thousands beats 3 thousands. John has more fuel!", emotion: 'happy' },
  { character: 'priya', text: "Now let's order ALL the rockets from least fuel to most!", emotion: 'excited' },
];
```

**PlaceValueLadder Component:**
```jsx
// Animates digits into 4 columns: Th | H | T | O
// Props: numbers = [3847, 4219]
// Highlights comparing column with glowing gold border
// Uses Framer Motion layoutId for smooth digit transitions
```

---

## 6. Phase 3 — Simulate Component (`src/components/simulate/`)

### 6.1 NumberComparator.jsx

```jsx
function NumberComparator() {
  const [numA, setNumA] = useState(3847);
  const [numB, setNumB] = useState(4219);
  const { narrate } = useNarration();

  const comparison = numA > numB ? '>' : numA < numB ? '<' : '=';

  // Trigger narration explanation whenever numbers change (debounced 800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      narrate(generateComparisonNarration(numA, numB, comparison));
    }, 800);
    return () => clearTimeout(timer);
  }, [numA, numB]);

  return (
    <div className="comparator">
      <NumberDial value={numA} onChange={setNumA} label="Rocket A" />
      <ComparisonSymbol symbol={comparison} />
      <NumberDial value={numB} onChange={setNumB} label="Rocket B" />
      <PlaceValueLadder numbers={[numA, numB]} highlightDiff />
    </div>
  );
}
```

**NumberDial:** Digit-by-digit input (4 separate single-digit fields, styled as fuel gauge segments). Each digit: 0–9 with up/down buttons or keyboard input.

### 6.2 NumberLineRocket.jsx

```jsx
// Horizontal number line 0–10,000
// Students drag rocket tokens to correct positions
// Uses @dnd-kit/core for accessible drag-and-drop
// Snap zones: every 500 units (snapping tolerance: ±200 units)
// Challenge numbers pre-generated: [randomInRange(0, 4999), randomInRange(5000, 9999)]
```

### 6.3 OrderingTower.jsx

```jsx
function OrderingTower() {
  const [cards, setCards] = useState(() => generateRandomCards(4));
  const [mode, setMode] = useState('ascending'); // 'ascending' | 'descending'
  const [userOrder, setUserOrder] = useState([]);

  function generateRandomCards(count) {
    // Generates `count` unique numbers ensuring at least one digit-position difference
    // between consecutive sorted values (prevents trivially obvious ordering)
    const numbers = [];
    while (numbers.length < count) {
      const n = Math.floor(Math.random() * 9000) + 1000; // 4-digit numbers
      if (!numbers.includes(n)) numbers.push(n);
    }
    return shuffle(numbers);
  }

  function checkOrder() {
    const sorted = [...cards].sort((a, b) => mode === 'ascending' ? a - b : b - a);
    const correct = userOrder.every((val, i) => val === sorted[i]);
    if (correct) triggerLaunchAnimation();
    else triggerHintNarration(userOrder, sorted);
  }
}
```

---

## 7. Phase 4 — Play Component (`src/components/play/`)

### 7.1 Question Generator (`src/utils/questions.js`)

```javascript
// === QUESTION TYPES ===

// Type 1: Binary Compare
export function generateBinaryCompare(level) {
  const range = levelRange(level); // { min, max }
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);
  return {
    type: 'binary_compare',
    question: `Compare these two numbers:`,
    numA: a,
    numB: b,
    answer: a > b ? '>' : a < b ? '<' : '=',
    options: ['<', '>', '='],
  };
}

// Type 2: Order Set
export function generateOrderSet(level, direction = 'ascending') {
  const range = levelRange(level);
  const count = level === 3 ? 5 : level === 2 ? 4 : 3;
  const nums = generateUniqueNumbers(count, range);
  return {
    type: 'order_set',
    question: `Arrange these numbers from ${direction === 'ascending' ? 'least to greatest' : 'greatest to least'}:`,
    numbers: shuffle(nums),
    answer: direction === 'ascending' ? [...nums].sort((a,b) => a-b) : [...nums].sort((a,b) => b-a),
    direction,
  };
}

// Type 3: Word Problem
export function generateWordProblem(level) {
  const names = ['John', 'Sarah', 'Mike', 'Priya', 'Lena', 'Omar', 'Aiko', 'Carlos', 'Emma', 'Ravi'];
  const [nameA, nameB] = sampleTwo(names);
  const range = levelRange(level);
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);
  const templates = [
    `${nameA} collected ${a} stickers. ${nameB} collected ${b} stickers. Who collected more?`,
    `${nameA}'s school has ${a} students. ${nameB}'s school has ${b} students. Which school is bigger?`,
    `${nameA} scored ${a} points in a game. ${nameB} scored ${b} points. Who has a higher score?`,
  ];
  return {
    type: 'word_problem',
    question: sample(templates),
    answer: a > b ? nameA : b > a ? nameB : 'They are equal',
    options: [nameA, nameB, 'They are equal'],
  };
}

// Level ranges
function levelRange(level) {
  return level === 1 ? { min: 100,  max: 999  }
       : level === 2 ? { min: 1000, max: 4999 }
       :               { min: 5000, max: 9999 };
}
```

### 7.2 Game State (`src/hooks/useGameState.js`)

```javascript
const initialGameState = {
  level: 1,          // 1, 2, 3
  questionIndex: 0,  // 0–4 per level
  correctCount: 0,
  streak: 0,
  xp: 0,
  stars: [0, 0, 0],  // Per-level star ratings
  badges: [],
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'CORRECT_ANSWER':
      const xpGain = 10 + (state.streak >= 2 ? 5 : 0);
      return { ...state,
        correctCount: state.correctCount + 1,
        streak: state.streak + 1,
        xp: state.xp + xpGain,
        questionIndex: state.questionIndex + 1,
      };
    case 'WRONG_ANSWER':
      return { ...state, streak: 0, questionIndex: state.questionIndex + 1 };
    case 'LEVEL_COMPLETE':
      const accuracy = state.correctCount / 5;
      const stars = accuracy >= 0.8 ? 3 : accuracy >= 0.6 ? 2 : 1;
      return { ...state,
        stars: state.stars.map((s, i) => i === state.level - 1 ? stars : s),
        level: state.level + 1,
        questionIndex: 0,
        correctCount: 0,
      };
    // ...
  }
}
```

### 7.3 PlayPhase.jsx

```jsx
function PlayPhase({ onComplete }) {
  const { gameState, dispatch } = useGameContext();
  const [currentQ, setCurrentQ] = useState(() => generateQuestion(gameState.level));
  const [answered, setAnswered] = useState(null); // null | 'correct' | 'wrong'
  const [showHint, setShowHint] = useState(false);

  function handleAnswer(choice) {
    const correct = choice === currentQ.answer;
    setAnswered(correct ? 'correct' : 'wrong');
    dispatch({ type: correct ? 'CORRECT_ANSWER' : 'WRONG_ANSWER' });
    if (correct) {
      narrate(encouragementNarration());
      setTimeout(nextQuestion, 1500);
    } else {
      setShowHint(true);
    }
  }

  function nextQuestion() {
    if (gameState.questionIndex >= 4) {
      dispatch({ type: 'LEVEL_COMPLETE' });
      if (gameState.level >= 3) onComplete();
    } else {
      setCurrentQ(generateQuestion(gameState.level));
      setAnswered(null);
      setShowHint(false);
    }
  }

  return (
    <motion.section className="play-phase">
      <LevelHeader level={gameState.level} xp={gameState.xp} />
      <RocketProgressBar progress={gameState.questionIndex / 5} />
      <QuestionCard question={currentQ} onAnswer={handleAnswer} answered={answered} />
      {showHint && <HintCard question={currentQ} />}
      {answered === 'correct' && <CorrectAnimation />}
    </motion.section>
  );
}
```

---

## 8. Audio Pipeline Implementation

### 8.1 Narration Scripts (`src/utils/narration.js`)

```javascript
import { say, ask, cheer, emphasize, think, celebrate } from './narrationHelpers';

export function wonderNarration() {
  return [
    ask("Welcome, Rocket Pilot! Your mission is about to begin."),
    ask("Sarah's fuel gauge shows three thousand, eight hundred and forty seven."),
    ask("John's fuel gauge shows four thousand, two hundred and nineteen."),
    ask("Which rocket has more fuel? Can you figure it out?"),
  ];
}

export function storyBeat1Narration() {
  return [say("Sarah looked at her gauge. Three thousand, eight hundred and forty seven. A big number!")];
}

export function storyBeat3Narration() {
  return [
    think("How do we compare such big numbers?"),
    emphasize("The secret is the Place Value Ladder!"),
    emphasize("We always start by comparing the THOUSANDS digit first."),
  ];
}

export function generateComparisonNarration(a, b, symbol) {
  const aStr = numberToWords(a);
  const bStr = numberToWords(b);
  if (symbol === '>') return [say(`${aStr} is greater than ${bStr}. The first number wins!`)];
  if (symbol === '<') return [say(`${aStr} is less than ${bStr}. The second number is bigger!`)];
  return [say(`Both numbers are equal! They tie!`)];
}

export function encouragementNarration() {
  const lines = [
    cheer("Brilliant! That's exactly right!"),
    cheer("Amazing work, Pilot!"),
    cheer("You nailed it! Keep going!"),
    cheer("Correct! You're on fire!"),
  ];
  return [lines[Math.floor(Math.random() * lines.length)]];
}

export function celebrationNarration(level) {
  return [celebrate(`Level ${level} complete! You earned ${level === 3 ? 'three' : level} stars! Outstanding pilot!`)];
}
```

### 8.2 Audio Engine (`src/utils/audio.js`)

Identical architecture to the reference pipeline:

```javascript
import audioMap from './audioMap.js';

const elevenLabsCache = new Map();

export async function getAudioUrl(text) {
  // 1. Static cache check
  if (audioMap[text]) return audioMap[text];

  // 2. Memory cache check
  if (elevenLabsCache.has(text)) return elevenLabsCache.get(text);

  // 3. Dynamic API call
  const url = await fetchElevenLabsAudio(text);
  elevenLabsCache.set(text, url);
  return url;
}

export async function narrate(segments) {
  for (let i = 0; i < segments.length; i++) {
    const url = await getAudioUrl(segments[i].text);

    // Eagerly preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text); // fire-and-forget
    }

    await playAudio(url);
  }
}

async function fetchElevenLabsAudio(text, style = 'statement') {
  const styleSettings = {
    statement:    { stability: 0.75, similarity_boost: 0.75, style: 0.3 },
    question:     { stability: 0.60, similarity_boost: 0.80, style: 0.5 },
    encouragement:{ stability: 0.50, similarity_boost: 0.85, style: 0.7 },
    emphasis:     { stability: 0.85, similarity_boost: 0.80, style: 0.2 },
    thinking:     { stability: 0.65, similarity_boost: 0.75, style: 0.4 },
    celebration:  { stability: 0.40, similarity_boost: 0.90, style: 0.9 },
  };

  const res = await fetch('/api/elevenlabs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice_id: 'Xb7hH8MSUJpSbSDYk0k2',
      model_id: 'eleven_multilingual_v2',
      voice_settings: styleSettings[style] || styleSettings.statement,
    }),
  });

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
```

### 8.3 Offline Audio Generation (`scripts/generate_audio.js`)

```javascript
const phrases = [
  // Wonder Phase
  { text: "Welcome, Rocket Pilot! Your mission is about to begin.", style: 'statement' },
  { text: "Sarah's fuel gauge shows three thousand, eight hundred and forty seven.", style: 'statement' },
  { text: "John's fuel gauge shows four thousand, two hundred and nineteen.", style: 'statement' },
  { text: "Which rocket has more fuel? Can you figure it out?", style: 'question' },
  
  // Story Phase — Beat 3 (Place Value)
  { text: "The secret is the Place Value Ladder!", style: 'emphasis' },
  { text: "We always start by comparing the THOUSANDS digit first.", style: 'emphasis' },
  { text: "Four thousands is more than three thousands. John wins!", style: 'encouragement' },
  
  // Simulate Phase
  { text: "Try changing the number. Watch what happens to the Place Value Ladder!", style: 'instruction' },
  { text: "Drag your rocket to the right spot on the number line.", style: 'instruction' },
  { text: "Now put these cards in order. Which number is least?", style: 'thinking' },
  
  // Play — Encouragement pool
  { text: "Brilliant! That's exactly right!", style: 'encouragement' },
  { text: "Amazing work, Pilot!", style: 'encouragement' },
  { text: "You nailed it! Keep going!", style: 'encouragement' },
  { text: "Correct! You're on fire!", style: 'encouragement' },
  
  // Play — Celebrations
  { text: "Level one complete! You earned your Cadet wings!", style: 'celebration' },
  { text: "Level two complete! You are now a Navigator!", style: 'celebration' },
  { text: "Level three complete! You are a certified Number Commander!", style: 'celebration' },
  
  // Reflect Phase
  { text: "What did you learn today? Tell me in your own words.", style: 'thinking' },
  { text: "Explain to John how you would figure out which number is bigger.", style: 'thinking' },
];

// Script hits ElevenLabs API and writes MP3s + audioMap.js
// Run: node scripts/generate_audio.js
```

---

## 9. Random Question Engine — Detailed Specification

### 9.1 Seeding Strategy
```javascript
// Each session gets a unique seed from: Date.now() ^ userId hash
// This ensures: same user always gets different questions
// But questions are reproducible for debugging via seed param (?seed=1234)
import seedrandom from 'seedrandom';

export function createQuestionEngine(seed = Date.now()) {
  const rng = seedrandom(seed);
  return {
    randomInt: (min, max) => Math.floor(rng() * (max - min + 1)) + min,
    randomChoice: (arr) => arr[Math.floor(rng() * arr.length)],
    shuffle: (arr) => [...arr].sort(() => rng() - 0.5),
  };
}
```

### 9.2 Anti-Repetition Rules
```javascript
// Within a session, track used numbers
const usedNumbers = new Set();

function generateUniqueNumber(min, max, engine) {
  let n, attempts = 0;
  do {
    n = engine.randomInt(min, max);
    attempts++;
  } while (usedNumbers.has(n) && attempts < 100);
  usedNumbers.add(n);
  return n;
}
```

### 9.3 Distractor Generation
```javascript
// For multiple choice, generate plausible wrong answers
function generateDistractors(correct, count, range, engine) {
  const distractors = new Set();
  
  // Strategy 1: Flip one digit (e.g., 4219 → 4129, 4291)
  // Strategy 2: Off by one place value (4219 → 3219, 5219)
  // Strategy 3: Swap two digits (4219 → 2419)
  
  while (distractors.size < count) {
    const strategy = engine.randomInt(1, 3);
    // ... apply strategy, validate in range, add to set
  }
  return shuffle([correct, ...distractors]);
}
```

---

## 10. UI Component Specifications

### 10.1 PlaceValueLadder

```jsx
// Props: numbers (array of 1-2 numbers), highlightDiff (boolean)
// Renders: Table with columns Th | H | T | O
// Each digit animates in with spring: stiffness: 300, damping: 20
// When highlightDiff=true: scans left-to-right, highlights first differing column gold
// Column glow: box-shadow: 0 0 20px #FBBF24, border: 2px solid #FBBF24

function PlaceValueLadder({ numbers, highlightDiff = false }) {
  const digits = numbers.map(n => extractDigits(n)); // [th, h, t, o]
  const diffCol = highlightDiff ? findFirstDiffColumn(digits) : -1;

  return (
    <div className="place-value-ladder">
      <header>
        {['Th', 'H', 'T', 'O'].map((label, i) => (
          <div key={i} className={`col-header ${i === diffCol ? 'highlighted' : ''}`}>{label}</div>
        ))}
      </header>
      {digits.map((row, ri) => (
        <div key={ri} className="number-row">
          {row.map((digit, ci) => (
            <motion.div
              key={ci}
              className={`digit-cell ${ci === diffCol ? 'highlighted' : ''}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: ci * 0.15, type: 'spring', stiffness: 300 }}
            >
              {digit !== null ? digit : '—'}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### 10.2 QuestionCard

Shared across all question types. Renders question text + answer options.

```jsx
function QuestionCard({ question, onAnswer, answered }) {
  const isOrderSet = question.type === 'order_set';

  return (
    <motion.div className="question-card" layout>
      <p className="question-text">{question.question}</p>

      {isOrderSet
        ? <DraggableOrderInput numbers={question.numbers} onSubmit={onAnswer} />
        : <ChoiceGrid options={question.options} onSelect={onAnswer} answered={answered} correct={question.answer} />
      }
    </motion.div>
  );
}
```

### 10.3 StarfieldBackground

```jsx
// CSS-only animated starfield for Wonder phase
// 200 pseudo-randomly positioned stars via clip-path / box-shadow trick
// Parallax: slow stars (40s), medium (25s), fast (15s) layers
// Pure CSS animation, zero JS overhead
```

---

## 11. Styling System

### 11.1 CSS Variables (Root)

```css
:root {
  /* Brand Colors */
  --color-navy:    #0D1B3E;
  --color-blue:    #2563EB;
  --color-orange:  #F97316;
  --color-purple:  #7C3AED;
  --color-gold:    #FBBF24;
  --color-green:   #22C55E;
  --color-white:   #FFFFFF;

  /* Phase Accent Colors */
  --wonder-accent:   #7C3AED;
  --story-accent:    #F97316;
  --simulate-accent: #7C3AED;
  --play-accent:     #22C55E;
  --reflect-accent:  #2563EB;

  /* Typography */
  --font-display: 'Fredoka One', cursive;
  --font-body:    'Nunito', sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 48px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 8px 32px rgba(13, 27, 62, 0.15);
  --shadow-glow-gold: 0 0 24px rgba(251, 191, 36, 0.6);
  --shadow-glow-blue: 0 0 24px rgba(37, 99, 235, 0.5);
}
```

### 11.2 Phase Background Gradients

```css
.wonder-phase   { background: radial-gradient(ellipse at 60% 40%, #1e1b4b 0%, #0d1b3e 70%); }
.story-phase    { background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%); }
.simulate-phase { background: linear-gradient(180deg, #1e1b4b 0%, #0d1b3e 100%); }
.play-phase     { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); }
.reflect-phase  { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); }
```

---

## 12. Performance Requirements

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Interaction to Next Paint | < 200ms |
| Audio gap between segments | < 100ms (preload eliminates gap) |
| Bundle size (gzipped) | < 250KB (excluding audio assets) |
| Animation FPS | Consistent 60fps |
| Lighthouse score | ≥ 90 (Performance, Accessibility) |

---

## 13. Accessibility Requirements

| Requirement | Implementation |
|------------|---------------|
| Keyboard navigation | All buttons/inputs tab-navigable; drag-drop has keyboard alternative |
| Screen reader | ARIA labels on all interactive elements; live regions for feedback |
| Audio toggle | Persistent mute button; audio never auto-plays on repeat visit without consent |
| Focus indicators | High-contrast focus rings: `outline: 3px solid var(--color-gold)` |
| Touch targets | Minimum 44×44px per WCAG 2.5.5 |
| Color contrast | All text ≥ 4.5:1 contrast ratio |
| Reduced motion | `@media (prefers-reduced-motion)` disables all non-essential animations |

---

## 14. Environment & Deployment

```bash
# Development
npm install
cp .env.example .env.local  # Add VITE_ELEVENLABS_API_KEY
npm run dev

# Audio generation (offline, run once per script update)
node scripts/generate_audio.js
node scripts/clean_audio.js  # optional cleanup

# Production build
npm run build
# Output: /dist — deploy as static files to Intellia CDN
# Embed via <iframe> or module federation into intelliasg.com/courses/grade-3-math
```

### Environment Variables

```
VITE_ELEVENLABS_API_KEY=sk-...      # ElevenLabs API key
VITE_ELEVENLABS_VOICE_ID=Xb7hH8MSUJpSbSDYk0k2
VITE_APP_ENV=production
VITE_ENABLE_DEBUG_SEED=false        # Set true for QA: ?seed=1234 enables reproducible questions
```

---

## 15. Testing Strategy

| Test Type | Tool | Coverage |
|-----------|------|---------|
| Unit — question generator | Vitest | All question types, edge cases, seeding |
| Unit — audio engine | Vitest + MSW | Cache hit, cache miss, API failure |
| Unit — game reducer | Vitest | All action types, XP calculation, star rating |
| Component | React Testing Library | Each phase component renders, narration triggers |
| E2E | Playwright | Full journey: Wonder → Reflect, answer 15 questions |
| Accessibility | axe-core + Playwright | All phases pass WCAG 2.1 AA |
| Performance | Lighthouse CI | On every PR |

---

## 16. API Contracts

### ElevenLabs (via `/api/elevenlabs` proxy)

```
POST /api/elevenlabs
Content-Type: application/json

{
  "text": "string",
  "voice_id": "Xb7hH8MSUJpSbSDYk0k2",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.75,
    "similarity_boost": 0.75,
    "style": 0.3
  }
}

Response: audio/mpeg blob
```

---

## 17. File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PlaceValueLadder.jsx` |
| Hooks | camelCase with `use` prefix | `useGameState.js` |
| Utils | camelCase | `questions.js`, `narration.js` |
| Audio files | `audio_[phase]_[slug]_[index].mp3` | `audio_wonder_which_rocket_0.mp3` |
| CSS modules | PascalCase match component | `PlaceValueLadder.module.css` |

---

## 18. Known Constraints & Decisions

| Constraint | Decision |
|-----------|---------|
| No backend | All game state in React; no persistence in v1 |
| ElevenLabs rate limits | Pre-generation avoids runtime limits for all scripted lines |
| Drag-and-drop on mobile | @dnd-kit with pointer events (not HTML5 drag) for touch support |
| Number-to-words conversion | Custom utility for 0–9,999; no library needed |
| Bundle size | Lazy-load Framer Motion; split per phase using React.lazy |
| Audio autoplay policy | First narration triggers on first user interaction (click "Let's Find Out!") |
