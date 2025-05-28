function generateWeek4Questions() {
  const questions = [];

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
  label: html,
  answer: correctLabel,
  correctAnswers: [correctLabel],
  explanation: uitleg
});
  }

  // Vraag 2: Endianness bepalen
  {
    // Willekeurige .word waarde
    const word = Math.floor(rng() * 0xFFFFFFFF);
    const wordHex = word.toString(16).padStart(8, '0').toUpperCase();

    // Willekeurig endianness scenario
    const isLittleEndian = rng() < 0.5;

    // Genereer byte array
    const bytes = [];
    for (let i = 0; i < 4; i++) {
      const byte = (word >> (isLittleEndian ? i * 8 : (3 - i) * 8)) & 0xFF;
      bytes.push(byte);
    }

    // Willekeurige offset
    const offsetLb = Math.floor(rng() * 4);
    let offsetLbu = offsetLb;
    while (offsetLbu === offsetLb) {
      offsetLbu = Math.floor(rng() * 4);
    }

// Registers, zorg dat ze allemaal verschillend zijn
const possibleRegs = [
  "x10", "x11", "x12", "x13", "x14", "x15", "x16", "x17"
];

// Functie om een register te kiezen en uit de lijst te verwijderen
function pickRegister(list) {
  const idx = Math.floor(rng() * list.length);
  const reg = list[idx];
  list.splice(idx, 1); // verwijderen zodat niet nogmaals gekozen wordt
  return reg;
}

const regsCopy = [...possibleRegs];

const regBase = pickRegister(regsCopy);  // Kies eerste register
const regLb = pickRegister(regsCopy);    // Kies tweede register, verschillend van regBase
const regLbu = pickRegister(regsCopy);   // Kies derde register, verschillend van regBase en regLb


    // Waarden in registers
    const valLb = ((bytes[offsetLb] << 24) >> 24) >>> 0;
    const valLbSigned = valLb > 0x7F ? (valLb | 0xFFFFFF00) >>> 0 : valLb;

    const valLbu = bytes[offsetLbu];

    const endianText = isLittleEndian ? "Little Endian" : "Big Endian";

    const asmCode = `
.data
arr2: .word 0x${wordHex}

.text
la ${regBase}, arr2
lb ${regLb}, ${offsetLb}(${regBase})
lbu ${regLbu}, ${offsetLbu}(${regBase})
`;

    const explanation = `
Toelichting: In de .word 0x${wordHex} worden de bytes als ${
      isLittleEndian ? "LSB eerst" : "MSB eerst"
    } opgeslagen.<br>
Offset ${offsetLb} bevat byte 0x${bytes[offsetLb].toString(16).padStart(2, '0')}, offset ${offsetLbu} bevat byte 0x${bytes[offsetLbu].toString(16).padStart(2, '0')}<br>
`;

    questions.push({
label: `
<p>Gegeven onderstaande assembly code:</p>
<pre><code>${asmCode.trim()}</code></pre>
<p>Na het uitvoeren van dit programma hebben de registers de volgende waarden:</p>
<ul>
  <li>${regBase}: 0x10010000</li>
  <li>${regLb}: 0x${valLbSigned.toString(16).padStart(8, '0').toUpperCase()}</li>
  <li>${regLbu}: 0x${valLbu.toString(16).padStart(8, '0').toUpperCase()}</li>
</ul>
<p><strong>Welke notatiewijze wordt gebruikt door de processor?</strong></p>
<p>(Typ: <code>Little Endian</code> of <code>Big Endian</code>)</p>`,
      answer: endianText,
      correctAnswers: [endianText],
      explanation: explanation.trim()
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
    { mnemonic: "srl",  opcode: "0110011", funct3: "101", funct7: "0000000", format: "R" },
    { mnemonic: "sra",  opcode: "0110011", funct3: "101", funct7: "0100000", format: "R" },
    { mnemonic: "slt",  opcode: "0110011", funct3: "010", funct7: "0000000", format: "R" },
    { mnemonic: "sltu", opcode: "0110011", funct3: "011", funct7: "0000000", format: "R" },
  ];

  // I-type instructies
  const iTypeInstrs = [
    { mnemonic: "addi", opcode: "0010011", funct3: "000", format: "I" },
    { mnemonic: "xori", opcode: "0010011", funct3: "100", format: "I" },
    { mnemonic: "ori",  opcode: "0010011", funct3: "110", format: "I" },
    { mnemonic: "andi", opcode: "0010011", funct3: "111", format: "I" },
    { mnemonic: "slli", opcode: "0010011", funct3: "001", format: "I", funct7: "0000000" },
    { mnemonic: "srli", opcode: "0010011", funct3: "101", format: "I", funct7: "0000000" },
    { mnemonic: "srai", opcode: "0010011", funct3: "101", format: "I", funct7: "0100000" },
    { mnemonic: "slti", opcode: "0010011", funct3: "010", format: "I" },
    { mnemonic: "sltiu",opcode: "0010011", funct3: "011", format: "I" },
  ];

  // Kies random type instructie
  const isRType = (Math.random() < 0.5);

  // Register helper (x10 t/m x20)
  function randReg() {
    return 10 + Math.floor(Math.random() * 11);
  }

  // Genereer willekeurige 32-bit hex (4 bytes) als string "0x????????"
function randomHex32() {
  return '0x' + Math.floor(Math.random() * 0x01000000).toString(16).padStart(8, '0');
}

  let instr, rd, rs1, rs2, imm, instrHex, binaryInstr;

  if (isRType) {
    instr = rTypeInstrs[Math.floor(Math.random() * rTypeInstrs.length)];
    rd = randReg();
    rs1 = randReg();
    rs2 = randReg();
    while (rs1 === rd) rs1 = randReg();
    while (rs2 === rd || rs2 === rs1) rs2 = randReg();

    binaryInstr =
      instr.funct7 +
      regBin(rs2) +
      regBin(rs1) +
      instr.funct3 +
      regBin(rd) +
      instr.opcode;

    instrHex = parseInt(binaryInstr, 2).toString(16).padStart(8, '0');
  } else {
    instr = iTypeInstrs[Math.floor(Math.random() * iTypeInstrs.length)];
    rd = randReg();
    rs1 = randReg();
    while (rs1 === rd) rs1 = randReg();

    if (["slli","srli","srai"].includes(instr.mnemonic)) {
      imm = Math.floor(Math.random() * 32);
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
      imm = Math.floor(Math.random() * 4096) - 2048;
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
  label: questionText,
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
    label: html,
    answer: correctAnswer,
    correctAnswers: [correctAnswer],
    explanation: uitleg.trim()
  });
}

// Vraag 5: Wat is de uitkomst van een instructie gegeven 3 registerwaarden?
{
  const instrList = [
    { mnemonic: "add",  type: "R", exec: (rs1, rs2) => rs1 + rs2 },
    { mnemonic: "sub",  type: "R", exec: (rs1, rs2) => rs1 - rs2 },
    { mnemonic: "xor",  type: "R", exec: (rs1, rs2) => rs1 ^ rs2 },
    { mnemonic: "or",   type: "R", exec: (rs1, rs2) => rs1 | rs2 },
    { mnemonic: "and",  type: "R", exec: (rs1, rs2) => rs1 & rs2 },
    { mnemonic: "sll",  type: "R", exec: (rs1, rs2) => rs1 << (rs2 & 0x1F) },
    { mnemonic: "srl",  type: "R", exec: (rs1, rs2) => rs1 >>> (rs2 & 0x1F) },
    { mnemonic: "sra",  type: "R", exec: (rs1, rs2) => rs1 >> (rs2 & 0x1F) },
    { mnemonic: "slt",  type: "R", exec: (rs1, rs2) => (rs1 < rs2) ? 1 : 0 },
    { mnemonic: "sltu", type: "R", exec: (rs1, rs2) => (rs1 >>> 0) < (rs2 >>> 0) ? 1 : 0 },
    { mnemonic: "addi", type: "I", exec: (rs1, imm) => rs1 + imm },
    { mnemonic: "xori", type: "I", exec: (rs1, imm) => rs1 ^ imm },
    { mnemonic: "ori",  type: "I", exec: (rs1, imm) => rs1 | imm },
    { mnemonic: "andi", type: "I", exec: (rs1, imm) => rs1 & imm },
    { mnemonic: "slli", type: "I", exec: (rs1, imm) => rs1 << (imm & 0x1F) },
    { mnemonic: "srli", type: "I", exec: (rs1, imm) => rs1 >>> (imm & 0x1F) },
    { mnemonic: "srai", type: "I", exec: (rs1, imm) => rs1 >> (imm & 0x1F) },
    { mnemonic: "slti", type: "I", exec: (rs1, imm) => (rs1 < imm) ? 1 : 0 },
    { mnemonic: "sltiu",type: "I", exec: (rs1, imm) => (rs1 >>> 0) < (imm >>> 0) ? 1 : 0 },
  ];

  const instr = instrList[Math.floor(rng() * instrList.length)];

  const x6 = Math.floor(rng() * 256);
  const x16 = Math.floor(rng() * 256);
  const x17 = Math.floor(rng() * 256);

  let instruction = "";
  let newX6 = x6;
  let uitleg = "";

  if (instr.type === "R") {
    instruction = `${instr.mnemonic} x6, x16, x17`;
    newX6 = instr.exec(x16, x17);
    uitleg = `De ${instr.mnemonic}-instructie gebruikt x16 (${x16}) en x17 (${x17}) als invoer en slaat het resultaat op in x6.`;
  } else if (instr.type === "I") {
    const imm = Math.floor(rng() * 32);
    instruction = `${instr.mnemonic} x6, x16, ${imm}`;
    newX6 = instr.exec(x16, imm);
    uitleg = `De ${instr.mnemonic}-instructie gebruikt x16 (${x16}) en immediate ${imm} als invoer en slaat het resultaat op in x6.`;
  }

  newX6 = newX6 >>> 0;
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
    label: html,
    answer: correctAnswer,
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
    label: html,
    answer: jumpTargetLabel,
    correctAnswers: [jumpTargetLabel],
    explanation: uitleg
  });
}


  return questions;
}
