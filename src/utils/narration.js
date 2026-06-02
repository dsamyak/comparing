// ──────────────────────────────────────────────────
// Narration Scripts — Comparing & Ordering Numbers
// ──────────────────────────────────────────────────

import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// ─── INTRO SCREEN ────────────────────────────────
export function introNarration() {
  return [
    cheer("Welcome to the Great Sky Race!"),
    say("Today, we are going to learn how to compare and order large numbers."),
    ask("Who gets to launch first? Let us find out!"),
    cheer("Are you ready to explore space and solve some fun challenges? Let us get started on our learning journey!"),
  ];
}

// ─── WONDER PHASE ────────────────────────────────
export function wonderNarration() {
  return [
    ask("Which rocket has more fuel?"),
    say("Mission Control says only the bigger number gets to launch!"),
  ];
}

export function wonderDiscoverNarration() {
  return [];
}

// ─── STORY PHASE ─────────────────────────────────
export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say("Sarah's fuel reads 3,847. John's reads 4,219. Mission Control announces only the pilot with the bigger number gets to launch!"),
        ask("Which is bigger: 3,847 or 4,219?"),
        say("We have to compare the numbers!"),
      ];
    case 1:
      return [
        say('Mike the fuel engineer says "Bigger number equals more fuel equals longer flight!"'),
        ask("But how do you know which is bigger when the numbers are so huge?"),
        say("Hmm... maybe we look at the digits?"),
      ];
    case 2:
      return [
        say("Priya pulls up the Place Value Ladder! She compares the THOUSANDS digit first."),
        emphasize("4 thousands is more than 3 thousands. John wins!"),
      ];
    case 3:
      return [
        say("But wait! Lena, Omar, and Aiko also want to race! Now we have to order all their fuel readings from least to greatest."),
        emphasize("We can use the ladder again!"),
      ];
    case 4:
      return [
        say("Using the Place Value Ladder, Mission Control orders all the rockets."),
        emphasize("The race begins and the rockets blast off into space!"),
      ];
    default:
      return [];
  }
}

// ─── SIMULATE PHASE ──────────────────────────────
export function simulateStation1Intro() {
  return [
    instruct("Adjust the dials to change the fuel numbers. Watch the ladder!"),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Drag the rocket to land close to the target!"),
  ];
}

export function simulateStation3Intro() {
  return [
    ask("Drag the cards to order them!"),
  ];
}

export function simulateAllComplete() {
  return [];
}

// ─── PLAY PHASE ──────────────────────────────────
export function playWorldIntro(worldName) {
  return [
    celebrate(`Welcome to ${worldName}!`),
  ];
}

export function playReadQuestion(questionText) {
  return [
    say(questionText),
  ];
}

export function playCorrectNarration(streak = 0) {
  return [];
}

export function playWrongNarration() {
  return [];
}

export function playWorldComplete(worldName, score, total) {
  return [
    say(`${worldName} Complete!`),
    say(`Score: ${score} out of ${total}`),
  ];
}

// ─── REFLECT PHASE ───────────────────────────────
export function reflectIntroNarration() {
  return [
    ask("What did you learn about comparing numbers?"),
  ];
}

export function reflectCorrectNarration() {
  return [];
}

export function reflectWrongNarration() {
  return [];
}

export function reflectConfidenceNarration() {
  return [
    ask("How confident do you feel about comparing numbers?"),
  ];
}

export function reflectCertificateNarration(pct) {
  return [
    say(`You scored ${Math.round(pct)}%`),
  ];
}

