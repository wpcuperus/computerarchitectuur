const seed = 123456;
const rng = mulberry32(seed);

// RNG functie
function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffle functie
function shuffleArray(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Genereer alle vragen
function generateAllQuestions() {
  let all = [];

  all = all.concat(generateWeek1Questions());
  all = all.concat(generateWeek1TheoryQuestions());
  all = all.concat(generateWeek2Questions());
  all = all.concat(generateWeek2TheoryQuestions());
  all = all.concat(generateWeek3Questions());
  all = all.concat(generateWeek4Questions());
  all = all.concat(generateWeek5Questions());
  all = all.concat(generateWeek6Questions());
  all = all.concat(generateWeek6TheoryQuestions());

  return all;
}

// Verwerk de vragen en toon ze
window.onload = function () {
  const rng = mulberry32(seed);
  let questions = generateAllQuestions();

  // Sorteer op basis van oorspronkelijke volgorde voor consistentie
  questions = questions.map((q, i) => ({ ...q, originalIndex: i }));
  shuffleArray(questions, rng); // Deterministische shuffle
  questions.sort((a, b) => a.originalIndex - b.originalIndex); // Of: laat geshuffled staan

  const container = document.getElementById('export-container');

  const table = document.createElement('table');
  table.style.width = '100%';
  table.border = '1';
  const headerRow = table.insertRow();
  ['#', 'Vraag', 'Antwoord'].forEach(h => {
    const cell = headerRow.insertCell();
    cell.innerHTML = `<strong>${h}</strong>`;
  });

  questions.forEach((q, index) => {
    const row = table.insertRow();

    const vraagText = q.label || '(geen label)';
    const answer = q.binaryAnswer ??
                   (Array.isArray(q.correctAnswers) ? q.correctAnswers.join(' / ') : q.answer);

    row.insertCell().textContent = index + 1;
    row.insertCell().innerHTML = vraagText;
    row.insertCell().textContent = answer;
  });

  container.appendChild(table);
};
