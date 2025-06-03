let rng, selectedQuestions = [];

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
    ...generateWeek2Questions(),
    ...generateWeek2TheoryQuestions(),
    ...generateWeek3Questions(),
    ...generateWeek4Questions(),
    ...generateWeek5Questions(),
    ...generateWeek6Questions()
  ];
}

function generateQuiz() {
  const { seed, indices } = getParams();
  rng = mulberry32(seed);
  const allQuestions = loadAllQuestions();
  selectedQuestions = indices.map(i => allQuestions[i]).filter(Boolean);

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
  let score = 0;
  selectedQuestions.forEach((q, index) => {
    const input = document.getElementById(`q${index}`).value.trim();
    const feedback = document.getElementById(`feedback-${index}`);
    let correct = false;

    if (q.binaryAnswer !== undefined) {
      correct = input === q.binaryAnswer;
    } else if (Array.isArray(q.correctAnswers)) {
      correct = q.correctAnswers.some(ans => ans.toLowerCase() === input.toLowerCase());
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
}

window.onload = generateQuiz;

function regenerateQuiz() {
  const params = new URLSearchParams(window.location.search);
  const seed = Math.floor(Math.random() * 1_000_000); // nieuw seed
  const indices = params.get("indices");

  // Zorg ervoor dat indices geldig zijn
  if (!indices) {
    alert("Geen vragen geselecteerd.");
    return;
  }

  // Redirect met nieuw seed maar dezelfde indices
  window.location.href = `advancedquiz.html?seed=${seed}&indices=${indices}`;
}

function showHint(index) {
  const hintContainer = document.getElementById(`hint-${index}`);
  const question = selectedQuestions[index];
  if (hintContainer.innerHTML) {
    // Hint is al zichtbaar, verberg hem
    hintContainer.innerHTML = '';
  } else if (question && question.hint) {
    // Toon de hint
    hintContainer.innerHTML = `<em>Hint:</em> ${question.hint}`;
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
    correct = q.correctAnswers.some(ans => ans.toLowerCase() === input.toLowerCase());
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
