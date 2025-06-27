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

  return questions;
}
