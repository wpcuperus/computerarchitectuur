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
    generateBaseAdditionToHexQuestion()
  ];

  return questions;
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
  const hexVal = Math.floor(rng() * (65535 - 4096 + 1)) + 4096;
  const hex = hexVal.toString(16).toUpperCase().padStart(4, '0');

  // Dynamische hint op basis van hex digits
  const digits = hex.split('');
  const powers = digits.map((digit, index) => {
    const dec = parseInt(digit, 16);
    const power = digits.length - index - 1;
    return `${dec} * 16^${power}`;
  });

  const hint = powers.join(' + ') + ' = ?';

  return {
    id: 'hex-to-decimal',
    title: 'Hexadecimale conversie',
    label: `Zet het hexadecimale getal ${hex} om naar decimaal:`,
    categories: ['Talstelsels'],
    hint: hint,
    answer: parseInt(hex, 16),
    explanation: `Het hexadecimale getal ${hex} is gelijk aan ${parseInt(hex, 16)} in decimaal.`
  };
}


function generateBinToDecimalQuestion() {
  const bin = getRandomNumber(2, 8, 255);
  return {
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
    id: 'bin-to-hex',
    title: 'Binaire conversie naar hexadecimaal',
    label: `Zet het binaire getal ${bin} om naar hexadecimaal:`,
    categories: ['Talstelsels'],
    hint: `Splits het binaire getal in groepen van 4 bits: ${bin.padStart(Math.ceil(bin.length / 4) * 4, '0')}.<br>Converteer elke groep naar hexadecimaal.`,
    answer: binaryToHex(bin),
    explanation: `Het binaire getal ${bin} is gelijk aan ${parseInt(bin, 2)} in decimaal, wat ${binaryToHex(bin)} is in hexadecimaal.`
  };
}

function generateOctToHexQuestion() {
  const octVal = Math.floor(rng() * (511 - 64 + 1)) + 64;
  const oct = octVal.toString(8).padStart(3, '0');
  return {
    id: 'oct-to-hex',
    title: 'Octale conversie naar hexadecimaal',
    label: `Zet het octale getal ${oct} om naar hexadecimaal:`,
    categories: ['Talstelsels'],
    hint: 'Converteer eerst de octale cijfers ' + oct.split('') + ' naar binair.<br>Converteer vervolgens de binaire groepen naar hexadecimaal.',
    answer: octToHex(oct),
    explanation: `Het octale getal ${oct} is gelijk aan ${parseInt(oct, 8)} in decimaal, wat ${octToHex(oct)} is in hexadecimaal.`
  };
}

function generateDecToHexQuestion() {
  const dec = getRandomNumber(10, 100, 999);
  return {
    id: 'dec-to-hex',
    title: 'Decimale conversie naar hexadecimaal',
    label: `Zet het decimale getal ${dec} om naar hexadecimaal:`,
    categories: ['Talstelsels'],
    hint: `Gebruik de deling door 16 methode: ${dec} / 16 = ?<br>Neem de rest en deel het resultaat opnieuw door 16.`,
    answer: decimalToHex(dec),
    explanation: `Het decimale getal ${dec} is gelijk aan ${decimalToHex(dec)} in hexadecimaal.`
  };
}

function generateBinaryMultiplicationQuestion() {
  const bin1 = getRandomNumber(2, 8, 31);
  const bin2 = getRandomNumber(2, 8, 31);
  const result = parseInt(bin1, 2) * parseInt(bin2, 2);
  return {
    id: 'bin-multiplication',
    title: 'Binaire vermenigvuldiging',
    label: `Wat is ${bin1} × ${bin2} (binair)?`,
    categories: ['Binair rekenen'],
    hint: 'Het is mogelijk om van de vermenigvuldigingssom een optelling te maken met binaire getallen, bijvoorbeeld: 1010 * 1101 = 1010 + 10100 + 000000 + 1010000.',
    answer: decimalToBinary(result),
    explanation: `Het binaire getal ${bin1} is ${parseInt(bin1, 2)} en ${bin2} is ${parseInt(bin2, 2)}. Hun product is ${result}, wat binair ${decimalToBinary(result)} is.`
  };
}

function generateBinaryAdditionQuestion() {
  const val1 = Math.floor(rng() * 256);
  const val2 = Math.floor(rng() * 256);
  return {
    id: 'binary-addition',
    title: 'Binaire optelling',
    categories: ['Binair rekenen'],
    label: `Wat is ${toBinary8Bits(val1)} + ${toBinary8Bits(val2)} (binair)?`,
    answer: decimalToBinary(val1 + val2),
    explanation: `Som van ${val1} en ${val2} is ${val1 + val2}, oftewel ${decimalToBinary(val1 + val2)} in binair.`
  };
}

function generateBinarySubtractionQuestion() {
  const val1 = Math.floor(rng() * 256) + 128;
  const val2 = Math.floor(rng() * 128);
  const diff = Math.max(0, val1 - val2);
  return {
    id: 'binary-subtraction',
    title: 'Binaire aftrekking',
    categories: ['Binair rekenen'],
    label: `Wat is ${toBinary8Bits(val1)} - ${toBinary8Bits(val2)} (binair)?`,
    answer: decimalToBinary(diff),
    explanation: `Verschil is ${diff}, oftewel ${decimalToBinary(diff)} in binair.`
  };
}

function generateHexAdditionQuestion() {
  const a = getRandomNumber(16).toUpperCase();
  const b = getRandomNumber(16).toUpperCase();
  const sum = parseInt(a, 16) + parseInt(b, 16);
  return {
    id: 'hex-addition',
    title: 'Hexadecimale optelling',
    categories: ['Talstelsels'],
    label: `Wat is ${a} + ${b} (hexadecimaal)?`,
    answer: decimalToHex(sum),
    explanation: `${a} + ${b} = ${sum} decimaal = ${decimalToHex(sum)} hex.`
  };
}

function generateHexSubtractionQuestion() {
  const a = getRandomNumber(16).toUpperCase();
  const b = getRandomNumber(16).toUpperCase();
  const diff = Math.max(0, parseInt(a, 16) - parseInt(b, 16));
  return {
    id: 'hex-subtraction',
    title: 'Hexadecimale aftrekking',
    categories: ['Talstelsels'],
    label: `Wat is ${a} - ${b} (hexadecimaal)?`,
    answer: decimalToHex(diff),
    explanation: `${a} - ${b} = ${diff} decimaal = ${decimalToHex(diff)} hex.`
  };
}

function generateOctalAdditionQuestion() {
  const a = Math.floor(rng() * 512);
  const b = Math.floor(rng() * 512);
  const sum = a + b;
  return {
    id: 'octal-addition',
    title: 'Octale optelling',
    categories: ['Talstelsels'],
    label: `Wat is ${a.toString(8)} + ${b.toString(8)} (octaal)?`,
    answer: sum.toString(8),
    explanation: `${a} + ${b} = ${sum} decimaal = ${sum.toString(8)} octaal.`
  };
}

function generateOctalSubtractionQuestion() {
  const a = Math.floor(rng() * 512);
  const b = Math.floor(rng() * 512);
  return {
    id: 'octal-subtraction',
    title: 'Octale aftrekking',
    categories: ['Talstelsels'],
    label: `Wat is ${a.toString(8)} - ${b.toString(8)} (octaal)?`,
    answer: (a - b).toString(8)
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
    id: 'base-addition',
    title: `Optelling in een aangepast talstelsel`,
    categories: ['Talstelsels'],
    label: `Tel de getallen ${val1Base} en ${val2Base} (beide getallen behoren tot het ${base}-tallig stelsel) op en geef het resultaat als hexadecimaal getal:`,
    hint: hint,
    answer: `0x${sumHex}`,
    explanation: `${val1Base} (${val1Dec}) + ${val2Base} (${val2Dec}) = ${sumDec} = 0x${sumHex}`
  };
}
