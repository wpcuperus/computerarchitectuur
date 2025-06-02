let rng = mulberry32(Date.now());
let allQuestions = [];

// Laad alle vragen
function loadAllQuestions() {
  allQuestions = [
    ...generateWeek1Questions().map(q => ({ ...q, week: 'week1' })),
    ...generateWeek2Questions().map(q => ({ ...q, week: 'week2' })),
    ...generateWeek2TheoryQuestions().map(q => ({ ...q, week: 'week2theorie' })),
    ...generateWeek3Questions().map(q => ({ ...q, week: 'week3' })),
    ...generateWeek4Questions().map(q => ({ ...q, week: 'week4' })),
    ...generateWeek5Questions().map(q => ({ ...q, week: 'week5' })),
    ...generateWeek6Questions().map(q => ({ ...q, week: 'week6' })),
  ];
}

// Toon de checkboxen
function displayQuestionSelection() {
  const container = document.getElementById('question-selection');
  container.innerHTML = '';

  const grouped = {};

  // Groepeer vragen per week
  allQuestions.forEach((q, index) => {
    if (!grouped[q.week]) {
      grouped[q.week] = [];
    }
    grouped[q.week].push({ ...q, index });
  });

  const sortedWeeks = Object.keys(grouped).sort();

  const weekLabels = {
    week1: "Week 1: Intro en Talstelsels (sommen)",
    week2: "Week 2: Geheugenrepresentatie (sommen)",
    week2theorie: "Week 2 - Geheugenrepresentatie (theorie)",
    week3: "Week 3: Logische schakelingen (theorie)",
    week4: "Week 4: Basic Assembly (theorie)",
    week5: "Week 5: Advanced Assembly (theorie)",
    week6: "Week 6: Processor en optimalisatie (theorie)"
  };

  // Globale selecteer alles checkbox
  const selectAllDiv = document.createElement('div');
  selectAllDiv.innerHTML = `
    <label>
      <input type="checkbox" id="select-all" checked />
      <strong>Selecteer alles</strong>
    </label>
  `;
  container.appendChild(selectAllDiv);

  document.getElementById('select-all').addEventListener('change', (e) => {
    const checked = e.target.checked;
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = checked;
    });
  });

  // Per week
  sortedWeeks.forEach(week => {
    const section = document.createElement('div');
    section.className = 'week-section';

    const weekId = `toggle-${week}`;
    const weekHeader = document.createElement('h2');
    weekHeader.innerHTML = `
      <label>
        <input type="checkbox" id="${weekId}" checked />
        ${weekLabels[week] || week}
      </label>
    `;
    section.appendChild(weekHeader);

    // Vragen per week
grouped[week].forEach(({ title, index }) => {
  const div = document.createElement('div');
  div.className = 'question-select';
  div.innerHTML = `
    <label>
      <input type="checkbox" data-index="${index}" checked class="week-checkbox-${week}" />
      ${title}
    </label>
  `;
  section.appendChild(div);
});

    container.appendChild(section);

    // Event handler voor week checkbox
    document.getElementById(weekId).addEventListener('change', (e) => {
      const checked = e.target.checked;
      section.querySelectorAll(`.week-checkbox-${week}`).forEach(cb => {
        cb.checked = checked;
      });
    });
  });
}



function generateCustomQuiz() {
  const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  const selectedIndices = selected.map(cb => parseInt(cb.dataset.index));

  if (selectedIndices.length === 0) {
    alert("Selecteer minstens één vraag om door te gaan.");
    return;
  }

  // Encodeer geselecteerde indices in de URL
  const seed = Math.floor(Math.random() * 1_000_000);
  const indicesParam = selectedIndices.join(',');
  window.location.href = `advancedquiz.html?seed=${seed}&indices=${indicesParam}`;
}


function checkCustomAnswers(questions) {
  let score = 0;

  questions.forEach((q, index) => {
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

  document.getElementById('score').textContent = `Je score: ${score} van de ${questions.length}`;
}

// Mulberry32 RNG
function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Init
window.onload = () => {
  loadAllQuestions();
  displayQuestionSelection();
  document.getElementById('generate-button').onclick = generateCustomQuiz;
};
