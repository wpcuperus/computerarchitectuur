let rng = mulberry32(Date.now());
let allQuestions = [];

function loadAllQuestions() {
  allQuestions = [
    ...generateWeek1Questions().map(q => ({ ...q, week: 'week1' })),
    ...generateWeek2Questions().map(q => ({ ...q, week: 'week2' })),
    ...generateWeek2TheoryQuestions().map(q => ({ ...q, week: 'week2theorie' })),
    ...generateWeek3Questions().map(q => ({ ...q, week: 'week3' })),
    ...generateWeek4Questions().map(q => ({ ...q, week: 'week4' })),
    ...generateWeek5Questions().map(q => ({ ...q, week: 'week5' })),
    ...generateWeek6Questions().map(q => ({ ...q, week: 'week6' })),
    ...generateWeek6TheoryQuestions().map(q => ({ ...q, week: 'week6theorie' }))
  ];
}

function shuffleArray(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function getUniqueCategories() {
  const categorySet = new Set();
  allQuestions.forEach(q => {
    if (Array.isArray(q.categories)) {
      q.categories.forEach(cat => categorySet.add(cat));
    }
  });
  return Array.from(categorySet).sort();
}

function displayQuestionSelection() {
  const container = document.getElementById('question-selection');
  container.innerHTML = '';

  // Categorie-filter als dropdown
  const uniqueCategories = getUniqueCategories();
  const filterDetails = document.createElement('details');
  filterDetails.id = 'category-filter';
  filterDetails.open = false; // standaard ingeklapt
  filterDetails.innerHTML = `
    <summary style="font-weight: bold; cursor: pointer; margin-bottom: 0.5rem;">Filter op categorieën</summary>
    <div style="margin-bottom: 0.5rem;">
      <label><input type="checkbox" id="select-all-categories" checked /> Selecteer alle categorieën</label>
    </div>
  `;
  const catContainer = document.createElement('div');
  catContainer.className = 'category-filter-container';
  catContainer.style.marginBottom = '0.5rem';

  uniqueCategories.forEach(cat => {
    const label = document.createElement('label');
    label.className = 'category-checkbox';
    label.style.display = 'block';
    label.innerHTML = `
      <input type="checkbox" class="category-filter" value="${cat}" checked />
      ${cat}
    `;
    catContainer.appendChild(label);
  });

  filterDetails.appendChild(catContainer);
  container.appendChild(filterDetails);

  document.getElementById('select-all-categories').addEventListener('change', (e) => {
    const checked = e.target.checked;
    document.querySelectorAll('.category-filter').forEach(cb => {
      cb.checked = checked;
    });
    filterQuestionsByCategory();
  });

  container.querySelectorAll('.category-filter').forEach(cb => {
    cb.addEventListener('change', () => filterQuestionsByCategory());
  });

  const grouped = {};
  allQuestions.forEach((q, index) => {
    if (!grouped[q.week]) grouped[q.week] = [];
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
    week6: "Week 6: Processor en optimalisatie (sommen)",
    week6theorie: "Week 6: Processor en optimalisatie (theorie)"
  };

  const questionListTitle = document.createElement('h3');
  questionListTitle.textContent = 'Selecteer de vragen:';
  questionListTitle.style.marginTop = '2rem';
  container.appendChild(questionListTitle);

  const selectAllDiv = document.createElement('div');
  selectAllDiv.innerHTML = `
    <label>
      <input type="checkbox" id="select-all" checked />
      Selecteer alle vragen
    </label>
  `;
  container.appendChild(selectAllDiv);

  document.getElementById('select-all').addEventListener('change', (e) => {
    const checked = e.target.checked;
    container.querySelectorAll('input[type="checkbox"][data-index]').forEach(cb => {
      cb.checked = checked;
    });
    const allWeeks = Array.from(new Set(allQuestions.map(q => q.week)));
    allWeeks.forEach(week => updateWeekCheckboxState(week));
    updateSelectedQuestionCount();
  });

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

    grouped[week].forEach(({ title, index, categories }) => {
      const div = document.createElement('div');
      div.className = 'question-select';
      div.innerHTML = `
        <label>
          <input type="checkbox" data-index="${index}" checked class="week-checkbox-${week}" />
          ${title} (${categories.join(', ')})
        </label>
      `;
      const checkbox = div.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        updateSelectedQuestionCount();
        const questionWeek = allQuestions[parseInt(checkbox.dataset.index)].week;
        updateWeekCheckboxState(questionWeek);
      });

      section.appendChild(div);
    });

    container.appendChild(section);

    document.getElementById(weekId).addEventListener('change', (e) => {
      const checked = e.target.checked;
      section.querySelectorAll(`.week-checkbox-${week}`).forEach(cb => {
        cb.checked = checked;
      });
      updateSelectedQuestionCount();
    });
  });

  const countDisplay = document.createElement('div');
  countDisplay.id = 'question-count';
  countDisplay.style.marginTop = '1.5rem';
  countDisplay.style.fontWeight = 'bold';
  countDisplay.textContent = 'Aantal geselecteerde vragen: 0';
  container.appendChild(countDisplay);

  updateSelectedQuestionCount();
}


function updateSelectedQuestionCount() {
  const selected = document.querySelectorAll('input[type="checkbox"][data-index]:checked').length;
  const counter = document.getElementById('question-count');
  if (counter) {
    counter.textContent = `Aantal geselecteerde vragen: ${selected}`;
  }
}

function generateCustomQuiz() {
  const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  const selectedIndices = selected
    .filter(cb => cb.hasAttribute('data-index'))
    .map(cb => parseInt(cb.dataset.index));

  if (selectedIndices.length === 0) {
    alert("Selecteer minstens één vraag om door te gaan.");
    return;
  }

  const seed = Math.floor(Math.random() * 1_000_000);
  const shuffledIndices = [...selectedIndices];  // maak kopie
  rng = mulberry32(seed);                        // maak deterministische RNG
  shuffleArray(shuffledIndices, rng);            // hussel op basis van seed

  const indicesParam = shuffledIndices.join(',');
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

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function filterQuestionsByCategory() {
  const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);

  allQuestions.forEach((q, index) => {
    const element = document.querySelector(`[data-index="${index}"]`)?.closest('.question-select');
    if (!element) return;
    const matchesCategory = q.categories?.some(cat => selectedCategories.includes(cat));
    element.style.display = matchesCategory ? '' : 'none';
  });

  updateSelectedQuestionCount();
}

window.onload = () => {
  loadAllQuestions();
  displayQuestionSelection();
  document.getElementById('generate-button').onclick = generateCustomQuiz;
};

function updateWeekCheckboxState(week) {
  const allCheckboxes = document.querySelectorAll(`.week-checkbox-${week}`);
  const weekCheckbox = document.getElementById(`toggle-${week}`);
  const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
  const noneChecked = Array.from(allCheckboxes).every(cb => !cb.checked);
  weekCheckbox.checked = allChecked;
  weekCheckbox.indeterminate = !allChecked && !noneChecked;
}
