let rng, selectedQuestions = [];
let originalIndices = [];
let usedHints = new Set();
let scoreVisible = false; // <== toggle status


function getParams() {
  const params = new URLSearchParams(window.location.search);
  const seed = parseInt(params.get("seed")) || Math.floor(Math.random() * 1_000_000);
  const indices = (params.get("indices") || "").split(",").map(Number).filter(n => !isNaN(n));
  return { seed, indices };
}

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function loadAllQuestions() {
  return [
    ...generateWeek1Questions(),
    ...generateWeek1TheoryQuestions(),
    ...generateWeek2Questions(),
    ...generateWeek2TheoryQuestions(),
    ...generateWeek3Questions(),
    ...generateWeek4Questions(),
    ...generateWeek5Questions(),
    ...generateWeek6Questions(),
    ...generateWeek6TheoryQuestions()
  ];
}

function generateQuiz() {
  const { seed, indices } = getParams();
  rng = mulberry32(seed);
  const allQuestions = loadAllQuestions();

  // Shuffle indices met de seed
  const indicesShuffled = [...indices];
  for (let i = indicesShuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indicesShuffled[i], indicesShuffled[j]] = [indicesShuffled[j], indicesShuffled[i]];
  }

  // Sla originele indices (vóór shufflen) op om bijv. regenerateFromWrongAnswers te laten werken
  selectedQuestions = [];
  originalIndices = [];

  indicesShuffled.forEach(i => {
    if (allQuestions[i]) {
      selectedQuestions.push(allQuestions[i]);
      originalIndices.push(i);
    }
  });

  document.getElementById('seed-info').textContent = `Toetscode (seed): ${seed}`;
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  selectedQuestions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `
      <label for="q${index}"><strong>Vraag ${index + 1}:</strong> ${q.label}</label><br>
      <input type="text" id="q${index}" />
      ${q.hint ? `<button type="button" onclick="showHint(${index})">Toon hint</button>` : ''}
      <button type="button" onclick="checkSingleAnswer(${index})">Controleer vraag</button>
      <div class="hint" id="hint-${index}" style="margin-top: 0.5em; color: #555;"></div>
      <div class="feedback" id="feedback-${index}" style="min-height: 2em;"></div>
    `;
    container.appendChild(div);
  });
}


function checkAnswers() {
  const scoreElement = document.getElementById('score');
  
  if (scoreVisible) {
    // Tweede klik: reset feedback en scroll terug
    selectedQuestions.forEach((_, index) => {
      document.getElementById(`feedback-${index}`).textContent = '';
    });
    scoreElement.textContent = '';
    
    scoreVisible = false;
    return;
  }

  let score = 0;
  selectedQuestions.forEach((q, index) => {
    const input = document.getElementById(`q${index}`).value.trim();
    const feedback = document.getElementById(`feedback-${index}`);
    let correct = false;

    if (q.binaryAnswer !== undefined) {
      correct = input === q.binaryAnswer;
    } else if (Array.isArray(q.correctAnswers)) {
      correct = q.correctAnswers.some(ans => 
  String(ans).toLowerCase() === input.toLowerCase()
);

    } else {
      correct = input.toLowerCase() === q.answer.toString().toLowerCase();
    }

    if (correct) {
      feedback.style.color = 'green';
      feedback.textContent = '✔️ Correct beantwoord';
      score++;
    } else {
      feedback.style.color = 'red';
      const correctAnswer = q.binaryAnswer || (Array.isArray(q.correctAnswers) ? q.correctAnswers.join(' / ') : q.answer);
      feedback.innerHTML = `❌ Fout. Het juiste antwoord is: ${correctAnswer}<br>${q.explanation || ''}`;
    }
  });

  document.getElementById('score').textContent = `Je score: ${score} van de ${selectedQuestions.length}`;


const total = selectedQuestions.length;
const ignored = Math.floor(total * 0.25);  // Eerste 25% telt niet mee
const relevant = total - ignored;
const correctRelevant = Math.max(0, score - ignored);

// Percentage van relevante vragen
const percentage = relevant > 0 ? correctRelevant / relevant : 0;

// Cijferberekening
let grade;
if (percentage <= 0.55) {
  // Tussen 1,0 en 5,5 → lineair
  grade = 1.0 + (percentage / 0.55) * (5.5 - 1.0);
} else {
  // Tussen 5,5 en 10 → lineair
  grade = 5.5 + ((percentage - 0.55) / (1.0 - 0.55)) * (10 - 5.5);
}

// Truncate grade to 1 decimal
grade = Math.floor(grade * 10) / 10;

// Toon het cijfer
const gradeElement = document.createElement('div');
gradeElement.textContent = `Cijfer: ${grade.toFixed(1)}`;
gradeElement.style.marginTop = '0.5em';
gradeElement.style.fontWeight = 'bold';
  document.getElementById('score').appendChild(gradeElement);

  
  // Voeg retry-knop toe
const retryContainer = document.getElementById('retry-button-container') || document.createElement('div');
retryContainer.id = 'retry-button-container';
retryContainer.innerHTML = ''; // reset eerdere inhoud

if (score < selectedQuestions.length) {
  const retryButton = document.createElement('button');
  retryButton.textContent = 'Oefen fout beantwoorde vragen opnieuw';
  retryButton.style.marginTop = '1em';
  retryButton.onclick = regenerateFromWrongAnswers;
  retryContainer.appendChild(retryButton);
}

    scoreElement.scrollIntoView({ behavior: 'smooth' });

document.getElementById('score').appendChild(retryContainer);

  scoreVisible = true;

}

window.onload = generateQuiz;

function regenerateQuiz() {
  const params = new URLSearchParams(window.location.search);
  const oldIndices = params.get("indices");
  if (!oldIndices) return;

  const indexArray = oldIndices.split(',').map(Number).filter(n => !isNaN(n));
  
  // Genereer een nieuwe seed
  const newSeed = Math.floor(Math.random() * 1_000_000);
  const rng = mulberry32(newSeed);

  // Shuffle de indices deterministisch op basis van de nieuwe seed
  for (let i = indexArray.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
  }

  // Genereer nieuwe URL met dezelfde indices (gehusseld) en nieuwe seed
  const newIndices = indexArray.join(',');
  window.location.search = `?seed=${newSeed}&indices=${newIndices}`;
}




function showHint(index) {
  const hintContainer = document.getElementById(`hint-${index}`);
  const question = (typeof selectedQuestions !== 'undefined' ? selectedQuestions : currentQuestions)[index];

  if (hintContainer.innerHTML) {
    // Hint is al zichtbaar, verberg hem
    hintContainer.innerHTML = '';
  } else if (question && question.hint) {
    // Toon de hint en registreer hintgebruik
    hintContainer.innerHTML = `<em>Hint:</em> ${question.hint}`;
    
    if (!usedHints.has(index)) {
      usedHints.add(index);
      updateHintCounter();
    }
  }
}


function checkSingleAnswer(index) {
  const q = selectedQuestions[index] || currentQuestions[index];
  const input = document.getElementById(`q${index}`).value.trim();
  const feedback = document.getElementById(`feedback-${index}`);
  
  if (feedback.innerHTML) {
    feedback.innerHTML = '';
    return;
  }
  
  let correct = false;

  if (q.binaryAnswer !== undefined) {
    correct = input === q.binaryAnswer;
  } else if (Array.isArray(q.correctAnswers)) {
      correct = q.correctAnswers.some(ans => 
    String(ans).toLowerCase() === input.toLowerCase()
  );

  } else {
    correct = input.toLowerCase() === q.answer.toString().toLowerCase();
  }

  if (correct) {
    feedback.style.color = 'green';
    feedback.textContent = '✔️ Correct beantwoord';
  } else {
    feedback.style.color = 'red';
    const correctAnswer = q.binaryAnswer !== undefined
      ? q.binaryAnswer
      : (Array.isArray(q.correctAnswers) ? q.correctAnswers.join(' / ') : q.answer);
    feedback.innerHTML = `❌ Fout. Het juiste antwoord is: ${correctAnswer}<br>${q.explanation || ''}`;
  }
}

function regenerateFromWrongAnswers() {
const wrongIndices = [];

selectedQuestions.forEach((q, index) => {
  const input = document.getElementById(`q${index}`).value.trim();
  let correct = false;

  if (q.binaryAnswer !== undefined) {
    correct = input === q.binaryAnswer;
  } else if (Array.isArray(q.correctAnswers)) {
        correct = q.correctAnswers.some(ans => 
      String(ans).toLowerCase() === input.toLowerCase()
    );

  } else {
    correct = input.toLowerCase() === q.answer.toString().toLowerCase();
  }

  if (!correct) {
    wrongIndices.push(originalIndices[index]); // Gebruik originele index i.p.v. shuffled index
  }
});


  if (wrongIndices.length === 0) {
    alert('Alle antwoorden zijn correct beantwoord!');
    return;
  }

  const newSeed = Math.floor(Math.random() * 1_000_000);
  const newIndices = wrongIndices.join(',');
  const url = `advancedquiz.html?seed=${newSeed}&indices=${newIndices}`;
  window.location.href = url;
}


function updateHintCounter() {
  const counter = document.getElementById('hint-counter');
  if (counter) {
    const total = (typeof selectedQuestions !== 'undefined' ? selectedQuestions : currentQuestions).length;
    counter.textContent = `${usedHints.size} / ${total} hints gebruikt`;
  }
}
