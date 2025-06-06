function generateWeek3Questions() {
  const questions = [];

  // Logische bewerkingen
  const logicFunctions = {
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    NAND: (a, b) => !(a & b) ? 1 : 0,
    NOR: (a, b) => !(a | b) ? 1 : 0,
    XOR: (a, b) => a ^ b
  };

  // Vraag 1: Logische schakeling met 2 inputs (A,B)
  {
    // Random hoofdpoort
    const mainGateTypes = ['AND', 'OR', 'NAND', 'NOR', 'XOR'];
    const mainGate = mainGateTypes[Math.floor(rng() * mainGateTypes.length)];

    // 50% kans op NOT voor B
    const notOnB = rng() < 0.5;

    // Truth table genereren
    const truthTable = [];
    for (let a = 0; a <= 1; a++) {
      for (let b = 0; b <= 1; b++) {
        const actualB = notOnB ? (b ? 0 : 1) : b;
        const output = logicFunctions[mainGate](a, actualB);
        truthTable.push(output);
      }
    }

    // ASCII verbindingen afhankelijk van NOT
    const aWire = notOnB ? '-------------------------|' : '--------------|';
    const bWireDirect = '--------------|';
    const bWireToNot = '---';
    const wireBetweenNotAndMain = '------|';

    const html = `
<div style="position: relative; width: 400px; height: 180px; font-family: monospace; border: 1px solid #ccc; margin-bottom: 1em;">

  <div style="position: absolute; left: 0; top: 30px; font-weight: bold;">A</div>
  <div style="position: absolute; left: 20px; top: 35px;">${aWire}</div>

  <div style="position: absolute; left: 0; top: 110px; font-weight: bold;">B</div>

  ${
    notOnB
      ? `
      <div style="position: absolute; left: 20px; top: 115px;">${bWireToNot}</div>
      <img src="assets/gates/not.png" style="position: absolute; left: 50px; top: 90px;" alt="NOT" width="100" height="50" />
      <div style="position: absolute; left: 150px; top: 115px;">${wireBetweenNotAndMain}</div>
      <div style="position: absolute; left: 140px; top: 110px;">|</div>
      `
      : `
      <div style="position: absolute; left: 20px; top: 115px;">${bWireDirect}</div>
      `
  }

  <img src="assets/gates/${mainGate.toLowerCase()}.png" style="position: absolute; left: 210px; top: 70px;" alt="${mainGate}" width="100" height="50" />

  <div style="position: absolute; left: 320px; top: 95px;">---</div>

  <div style="position: absolute; left: 360px; top: 90px; font-weight: bold;">U</div>

</div>

<p>Onderstaande schakeling verwerkt twee invoerwaarden A en B. Vul de waarde van uitgang <strong>U</strong> in voor alle combinaties van A en B:</p>

<table border="1" cellpadding="5" style="font-family: monospace;">
  <tr><th>A</th><th>B</th><th>U</th></tr>
  <tr><td>0</td><td>0</td><td>[ ]</td></tr>
  <tr><td>0</td><td>1</td><td>[ ]</td></tr>
  <tr><td>1</td><td>0</td><td>[ ]</td></tr>
  <tr><td>1</td><td>1</td><td>[ ]</td></tr>
</table>
`;

    const answer = truthTable.join('');

    questions.push({
      title: 'Logische schakeling met 2 inputs',
      label: html,
      categories: ['Waarheidstabellen', 'Gates'],
      answer: answer,
      correctAnswers: [answer]
    });
  }

  // Vraag 2: Logische schakeling met 3 inputs (A,B,C)
  {
    const mainGateTypes = ['AND', 'OR', 'NAND', 'NOR', 'XOR'];

    // Kies poort AB en poort U (tweede poort)
    const gateAB = mainGateTypes[Math.floor(rng() * mainGateTypes.length)];
    const gateU = mainGateTypes[Math.floor(rng() * mainGateTypes.length)];

    // 50% kans op NOT op C
    const notOnC = rng() < 0.5;


    // Truth table voor A,B,C
    const truthTable = [];
    for (let a = 0; a <= 1; a++) {
      for (let b = 0; b <= 1; b++) {
        for (let c = 0; c <= 1; c++) {
          // Eerst AB-poort
          const abVal = logicFunctions[gateAB](a, b);

          // C mogelijk met NOT
          const actualC = notOnC ? (c ? 0 : 1) : c;

          // Tweede poort U van abVal en actualC
          const uVal = logicFunctions[gateU](abVal, actualC);

          truthTable.push(uVal);
        }
      }
    }

    // ASCII en plaatjes

    // ASCII lijnen
    // A en B naar eerste poort
    const wireAB = '---|';
    // Draad tussen AB-poort en tweede poort
    const wireABtoU = '----------|';
    // C naar NOT of direct naar tweede poort
    const wireCtoNot = '-------';
    const wireNotToU = '------|';

    // Positionering voor plaatjes en lijnen, met labels A,B,C en U

    const html = `
<div style="position: relative; width: 500px; height: 240px; font-family: monospace; border: 1px solid #ccc; margin-bottom: 1em;">

  <!-- A label en draad -->
  <div style="position: absolute; left: 0; top: 40px; font-weight: bold;">A</div>
  <div style="position: absolute; left: 20px; top: 45px;">${wireAB}</div>

  <!-- B label en draad -->
  <div style="position: absolute; left: 0; top: 110px; font-weight: bold;">B</div>
  <div style="position: absolute; left: 20px; top: 115px;">${wireAB}</div>

  <!-- Eerste poort (AB) -->
  <img src="assets/gates/${gateAB.toLowerCase()}.png" style="position: absolute; left: 60px; top: 65px;" alt="${gateAB}" width="100" height="50" />

  <!-- Draad van AB-poort naar tweede poort -->
  <div style="position: absolute; left: 180px; top: 85px;">${wireABtoU}</div>
  <div style="position: absolute; left: 250px; top: 80px;"></div>

  <!-- C label -->
  <div style="position: absolute; left: 0; top: 180px; font-weight: bold;">C</div>

  ${
    notOnC
      ? `
      <!-- C draad naar NOT -->
      <div style="position: absolute; left: 20px; top: 185px;">${wireCtoNot}</div>
      <img src="assets/gates/not.png" style="position: absolute; left: 100px; top: 160px;" alt="NOT" width="100" height="50" />
      <!-- draad van NOT naar tweede poort -->
      <div style="position: absolute; left: 200px; top: 185px;">${wireNotToU}</div>
      <div style="position: absolute; left: 190px; top: 180px;">|</div>
      `
      : `
      <!-- C draad direct naar tweede poort -->
      <div style="position: absolute; left: 20px; top: 185px;">--------------------------------|</div>
      `
  }

  <!-- Tweede poort (U) -->
  <img src="assets/gates/${gateU.toLowerCase()}.png" style="position: absolute; left: 280px; top: 120px;" alt="${gateU}" width="100" height="50" />

  <!-- Draad van tweede poort naar U -->
  <div style="position: absolute; left: 390px; top: 140px;">---</div>

  <!-- U label -->
  <div style="position: absolute; left: 430px; top: 135px; font-weight: bold;">U</div>

</div>

<p>Onderstaande schakeling verwerkt drie invoerwaarden A, B en C. Vul de waarde van uitgang <strong>U</strong> in voor alle combinaties van A, B en C:</p>

<table border="1" cellpadding="5" style="font-family: monospace;">
  <tr><th>A</th><th>B</th><th>C</th><th>U</th></tr>
  ${
    // Rijen voor de 8 combinaties van A,B,C
    Array.from({ length: 8 }, (_, i) => {
      const a = (i & 4) >> 2;
      const b = (i & 2) >> 1;
      const c = i & 1;
      return `<tr><td>${a}</td><td>${b}</td><td>${c}</td><td>[ ]</td></tr>`;
    }).join('\n')
  }
</table>
`;

    const answer = truthTable.join('');

    questions.push({
      title: 'Logische schakeling met 3 inputs',
      label: html,
      categories: ['Waarheidstabellen', 'Gates'],
      answer: answer,
      correctAnswers: [answer]
    });
  }

    // Vraag 3: 4-naar-1 Multiplexor (selectorwaarden A/S1 en B/S2)
  {
    // Genereer inputwaarden I0 t/m I3 willekeurig (0 of 1)
    const inputs = [];
    for (let i = 0; i < 4; i++) {
      inputs.push(rng() < 0.5 ? 0 : 1);
    }

    // truthTable is output Y per selector (A,B)
    // selector: 00 -> I0, 01 -> I1, 10 -> I2, 11 -> I3
    const truthTable = [];
    for (let A = 0; A <= 1; A++) {
      for (let B = 0; B <= 1; B++) {
        const sel = (A << 1) | B; // selector index 0..3
        truthTable.push(inputs[sel]);
      }
    }

    const html = `
    <p>Een 4-naar-1 multiplexor heeft 2 selectorwaarden <strong>A (S1)</strong> en <strong>B (S2)</strong> en 4 inputwaarden I0, I1, I2, I3.</p>

    <img src="assets/multiplexor.png" style="width: 180px; height: 200px;" alt="4-naar-1 Multiplexor" />

    <p>De inputwaarden zijn als volgt gegeven (constant):</p>
    <ul>
      <li>I0 = ${inputs[0]}</li>
      <li>I1 = ${inputs[1]}</li>
      <li>I2 = ${inputs[2]}</li>
      <li>I3 = ${inputs[3]}</li>
    </ul>
    <p>Vul voor elke combinatie van selectorwaarden A en B de uitgang <strong>Y</strong> in:</p>

    <table border="1" cellpadding="5" style="font-family: monospace;">
      <tr><th>A (S1)</th><th>B (S2)</th><th>Y</th></tr>
      <tr><td>0</td><td>0</td><td>[ ]</td></tr>
      <tr><td>0</td><td>1</td><td>[ ]</td></tr>
      <tr><td>1</td><td>0</td><td>[ ]</td></tr>
      <tr><td>1</td><td>1</td><td>[ ]</td></tr>
    </table>
    `;

    // Het correcte antwoord is de string van de 4 outputwaarden (Y's)
    const answer = truthTable.join('');

    questions.push({
      title: '4-naar-1 Multiplexor',
      label: html,
      categories: ['Multiplexors', 'Selectors'],
      answer: answer,
      correctAnswers: [answer]
    });
  }

// Vraag 4: Geheugenschakeling met vaste waarden (altijd antwoord 1011)
{
  const rows = [
    { Din: 0, Write: 0, Duit: 1, C: 0, D: 0, F: "1 (hold)", E: "0 (hold)" },
    { Din: 0, Write: 1, Duit: 0, C: 0, D: 1, F: "0", E: "1" },
    { Din: 1, Write: 0, Duit: 1, C: 0, D: 0, F: "1 (hold)", E: "0 (hold)" },
    { Din: 1, Write: 1, Duit: 1, C: 1, D: 0, F: "1", E: "0" }
  ];

  const html = `
<p>Gegeven de onderstaande schakeling, waarbij <strong>E = 0</strong> en <strong>F = 1</strong> de startwaarden zijn.</p>

<img src="assets/srlatch.png" alt="SR Latch Schakeling" style="width: 100%; max-width: 600px;">

<p>Vul de waarde van <strong>Duit</strong> in per stap. Geef het uiteindelijke antwoord door de Duit-waarden achter elkaar te plakken van boven naar beneden.</p>

<table border="1" cellpadding="5" style="font-family: monospace;">
  <tr><th>Din</th><th>Write</th><th>Duit</th><th>C</th><th>D</th><th>F</th><th>E</th></tr>
  ${rows.map(r => `
    <tr>
      <td>${r.Din}</td>
      <td>${r.Write}</td>
      <td>[ ]</td>
      <td>${r.C}</td>
      <td>${r.D}</td>
      <td>${r.F}</td>
      <td>${r.E}</td>
    </tr>
  `).join('\n')}
</table>
`;

  const answer = rows.map(r => r.Duit).join('');

  questions.push({
    title: 'Geheugenschakeling met SR Latch',
    label: html,
    categories: ['Latches'],
    answer: answer,
    correctAnswers: [answer]
  });
}

// Vraag 5: Controleer De Morgan – dynamisch gegenereerde expressies
{
  const baseExpressions = [
    {
      originalStr: "not (A + B)",
      original: (a, b, c) => !(a || b),
      correctStr: "not A * not B",
      correct: (a, b, c) => !a && !b,
      incorrectStr: "not A + not B",
      incorrect: (a, b, c) => !a || !b,
    },
    {
      originalStr: "not (A * B)",
      original: (a, b, c) => !(a && b),
      correctStr: "not A + not B",
      correct: (a, b, c) => !a || !b,
      incorrectStr: "not A * not B",
      incorrect: (a, b, c) => !a && !b,
    },
    {
      originalStr: "not (A + not(B * C))",
      original: (a, b, c) => !(a || !(b && c)),
      correctStr: "not A * B * C",
      correct: (a, b, c) => !a && b && c,
      incorrectStr: "not A + B + C",
      incorrect: (a, b, c) => !a || b || c,
    },
    {
      originalStr: "not (not A * not B)",
      original: (a, b, c) => !(!a && !b),
      correctStr: "A + B",
      correct: (a, b, c) => a || b,
      incorrectStr: "not A + not B",
      incorrect: (a, b, c) => !a || !b,
    },
  ];

  // Kies willekeurige expressie
  const chosen = baseExpressions[Math.floor(rng() * baseExpressions.length)];
  const isCorrect = rng() < 0.5;

  const expr1 = chosen.original;
  const expr2 = isCorrect ? chosen.correct : chosen.incorrect;
  const exprStr2 = isCorrect ? chosen.correctStr : chosen.incorrectStr;

  const truthTable1 = [];
  const truthTable2 = [];

  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      for (let c = 0; c <= 1; c++) {
        truthTable1.push(expr1(a, b, c) ? 1 : 0);
        truthTable2.push(expr2(a, b, c) ? 1 : 0);
      }
    }
  }

  const html = `
<p>Iemand beweert dat, door gebruik te maken van de wetten van De Morgan, de expressie:</p>
<pre>U = ${chosen.originalStr}</pre>
<p>kan worden vereenvoudigd tot:</p>
<pre>U = ${exprStr2}</pre>
<p>Controleer deze bewering door de waarheidstabel van beide expressies met elkaar te vergelijken.</p>

<table border="1" cellpadding="5" style="font-family: monospace;">
  <tr><th>A</th><th>B</th><th>C</th><th>U1 (origineel)</th><th>U2 (vereenvoudigd)</th></tr>
  ${Array.from({ length: 8 }, (_, i) => {
    const a = (i & 4) >> 2;
    const b = (i & 2) >> 1;
    const c = i & 1;
    return `<tr><td>${a}</td><td>${b}</td><td>${c}</td><td>[ ]</td><td>[ ]</td></tr>`;
  }).join('\n')}
</table>

<p>Zijn de twee expressies altijd gelijk aan elkaar? <strong>Antwoord met: JA of NEE</strong></p>
`;

  const answer = isCorrect ? "JA" : "NEE";

  questions.push({
    title: 'Expressies vergelijken met De Morgan',
    label: html,
    categories: ['Waarheidstabellen'],
    answer: answer,
    correctAnswers: [answer]
  });
}

// Vraag 6: Verkeerslicht met 2-naar-4 decoder
{
  const colors = ['rood', 'oranje', 'groen', 'blauw', 'geel', 'paars'];
  // Kies 3 willekeurige kleuren
  const shuffledColors = colors.sort(() => rng() - 0.5).slice(0, 3);

  const [kleurX, kleurY, kleurZ] = shuffledColors;

  // Mapping van decoder-uitgangen naar lampen:
  // d0: OR -> kleurZ
  // d1: OR -> kleurZ én kleurX
  // d2: direct -> kleurY
  // d3: OR -> kleurX

  // Genereer geshuffelde inputvolgorde van 0,1,2,3
  const inputSequence = [0,1,2,3].sort(() => rng() - 0.5);

  // Laat ze een paar keer herhalen (bv. 2x)
  const inputs = [...inputSequence];

  // Bereken per input welke kleur brandt
  const getKleur = (input) => {
    switch (input) {
      case 0: return kleurZ;              // d0
      case 1: return `${kleurZ} en ${kleurX}`; // d1
      case 2: return kleurY;              // d2
      case 3: return kleurX;              // d3
    }
  };

  const kleuren = inputs.map(getKleur);

  const html = `
<p>Beschouw onderstaande schakeling waarin een 2-4 decoder is opgenomen om drie lampen van een verkeerslicht aan te sturen. De lampen hebben de kleuren:</p>
<ul>
  <li><strong>Lamp X</strong>: ${kleurX}</li>
  <li><strong>Lamp Y</strong>: ${kleurY}</li>
  <li><strong>Lamp Z</strong>: ${kleurZ}</li>
</ul>

<img src="assets/verkeerslicht.png" alt="Verkeerslicht schakeling" style="width: 500px; height: auto;" />

<p>De inputs <code>i0</code> en <code>i1</code> nemen achtereenvolgens de volgende waarden aan (in binair):</p>
<p><code>${inputs.map(i => i.toString(2).padStart(2, '0')).join(', ')}</code></p>

<p>Welke kleur(en) brandt telkens? Vul hieronder in:</p>

<table border="1" cellpadding="5" style="font-family: monospace;">
  <tr><th>i1i0</th><th>Kleur(en)</th></tr>
  ${inputs.map((i, idx) => `
    <tr>
      <td>${i.toString(2).padStart(2, '0')}</td>
      <td>[ ]</td>
    </tr>`).join('')}
</table>

<p>Vul de antwoorden in volgens het format: kleur1, kleur2 en kleur3, kleur4, kleur5</p>
`;

  const answer = kleuren.join(', ');

  questions.push({
    title: 'Verkeerslicht met 2-naar-4 decoder',
    label: html,
    categories: ['Latches'],
    answer: answer,
    correctAnswers: [answer]
  });
}

{
  const steps = 10;

  // Vaste CLK (toggle per 2 stappen): 0 0 1 1 0 0 1 1 0 0
  const clk = [];
  for (let i = 0; i < steps; i++) {
    clk.push(Math.floor(i / 2) % 2);
  }

  // Vaste X-volgorde
  const x = [0, 1, 1, 1, 1, 0, 0, 0, 0, 1];

  // Bereken Q op rising edges
  const q = [];
  let qState = 0;
  for (let i = 0; i < steps; i++) {
    const risingEdge = i > 0 && clk[i - 1] === 0 && clk[i] === 1;
    if (risingEdge) qState = x[i];
    q.push(qState);
  }

  // Bereken Z: Z = (Q <= X)
  const z = q.map((qVal, i) => qVal <= x[i] ? 1 : 0);

  // Willekeurig kiezen of Q of Z verborgen moet worden
  const showQ = rng() > 0.5;

  // Helperfunctie voor rij
  const row = (label, arr, hidden) => {
    return `<tr><td><strong>${label}</strong></td>${
      arr.map(v => hidden ? `<td>[ ]</td>` : `<td>${v}</td>`).join('')
    }</tr>`;
  };

  const html = `
<p>In onderstaande schakeling is FF een flip-flop die van toestand verandert bij een <strong>rising edge</strong> van de klok-ingang. 
Dit betekent: als de klok-ingang <code>CLK</code> van 0 naar 1 gaat, dan wordt Q gelijk aan D (= X).</p>

<img src="assets/flipflop.png" alt="flipflop" style="width: 400px; height: auto;" />

<p>De vergelijker “A ≤ B” heeft als output een “1” als A ≤ B, anders “0”.</p>

<p>In onderstaande tabel is het tijdsverloop van CLK en X weergegeven. Vul de ontbrekende regel (${showQ ? "Q" : "Z"}) aan:</p>

<table border="1" cellpadding="5" style="font-family: monospace; text-align: center;">
  <tr><th>t</th>${[...Array(steps).keys()].map(i => `<th>${i}</th>`).join('')}</tr>
  ${row("CLK", clk, false)}
  ${row("X", x, false)}
  ${row("Q", q, showQ)}
  ${row("Z", z, !showQ)}
</table>
`;

  const answer = (showQ ? q : z).join(",");

  questions.push({
    title: 'Flip-flop met kloksignaal | Tabel aanvullen',
    label: html,
    categories: ['Flip-flops'],
    answer: answer,
    correctAnswers: [answer]
  });
}

// Vraag 7: Flip-flop met kloksignaal
{
  const html = `
<p>In onderstaande schakeling is FF een flip-flop die van toestand verandert bij een <strong>rising edge</strong> van de klok-ingang (CLK).</p>

<img src="assets/flipflop2.png" alt="Flipflop schakeling" style="width: 100%; max-width: 600px;" />

<p>In onderstaande figuur is het verloop in de tijd van de inputs aangegeven.</p>

<img src="assets/flipflop3.png" alt="Flipflop tijdsverloop" style="width: 100%; max-width: 600px;" />

<p>Geef de waarde van de output <strong>Z</strong> op de tijdstippen A, B, C en D.</p>

`;

  const correctVariants = ['1001', '1, 0, 0, 1', 'A=1, B=0, C=0, D=1'];

  questions.push({
    title: 'Flip-flop met kloksignaal | Output per tijdstip',
    label: html,
    categories: ['Flip-flops'],
    answer: correctVariants[0],
    correctAnswers: correctVariants
  });
}

  return questions;
}
