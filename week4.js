function encodeJAL(rd, offset) {
  // RISC-V jal immediate is in multiples of 2 and is 21 bits signed
  const imm = offset;
  const imm20 = (imm >> 20) & 0x1;
  const imm10_1 = (imm >> 1) & 0x3ff;
  const imm11 = (imm >> 11) & 0x1;
  const imm19_12 = (imm >> 12) & 0xff;

  const opcode = 0b1101111;
  const rdVal = rd; // x0 = 0

  const instruction =
    (imm20 << 31) |
    (imm19_12 << 12) |
    (imm11 << 20) |
    (imm10_1 << 21) |
    (rdVal << 7) |
    opcode;

  return instruction >>> 0; // unsigned
}

// Week 4: Basic Assembly
// Categorieën: RISC-V, branching, bitwise operators, arrays, overflow

function generateWeek4Questions() {
  const questions = [];

    function shuffle(array) {
    return array.map(x => ({ x, sort: rng() })).sort((a, b) => a.sort - b.sort).map(({ x }) => x);
  }

  // Vraag 1: Bit in register wordt gezet
  {
    const bitPosition = Math.floor(rng() * 8); // 0 t/m 7

    const bitTexts = [
      "Het 1e bit van rechts in x12 wordt op 1 gezet.",
      "Het 2e bit van rechts in x12 wordt op 1 gezet.",
      "Het 3e bit van rechts in x12 wordt op 1 gezet.",
      "Het 4e bit van rechts in x12 wordt op 1 gezet.",
      "Het 5e bit van rechts in x12 wordt op 1 gezet.",
      "Het 6e bit van rechts in x12 wordt op 1 gezet.",
      "Het 7e bit van rechts in x12 wordt op 1 gezet.",
      "Het 8e bit van rechts in x12 wordt op 1 gezet.",
    ];

    const wrongBitTexts = [
      "Het 1e bit van rechts in x12 wordt op 0 gezet.",
      "Het 2e bit van rechts in x12 wordt op 0 gezet.",
      "Het 3e bit van rechts in x12 wordt op 0 gezet.",
      "Het 4e bit van rechts in x12 wordt op 0 gezet.",
      "Het 5e bit van rechts in x12 wordt op 0 gezet.",
      "Het 6e bit van rechts in x12 wordt op 0 gezet.",
      "Het 7e bit van rechts in x12 wordt op 0 gezet.",
      "Het 8e bit van rechts in x12 wordt op 0 gezet.",
    ];

    const correctAnswer = bitTexts[bitPosition];
    const options = [correctAnswer];

    while (options.length < 6) {
      const source = rng() < 0.5 ? bitTexts : wrongBitTexts;
      const choice = source[Math.floor(rng() * source.length)];
      if (!options.includes(choice)) options.push(choice);
    }

    const shuffledOptions = options
      .map((text) => ({ text, sort: rng() }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.text);

    const labels = ["A", "B", "C", "D", "E", "F"];
    const correctLabel = labels[shuffledOptions.indexOf(correctAnswer)];

    const html = `
<p>In onderstaande code worden de registers <code>x12</code> en <code>x13</code> aangepast.</p>
<pre><code>addi x13, zero, 1
slli x13, x13, ${bitPosition}
or   x12, x12, x13</code></pre>
<p>Neem aan dat in het 1e bit van rechts het LSB bit van die byte is.</p>
<p><strong>Wat is het resultaat van bovenstaand programma?</strong></p>
<p>Kies het juiste antwoord:</p>
<ol type="A">
  ${shuffledOptions.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van je antwoord:</p>`;

const uitleg = `✔️ Het bit op positie ${bitPosition} (van rechts, 0-gebaseerd) wordt op 1 gezet via:
<ul>
  <li><code>addi x13, zero, 1</code>: zet waarde 1 in x13</li>
  <li><code>slli x13, x13, ${bitPosition}</code>: schuift deze 1 ${bitPosition} posities naar links</li>
  <li><code>or x12, x12, x13</code>: zet het overeenkomstige bit in x12 op 1</li>
</ul>
Het juiste antwoord is dus: "${correctAnswer}"`;

questions.push({
  title: 'Bit in Register Instellen',
  label: html,
  answer: correctLabel,
  categories: ['RISC-V', 'Bitwise Operators'],
  hint: `Kijk goed naar de instructie <code>slli x13, x13, ${bitPosition}</code> en bedenk wat dit doet met de waarde in x13. Hoe wordt het bit in x12 aangepast?`,
  correctAnswers: [correctLabel],
  explanation: uitleg
});
  }



  // Vraag 3: Instructie decoderen

{
  // Hulpfunctie: converteer register nummer naar 5-bit binaire string
  function regBin(regNum) {
    return regNum.toString(2).padStart(5, '0');
  }

  // Hulpfunctie: converteer immediate naar bits als 2's complement
  function immBin(imm, bits) {
    if (imm < 0) imm = (1 << bits) + imm;
    return imm.toString(2).padStart(bits, '0');
  }

  // R-type instructies
  const rTypeInstrs = [
    { mnemonic: "add",  opcode: "0110011", funct3: "000", funct7: "0000000", format: "R" },
    { mnemonic: "sub",  opcode: "0110011", funct3: "000", funct7: "0100000", format: "R" },
    { mnemonic: "xor",  opcode: "0110011", funct3: "100", funct7: "0000000", format: "R" },
    { mnemonic: "or",   opcode: "0110011", funct3: "110", funct7: "0000000", format: "R" },
    { mnemonic: "and",  opcode: "0110011", funct3: "111", funct7: "0000000", format: "R" },
    { mnemonic: "sll",  opcode: "0110011", funct3: "001", funct7: "0000000", format: "R" },
  ];

  // I-type instructies
  const iTypeInstrs = [
    { mnemonic: "addi", opcode: "0010011", funct3: "000", format: "I" },
    { mnemonic: "xori", opcode: "0010011", funct3: "100", format: "I" },
    { mnemonic: "ori",  opcode: "0010011", funct3: "110", format: "I" },
    { mnemonic: "andi", opcode: "0010011", funct3: "111", format: "I" },
    { mnemonic: "slli", opcode: "0010011", funct3: "001", format: "I", funct7: "0000000" },
  ];

  // Kies random type instructie
  const isRType = (rng() < 0.5);

  // Register helper (x10 t/m x20)
  function randReg() {
    return 10 + Math.floor(rng() * 11);
  }

  // Genereer willekeurige 32-bit hex (4 bytes) als string "0x????????"
function randomHex32() {
  return '0x' + Math.floor(rng() * 0x01000000).toString(16).padStart(8, '0');
}

  let instr, rd, rs1, rs2, imm, instrHex, binaryInstr;

  if (isRType) {
    instr = rTypeInstrs[Math.floor(rng() * rTypeInstrs.length)];
    rd = randReg();
    rs1 = randReg();
do { rs2 = randReg(); } while (rs2 === rd || rs2 === rs1);

// Bij sub: rs1 moet groter zijn dan rs2
if (instr.mnemonic === "sub") {
  if (rs1 < rs2) {
    const tmp = rs1;
    rs1 = rs2;
    rs2 = tmp;
  }
}


    binaryInstr =
      instr.funct7 +
      regBin(rs2) +
      regBin(rs1) +
      instr.funct3 +
      regBin(rd) +
      instr.opcode;

    instrHex = parseInt(binaryInstr, 2).toString(16).padStart(8, '0');
  } else {
    instr = iTypeInstrs[Math.floor(rng() * iTypeInstrs.length)];
    rd = randReg();
    rs1 = randReg();
    while (rs1 === rd) rs1 = randReg();

    if (["slli","srli","srai"].includes(instr.mnemonic)) {
      imm = Math.floor(rng() * 33);
      const imm5 = immBin(imm, 5);
      binaryInstr =
        instr.funct7 +
        imm5 +
        regBin(rs1) +
        instr.funct3 +
        regBin(rd) +
        instr.opcode;
      instrHex = parseInt(binaryInstr, 2).toString(16).padStart(8, '0');
    } else {
      imm = Math.floor(rng() * 33); // max 32
      const imm12 = immBin(imm, 12);
      binaryInstr =
        imm12 +
        regBin(rs1) +
        instr.funct3 +
        regBin(rd) +
        instr.opcode;
      instrHex = parseInt(binaryInstr, 2).toString(16).padStart(8, '0');
    }
  }

  const baseAddr = 0x00400000;
  

  // Instructies rij met 5 plekken; de instructie komt op index 1 (offset +4)
  const instructions = [];
  const instrIndex = Math.floor(rng() * 5); // 0 t/m 4
  const pc = baseAddr + instrIndex * 4;

  for (let i = 0; i < 5; i++) {
    instructions.push(i === instrIndex ? "0x" + instrHex : randomHex32());
  }

  // Willekeurige data voor de rest van de tabel (4 rijen x 5 kolommen)
  function generateDataRow() {
    const row = [];
    for (let i = 0; i < 5; i++) {
      row.push(randomHex32());
    }
    return row;
  }

  const row1 = generateDataRow();
  const row2 = generateDataRow();
  const row3 = generateDataRow();

  const questionText = `
<p>Na het assembleren van een programma in de RARS simulator is het instructiegeheugen als volgt.</p>
<table border="1" cellpadding="4" style="border-collapse: collapse;">
<tr><th>Address</th><th>Value (+0)</th><th>Value (+4)</th><th>Value (+8)</th><th>Value (+c)</th><th>Value (+10)</th></tr>
<tr>
  <td>0x${baseAddr.toString(16).padStart(8,'0')}</td>
  <td>${instructions[0]}</td>
  <td>${instructions[1]}</td>
  <td>${instructions[2]}</td>
  <td>${instructions[3]}</td>
  <td>${instructions[4]}</td>
</tr>
<tr>
  <td>0x${(baseAddr+0x20).toString(16).padStart(8,'0')}</td>
  <td>${row1[0]}</td>
  <td>${row1[1]}</td>
  <td>${row1[2]}</td>
  <td>${row1[3]}</td>
  <td>${row1[4]}</td>
</tr>
<tr>
  <td>0x${(baseAddr+0x40).toString(16).padStart(8,'0')}</td>
  <td>${row2[0]}</td>
  <td>${row2[1]}</td>
  <td>${row2[2]}</td>
  <td>${row2[3]}</td>
  <td>${row2[4]}</td>
</tr>
<tr>
  <td>0x${(baseAddr+0x60).toString(16).padStart(8,'0')}</td>
  <td>${row3[0]}</td>
  <td>${row3[1]}</td>
  <td>${row3[2]}</td>
  <td>${row3[3]}</td>
  <td>${row3[4]}</td>
</tr>
</table>

<p>Wat is de eerstvolgende instructie die uitgevoerd wordt als de Program Counter (PC) de waarde 0x${pc.toString(16).padStart(8, '0')} heeft en instructies worden gecodeerd volgens deze tabel: <a href="https://www.cs.sfu.ca/~ashriram/Courses/CS295/assets/notebooks/RISCV/RISCV_CARD.pdf" target="_blank">RISC-V instructietabel</a>?</p>
`;

const uitleg = `
Het adres 0x${pc.toString(16).padStart(8, '0')} bevat de binaire instructie <code>${binaryInstr}</code>.<br>
Deze decodeert als: <code>${isRType ? `${instr.mnemonic} x${rd}, x${rs1}, x${rs2}` : `${instr.mnemonic} x${rd}, x${rs1}, ${imm}`}</code><br>
Gebaseerd op de opcode en funct-velden volgens de RISC-V instructietabel.`;

questions.push({
  id: `riscv-instruction-decode`,
  title: 'RISC-V Instructie Decoderen op basis van instructiegeheugen',
  label: questionText,
  categories: ['RISC-V'],
  hint: `Gebruik de RISC-V instructieset om te bepalen welke instructie dit is op basis van de opcode, funct3 en funct7 velden. De instructie is altijd een R - of I-type instructie.`,
  answer: isRType
    ? `${instr.mnemonic} x${rd}, x${rs1}, x${rs2}`
    : `${instr.mnemonic} x${rd}, x${rs1}, ${imm}`,
  correctAnswers: [
    isRType
      ? `${instr.mnemonic} x${rd}, x${rs1}, x${rs2}`
      : `${instr.mnemonic} x${rd}, x${rs1}, ${imm}`,
  ],
  explanation: uitleg.trim()
});

}

// Vraag 4: Decodeer de binaire R-type instructie op basis van velden
{
  const rInstrs = [
    { mnemonic: "add",  funct3: "000", funct7: "0000000" },
    { mnemonic: "sub",  funct3: "000", funct7: "0100000" },
    { mnemonic: "xor",  funct3: "100", funct7: "0000000" },
    { mnemonic: "or",   funct3: "110", funct7: "0000000" },
    { mnemonic: "and",  funct3: "111", funct7: "0000000" },
    { mnemonic: "sll",  funct3: "001", funct7: "0000000" },
    { mnemonic: "srl",  funct3: "101", funct7: "0000000" },
    { mnemonic: "sra",  funct3: "101", funct7: "0100000" },
    { mnemonic: "slt",  funct3: "010", funct7: "0000000" },
    { mnemonic: "sltu", funct3: "011", funct7: "0000000" },
  ];

  const instr = rInstrs[Math.floor(rng() * rInstrs.length)];

  // Random registers (x1 t/m x31)
  const rd  = 1 + Math.floor(rng() * 31);
  let rs1 = 1 + Math.floor(rng() * 31);
  let rs2 = 1 + Math.floor(rng() * 31);
  while (rs1 === rd) rs1 = 1 + Math.floor(rng() * 31);
  while (rs2 === rd || rs2 === rs1) rs2 = 1 + Math.floor(rng() * 31);

  const opcode = "0110011";

  const html = `
<p>Welke RISC-V instructie is weergegeven in onderstaande figuur?</p>
<table border="1" cellpadding="4" style="border-collapse: collapse;">
  <tr><th>funct7</th><th>rs2</th><th>rs1</th><th>funct3</th><th>rd</th><th>opcode</th></tr>
  <tr><td>${parseInt(instr.funct7, 2)}</td><td>${rs2}</td><td>${rs1}</td><td>${parseInt(instr.funct3, 2)}</td><td>${rd}</td><td>${parseInt(opcode, 2)}</td></tr>
</table>
<p> Gebruik de <a href="https://www.cs.sfu.ca/~ashriram/Courses/CS295/assets/notebooks/RISCV/RISCV_CARD.pdf" target="_blank">RISC-V instructietabel</a> om de instructie te decoderen.</p>
<p><strong>Typ de correcte assembly instructie:</strong></p>
`;

  const correctAnswer = `${instr.mnemonic} x${rd}, x${rs1}, x${rs2}`;

      const uitleg = `
De instructie is een R-type met opcode ${opcode} (decimaal ${parseInt(opcode,2)}).<br>
funct7 (${instr.funct7}) en funct3 (${instr.funct3}) bepalen het specifieke type instructie (${instr.mnemonic}).<br>
De registers zijn: rd = x${rd}, rs1 = x${rs1}, rs2 = x${rs2}.<br>
Dit is precies hoe RISC-V instructies in assembler worden geschreven: <code>${correctAnswer}</code>.
`;

  questions.push({
    id: `riscv-instruction-decode-table`,
    title: 'RISC-V Instructie Decoderen op basis van tabel',
    label: html,
    answer: correctAnswer,
    categories: ['RISC-V'],
    hint: `Gebruik de RISC-V instructieset om te bepalen welke instructie dit is op basis van de funct3 en funct7 velden.`,
    correctAnswers: [correctAnswer],
    explanation: uitleg.trim()
  });
}

// Vraag 5: Wat is de uitkomst van een instructie gegeven 3 registerwaarden?
{
  const instrList = [
    { mnemonic: "add",  type: "R", exec: (rs1, rs2) => rs1 + rs2 },
    { mnemonic: "sub",  type: "R", exec: (rs1, rs2) => Math.max(1, rs1 - rs2) }, // voorkom negatief
    { mnemonic: "xor",  type: "R", exec: (rs1, rs2) => rs1 ^ rs2 },
    { mnemonic: "or",   type: "R", exec: (rs1, rs2) => rs1 | rs2 },
    { mnemonic: "and",  type: "R", exec: (rs1, rs2) => rs1 & rs2 },
    { mnemonic: "sll",  type: "R", exec: (rs1, rs2) => rs1 << (rs2 & 0x1F) },
    { mnemonic: "srl",  type: "R", exec: (rs1, rs2) => rs1 >>> (rs2 & 0x1F) },
    { mnemonic: "sra",  type: "R", exec: (rs1, rs2) => Math.max(1, rs1 >> (rs2 & 0x1F)) }, // voorkom negatief
    { mnemonic: "slt",  type: "R", exec: (rs1, rs2) => (rs1 < rs2) ? 1 : 0 },
    { mnemonic: "sltu", type: "R", exec: (rs1, rs2) => (rs1 >>> 0) < (rs2 >>> 0) ? 1 : 0 },
    { mnemonic: "addi", type: "I", exec: (rs1, imm) => rs1 + imm },
    { mnemonic: "xori", type: "I", exec: (rs1, imm) => rs1 ^ imm },
    { mnemonic: "ori",  type: "I", exec: (rs1, imm) => rs1 | imm },
    { mnemonic: "andi", type: "I", exec: (rs1, imm) => rs1 & imm },
    { mnemonic: "slli", type: "I", exec: (rs1, imm) => rs1 << (imm & 0x1F) },
    { mnemonic: "srli", type: "I", exec: (rs1, imm) => rs1 >>> (imm & 0x1F) },
    { mnemonic: "srai", type: "I", exec: (rs1, imm) => Math.max(1, rs1 >> (imm & 0x1F)) }, // voorkom negatief
    { mnemonic: "slti", type: "I", exec: (rs1, imm) => (rs1 < imm) ? 1 : 0 },
    { mnemonic: "sltiu",type: "I", exec: (rs1, imm) => (rs1 >>> 0) < (imm >>> 0) ? 1 : 0 },
  ];

  const instr = instrList[Math.floor(rng() * instrList.length)];

  // Zorg dat alle registerwaarden altijd > 0 zijn
  const x6 = Math.floor(rng() * 255) + 1;
  const x16 = Math.floor(rng() * 255) + 1;
  const x17 = Math.floor(rng() * 255) + 1;

  let instruction = "";
  let newX6 = x6;
  let uitleg = "";

  if (instr.type === "R") {
    instruction = `${instr.mnemonic} x6, x16, x17`;
    newX6 = instr.exec(x16, x17);
    uitleg = `De ${instr.mnemonic}-instructie gebruikt x16 (${x16}) en x17 (${x17}) als invoer en slaat het resultaat op in x6.`;
  } else if (instr.type === "I") {
    const imm = Math.floor(rng() * 31) + 1; // voorkom imm = 0
    instruction = `${instr.mnemonic} x6, x16, ${imm}`;
    newX6 = instr.exec(x16, imm);
    uitleg = `De ${instr.mnemonic}-instructie gebruikt x16 (${x16}) en immediate ${imm} als invoer en slaat het resultaat op in x6.`;
  }

  // Zorg dat newX6 altijd positief blijft
  newX6 = Math.max(1, newX6 >>> 0);
  newX6 = newX6 & 0xFFFFFFFF;

  const html = `
<p>Neem aan dat voor een instructie wordt uitgevoerd steeds geldt: x6 = 0x${x6.toString(16).toUpperCase()}, x16 = 0x${x16.toString(16).toUpperCase()}, x17 = 0x${x17.toString(16).toUpperCase()}.</p>
<p>Beantwoord onderstaande vraag met behulp van <a href="https://www.cs.sfu.ca/~ashriram/Courses/CS295/assets/notebooks/RISCV/RISCV_CARD.pdf" target="_blank">de instructieset</a>.</p>
<p>Wat is na de instructie de hexadecimale waarde van x6, x16 en x17?<br>
Geef het antwoord als volgt: 0x45, 0xBB, 0x12</p>
<p><strong>instructie: ${instruction}</strong></p>
`;

  const correctAnswer = `0x${newX6.toString(16).toUpperCase()}, 0x${x16.toString(16).toUpperCase()}, 0x${x17.toString(16).toUpperCase()}`;

  questions.push({
    id: `riscv-instruction-result`,
    title: 'RISC-V Instructie Uitkomst Bepalen',
    label: html,
    categories: ['RISC-V'],
    answer: correctAnswer,
    hint: `Gebruik de RISC-V instructieset om te bepalen wat de instructie doet met de registers x6, x16, en/of x17. De eerste waarde in een instructie is de locatie waar het resultaat wordt opgeslagen.`,
    correctAnswers: [correctAnswer],
    explanation: uitleg
  });
}



// Vraag 6: Seed-gebaseerde branch target bepaling met vaste blokvolgorde
{
  const blocks = ['blok1', 'blok2', 'blok3', 'blok4', 'blok5'];

  const jumpTargetIndex = Math.floor(rng() * 4);
  const jumpTargetLabel = blocks[jumpTargetIndex];

  let sourceCode = `<pre><code>.text\n\n`;
  for (let i = 0; i < blocks.length; i++) {
    if (i < 4) {
      sourceCode += `${blocks[i]}:\n  addi x${i + 5}, zero, ${i + 1}\n\n`;
    } else {
      sourceCode += `${blocks[i]}:\n  bne x0, x0,\n\n`;
    }
  }
  sourceCode += `</code></pre>`;

  let assemblerOutput = `
    <table border="1" cellpadding="5" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Address</th>
          <th>Code</th>
          <th>Basic</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
  `;
  let pc = 0x00400000;
  for (let i = 0; i < blocks.length; i++) {
    if (i < 4) {
      const reg = i + 5;
      const val = i + 1;
      assemblerOutput += `
  <tr>
    <td>0x${pc.toString(16).padStart(8, '0')}</td>
    <td>0x00${val}00${reg.toString(16)}13</td>
    <td>addi x${reg}, x0, ${val}</td>
    <td>addi x${reg}, zero, ${val}</td>
  </tr>
`;
      pc += 4;
    } else {
      const currentPC = pc;
      const targetPC = 0x00400000 + (jumpTargetIndex * 4);
      const offset = targetPC - currentPC;

      assemblerOutput += `
  <tr>
    <td>0x${pc.toString(16).padStart(8, '0')}</td>
    <td>0xfe001ee3</td>
    <td>bne x0, x0, ${offset}</td>
    <td>bne x0, x0,</td>
  </tr>
`;
    }
  }
  assemblerOutput += `
    </tbody>
  </table>
`;

  const uitleg = `De branch instructie <code>bne x0, x0,</code> wordt altijd niet uitgevoerd omdat x0 gelijk is aan x0. Toch moeten we bepalen welk blok het doel zou zijn als de sprong wel plaatsvindt. Dit gebeurt op basis van het offset in de assembler output.`;

  const html = `
  <p>Gegeven onderstaande code waarbij de laatste parameter van de branch instructie niet is weergegeven.</p>
  ${sourceCode}
  <p>Na assembleren geeft de RARS simulator onderstaande informatie.</p>
  ${assemblerOutput}
  <p>Wat is de laatste parameter van het branch statement?<br>
  Antwoord met "blok1", "blok2", "blok3" of "blok4".</p>
  `;

  questions.push({
    id: `branch-target-determination`,
    title: 'Branch Target Bepalen',
    label: html,
    categories: ['RISC-V', 'Branching'],
    hint: `Bepaal het offset van de branch instructie in de assembler output en gebruik dit om het doelblok te vinden.`,
    answer: jumpTargetLabel,
    correctAnswers: [jumpTargetLabel],
    explanation: uitleg
  });
}

{
  // Willekeurige beginwaarden genereren
  const x13_init = 1;  // Dit kun je ook willekeurig maken als je wilt
  const x14_init = Math.floor(rng() * 10 - 5);  // Bijv. -5 t/m 4
  const x15_init = Math.floor(rng() * 10 - 10); // Bijv. -10 t/m -1

  // Genereer assembly code met deze waarden
  const html = `
<p>Bekijk het onderstaande RISC-V programma:</p>
<pre><code>.text
init:
  addi x13, zero, ${x13_init}
  addi x14, zero, ${x14_init}
  addi x15, x0, ${x15_init}
loop:
  sub x15, zero, x15
  add x14, x13, x14
  bne x13, x14, loop
  j end
blok:
  addi x15, x15, 3
end:
  addi x14, x14, -2</code></pre>

<p>Welke waarden staan er in de registers na het uitvoeren van dit programma?</p>
<p>Geef het antwoord in het formaat: <code>x14 = ? en x15 = ?</code></p>
`;

  // Simuleer het programma om het correcte antwoord te bepalen
  let x13 = x13_init;
  let x14 = x14_init;
  let x15 = x15_init;

  while (x13 !== x14) {
    x15 = -x15;
    x14 = x14 + x13;
  }

  // blok wordt overgeslagen
  x14 = x14 - 2;

  const correctAnswer = `x14 = ${x14} en x15 = ${x15}`;

  const uitleg = `
✔️ Het programma voert de lus uit totdat x13 gelijk is aan x14.
Daarna stopt de lus en springt hij naar <code>end</code>. Daar wordt x14 nog met 2 verminderd:
<code>x14 = ${x14 + 2} - 2 = ${x14}</code>.<br>
x15 blijft ${x15} omdat <code>blok</code> wordt overgeslagen.
`;

  questions.push({
    title: 'Waarden in registers na RISC-V programma',
    label: html,
    categories: ['RISC-V'],
    hint: 'Doorloop het programma stap voor stap. Kijk goed wanneer de lus stopt en of de blok-instructies worden uitgevoerd.',
    answer: correctAnswer,
    correctAnswers: [correctAnswer],
    explanation: uitleg.trim()
  });
}

{
  // Genereer willekeurige getallen
  const getallen = Array.from({length: 7}, () => 5 + Math.floor(rng() * 11)); // 5 t/m 15
  const t2Index = 0; // eerste element
  const t3Index = 1; // tweede element
  const t5Value = 2 + Math.floor(rng() * 4); // 2 t/m 5

  const t2Value = getallen[t2Index];
  const t3Value = getallen[t3Index];
  const s1Value = (t2Value * t5Value) + t3Value;

  const html = `
<p>Welke decimale waarde staat in register <code>s1</code> na uitvoeren van onderstaande code?</p>
<pre><code>.data
getallen: .word ${getallen.join(', ')}

.text
la t1, getallen
lw t2, (t1)
lw t3, 4(t1)
li t5, ${t5Value}
mul t2, t2, t5
add s1, t2, t3</code></pre>

<p>Voer als antwoord alleen het decimale getal in.</p>
`;

  const uitleg = `✔️ t2 = ${t2Value}, t3 = ${t3Value}, t5 = ${t5Value}.<br>
t2 * t5 = ${t2Value * t5Value}.<br>
+ t3 = ${s1Value}.`;

  questions.push({
    id: 'riscv-data-calc',
    title: 'Registerwaarde na uitvoering',
    label: html,
    categories: ['RISC-V'],
    hint: `Let goed op welke waarden in het geheugen staan en hoe deze worden geladen.`,
    answer: s1Value.toString(),
    correctAnswers: [s1Value.toString()],
    explanation: uitleg
  });
}

{
  // Willekeurige waarden voor x10 en x11
  const x10Init = 10 + Math.floor(rng() * 21);  // 10 t/m 30
  const x11Init = 20 + Math.floor(rng() * 31);  // 20 t/m 50
  const addiVal = 1 + Math.floor(rng() * 5);    // 1 t/m 5

  // Berekeningen stap voor stap
  const x10AfterAddi = x11Init + addiVal;
  const x12Val = x10AfterAddi + x11Init;

  // Vraagtekst
  const html = `
<p>Welke (decimale) waarde staat in register <code>x12</code> na uitvoeren van onderstaande code?</p>
<pre><code>li x10, ${x10Init}
li x11, ${x11Init}
addi x10, x11, ${addiVal}
add x12, x10, x11</code></pre>
<p>Voer als antwoord alleen het decimale getal in.</p>
`;

  const uitleg = `
✔️ Uitleg van de stappen:
<ul>
  <li><code>li x10, ${x10Init}</code></li>
  <li><code>li x11, ${x11Init}</code></li>
  <li><code>addi x10, x11, ${addiVal}</code> → x10 = ${x11Init} + ${addiVal} = ${x10AfterAddi}</li>
  <li><code>add x12, x10, x11</code> → x12 = ${x10AfterAddi} + ${x11Init} = ${x12Val}</li>
</ul>
Het juiste antwoord is dus <strong>${x12Val}</strong>.
`;

  questions.push({
    id: 'riscv-x12-calc',
    title: 'Bereken registerwaarde x12',
    label: html,
    categories: ['RISC-V'],
    hint: `Let goed op hoe x10 overschreven wordt door de addi-instructie.`,
    answer: x12Val.toString(),
    correctAnswers: [x12Val.toString()],
    explanation: uitleg.trim()
  });
}

{
  // Willekeurige 32-bit waarde
  const word = Math.floor(rng() * 0xFFFFFFFF);
  
  // De afzonderlijke bytes in little-endian volgorde
  const b0 = word & 0xFF;               // adres 0x10000
  const b1 = (word >> 8) & 0xFF;        // adres 0x10001
  const b2 = (word >> 16) & 0xFF;       // adres 0x10002
  const b3 = (word >> 24) & 0xFF;       // adres 0x10003

  // De 16-bit waarde die geladen wordt
  const val16 = (b1 << 8) | b0;

  // 32-bit registerwaarde
  const val32 = val16 >>> 0;  // unsigned 32-bit
  const val32hex = `0x${val32.toString(16).toUpperCase().padStart(8, '0')}`;

  // Vraagtekst
  const html = `
<p>Gegeven:</p>
<ul>
<li>De processor hanteert <strong>little-endian</strong>;</li>
<li>Op geheugenadres <code>0x10000</code> is de 32-bit integer <code>0x${word.toString(16).toUpperCase().padStart(8, '0')}</code> opgeslagen;</li>
<li>De processor leest een 16-bit integer van geheugenadres <code>0x10000</code>, en slaat deze op in (32-bit) register <code>x10</code>.</li>
</ul>
<p>Welke waarde heeft register <code>x10</code>?</p>
<p><em>Voer je antwoord in als een 32-bit hexadecimale waarde, bijvoorbeeld <code>0x00003C4D</code></em></p>
`;

  // Uitleg
  const uitleg = `
De 32-bit integer <code>0x${word.toString(16).toUpperCase().padStart(8, '0')}</code> bestaat uit de bytes:
<ul>
<li><code>0x${b3.toString(16).toUpperCase().padStart(2, '0')}</code> (hoogste byte, adres 0x10003)</li>
<li><code>0x${b2.toString(16).toUpperCase().padStart(2, '0')}</code> (adres 0x10002)</li>
<li><code>0x${b1.toString(16).toUpperCase().padStart(2, '0')}</code> (adres 0x10001)</li>
<li><code>0x${b0.toString(16).toUpperCase().padStart(2, '0')}</code> (laagste byte, adres 0x10000)</li>
</ul>
Bij little-endian staat <code>0x${b0.toString(16).toUpperCase().padStart(2, '0')}</code> op adres 0x10000 en <code>0x${b1.toString(16).toUpperCase().padStart(2, '0')}</code> op adres 0x10001.<br>
De 16-bit waarde is <code>0x${b1.toString(16).toUpperCase().padStart(2, '0')}${b0.toString(16).toUpperCase().padStart(2, '0')}</code>, dus <code>${val32hex}</code> in een 32-bit register.
`;

  questions.push({
    id: 'riscv-little-endian-load16',
    title: 'Little-endian 16-bit load',
    label: html,
    categories: ['RISC-V', 'Endianness'],
    hint: `Let goed op de bytevolgorde bij little-endian.`,
    answer: val32hex,
    correctAnswers: [val32hex],
    explanation: uitleg.trim()
  });
}

{
  const ops = ['xor', 'or', 'and', 'add', 'sub'];
  const op = ops[Math.floor(rng() * ops.length)];

  const rd = `x${Math.floor(rng() * 28) + 2}`;   // geen x0, x1, of x31
  const rs = `x${Math.floor(rng() * 28) + 2}`;
  const imm1 = Math.floor(rng() * 240) + 1;  // 1..240
  const imm2 = Math.floor(rng() * 240) + 1;

  const imm1Str = rng() < 0.5 ? `0x${imm1.toString(16).toUpperCase()}` : `${imm1}`;
  const imm2Str = rng() < 0.5 ? `0x${imm2.toString(16).toUpperCase()}` : `${imm2}`;

  let result;
  switch (op) {
    case 'xor': result = imm1 ^ imm2; break;
    case 'or': result = imm1 | imm2; break;
    case 'and': result = imm1 & imm2; break;
    case 'add': result = (imm1 + imm2) & 0xFFFFFFFF; break;
    case 'sub': result = (imm1 - imm2 + 0x100000000) & 0xFFFFFFFF; break;
  }

  const askHex = rng() < 0.5;
  const correct = askHex ? `0x${result.toString(16).toUpperCase()}` : `${result}`;
  

  const html = `
<p><strong>Gegeven onderstaande RISC-V assembly code (32 bit). Wat is de waarde van ${rd} als het programma op regel 5 is beland?</strong></p>
<pre>
  addi ${rd}, zero, ${imm1Str}
  addi ${rs}, zero, ${imm2Str}
  ${op} ${rd}, ${rd}, ${rs}
end:  j end
</pre>
<p>Geef je antwoord in ${askHex ? "hexadecimale" : "decimale"} notatie.</p>`;

  questions.push({
    title: 'Waarde van register berekenen in RISC-V',
    label: html,
    answer: correct,
    categories: ['RISC-V', 'Bitwise operators'],
    hint: `De addi-instructies laden immediates in registers, daarna wordt met ${op} een bewerking uitgevoerd tussen ${rd} en ${rs}.`,
    correctAnswers: [correct],
    explanation: `Eerst krijgt ${rd} de waarde ${imm1}, en ${rs} krijgt ${imm2}. Daarna wordt de ${op}-operatie toegepast tussen deze waarden. Het resultaat komt weer in ${rd}.`
  });
}

{
  const baseRegIndex = Math.floor(rng() * 25) + 5; // x5 – x29
  const reg1 = `x${baseRegIndex}`;
  const reg2 = `x${baseRegIndex + 1}`;
  const reg3 = `x${baseRegIndex + 2}`;

  // Genereer array van 10 willekeurige getallen tussen -20 en 20
  const arr = Array.from({ length: 10 }, () => Math.floor(rng() * 41) - 20);

  // Kies twee indexen in het bereik [0, 9]
  const idx1 = Math.floor(rng() * 8);       // max 8 om overflow te vermijden
  const idx2 = idx1 + 1 + Math.floor(rng() * (9 - idx1)); // altijd > idx1

  const offset1 = idx1 * 4;
  const offset2 = idx2 * 4;

  const val1 = arr[idx1];
  const val2 = arr[idx2];

  const asm = `
.data
  arr: .word ${arr.join(' ')}
.text
  la ${reg1}, arr
  lw ${reg2}, ${offset1}(${reg1})
  lw ${reg3}, ${offset2}(${reg1})`.trim();

  questions.push({
    title: 'Lezen uit array met lw en offset',
    label: `
<p><strong>Gegeven onderstaande assembly code:</strong></p>
<pre><code>${asm}</code></pre>
<p>Wat zijn de decimale waarden van de registers <code>${reg2}</code> en <code>${reg3}</code> na het uitvoeren van deze code?</p>
<p>Antwoordformaat: <code>${reg2} = ...</code> en <code>${reg3} = ...</code></p>`,
    answer: `${reg2} = ${val1} en ${reg3} = ${val2}`,
    categories: ['RISC-V', 'Arrays'],
    hint: `Een 'word' is 4 bytes groot. Gebruik de offset om het juiste element te berekenen.`,
    correctAnswers: [
      `${reg2} = ${val1} en ${reg3} = ${val2}`,
      `${reg3} = ${val2} en ${reg2} = ${val1}`
    ],
    explanation: `De array bevat: ${arr.join(', ')}.<br>
<code>la ${reg1}, arr</code> laadt het adres van het eerste element.<br>
<code>lw ${reg2}, ${offset1}(${reg1})</code> leest waarde op index ${idx1} = ${val1}.<br>
<code>lw ${reg3}, ${offset2}(${reg1})</code> leest waarde op index ${idx2} = ${val2}.`
  });
}

{
  const baseRegIndex = Math.floor(rng() * 25) + 5; // x5 – x29
  const reg1 = `x${baseRegIndex}`;
  const reg2 = `x${baseRegIndex + 1}`;
  const reg3 = `x${baseRegIndex + 2}`;

  // Genereer array van 10 willekeurige getallen tussen -20 en 20
  const arr = Array.from({ length: 10 }, () => Math.floor(rng() * 41) - 20);

  // Kies twee indexen in het bereik [0, 9]
  const idx1 = Math.floor(rng() * 8);       // max 8 om overflow te vermijden
  const idx2 = idx1 + 1 + Math.floor(rng() * (9 - idx1)); // altijd > idx1

  const offset1 = idx1 * 4;
  const offset2 = idx2 * 4;

  const val1 = arr[idx1];
  const val2 = arr[idx2];

  const asm = `
.data
  arr: .word ${arr.join(' ')}
.text
  la ${reg1}, arr
  lw ${reg2}, ${offset1}(${reg1})
  lw ${reg3}, ${offset2}(${reg1})`.trim();

  questions.push({
    title: 'Lezen uit array met lw en offset',
    label: `
<p><strong>Gegeven onderstaande assembly code:</strong></p>
<pre><code>${asm}</code></pre>
<p>Wat zijn de decimale waarden van de registers <code>${reg2}</code> en <code>${reg3}</code> na het uitvoeren van deze code?</p>
<p>Antwoordformaat: <code>${reg2} = ...</code> en <code>${reg3} = ...</code></p>`,
    answer: `${reg2} = ${val1} en ${reg3} = ${val2}`,
    categories: ['RISC-V'],
    hint: `Een 'word' is 4 bytes groot. Gebruik de offset om het juiste element te berekenen.`,
    correctAnswers: [
      `${reg2} = ${val1} en ${reg3} = ${val2}`,
      `${reg3} = ${val2} en ${reg2} = ${val1}`
    ],
    explanation: `De array bevat: ${arr.join(', ')}.<br>
<code>la ${reg1}, arr</code> laadt het adres van het eerste element.<br>
<code>lw ${reg2}, ${offset1}(${reg1})</code> leest waarde op index ${idx1} = ${val1}.<br>
<code>lw ${reg3}, ${offset2}(${reg1})</code> leest waarde op index ${idx2} = ${val2}.`
  });
}

// Meerkeuzevraag: RISC-V standaard
{
      const correct = "RISC-V is een open standaard. Elke ontwikkelaar kan een CPU ontwikkelen en uitbrengen die RISC-V implementeert."
      const incorrect = [
        "RISC-V is een gesloten standaard. Alleen goedgekeurde bedrijven kan een CPU ontwikkelen en uitbrengen die RISC-V implementeert.",
        "RISC-V is een licentiestandaard. Alleen bedrijven die een licentie gekocht hebben kunnen een CPU ontwikkelen en uitbrengen die RISC-V implementeert.",
        "RISC-V is een standaard die alleen gebruikt wordt in embedded systemen. Het is niet geschikt voor algemene computers.",
        "RISC-V is een standaard die alleen gebruikt wordt in high-performance computing. Het is niet geschikt voor embedded systemen.",
        "RISC-V is een standaard die alleen gebruikt wordt in mobiele apparaten. Het is niet geschikt voor servers of desktops.",
        "RISC-V is een standaard die alleen gebruikt wordt in de academische wereld. Het is niet geschikt voor commerciële toepassingen.",
        "RISC-V is een standaard die alleen gebruikt wordt in de gaming industrie. Het is niet geschikt voor andere toepassingen."
      ];

      const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 7)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];

    const html = `
<p>Welke van de onderstaande beweringen over RISC-V is waar?</p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van het juiste antwoord:</p>`;

    questions.push({
      id: 'riscv-standard',
      title: 'RISC-V Standaard',
      label: html,
      categories: ['RISC-V'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      hint: `Denk na over de aard van RISC-V en hoe het zich verhoudt tot andere CPU-architecturen.`,
      explanation: `RISC-V is een open standaard, wat betekent dat iedereen vrij is om een CPU te ontwikkelen die deze standaard implementeert. Dit bevordert innovatie en samenwerking in de industrie.`
    });
  }
  // Meerkeuzevraag: Beweringen over RISC-V processoren
  {
    const correct = "RISC betekent Reduced Instruction Set Computer";
    const incorrect = [
      "Caching kan niet worden toegepast omdat veel instructies langer duren dan 1 klokperiode.",
      "Met een ADD instructie kan data vanuit het externe geheugen worden opgeteld bij de inhoud van een register.",
      "RISC-V is een 64-bit processor, dus alle registers zijn 64 bits breed.",
      "RISC-V is een 32-bit processor, dus alle registers zijn 32 bits breed.",
      "Alle instructies hebben een variabele lengte.",
      "RISC-V is alleen geschikt voor embedded systemen en niet voor algemene computers.",
      "RISC-V is alleen geschikt voor high-performance computing en niet voor embedded systemen.",
      "Met een SUB instructie kan data vanuit het externe geheugen worden afgetrokken van de inhoud van een register.",
      "RISC-V is alleen geschikt voor mobiele apparaten en niet voor servers of desktops.",
      "RISC bevat meer instructies dan CISC, waardoor het complexer is.",
      "RISC betekent Robot Instruction Set Computer",
      "RISC betekent Reduced Instruction Set Code",
      "RISC betekent Real International Standard Code",
    ];
    const options = shuffle([
      correct,
      ...shuffle(incorrect).slice(0, 7)
    ]);

    const labels = "ABCDEFGH".split('');
    const correctLabel = labels[options.indexOf(correct)];
    const html = `
<p>Welke van de onderstaande beweringen over RISC-V processoren is waar?</p>
<ol type="A">
  ${options.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van het juiste antwoord:</p>`;
    questions.push({
      id: 'riscv-processor-statements',
      title: 'RISC-V Processor Beweringen',
      label: html,
      categories: ['RISC-V'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      hint: `Denk na over de betekenis van RISC en de kenmerken van RISC-V processoren.`,
      explanation: `RISC staat voor Reduced Instruction Set Computer, wat betekent dat RISC-V een set van eenvoudige instructies heeft die snel kunnen worden uitgevoerd.`
    });
  }


  return questions;
}
