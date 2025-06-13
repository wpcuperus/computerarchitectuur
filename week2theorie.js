function randomHex32Aligned() {
  // Generate een positief 32-bit getal, laatste hex digit = 0
  // rng() geeft een float tussen 0 (incl) en 1 (excl)
  const num = Math.floor(rng() * 0x100000000); // max 2^32 - 1
  const alignedNum = num & 0xFFFFFFF0; // Zorg dat laatste nibble 0 is
  return alignedNum.toString(16).padStart(8, '0');
}


function generateWeek2TheoryQuestions() {
  const questions = [];

  // Helper voor random hex getal als string met 8 digits
  function randomHex32() {
    return '0x' + Math.floor(rng() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
  }

  // Helper: random 8-bit hex string (2 digits)
  function randomHex8() {
    return Math.floor(rng() * 0x100).toString(16).padStart(2, '0').toUpperCase();
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
      id: `endianness-assembly`,
      title: 'Endianess in Assembly Code',
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
      categories: ['RISC-V', 'Endianness'],
      hint: `Let op de volgorde van de bytes in het gegeven word: is de byte op offset ${offsetLb} het eerste of het laatste byte van rechts? Probeer de volgorde van de bytes te bepalen zoals ze in het geheugen worden opgeslagen bij little endian vs big endian.`,
      correctAnswers: [endianText],
      explanation: explanation.trim()
    });
  }

// Vraag 2: Geheugendump + waarde lezen
{
  // Willekeurig startadres (32bit aligned)
  const startAddrInt = (Math.floor(rng() * 0x100000000) & 0xFFFFFFF0) >>> 0;
const startAddrStr = startAddrInt.toString(16).padStart(8, '0');




  // Maak 16 bytes willekeurige data
  const memBytes = [];
  for (let i = 0; i < 16; i++) {
    memBytes.push(Math.floor(rng() * 0x100));
  }

  // Bouw geheugendump string, 16 bytes per regel
  const hexBytes = memBytes.map(b => b.toString(16).padStart(2, '0'));
  const asciiBytes = memBytes.map(b => (b >= 0x20 && b <= 0x7E) ? String.fromCharCode(b) : '.');

  const line = `${startAddrStr}: <code>${hexBytes.join(' ')}  * ${asciiBytes.join('')} *</code>`;

  // Kies offset binnen de 16 bytes (max offset = 16 - max datatype bytes)
  const dataSizes = [1, 2, 4];
  const dataSize = dataSizes[Math.floor(rng() * dataSizes.length)];

  const maxOffset = 16 - dataSize;
  const offset = Math.floor(rng() * (maxOffset + 1));

  // Little or big endian?
  const littleEndian = rng() < 0.5;

  // Haal relevante bytes
  let valBytes = memBytes.slice(offset, offset + dataSize);
  if (littleEndian) {
    valBytes = valBytes.slice().reverse();
  }

  // Zet de bytes om naar een hex-string (in juiste volgorde)
  const hexValue = '0x' + valBytes.map(b => b.toString(16).padStart(2, '0')).join('');

  // Bouw vraagtekst
  const questionText = `Gegeven onderstaande geheugendump: <br>
  
  ${line}
  <br><br>
  Wat is de ${dataSize * 8}-bits waarde gelezen vanaf geheugenlocatie 0x${(startAddrInt + offset).toString(16).toUpperCase()}? (Houd rekening met de endianess: ${littleEndian ? 'little endian' : 'big endian'})`;

  questions.push({
    id: `memory-dump-value-read`,
    title: 'Geheugendump en Waarde Lezen',
    label: questionText,
    answer: hexValue.toLowerCase(),  // Antwoord in kleine letters
    categories: ['Endianness'],
    // Antwoord met en zonder 0x prefix, en met en zonder spaties tussen elke twee hex-digits
    correctAnswers: [hexValue.toLowerCase(), hexValue.toLowerCase().replace('0x', ''), hexValue.toLowerCase().replace('0x', '').replace(/(.{2})/g, '$1 ').trim()],
    hint: `Bepaal eerst de offset binnen de regel. Kijk vervolgens welke bytes je nodig hebt op basis van het aantal bits. Vergeet niet om de bytes om te keren bij little endian voordat je ze samenvoegt tot een hexadecimale waarde.`
  });
}


  return questions;
}
