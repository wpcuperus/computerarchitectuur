// Haal het formulier en checkboxen op
const form = document.getElementById('subject-form');
const selectAllCheckbox = document.getElementById('selectAll');
const weekCheckboxes = form.querySelectorAll('input[type="checkbox"]:not(#selectAll)');

// "Alles selecteren" aanvinken => alle andere vakjes aanvinken
selectAllCheckbox.addEventListener('change', () => {
  weekCheckboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
});

// Elke wijziging in een van de week-vakjes => check of "Alles selecteren" nog klopt
weekCheckboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    if (!cb.checked) {
      selectAllCheckbox.checked = false;
    } else {
      const allChecked = Array.from(weekCheckboxes).every(cb => cb.checked);
      selectAllCheckbox.checked = allChecked;
    }
  });
});

// Bij verzenden van het formulier
form.onsubmit = function (event) {
  event.preventDefault();

  // Verzamel de geselecteerde weken
  const selectedWeeks = [];
  weekCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedWeeks.push(checkbox.name);
    }
  });

  // Voorkom doorgaan zonder selectie
  if (selectedWeeks.length === 0) {
    alert("Selecteer minstens één onderwerp om door te gaan.");
    return;
  }

  // Genereer een seed
  const seed = generateSeed(selectedWeeks);

  // Redirect naar de quiz-pagina
  window.location.href = `quiz.html?seed=${seed}`;
};

// Seed-generatiefunctie met weeks-encoding
function generateSeed(selectedWeeks) {
  const baseSeed = Math.floor(Math.random() * 1_000_000); // Basis seed

  // Encodeer de geselecteerde weken als een bitstring
  let weekFlags = 0;
  selectedWeeks.forEach(week => {
    if (week === 'week1') weekFlags |= 1 << 0;
    if (week === 'week2') weekFlags |= 1 << 1;
    if (week === 'week3') weekFlags |= 1 << 2;
    if (week === 'week4') weekFlags |= 1 << 3;
    if (week === 'week5') weekFlags |= 1 << 4;
    if (week === 'week6') weekFlags |= 1 << 5;
    if (week === 'week2theorie') weekFlags |= 1 << 6;
    if (week === 'week6theorie') weekFlags |= 1 << 7;
    if (week === 'week1theorie') weekFlags |= 1 << 8;
  });

  return `${baseSeed}-${weekFlags}`;
}
