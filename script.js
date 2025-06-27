let currentQuestions = [];
let usedHints = new Set();
let seed = null;
let rng = null;
let selectedWeeks = [];

// Haal de seed en de geselecteerde weken op uit de URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const wrongIdsParam = params.get('wrongIds');
  let filterWrongIds = null;

  if (wrongIdsParam) {
    filterWrongIds = decodeURIComponent(wrongIdsParam).split(',');
  }
  const seed = params.get('seed');

  // De seed bevat zowel de basiswaarde als de weekinformatie
  const [baseSeed, weekFlags] = seed.split('-').map(Number);

  // Decodeer de weekinformatie
  const weeks = [];
  for (let i = 0; i < 9; i++) {  // nu 7 bits i.p.v. 6
    if (weekFlags & (1 << i)) {
  if (i === 6) {
    weeks.push('week2theorie'); // bestaande mapping
  } else if (i === 7) {
    weeks.push('week6theorie'); // nieuwe mapping
  } else if (i === 8) {
    weeks.push('week1theorie'); // nieuwe mapping
  } else {
    weeks.push(`week${i + 1}`);
  }
}

  }


  return { seed: baseSeed, weeks };
}

// Deterministische RNG op basis van seed (Mulberry32)
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Genereer de vragen voor de geselecteerde weken
function generateQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  document.getElementById('score').textContent = '';
  document.getElementById('seed-info').textContent = `Toetscode (seed): ${seed}`;

  // Voeg de vragen toe voor de geselecteerde weken
  let questions = [];
  if (selectedWeeks.includes('week1')) {
    questions = questions.concat(generateWeek1Questions()); // Voeg week 1 vragen toe
  }
  if (selectedWeeks.includes('week1theorie')) {
    questions = questions.concat(generateWeek1TheoryQuestions()); // Voeg week 1 theorie vragen toe
  }
  if (selectedWeeks.includes('week2')) {
    questions = questions.concat(generateWeek2Questions()); // Voeg week 2 vragen toe
  }
  if (selectedWeeks.includes('week2theorie')) {
    questions = questions.concat(generateWeek2TheoryQuestions());
  }
  if (selectedWeeks.includes('week3')) {
    questions = questions.concat(generateWeek3Questions()); // Voeg week 3 vragen toe
  }
  if (selectedWeeks.includes('week4')) {
    questions = questions.concat(generateWeek4Questions()); // Voeg week 4 vragen toe
  }
  if (selectedWeeks.includes('week5')) {
    questions = questions.concat(generateWeek5Questions()); // Voeg week 5 vragen toe
  }
  if (selectedWeeks.includes('week6')) {
    questions = questions.concat(generateWeek6Questions()); // Voeg week 6 vragen toe
  }
  if (selectedWeeks.includes('week6theorie')) {
    questions = questions.concat(generateWeek6TheoryQuestions());
  }

  questions = questions.map((q, i) => ({ ...q, originalIndex: i }));
  shuffleArray(questions);


  currentQuestions = questions;
  
  currentQuestions.forEach((q, index) => {
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

// Controleer de gegeven antwoorden en geef feedback
let scoreVisible = false;

function checkAnswers() {
  const scoreElement = document.getElementById('score');

  // Toggle: als score al zichtbaar is, verberg alles en stop hier
  if (scoreVisible) {
    currentQuestions.forEach((_, index) => {
      document.getElementById(`feedback-${index}`).textContent = '';
    });
    scoreElement.textContent = '';
    scoreVisible = false;
    return;
  }

  let score = 0;

  currentQuestions.forEach((q, index) => {
    const userInput = document.getElementById(`q${index}`).value.trim();
    const inputField = document.getElementById(`q${index}`);
    const parentDiv = inputField.parentElement;

    const feedback = document.getElementById(`feedback-${index}`);
    let isCorrect = false;

    if (q.binaryAnswer !== undefined) {
      isCorrect = userInput === q.binaryAnswer;
    } else if (Array.isArray(q.correctAnswers)) {
      isCorrect = q.correctAnswers.some(correct =>
  typeof correct === 'string'
    ? correct.toLowerCase() === userInput.toLowerCase()
    : String(correct).toLowerCase() === userInput.toLowerCase()
);

    } else {
      isCorrect = userInput.toLowerCase() === q.answer.toString().toLowerCase();
    }

    if (isCorrect) {
      feedback.style.color = 'green';
      feedback.textContent = '✔️ Correct beantwoord';
      score++;
    } else {
      feedback.style.color = 'red';
      const correctAnswer = q.binaryAnswer !== undefined ? q.binaryAnswer : (Array.isArray(q.correctAnswers) ? q.correctAnswers.join(' / ') : q.answer);
      feedback.innerHTML = `❌ Fout. Het juiste antwoord is: ${correctAnswer}<br>${q.explanation || ''}`;
    }

    parentDiv.appendChild(feedback);
  });

  scoreElement.textContent = `Je score: ${score} van de ${currentQuestions.length}`;

const total = currentQuestions.length;
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
scoreElement.appendChild(gradeElement);




  scoreVisible = true;

  // Scroll naar de score
  scoreElement.scrollIntoView({ behavior: 'smooth' });

  // ❗ Knop toevoegen voor heroefening van foute vragen
  const buttonContainer = document.getElementById('retry-button-container') || document.createElement('div');
  buttonContainer.id = 'retry-button-container';
  buttonContainer.innerHTML = ''; // reset vorige inhoud

  const retryButton = document.createElement('button');
  retryButton.textContent = 'Oefen fout beantwoorde vragen opnieuw';
  retryButton.style.marginTop = '1rem';
  retryButton.onclick = () => regenerateFromWrongAnswers();

  // Alleen tonen als er fouten zijn
  if (score < currentQuestions.length) {
    buttonContainer.appendChild(retryButton);
    scoreElement.appendChild(buttonContainer);
  }
}

function regenerateQuiz() {
  // Genereer een nieuwe seed (zonder de weken te veranderen)
  const newSeed = Math.floor(Math.random() * 1_000_000);  // Nieuwe willekeurige seed

  // Verkrijg de weekinformatie uit de huidige URL
  const weekFlags = getWeekFlagsFromWeeks(selectedWeeks);  // Weekinformatie behouden

  // Stel de nieuwe URL in met de nieuwe seed en dezelfde weekinformatie
  window.location.search = `?seed=${newSeed}-${weekFlags}`;
}

// Functie om de weekinformatie om te zetten naar een bitstring (zoals in de seed-generatie)
function getWeekFlagsFromWeeks(weeks) {
  let weekFlags = 0;
  weeks.forEach(week => {
    if (week === 'week1') weekFlags |= 1 << 0;
    if (week === 'week2') weekFlags |= 1 << 1;
    if (week === 'week3') weekFlags |= 1 << 2;
    if (week === 'week4') weekFlags |= 1 << 3;
    if (week === 'week5') weekFlags |= 1 << 4;
    if (week === 'week6') weekFlags |= 1 << 5;
    if (week === 'week2theorie') weekFlags |= 1 << 6; // Nieuwe week 2 theorie
    if (week === 'week6theorie') weekFlags |= 1 << 7; // Nieuwe week 6 theorie
    if (week === 'week1theorie') weekFlags |= 1 << 8; // Nieuwe week 1 theorie
  });
  return weekFlags;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initializeer de pagina en zorg ervoor dat de seed correct wordt gebruikt
window.onload = () => {
  const { seed: urlSeed, weeks } = getQueryParams();
  seed = parseInt(urlSeed) || Math.floor(Math.random() * 1_000_000);
  rng = mulberry32(seed);

  // Zet de seed in de URL als deze nog niet aanwezig is
  if (!urlSeed) {
    window.history.replaceState(null, '', `?seed=${seed}`);
  }

  selectedWeeks = weeks;
  generateQuiz();
};

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
  const q = currentQuestions[index];
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
    correct = input.toLowerCase() === String(q.answer).toLowerCase();
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

  currentQuestions.forEach((q, index) => {
    const input = document.getElementById(`q${index}`).value.trim();
    let correct = false;

    if (q.binaryAnswer !== undefined) {
      correct = input === q.binaryAnswer;
    } else if (Array.isArray(q.correctAnswers)) {
  correct = q.correctAnswers.some(ans => 
    String(ans).toLowerCase() === input.toLowerCase()
  );
} else {
  correct = input.toLowerCase() === String(q.answer).toLowerCase();
}

    if (!correct) wrongIndices.push(q.originalIndex);
  });

  if (wrongIndices.length === 0) {
    alert('Alle antwoorden zijn correct beantwoord!');
    return;
  }

  // Encodeer foute vraag-id's in de URL
  const newSeed = Math.floor(Math.random() * 1_000_000);
  const weekFlags = getWeekFlagsFromWeeks(selectedWeeks);
const encodedIndices = wrongIndices.join(',');
const newURL = `advancedquiz.html?seed=${newSeed}&indices=${encodedIndices}`;
window.location.href = newURL;

}



function updateHintCounter() {
  const counter = document.getElementById('hint-counter');
  if (counter) {
    const total = (typeof selectedQuestions !== 'undefined' ? selectedQuestions : currentQuestions).length;
    counter.textContent = `${usedHints.size} / ${total} hints gebruikt`;
  }
}
