// Week 6: Processor en optimalisatie
// Categorieën:
// - Datapath
// - System Bus inc. address lines, data lines and control lines
// - Pipelining
// - Caching

function generateWeek6TheoryQuestions() {
  const questions = [];

  // Hulpfunctie om te schudden
  function shuffle(array) {
    return array.map(x => ({ x, sort: rng() })).sort((a, b) => a.sort - b.sort).map(({ x }) => x);
  }

  // Vraag 1: CPU-componenten
  {
    const cpuCorrect = ["ALU", "Geheugen (registers, cache)", "Control unit"];
    const cpuIncorrect = ["Scherm", "Moederbord", "RAM", "Hard drive", "GPU", "I/O apparaten"];

    const options = shuffle([
      ...cpuCorrect,
      ...shuffle(cpuIncorrect).slice(0, 3)
    ]);

    const labels = ["A", "B", "C", "D", "E", "F"];
  const correctLabels = options
    .map((opt, idx) => cpuCorrect.includes(opt) ? labels[idx] : null)
    .filter(Boolean)
    .sort()
    .join(""); // <-- direct een string van maken


    const html = `
<p><strong>Welke van de volgende componenten wordt logisch gezien als onderdeel van de processor (CPU)?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letters van de juiste antwoorden, bijvoorbeeld: <code>ACF</code></p>`;

    questions.push({
      title: 'CPU-componenten',
      label: html,
      categories: ['Datapath'],
      answer: correctLabels,
      correctAnswers: correctLabels,
      explanation: `De ALU, Control Unit en registers/cachegeheugen zijn onderdelen van de processor. Andere componenten zoals RAM, GPU en I/O-apparaten vallen buiten de CPU.`,
    });
  }

  // Vraag 2: Primaire functie datapath
  {
    const correct = "Het uitvoeren van rekenkundige operaties.";
    const incorrect = [
      "Het aansturen van I/O apparaten",
      "Het opslaan van programma's en data",
      "Het controleren van de stroom van instructies",
      "Het renderen van grafische objecten",
      "Het onderhouden van netwerkverbindingen",
      "Het beheren van gebruikersinvoer",
      "Het verwerken van audio-uitvoer",
      "Het draaien van meerdere besturingssystemen tegelijk",
      "Het versturen van data naar de harde schijf",
      "Het ontvangen van data van sensoren",
      "Het uitvoeren van deep learning-algoritmes",
      "Het verzorgen van draadloze communicatie",
      "Het beheren van batterijverbruik",
      "Het maken van backups naar de cloud"
    ];

    const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 7)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];

    const html = `
<p><strong>Wat is de primaire functie van de 'datapath' binnen een processor?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van je antwoord:</p>`;

    questions.push({
      title: 'Datapath functie',
      label: html,
      answer: correctLabel,
      categories: ['Datapath'],
      correctAnswers: [correctLabel],
      explanation: `De datapath voert bewerkingen uit, zoals optellen, vermenigvuldigen of vergelijken.`,
    });
  }

  // Vraag 3: Single-cycle vs pipelined
  {
    const correct = "De klokcyclusduur van een single-cycle datapath wordt bepaald door de langste instructie";
    const incorrect = [
      "Een single-cycle datapath kan meerdere instructies tegelijk uitvoeren",
      "Een pipelined datapath voert alle instructies in één klokcyclus uit",
      "Pipelining verhoogt de latentie van een individuele instructie.",
      "Single-cycle datapaths zijn sneller dan pipelined varianten",
      "Een pipelined datapath heeft geen controlelogica nodig",
      "Single-cycle designs gebruiken minder transistoren",
      "Pipelining vermindert de kans op fouten in instructies",
      "Alle datapaths gebruiken exact dezelfde hardwarecomponenten",
      "Een pipelined datapath voert instructies in willekeurige volgorde uit",
      "Single-cycle datapaths zijn efficiënter bij zware werkbelasting",
      "Pipelining verhoogt het geheugengebruik",
      "Een pipelined datapath maakt gebruik van meerdere ALU's",
      "Pipelining maakt programma's automatisch sneller zonder extra ontwerpwerk"
    ];

    const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 7)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];

    const html = `
<p><strong>Welke stelling is waar over het verschil tussen een single-cycle datapath en een pipelined datapath?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van het juiste antwoord:</p>`;

    questions.push({
      title: 'Single-cycle vs Pipelined',
      label: html,
      answer: correctLabel,
      categories: ['Datapath'],
      correctAnswers: [correctLabel],
      explanation: `Omdat alle stappen in een single-cycle datapath binnen één klokcyclus moeten passen, wordt de cyclusduur bepaald door de langzaamste (meest complexe) instructie.`,
    });
  }

  // Vraag 4: Wat is de functie van de adresbus in een computersysteem?
  {
    const correct = "Het transporteren van geheugenadressen van de CPU naar het geheugen.";
    const incorrect = [
      "Het transporteren van data tussen de CPU en het geheugen",
      "Het synchroniseren van de kloksignalen in het systeem",
      "Het uitvoeren van rekenkundige bewerkingen",
      "Het beheren van de stroomvoorziening naar de componenten",
      "Het coderen van instructies voor de ALU",
      "Het decoderen van signalen van I/O-apparaten",
      "Het opslaan van tijdelijke gegevens tijdens berekeningen",
      "Het controleren van fouten in dataoverdracht",
      "Het beheren van netwerkverbindingen",
      "Het renderen van grafische beelden op het scherm",
      "Het uitvoeren van besturingssysteemfuncties",
      "Het onderhouden van de cachegeheugenstructuur",
      "Het uitvoeren van beveiligingscontroles op data",
      "Het beheren van gebruikersinvoer via toetsenbord/muis"
    ];

    const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 7)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];

    const html = `
<p><strong>Wat is de functie van de adresbus in een computersysteem?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van je antwoord:</p>`;

    questions.push({
      title: 'Adresbus functie',
      label: html,
      answer: correctLabel,
      categories: ['System Bus'],
      correctAnswers: [correctLabel],
      explanation: `De adresbus is verantwoordelijk voor het transporteren van geheugenadressen van de CPU naar het geheugen.`
    });
  }

  // Vraag 5: Welk type bus is verantwoordelijk voor het regelen van de operaties en het dirigeren van de dataflow tussen de CPU en andere componenten?
  {
    const correct = "De control bus";
    const incorrect = [
      "De data bus",
      "De adres bus",
      "De I/O bus",
      "De geheugen bus",
      "De systeem bus",
      "De cache bus",
      "De video bus",
      "De audio bus",
      "De netwerk bus",
      "De power bus",
      "De interrupt bus",
      "De clock bus"
    ];

    const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 7)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];

    const html = `
<p><strong>Welk type bus is verantwoordelijk voor het regelen van de operaties en het dirigeren van de dataflow tussen de CPU en andere componenten?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van je antwoord:</p>`;

    questions.push({
      title: 'Control bus functie',
      label: html,
      answer: correctLabel,
      categories: ['System Bus'],
      correctAnswers: [correctLabel],
      explanation: `De control bus is verantwoordelijk voor het regelen van de operaties en het dirigeren van de dataflow tussen de CPU en andere componenten.`
    });
  }

{
  const optiesTekst = `
<br><br>
A: In ongeveer 25% van de gevallen<br>
B: Ongeveer 50%<br>
C: Bijna 100%<br>
D: Nauwelijks tot niet.
`;

  const situations = [
    {
      label: `Je schrijft een stuk RISC-V code (32 bits) dat het RAM-geheugen doorloopt met sprongen van 16 bytes, terwijl de cache direct-mapped is met een blokgrootte van 4 bytes en de cachegrootte klein is (bijvoorbeeld 64 bytes). In hoeverre is er dan sprake van cache-hits als het gaat om het datageheugen?` + optiesTekst,
      correctAnswer: 'A',
      explanation: `Omdat je steeds sprongen van 16 bytes maakt, worden verschillende indexen in de cache aangesproken, maar door de kleine cacheomvang overschrijft data zich regelmatig. Hierdoor is er slechts in ~25% van de gevallen een hit.`
    },
    {
      label: `Je schrijft een stuk RISC-V code (32 bits) dat het geheugen doorloopt in stappen van 8 bytes. De cache is direct-mapped, blokgrootte 4 bytes, en er is voldoende cache om ~50% van de blokken vast te houden. In hoeverre is er dan sprake van cache-hits als het gaat om het datageheugen?` + optiesTekst,
      correctAnswer: 'B',
      explanation: `Door de toegangssprongen en de cachecapaciteit is ongeveer de helft van de data al aanwezig wanneer opnieuw opgevraagd. Hierdoor ~50% hits.`
    },
    {
      label: `Je schrijft een stuk RISC-V code (32 bits) dat een array meerdere keren lineair doorloopt met een stapgrootte van 4 bytes. De cache is direct-mapped, blokgrootte ook 4 bytes, en de array past netjes in de cache. In hoeverre is er dan sprake van cache-hits als het gaat om het datageheugen?` + optiesTekst,
      correctAnswer: 'C',
      explanation: `De eerste doorloop veroorzaakt misses, maar daarna blijft alles in de cache. Bij volgende iteraties bijna 100% cache hits.`
    },
    {
      label: `Je schrijft een stuk code RISC-V code (32 bits) dat van het begin tot het eind het (RAM) datageheugen doorloopt, steeds per 4 bytes. De gebruikte cachetechniek is direct memory mapped cache. De cachebreedte is ook 4 bytes. In hoeverre is er dan sprake van cache-hits als het gaat om het datageheugen?` + optiesTekst,
      correctAnswer: 'D',
      explanation: `Omdat elk nieuw blok steeds een andere index in de cache overschrijft (en oude blokken niet behouden blijven), is er nauwelijks sprake van cache hits.`
    }
  ];

  const index = Math.floor(rng() * situations.length);
  const selected = situations[index];

  questions.push({
    id: `riscv-cache-doorloop`,
    title: 'Cachegedrag bij geheugen-doorloop in RISC-V',
    label: selected.label,
    hint: 'Bedenk wat er gebeurt met een direct-mapped cache als je steeds sequentieel door het geheugen loopt.',
    answer: selected.correctAnswer,
    correctAnswers: [selected.correctAnswer],
    categories: ['Caching', 'RISC-V'],
    explanation: selected.explanation
  });
}

// Vraag 6: Waarvoor staat de term IR als het gaat om een CPU?
{
  questions.push({
    id: 'ir-term-cpu',
    title: 'De betekenis van IR in een CPU',
    label: `<p>Waarvoor staat de term IR in de context van een CPU?</p>`,
    hint: 'Denk aan de rol van IR in het uitvoeren van instructies.',
    answer: 'Instruction Register',
    correctAnswers: ['Instruction Register'],
    categories: ['Datapath'],
    explanation: `IR staat voor Instruction Register. Het is een register in de CPU dat de huidige instructie bevat die wordt uitgevoerd.`
  });
}

// Vraag 7: Tristate schakelingen gebruiken
{
  const correct = "Voor het koppelen van geheugencellen aan de databus.";
  const incorrect = [
    "Voor het uitvoeren van rekenkundige bewerkingen",
    "Voor het synchroniseren van de kloksignalen",
    "Voor het decoderen van instructies",
    "Voor het beheren van de stroomvoorziening",
    "Voor het renderen van grafische beelden",
    "Voor het opslaan van tijdelijke gegevens",
    "Voor het controleren van fouten in dataoverdracht",
    "Voor het onderhouden van netwerkverbindingen",
    "Voor het uitvoeren van besturingssysteemfuncties",
    "Voor het beheren van gebruikersinvoer"
  ];
  const options = shuffle([
    correct,
    ...shuffle(incorrect).slice(0, 7)
  ]);
  const labels = "ABCDEFGH".split('');
  const correctLabel = labels[options.indexOf(correct)];
  const html = `
<p><strong>Waarom worden tristate schakelingen gebruikt in computersystemen?</strong></p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van je antwoord:</p>`;
  questions.push({
    title: 'Tristate schakelingen',
    label: html,
    answer: correctLabel,
    categories: ['Datapath'],
    correctAnswers: [correctLabel],
    explanation: `Tristate schakelingen worden gebruikt om meerdere geheugencellen aan dezelfde databus te koppelen zonder dat er conflicten ontstaan. Ze kunnen in drie toestanden werken: hoog, laag en hoog-impedantie (uit).`
  });
}


  return questions;
}
