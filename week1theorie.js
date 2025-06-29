function generateWeek1TheoryQuestions() {
  const questions = [];

    function shuffle(array) {
    return array.map(x => ({ x, sort: rng() })).sort((a, b) => a.sort - b.sort).map(({ x }) => x);
  }

  {
    const correct = "C-programma's verbruiken doorgaans minder rekenkracht en geheugen, wat resulteert in een lagere energieconsumptie";
    const incorrect = [
      "Python ondersteunt geen herbruikbare functies",
      "C gebruikt standaard altijd groene stroom",
      "Python gebruikt standaard GPU's, wat energie-intensiever is",
      "C heeft een ingebouwde energiebesparingsmodus",
      "Python compileert automatisch naar energie-inefficiënte bytecode",
      "C draait alleen op energiezuinige besturingssystemen",
      "Python maakt altijd verbinding met het internet",
      "C kan alleen op Linux draaien",
      "Python verbruikt altijd minstens 2GB RAM",
      "C heeft geen garbage collector, wat beter is voor het milieu",
      "Python genereert automatisch logbestanden, wat opslag kost",
      "C is ontwikkeld met milieunormen in het achterhoofd",
      "Python vereist zware dependencies",
      "C gebruikt minder kleuren in de interface",
      "Python staat voortdurend in de achtergrond actief"
    ];

    const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 7)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];

    const html = `
<p><strong>De programmeertaal C wordt over het algemeen als milieuvriendelijker beschouwd dan Python. Waarom is dat?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van het juiste antwoord:</p>`;

    questions.push({
      title: 'Milieuverschillen tussen C en Python',
      label: html,
      answer: correctLabel,
      categories: ['Intro'],
      hint: "Denk aan hoe dicht C bij de hardware zit en hoe dat het energieverbruik beïnvloedt.",
      correctAnswers: [correctLabel],
      explanation: `C is een gecompileerde taal die dicht bij de hardware zit. Daardoor zijn C-programma's vaak efficiënter in termen van CPU-gebruik en geheugenverbruik dan Python, wat leidt tot een lagere energieconsumptie.`
    });
  }

  // Meerkeuzevraag: Moore's Law
  {
    const correct = "De Wet van Moore stelt dat de rekenkracht op een geïntegreerde schakeling elke 1,5 / 2 jaar verdubbelt, terwijl de prijs gelijk blijft.";
    const incorrect = [
      "De Wet van Moore stelt dat de prijs van computers elke 1,5 jaar halveert, terwijl de rekenkracht gelijk blijft.",
      "De Wet van Moore stelt dat de rekenkracht van computers elke 5 jaar verdubbelt, maar de prijs stijgt.",
      "De Wet van Moore stelt dat de rekenkracht van computers elke 10 jaar verdubbelt, maar de prijs halveert.",
      "De Wet van Moore stelt dat de rekenkracht van computers elke 1,5 jaar verdubbelt, maar de prijs verdubbelt ook.",
      "De Wet van Moore stelt dat het aantal RAM in een computer elke 2 jaar verdubbelt, maar de prijs blijft gelijk.",
      "De Wet van Moore stelt dat de kracht van de GPU elke 3 jaar verdubbelt, maar de prijs blijft gelijk.",
      "De Wet van Moore stelt dat de snelheid van internetverbindingen elke 2 jaar verdubbelt, maar de prijs blijft gelijk.",
      "De Wet van Moore stelt dat de opslagcapaciteit van harde schijven elke 2 jaar verdubbelt, maar de prijs blijft gelijk.",
      "De Wet van Moore stelt dat de snelheid van de CPU elke 2 jaar verdubbelt, maar de prijs blijft gelijk.",
      "De Wet van Moore stelt dat de snelheid van de RAM elke 2 jaar verdubbelt, maar de prijs blijft gelijk.",
      "De Wet van Moore stelt dat de snelheid van de GPU elke 2 jaar verdubbelt, maar de prijs blijft gelijk.",
      "De Wet van Moore stelt dat de snelheid van de SSD elke 2 jaar verdubbelt, maar de prijs blijft gelijk.",
    ];

    const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 6)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];

    const html = `
<p><strong>Welke uitspraak over Moore's Law is waar?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van het juiste antwoord:</p>`;

    questions.push({
      title: 'Moore\'s Law',
      label: html,
      answer: correctLabel,
      hint: "Denk aan de verdubbeling van transistors op een chip en de impact op rekenkracht en prijs.",
      categories: ['Intro'],
      correctAnswers: [correctLabel],
      explanation: `Moore's Law stelt dat het aantal transistors op een chip ongeveer elke twee jaar verdubbelt, wat leidt tot een toename van de rekenkracht en een afname van de kosten per transistor.`
    });
  }

  return questions;
}
