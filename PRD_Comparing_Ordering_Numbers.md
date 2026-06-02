# Product Requirements Document (PRD)
## Comparing & Ordering Numbers — Whole Numbers Up to 10,000
### Intellia SG | Grade 3 Math | Simulation-Based Gamified Learning Module

---

**Document Version:** 1.0  
**Date:** June 2026  
**Product Owner:** Intellia SG  
**Target Platform:** https://intelliasg.com/courses/grade-3-math  
**Reference Implementation:** https://equal-tau.vercel.app/  
**Audience:** Grade 3 Students (Ages 7–9) | Global Curriculum Alignment  

---

## 1. Executive Summary

This document defines the product requirements for a fully gamified, simulation-based web learning module focused on **Comparing and Ordering Whole Numbers up to 10,000**. The module follows Intellia SG's established pedagogical architecture — a 5-phase learner journey: **Wonder → Story → Simulate → Play → Reflect** — and is built as a rich, interactive React application.

The module targets a global student audience (ages 7–9), uses culturally neutral characters with global names (John, Sarah, Mike, Priya, Lena, etc.), and delivers a highly animated, audio-narrated experience synchronized with the ElevenLabs audio pipeline described in the audio generation documentation.

---

## 2. Problem Statement

Understanding how to compare and order numbers is a foundational numeracy skill required across all global mathematics curricula (Singapore MOE, US Common Core, UK National Curriculum, Indian NCERT, Australian AC). Most existing learning tools present this concept through static worksheets or rote drill. Students lack:

- Conceptual grounding in *why* numbers have relative magnitude
- Simulation tools to manipulate and feel number comparisons viscerally
- A narrative hook that makes abstract concepts emotionally memorable
- Randomized, adaptive practice that prevents rote memorization of answers

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Conceptual understanding | Pre/post quiz improvement | ≥ 80% of students improve |
| Engagement | Average session completion rate | ≥ 85% |
| Time-on-task | Average module duration | 12–18 minutes |
| Practice coverage | Questions attempted per session | ≥ 10 randomized questions |
| Delight | 5-star rating on platform | ≥ 4.4 / 5.0 |
| Accessibility | WCAG 2.1 AA compliance | 100% |

---

## 4. Target Users

### Primary User
**Students — Grade 3 | Ages 7–9 | Global**
- Reading level: Early chapter-book (supports audio narration)
- Attention span: 10–20 minute focused sessions
- Device: Tablet-first, desktop-compatible, touch-friendly
- Context: Classroom or home learning

### Secondary Users
- **Teachers** — assign, monitor progress, review completion
- **Parents** — view progress summaries
- **Curriculum designers** — review content accuracy

---

## 5. Curriculum Alignment

| Curriculum | Standard | Description |
|-----------|---------|-------------|
| Singapore MOE | P3 Number Strand | Compare and order numbers within 10,000 |
| US Common Core | 2.NBT.A.4 / 3.NBT | Compare three-digit/four-digit numbers using <, >, = |
| UK National Curriculum | KS2 Year 3 | Order and compare numbers up to 1,000 and 10,000 |
| Australian AC | ACMNA052 | Recognise, model, represent and order numbers to 10,000 |
| Indian NCERT | Class 3 Maths | Comparison of numbers, ascending/descending order |
| IB PYP | Math Strand: Number | Number relationships and patterns |

**Core Learning Objectives:**
1. Compare two numbers up to 10,000 using <, >, and = symbols
2. Arrange a set of numbers in ascending (least to greatest) order
3. Arrange a set of numbers in descending (greatest to least) order
4. Identify the greatest and least values in a set
5. Use a number line to visualize and compare large numbers
6. Understand place value as the basis for comparison (thousands, hundreds, tens, ones)

---

## 6. Learner Journey — 5 Phases

All phases follow the Intellia SG framework visible in the reference implementation. Each phase is a distinct screen/section within the single-page application.

---

### Phase 1: WONDER 🔍
**Goal:** Create curiosity and prime the student's brain for the concept.

**Narrative Hook — "The Great Sky Race"**
Sarah and John are two young pilots in the year 2087. Their rocket ships are parked at Space Station Orion. Mission Control announces: *"Only the pilot with the BIGGER fuel number may launch!"* The fuel gauges show mysterious 4-digit numbers. Who gets to blast off?

**UI Elements:**
- Animated rocket ships on a starfield background
- Fuel gauge showing two large numbers with question marks
- Audio narration (ElevenLabs "Alice" voice, `question` style): *"Hmm, 3,847 and 4,219… which is bigger? Who gets to launch first?"*
- Big question mark animation — glowing, pulsing
- Single CTA button: **"Let's Find Out!"**

**No interaction required** — student simply watches and listens, then proceeds.

---

### Phase 2: STORY 📖
**Goal:** Introduce the concept through a memorable, character-driven narrative.

**Story: "Mission Control's Number Secret"**

*Characters:* Sarah (pilot), John (pilot), Priya (Mission Control officer), Mike (fuel engineer)

*Narrative Arc (5 beats):*

1. **Setup:** Sarah's fuel reads 3,847. John's reads 4,219. Mission Control needs to compare.
2. **Conflict:** Mike says "bigger number = more fuel = longer flight!" But how do you know which is bigger?
3. **Revelation — Place Value Ladder:** Priya pulls up the Place Value Ladder on her holo-screen. She compares THOUSANDS digit first. "4 thousands is more than 3 thousands. John wins!"
4. **Complication:** New mission — Lena, Omar, and Aiko also want to race! We must ORDER all four fuel readings from least to greatest.
5. **Resolution:** Using the Place Value Ladder, Mission Control orders all rockets and the race begins!

**UI Elements:**
- Illustrated comic-panel style scenes (Intellia SG cartoon aesthetic)
- Character speech bubbles with synchronized audio narration
- Animated Place Value Ladder (4 columns: Th | H | T | O)
- Numbers animate digit-by-digit into the ladder
- Highlighted comparison — winning digit glows gold
- Progress dots (Beat 1–5) at bottom
- Tap/click to advance each beat (or auto-advance after audio)

**Audio styles used:** `statement`, `thinking`, `emphasis`, `encouragement`

---

### Phase 3: SIMULATE 🔬
**Goal:** Hands-on exploration — hypothesis becomes felt knowledge.

**Simulation Title: "The Place Value Observatory"**

Students control an interactive simulation with three tools:

#### Tool A — Number Comparator
- Two large input dials (or number pads) to set any two numbers (0–9,999)
- Real-time Place Value Ladder showing both numbers side-by-side
- Animated comparison: digits highlight left-to-right, comparison symbol (<, >, =) animates in
- Audio narration explains the comparison step-by-step as student adjusts numbers
- Challenge prompts (auto-generated): *"Can you find a number bigger than 5,000 but smaller than 5,500?"*

#### Tool B — Number Line Rocket
- A horizontal number line (0–10,000, adjustable zoom)
- Students drag rocket ships to positions representing given numbers
- Numbers snap to correct positions; rockets animate into place
- Visual distance between numbers becomes intuitive

#### Tool C — Ordering Tower
- 3–5 random number cards appear
- Student drags them into order (ascending or descending — toggled by a switch)
- Correct order triggers a launch animation; incorrect triggers a gentle "try again" with a hint
- Numbers randomize on each attempt

**Key UX:** No time pressure. Unlimited exploration. Narration provides hints on hover/pause (3 seconds inactive = gentle audio nudge).

---

### Phase 4: PLAY 🎮
**Goal:** Gamified challenge — mastery unlocks the next level.

**Game: "Rocket Pilot License Test"**

Students earn their Pilot License by completing 3 levels. Each level has 5 questions. All questions are **randomly generated** every session.

#### Level 1 — Cadet (Numbers 1–1,000)
- Question types: Compare two numbers (select <, >, or =); identify greatest/least from a set of 3

#### Level 2 — Navigator (Numbers 1,001–5,000)
- Question types: Order 3 numbers ascending/descending; fill-in-the-blank comparison; true/false statements

#### Level 3 — Commander (Numbers 5,001–10,000)
- Question types: Order 4–5 numbers; multi-step (which two numbers are closest?); word problems with number comparison

**Question Randomization Rules:**
- Numbers generated fresh each session via a seeded random algorithm
- No question repeats within a session
- Distractor answers are mathematically plausible (differ by one digit position)
- Word problem names cycle through: John, Sarah, Mike, Priya, Lena, Omar, Aiko, Carlos, Emma, Ravi

**Gamification Mechanics:**
- XP points per correct answer (10 XP base, +5 XP streak bonus)
- Star rating per level (1–3 stars based on accuracy)
- Animated rocket ship ascends the screen as levels are completed
- Incorrect answers → gentle hint → second attempt → show answer with explanation
- No penalty for wrong answers (growth mindset design)
- Celebratory animations on level completion (confetti, rocket launch, audio: `celebration` style)
- Final badge: **"Certified Rocket Pilot — Number Commander!"**

---

### Phase 5: REFLECT 📓
**Goal:** Metacognitive consolidation — the lesson is complete only here.

**Reflection Prompt (randomly chosen from bank of 5):**
- *"Explain to John how you would figure out which of his numbers is bigger. Use your own words!"*
- *"Draw a number line and place 2,500 and 7,800 on it. Which is closer to 5,000?"*
- *"Sarah has three fuel readings: 6,100, 4,980, and 6,010. Put them in order. How did you decide?"*
- *"What does the THOUSANDS digit tell you about a number? Give an example."*
- *"Mike says 999 is bigger than 1,000. Is he right? How would you explain it to him?"*

**UI Elements:**
- Journal-style card with lined paper texture
- Text input area (for typed response) OR LearnFlow AI chat option
- Audio narration prompts the reflection question warmly (`thinking` style)
- Submit button → module completion celebration screen
- Completion screen: Stars earned, XP total, badge awarded, "Share with Teacher" option

---

## 7. Content Requirements

### 7.1 Question Bank Structure

| Type | Description | Count per level |
|------|------------|----------------|
| Binary Compare | Which is greater/less? | 3 per level |
| Symbol Select | Insert <, >, or = | 2 per level |
| Order Set | Arrange 3–5 numbers | 2 per level |
| True/False | Is this comparison correct? | 1 per level |
| Word Problem | Story-based comparison | 1 per level (L2, L3) |

All questions generated dynamically from parameterized templates. No static question list.

### 7.2 Narration Script Summary (ElevenLabs Pipeline)

All narration follows the audio pipeline spec: pre-generated `.mp3` files with exact-text matching via `audioMap.js`, dynamic fallback via ElevenLabs API.

| Phase | Style | Key Lines |
|-------|-------|-----------|
| Wonder | `question` | "Which rocket has more fuel? Can you figure it out?" |
| Story | `statement`, `emphasis` | "We always compare the THOUSANDS digit first!" |
| Simulate | `thinking`, `instruction` | "Try changing the number. Watch what happens!" |
| Play | `encouragement`, `celebration` | "Amazing! You got it right!" / "You earned 3 stars!" |
| Reflect | `thinking` | "What did you learn today? Tell me in your own words." |

### 7.3 Character Roster

| Name | Role | Visual |
|------|------|--------|
| Sarah | Pilot protagonist | Girl, brown hair, orange space suit |
| John | Pilot co-protagonist | Boy, dark hair, blue space suit |
| Priya | Mission Control | Girl, black hair, purple uniform |
| Mike | Fuel Engineer | Boy, blonde, green coveralls |
| Lena | Pilot (ordering challenge) | Girl, red hair, silver suit |
| Omar | Pilot (ordering challenge) | Boy, curly hair, yellow suit |

---

## 8. Design Requirements

### 8.1 Visual System (Intellia SG Brand)

Strictly follow Intellia SG visual identity as seen in the reference app (equal-tau.vercel.app):
- **Primary palette:** Deep navy (`#0D1B3E`), electric blue (`#2563EB`), vibrant orange (`#F97316`), space purple (`#7C3AED`)
- **Accent:** Gold/yellow (`#FBBF24`), success green (`#22C55E`)
- **Typography:** Fredoka One (headings), Nunito (body) — playful, round, legible for children
- **Illustrations:** 3D cartoon style consistent with Intellia SG asset library
- **Animations:** Framer Motion / CSS keyframes — bouncy, spring-based, child-appropriate
- **Layout:** Phase-by-phase full-screen sections, mobile-first, max-width 1200px

### 8.2 Accessibility
- All interactive elements keyboard-navigable
- Screen reader labels on all controls
- Audio can be toggled on/off
- Minimum touch target: 44×44px
- Contrast ratio ≥ 4.5:1 for all text
- Dyslexia-friendly font option (OpenDyslexic)

### 8.3 Responsive Design
- Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)
- Touch interactions: drag-and-drop, tap, swipe
- Landscape mode supported on tablet

---

## 9. Audio Requirements

Follows the architecture in `audio_generation_pipeline.md`:

- **Voice:** ElevenLabs Alice (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`
- **Pre-generation:** All scripted narration pre-generated and stored in `/public/assets/audio/`
- **Mapping:** `audioMap.js` for zero-latency exact-text lookup
- **Playback:** Eager preloading of segment `i+1` while playing segment `i`
- **Style mapping:** Wonder→`question`, Story→`statement`/`emphasis`, Simulate→`instruction`/`thinking`, Play→`encouragement`/`celebration`, Reflect→`thinking`
- **UI control:** Speaker icon (top-right) to mute/unmute; persists across session

---

## 10. Out of Scope

- Multi-language support (v1 English only)
- Teacher dashboard (separate product)
- Offline mode / PWA
- Parent accounts
- Numbers beyond 10,000
- Negative numbers or decimals

---

## 11. Dependencies & Integrations

| Dependency | Purpose |
|-----------|---------|
| ElevenLabs API | Audio narration generation |
| React + Vite | Frontend framework |
| Framer Motion | Animations |
| Intellia SG CDN | Asset hosting |
| intelliasg.com/courses/grade-3-math | Deployment target |

---

## 12. Timeline (Suggested)

| Milestone | Duration |
|-----------|----------|
| Design mockups + component library | Week 1–2 |
| Phase 1 (Wonder) development | Week 2 |
| Phase 2 (Story) development | Week 3 |
| Phase 3 (Simulate) development | Week 3–4 |
| Phase 4 (Play) development | Week 4–5 |
| Phase 5 (Reflect) development | Week 5 |
| Audio generation + mapping | Week 5 |
| QA, accessibility audit | Week 6 |
| Deployment to intelliasg.com | Week 6–7 |
