function generateWeek1Questions() {
  const questions = [
    generateHexToDecimalQuestion(),
    generateBinToDecimalQuestion(),
    generateOctToDecimalQuestion(),
    generateCustomToDecimalQuestion(),
    generateBinToHexQuestion(),
    generateOctToHexQuestion(),
    generateDecToHexQuestion(),
    generateBinaryMultiplicationQuestion(),
    generateBinaryAdditionQuestion(),
    generateBinarySubtractionQuestion(),
    generateHexAdditionQuestion(),
    generateHexSubtractionQuestion(),
    generateOctalAdditionQuestion(),
    generateOctalSubtractionQuestion(),
    generateSubnetQuestion(),
    generateBaseAdditionToHexQuestion(),
    generateCustomToDecimalWithFractionQuestion()
  ];

  return questions;
}

function hexVariants(hex) {
  const clean = hex.replace(/^0x/i, '').toUpperCase();
  return [clean, `0x${clean}`];
}


// Helperfuncties
function toBinary8Bits(value) {
  return value.toString(2).padStart(8, '0');
}

function binaryToHex(binary) {
  return parseInt(binary, 2).toString(16).toUpperCase();
}

function octToHex(octal) {
  return parseInt(octal, 8).toString(16).toUpperCase();
}

function decimalToHex(decimal) {
  return parseInt(decimal, 10).toString(16).toUpperCase();
}

function decimalToBinary(decimal) {
  return parseInt(decimal, 10).toString(2);
}

function getRandomNumber(base, min = 0, max = Math.pow(base, 3) - 1) {
  const range = max - min + 1;
  const randomValue = Math.floor(rng() * range) + min;
  return randomValue.toString(base);
}

function generateHexToDecimalQuestion() {
  const hexVal = Math.floor(rng() * (4095 - 16 + 1)) + 16; // 16 (0x10) tot 4095 (0xFFF)
  const hex = hexVal.toString(16).toUpperCase();

  const digits = hex.split('');
  const powers = digits.map((digit, index) => {
    const dec = parseInt(digit, 16);
    const power = digits.length - index - 1;
    return `${dec} * 16^${power}`;
  });

  const hint = powers.join(' + ') + ' = ?';
  const decimal = parseInt(hex, 16);

  return {
    questionnumber: 1,
    id: 'hex-to-decimal',
    title: 'Hexadecimale conversie',
    label: `Zet het hexadecimale getal ${hex} om naar decimaal:`,
    categories: ['Talstelsels'],
    hint: hint,
    answer: decimal,
    correctAnswers: [decimal.toString()],
    explanation: powers.join(' + ') + ` = ${decimal}. Het hexadecimale getal ${hex} is gelijk aan ${decimal} in decimaal.`
  };
}




function generateBinToDecimalQuestion() {
  const bin = getRandomNumber(2, 8, 255);
  return {
  questionnumber: 2,
    id: 'bin-to-decimal',
    title: 'Binaire conversie',
    label: `Zet het binaire getal ${bin} om naar decimaal:`,
    categories: ['Talstelsels'],
    hint: `${bin.split('').map((bit, index) => `${bit} * 2^${bin.length - index - 1}`).join(' + ')} = ?`,
    answer: parseInt(bin, 2),
    explanation: `Het binaire getal ${bin} is gelijk aan ${parseInt(bin, 2)} in decimaal.`
  };
}

function generateOctToDecimalQuestion() {
  const octVal = Math.floor(rng() * (511 - 64 + 1)) + 64;
  const oct = octVal.toString(8).padStart(3, '0');
  return {
  questionnumber: 3,
    id: 'oct-to-decimal',
    title: 'Octale conversie',
    label: `Zet het octale getal ${oct} om naar decimaal:`,
    categories: ['Talstelsels'],
    hint: `${oct.split('').map((digit, index) => `${digit} * 8^${oct.length - index - 1}`).join(' + ')} = ?`,
    answer: parseInt(oct, 8),
    explanation: `Het octale getal ${oct} is gelijk aan ${parseInt(oct, 8)} in decimaal.`
  };
}

function generateCustomToDecimalQuestion() {
  const base = Math.floor(rng() * 5) + 5;
  const custom = getRandomNumber(base, 10, 500);
  return {
  questionnumber: 4,
    id: 'custom-to-decimal',
    title: 'Conversie naar aangepast talstelsel',
    label: `Zet het getal ${custom} van het ${base}-tallige stelsel om naar decimaal:`,
    categories: ['Talstelsels'],
    hint: `${custom.split('').map((digit, index) => `${digit} * ${base}^${custom.length - index - 1}`).join(' + ')} = ?`,
    answer: parseInt(custom, base),
    explanation: `Het getal ${custom} in het ${base}-tallige stelsel is gelijk aan ${parseInt(custom, base)} in decimaal.`
  };
}

function generateBinToHexQuestion() {
  const bin = getRandomNumber(2, 8, 255);
  return {
  questionnumber: 5,
    id: 'bin-to-hex',
    title: 'Binaire conversie naar hexadecimaal',
    label: `Zet het binaire getal ${bin} om naar hexadecimaal:`,
    categories: ['Talstelsels'],
    hint: `Splits het binaire getal in groepen van 4 bits: ${bin.padStart(Math.ceil(bin.length / 4) * 4, '0')}.<br>Converteer elke groep naar hexadecimaal.`,
    answer: binaryToHex(bin),
    correctAnswers: [`0x${binaryToHex(bin)}`, binaryToHex(bin)],
    explanation: `Het binaire getal ${bin} is gelijk aan ${parseInt(bin, 2)} in decimaal, wat ${binaryToHex(bin)} is in hexadecimaal.`
  };
}

function generateOctToHexQuestion() {
  const octVal = Math.floor(rng() * (511 - 64 + 1)) + 64;
  const oct = octVal.toString(8).padStart(3, '0');
  return {
  questionnumber: 6,
    id: 'oct-to-hex',
    title: 'Octale conversie naar hexadecimaal',
    label: `Zet het octale getal ${oct} om naar hexadecimaal:`,
    categories: ['Talstelsels'],
    hint: 'Converteer eerst de octale cijfers ' + oct.split('') + ' naar binair.<br>Converteer vervolgens de binaire groepen naar hexadecimaal.',
    answer: octToHex(oct),
    correctAnswers: [`0x${octToHex(oct)}`, octToHex(oct)],
    explanation: `Het octale getal ${oct} is gelijk aan ${parseInt(oct, 8)} in decimaal, wat ${octToHex(oct)} is in hexadecimaal.`
  };
}

function generateDecToHexQuestion() {
  const dec = getRandomNumber(10, 100, 999);
  return {
  questionnumber: 7,
    id: 'dec-to-hex',
    title: 'Decimale conversie naar hexadecimaal',
    label: `Zet het decimale getal ${dec} om naar hexadecimaal:`,
    categories: ['Talstelsels'],
    hint: `Gebruik de deling door 16 methode: ${dec} / 16 = ?<br>Neem de rest en deel het resultaat opnieuw door 16.`,
    answer: decimalToHex(dec),
    correctAnswers: [`0x${decimalToHex(dec)}`, decimalToHex(dec)],
    explanation: `Het decimale getal ${dec} is gelijk aan ${decimalToHex(dec)} in hexadecimaal.`
  };
}

function generateBinaryMultiplicationQuestion() {
  const bin1 = getRandomNumber(2, 8, 31);
  const bin2 = getRandomNumber(2, 8, 31);
  const result = parseInt(bin1, 2) * parseInt(bin2, 2);
  return {
    questionnumber: 8,
    id: 'bin-multiplication',
    title: 'Binaire vermenigvuldiging',
    label: `Wat is ${bin1} × ${bin2} (binair)?`,
    categories: ['Binair rekenen'],
    hint: 'Het is mogelijk om van de vermenigvuldigingssom een optelling te maken met binaire getallen, bijvoorbeeld: 1010 * 1101 = 1010 + 00000 + 101000 + 1010000.',
    answer: decimalToBinary(result),
    correctAnswers: [decimalToBinary(result), `0b${decimalToBinary(result)}`],
    explanation: `Het binaire getal ${bin1} is ${parseInt(bin1, 2)} en ${bin2} is ${parseInt(bin2, 2)}. Hun product is ${result}, wat binair ${decimalToBinary(result)} is.`
  };
}

function generateBinaryAdditionQuestion() {
  const val1 = Math.floor(rng() * 256);
  const val2 = Math.floor(rng() * 256);
  return {
    questionnumber: 9,
    id: 'binary-addition',
    title: 'Binaire optelling',
    categories: ['Binair rekenen'],
    label: `Wat is ${toBinary8Bits(val1)} + ${toBinary8Bits(val2)} (binair)?`,
    hint: `Zet de getallen onder elkaar en tel ze op zoals bij decimale getallen. Vergeet niet te dragen indien nodig.`,
    answer: decimalToBinary(val1 + val2),
    correctAnswers: [decimalToBinary(val1 + val2), `0b${decimalToBinary(val1 + val2)}`],
    explanation: `Som van ${val1} en ${val2} is ${val1 + val2}, oftewel ${decimalToBinary(val1 + val2)} in binair.`
  };
}

function generateBinarySubtractionQuestion() {
  const val1 = Math.floor(rng() * 128) + 128; // 128–255
  const val2 = Math.floor(rng() * val1);      // 0–val1-1, altijd kleiner

  const diff = val1 - val2;
  return {
    questionnumber: 10,
    id: 'binary-subtraction',
    title: 'Binaire aftrekking',
    categories: ['Binair rekenen'],
    label: `Wat is ${toBinary8Bits(val1)} - ${toBinary8Bits(val2)} (binair)?`,
    hint: `Zet de getallen onder elkaar en trek ze af zoals bij decimale getallen. Vergeet niet te lenen indien nodig.`,
    answer: decimalToBinary(diff),
    correctAnswers: [decimalToBinary(diff), `0b${decimalToBinary(diff)}`],
    explanation: `Verschil is ${diff}, oftewel ${decimalToBinary(diff)} in binair.`
  };
}


function generateHexAdditionQuestion() {
  const a = getRandomNumber(16).toUpperCase();
  const b = getRandomNumber(16).toUpperCase();
  const sum = parseInt(a, 16) + parseInt(b, 16);
  return {
  questionnumber: 11,
    id: 'hex-addition',
    title: 'Hexadecimale optelling',
    categories: ['Talstelsels'],
    label: `Wat is ${a} + ${b} (hexadecimaal)?`,
    answer: decimalToHex(sum),
    hint: `Houd rekening met het hexadecimale talstelsel: ${a} + ${b}. De getallen in het hexadecimale stelsel zijn 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A (10), B (11), C (12), D (13), E (14), F (15).`,
    correctAnswers: hexVariants(decimalToHex(sum)),
    explanation: `${a} + ${b} = ${sum} decimaal = ${decimalToHex(sum)} hex.`
  };
}

function generateHexSubtractionQuestion() {
  let a = getRandomNumber(16).toUpperCase();
  let b = getRandomNumber(16).toUpperCase();

  // Zorg dat a >= b
  while (parseInt(b, 16) > parseInt(a, 16)) {
    b = getRandomNumber(16).toUpperCase();
  }

  const diff = parseInt(a, 16) - parseInt(b, 16);

  return {
  questionnumber: 12,
    id: 'hex-subtraction',
    title: 'Hexadecimale aftrekking',
    categories: ['Talstelsels'],
    label: `Wat is ${a} - ${b} (hexadecimaal)?`,
    answer: decimalToHex(diff),
    hint: `Houd rekening met het hexadecimale talstelsel : ${a} - ${b}. De getallen in het hexadecimale stelsel zijn 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A (10), B (11), C (12), D (13), E (14), F (15).`,
    correctAnswers: hexVariants(decimalToHex(diff)),
    explanation: `${a} - ${b} = ${diff} decimaal = ${decimalToHex(diff)} hex.`
  };
}



function generateOctalAdditionQuestion() {
  const a = Math.floor(rng() * 512);
  const b = Math.floor(rng() * 512);
  const sum = a + b;
  return {
  questionnumber: 13,
    id: 'octal-addition',
    title: 'Octale optelling',
    categories: ['Talstelsels'],
    label: `Wat is ${a.toString(8)} + ${b.toString(8)} (octaal)?`,
    hint: `Houd rekening met het octale talstelsel: ${a.toString(8)} + ${b.toString(8)}. De getallen in het octale stelsel zijn 0, 1, 2, 3, 4, 5, 6, 7.`,
    answer: sum.toString(8),
    explanation: `${a} + ${b} = ${sum} decimaal = ${sum.toString(8)} octaal.`
  };
}

function generateOctalSubtractionQuestion() {
  let a = Math.floor(rng() * 512);
  let b = Math.floor(rng() * 512);

  if (b > a) [a, b] = [b, a]; // zorg dat a >= b

  const diff = a - b;
  return {
  questionnumber: 14,
    id: 'octal-subtraction',
    title: 'Octale aftrekking',
    categories: ['Talstelsels'],
    label: `Wat is ${a.toString(8)} - ${b.toString(8)} (octaal)?`,
    hint: `Houd rekening met het octale talstelsel: ${a.toString(8)} - ${b.toString(8)}. De getallen in het octale stelsel zijn 0, 1, 2, 3, 4, 5, 6, 7.`,
    answer: diff.toString(8),
    explanation: `${a.toString(8)} - ${b.toString(8)} = ${diff} decimaal = ${diff.toString(8)} octaal.`
  };
}


function generateSubnetQuestion() {
  const mask = [255, 255, 254, 0];
  const ipA = Array.from({ length: 4 }, () => Math.floor(rng() * 256));
  const sameSubnet = rng() < 0.5;
  let ipB;

  if (sameSubnet) {
    ipB = ipA.map((octet, i) => (mask[i] === 255 ? octet : Math.floor(rng() * 256) & ~mask[i]));
  } else {
    ipB = ipA.slice();
    const changeIndex = [2, 1, 0][Math.floor(rng() * 3)];
    ipB[changeIndex] = ipA[changeIndex] ^ 1;
  }

  const aNet = ipA.map((o, i) => o & mask[i]).join('.');
  const bNet = ipB.map((o, i) => o & mask[i]).join('.');
  const correct = aNet === bNet ? 'juist' : 'onjuist';

  return {
  questionnumber: 15,
    id: 'subnet-question',
    title: 'IP-adressen en subnetten',
    categories: ['Binair rekenen'],
    label: `Adres A: ${ipA.join('.')}<br>Adres B: ${ipB.join('.')}<br>Masker: ${mask.join('.')}<br><strong>Behoren deze IP-adressen tot dezelfde reeks?</strong><br><em>(Antwoord: "juist" of "onjuist")</em>`,
    hint: `Gebruik AND om de netwerken te vergelijken met het masker: ${mask.join('.')}.`,
    answer: correct,
    explanation: aNet === bNet
      ? `✔️ Adressen zitten in hetzelfde subnet want ${aNet} == ${bNet}`
      : `❌ Adressen zitten *niet* in hetzelfde subnet want ${aNet} ≠ ${bNet}`
  };
}

function generateBaseAdditionToHexQuestion() {
  const base = Math.floor(rng() * 6) + 5;
  const val1Dec = Math.floor(rng() * 100) + 1;
  const val2Dec = Math.floor(rng() * 100) + 1;
  const val1Base = val1Dec.toString(base).toUpperCase();
  const val2Base = val2Dec.toString(base).toUpperCase();
  const sumDec = val1Dec + val2Dec;
  const sumHex = sumDec.toString(16).toUpperCase().padStart(2, '0');

  let hint = '';

  if (base !== 10) {
    const digits1 = val1Base.split('').map((char, i) => `${char}×${base}^${val1Base.length - i - 1}`).join(' + ');
    const digits2 = val2Base.split('').map((char, i) => `${char}×${base}^${val2Base.length - i - 1}`).join(' + ');
    hint += `Zet beide getallen om naar decimaal met de formule:<br>${val1Base} = ${digits1}<br>${val2Base} = ${digits2}<br>`;
  }

  hint += 'Tel vervolgens de decimale waarden op en zet het resultaat om naar hexadecimaal met de formule:<br>';
  hint += 'decimaal / 16 → noteer de rest → deel opnieuw tot 0 → lees hex van onder naar boven.';

  return {
  questionnumber: 16,
    id: 'base-addition',
    title: `Optelling in een aangepast talstelsel`,
    categories: ['Talstelsels'],
    label: `Tel de getallen ${val1Base} en ${val2Base} (beide getallen behoren tot het ${base}-tallig stelsel) op en geef het resultaat als hexadecimaal getal:`,
    hint: hint,
    answer: `0x${sumHex}`,
    correctAnswers: [`0x${sumHex}`, `${sumHex}`],
    explanation: `${val1Base} (${val1Dec}) + ${val2Base} (${val2Dec}) = ${sumDec} = 0x${sumHex}`
  };
}

function digitToChar(digit) {
  if (digit < 10) return digit.toString();
  return String.fromCharCode('A'.charCodeAt(0) + digit - 10);
}

function generateCustomToDecimalWithFractionQuestion() {
  const allowedBases = [5, 6, 7, 9, 11, 12, 13, 14, 15];
  const base = allowedBases[Math.floor(rng() * allowedBases.length)];
  
  const wholeDecimal = Math.floor(rng() * 50); 
  const wholeStr = wholeDecimal.toString(base).toUpperCase();

  const decimalFraction = (Math.floor(rng() * 9) + 1) / 10;

  let fractionalDigit = null;
  for (let i = 1; i < base; i++) {
    const value = i / base;
    if (Math.abs(value - decimalFraction) < 0.000001) {
      fractionalDigit = i;
      break;
    }
  }

  if (fractionalDigit === null) return generateCustomToDecimalWithFractionQuestion();

  const fractionalChar = digitToChar(fractionalDigit);
  const customNumber = `${wholeStr}.${fractionalChar}`;
  
  const wholeValueDecimal = parseInt(wholeStr, base);
  const decimalAnswer = wholeValueDecimal + (fractionalDigit / base);

  const hint = `${wholeStr} = ${wholeValueDecimal} in decimaal, dus\n${wholeValueDecimal} + ${fractionalDigit} / ${base} = ?`;


  return {
    questionnumber: 17,
    id: 'custom-to-decimal-fraction',
    title: 'Conversie met fractioneel getal',
    categories: ['Talstelsels'],
    label: `Gegeven het getal ${customNumber} in het ${base}-tallige stelsel. Wat is de decimale waarde van dit getal?`,
    hint: hint,
    answer: decimalAnswer,
    // Antwoord met komma en punt worden beide geaccepteerd
    correctAnswers: [decimalAnswer.toFixed(1), decimalAnswer.toFixed(1).replace('.', ',')],  // evt met meer decimalen
    explanation: `${customNumber} in het ${base}-tallig stelsel is ${wholeStr} = ${wholeValueDecimal} + ${fractionalDigit}/${base} = ${decimalAnswer.toFixed(4)} in decimaal.`
  };
}
