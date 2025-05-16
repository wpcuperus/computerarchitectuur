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
      label: html,
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
      label: html,
      answer: answer,
      correctAnswers: [answer]
    });
  }

  return questions;
}
