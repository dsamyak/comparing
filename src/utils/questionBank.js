import seedrandom from 'seedrandom';

export function createQuestionEngine(seed = Date.now()) {
  const rng = seedrandom(seed);
  return {
    randomInt: (min, max) => Math.floor(rng() * (max - min + 1)) + min,
    randomChoice: (arr) => arr[Math.floor(rng() * arr.length)],
    shuffle: (arr) => [...arr].sort(() => rng() - 0.5),
  };
}

function levelRange(level) {
  return level === 1 ? { min: 100,  max: 999  }
       : level === 2 ? { min: 1000, max: 4999 }
       :               { min: 5000, max: 9999 };
}

function generateUniqueNumbers(count, range, engine) {
  const nums = new Set();
  while(nums.size < count) {
    nums.add(engine.randomInt(range.min, range.max));
  }
  return Array.from(nums);
}

// Type 1: Binary Compare
export function generateBinaryCompare(level, engine) {
  const range = levelRange(level);
  const [a, b] = generateUniqueNumbers(2, range, engine);
  return {
    type: 'binary_compare',
    question: `Compare these two numbers: ${a} and ${b}`,
    numA: a,
    numB: b,
    answer: a > b ? '>' : '<', // Since they are unique, they are never equal
    options: ['<', '>', '='],
  };
}

// Type 2: Order Set
export function generateOrderSet(level, engine) {
  const range = levelRange(level);
  const count = level === 3 ? 5 : level === 2 ? 4 : 3;
  const direction = engine.randomChoice(['ascending', 'descending']);
  const nums = generateUniqueNumbers(count, range, engine);
  const answerArr = direction === 'ascending' ? [...nums].sort((a,b) => a-b) : [...nums].sort((a,b) => b-a);
  
  // Format as strings for options to make it multiple choice, 
  // or return the raw numbers if we use a drag-and-drop component.
  // We'll use a multiple choice for simplicity in PlayPhase to match reference.
  const correctAnswer = answerArr.join(', ');
  
  // Distractors
  const distractor1 = [...nums].sort((a,b) => engine.randomChoice([-1, 1])).join(', ');
  const distractor2 = direction === 'ascending' ? [...nums].sort((a,b) => b-a).join(', ') : [...nums].sort((a,b) => a-b).join(', ');
  
  // Ensure distractors are unique
  const optionsSet = new Set([correctAnswer, distractor1, distractor2]);
  while(optionsSet.size < 3) {
      optionsSet.add(engine.shuffle([...nums]).join(', '));
  }

  return {
    type: 'order_set',
    question: `Arrange these numbers from ${direction === 'ascending' ? 'least to greatest' : 'greatest to least'}:\n${nums.join(', ')}`,
    answer: correctAnswer,
    options: engine.shuffle(Array.from(optionsSet)),
  };
}

// Type 3: Word Problem
export function generateWordProblem(level, engine) {
  const names = ['John', 'Sarah', 'Mike', 'Priya', 'Lena', 'Omar', 'Aiko', 'Carlos', 'Emma', 'Ravi'];
  const [nameA, nameB] = engine.shuffle([...names]).slice(0, 2);
  const range = levelRange(level);
  const [a, b] = generateUniqueNumbers(2, range, engine);
  const templates = [
    `${nameA} has ${a} space credits. ${nameB} has ${b} space credits. Who has more?`,
    `${nameA}'s rocket flew ${a} miles. ${nameB}'s rocket flew ${b} miles. Which rocket flew further?`,
    `${nameA} collected ${a} star gems. ${nameB} collected ${b} star gems. Who has the bigger collection?`,
  ];
  const q = engine.randomChoice(templates);
  const answer = a > b ? nameA : nameB;
  return {
    type: 'word_problem',
    question: q,
    answer: answer,
    options: engine.shuffle([nameA, nameB, 'They are equal']),
  };
}

export function generateQuestion(level, seed) {
  const engine = createQuestionEngine(seed || Date.now());
  const r = engine.randomInt(1, 100);
  
  if (level === 1) {
    return generateBinaryCompare(level, engine); // mostly binary compare for level 1
  } else if (level === 2) {
    if (r < 50) return generateBinaryCompare(level, engine);
    else if (r < 80) return generateOrderSet(level, engine);
    else return generateWordProblem(level, engine);
  } else {
    if (r < 30) return generateBinaryCompare(level, engine);
    else if (r < 70) return generateOrderSet(level, engine);
    else return generateWordProblem(level, engine);
  }
}

export function generateSessionQuestions() {
  const questions = [];
  // 3 worlds, 10 questions each
  for (let w = 0; w < 3; w++) {
    const level = w + 1;
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion(level, Date.now() + w * 100 + i);
      q.world = w;
      q.explanation = q.type === 'binary_compare' ? `Compare the highest place values first.` :
                      q.type === 'order_set' ? `Check the thousands, then hundreds, tens, and ones.` :
                      `Look closely at the numbers to find the bigger one.`;
      questions.push(q);
    }
  }
  return questions;
}
