// Haal het formulier en de checkboxen op
const form = document.getElementById('subject-form');
const weekCheckboxes = form.querySelectorAll('input[type="checkbox"]');

// Voeg een submit-event toe om de keuzes op te slaan en de quiz te genereren
form.onsubmit = function (event) {
  event.preventDefault();

  // Verzamel de geselecteerde weken
  const selectedWeeks = [];
  weekCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedWeeks.push(checkbox.name);
    }
  });

  // Genereer een seed die zowel de numerieke waarde als de geselecteerde weken bevat
  const seed = generateSeed(selectedWeeks);

  // Redirect naar de quiz-pagina met de gegenereerde seed
  window.location.href = `quiz.html?seed=${seed}`;
};

// Functie om een seed te genereren die zowel de numerieke waarde als de geselecteerde weken bevat
function generateSeed(selectedWeeks) {
  const baseSeed = Math.floor(Math.random() * 1_000_000); // Basis seed

  // Encodeer de geselecteerde weken als een bitstring
  let weekFlags = 0;
  selectedWeeks.forEach(week => {
    if (week === 'week1') weekFlags |= 1 << 0; // Week 1
    if (week === 'week2') weekFlags |= 1 << 1; // Week 2
    if (week === 'week3') weekFlags |= 1 << 2; // Week 3
    if (week === 'week4') weekFlags |= 1 << 3; // Week 4
    if (week === 'week5') weekFlags |= 1 << 4; // Week 5
    if (week === 'week6') weekFlags |= 1 << 5; // Week 6
  });

  // Combineer de basis seed met de weekFlags (waarbij de weekinformatie wordt gecodeerd)
  return `${baseSeed}-${weekFlags}`;
}
