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

  // Vraag 1: Assembly code endianess
  {
    const baseAddr = randomHex32(); // bv. 0x10010000
    // Willekeurige 32-bit word data (in hex, 8 hex digits)
    const dataWord = randomHex32();

    // Beslis endianess 50/50
    const littleEndian = rng() < 0.5;

    // Data bytes uit dataWord (big endian string in hex, bv 'ABCDEF12')
    const dataBytesBE = dataWord.slice(2).match(/.{2}/g); // [ 'AB', 'CD', 'EF', '12' ]

    // dataBytesLE is reversed (little endian)
    const dataBytesLE = [...dataBytesBE].reverse();

    // lb x15, 2(x12) = byte op offset 2 vanaf baseAddr
    // lbu x16, 3(x12) = byte op offset 3 vanaf baseAddr (unsigned)
    // x12 = baseAddr

    // Registreerwaarden berekenen
    // x15 is lb -> signed byte at offset 2
    // x16 is lbu -> unsigned byte at offset 3

    const byteOffset2 = littleEndian ? parseInt(dataBytesLE[2], 16) : parseInt(dataBytesBE[2], 16);
    let x15_val = byteOffset2;
    if (x15_val > 0x7F) x15_val = x15_val - 0x100; // signed extend

    const byteOffset3 = littleEndian ? parseInt(dataBytesLE[3], 16) : parseInt(dataBytesBE[3], 16);
    const x16_val = byteOffset3; // unsigned

    const questionText = `Gegeven onderstaande assembly code:<br>

.data <br>
arr2: .word ${dataWord} <br>
<br>
.text <br>
la x12, arr2 <br>
lb x15, 2(x12) <br>
lbu x16, 3(x12) <br><br>

Na het uitvoeren van dit programma hebben de registers de volgende waarden: <br>
x12 = ${baseAddr} <br>
x15 = 0x${(x15_val < 0 ? (x15_val + 0x100).toString(16).toUpperCase() : x15_val.toString(16).padStart(2,'0').toUpperCase())} <br>
x16 = 0x${x16_val.toString(16).padStart(2,'0').toUpperCase()} <br>

Welke notatiewijze wordt gebruikt door de processor?`;

    questions.push({
      title: 'Endianess in Assembly Code',
      label: questionText,
      answer: littleEndian ? 'little endian' : 'big endian',
      hint: `Let op de volgorde van de bytes in het gegeven word: is de byte op offset 2 het derde of het eerste byte van rechts? Probeer de volgorde van de bytes te bepalen zoals ze in het geheugen worden opgeslagen bij little endian vs big endian.`,
      correctAnswers: ['little endian', 'big endian']
    });
  }

// Vraag 2: Geheugendump + waarde lezen
{
  // Willekeurig startadres (32bit aligned)
  const startAddrInt = Math.floor(rng() * 0xFFFFF000);
  const startAddrStr = startAddrInt.toString(16).padStart(8, '0');

  // Maak 16 bytes willekeurige data
  const memBytes = [];
  for (let i = 0; i < 16; i++) {
    memBytes.push(Math.floor(rng() * 0x100));
  }

  // Bouw geheugendump string, 16 bytes per regel
  const hexBytes = memBytes.map(b => b.toString(16).padStart(2, '0'));
  const asciiBytes = memBytes.map(b => (b >= 0x20 && b <= 0x7E) ? String.fromCharCode(b) : '.');

  const line = `${startAddrStr}: ${hexBytes.join(' ')}  * ${asciiBytes.join('')} *`;

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
    title: 'Geheugendump en Waarde Lezen',
    label: questionText,
    answer: hexValue.toLowerCase(),  // Antwoord in kleine letters
    correctAnswers: [hexValue.toLowerCase()],
    hint: `Bepaal eerst de offset binnen de regel. Kijk vervolgens welke bytes je nodig hebt op basis van het aantal bits. Vergeet niet om de bytes om te keren bij little endian voordat je ze samenvoegt tot een hexadecimale waarde.`
  });
}


  return questions;
}
