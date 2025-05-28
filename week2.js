// Converteer een decimaal getal naar two's complement binair formaat
function toTwosComplement(value, bits) {
  const max = 1 << bits;
  if (value < 0) {
    value = max + value; // Two's complement voor negatieve getallen
  }
  return value.toString(2).padStart(bits, '0');
}

function toTwosComplementBinary(value, bits) {
  let intVal = parseInt(value, 10);
  if (intVal < 0) {
    intVal = (1 << bits) + intVal;
  }
  return intVal.toString(2).padStart(bits, '0');
}


// Genereer vragen voor week 2 (Geheugenrepresentatie)
function generateWeek2Questions() {
  const questions = [];

  // Helper om geldige random getallen in range van two's complement te genereren
  function getRandomTwosComplementPair(bits) {
    const min = -(1 << (bits - 1));
    const max = (1 << (bits - 1)) - 1;
    const a = Math.floor(rng() * (max - min + 1)) + min;
    const b = Math.floor(rng() * (max - min + 1)) + min;
    return [a, b];
  }

  

  // Vraag: Optellen in two's complement 4 bits
  {
    const [a, b] = getRandomTwosComplementPair(4);
    const result = a + b;
    const binaryAnswer = toTwosComplement(result, 4);
    questions.push({
      label: `Wat is ${a} + ${b} in two's complement (4 bits)?`,
      answer: result.toString(),
      binaryAnswer
    });
  }

  // Vraag: Aftrekken in two's complement 4 bits
  {
    const [a, b] = getRandomTwosComplementPair(4);
    const result = a - b;
    const binaryAnswer = toTwosComplement(result, 4);
    questions.push({
      label: `Wat is ${a} - ${b} in two's complement (4 bits)?`,
      answer: result.toString(),
      binaryAnswer
    });
  }

  // Vraag: Optellen in two's complement 8 bits
  {
    const [a, b] = getRandomTwosComplementPair(8);
    const result = a + b;
    const binaryAnswer = toTwosComplement(result, 8);
    questions.push({
      label: `Wat is ${a} + ${b} in two's complement (8 bits)?`,
      answer: result.toString(),
      binaryAnswer
    });
  }

  // Vraag: Aftrekken in two's complement 8 bits
  {
    const [a, b] = getRandomTwosComplementPair(8);
    const result = a - b;
    const binaryAnswer = toTwosComplement(result, 8);
    questions.push({
      label: `Wat is ${a} - ${b} in two's complement (8 bits)?`,
      answer: result.toString(),
      binaryAnswer
    });
  }

// Vraag: Hex naar IEEE 754 float (beperkt bereik en precisie)
{
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);

  // Genereer een geheel deel tussen -16 en 16
  const intPart = Math.floor(rng() * 33) - 16;

  // Genereer een fractioneel deel van 0/16 tot 15/16
  const fractionSteps = Math.floor(rng() * 16); // 0–15
  const fracPart = fractionSteps / 16;

  const floatVal = (intPart + fracPart).toFixed(6);
  view.setFloat32(0, parseFloat(floatVal), false); // big endian
  const hex = [...Array(4)]
    .map((_, i) => view.getUint8(i).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

const correctFloat = parseFloat(floatVal).toString();
questions.push({
  label: `Welk decimaal getal hoort bij het IEEE 754 hexadecimale getal 0x${hex}? (Je mag een punt of komma als decimaalteken gebruiken)`,
  answer: correctFloat,
  correctAnswers: [correctFloat, correctFloat.replace('.', ',')]
});

}


// Vraag: IEEE 754 float naar hex (beperkt bereik en precisie)
{
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);

  // Genereer een geheel getal tussen -16 en 16
  const intPart = Math.floor(rng() * 33) - 16; // [-16, 16]

  // Genereer een fractioneel deel als veelvoud van 1/16 (0 tot 15/16)
  const fractionSteps = Math.floor(rng() * 16); // 0–15
  const fracPart = fractionSteps / 16;

  // Combineer
  const floatVal = (intPart + fracPart).toFixed(6); // 6 decimalen voor consistentie
  view.setFloat32(0, parseFloat(floatVal), false); // big endian
  const hex = [...Array(4)]
    .map((_, i) => view.getUint8(i).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

const hexStr = hex.toUpperCase();
questions.push({
  label: `Wat is de IEEE 754 (32-bit single precision) hexadecimale representatie van ${floatVal}? (Je mag het antwoord met of zonder "0x" prefix geven)`,
  answer: `0x${hexStr}`,
  correctAnswers: [`0x${hexStr}`, hexStr]
});

}

// Vraag: IEEE 754 binaire string naar decimaal (beperkt bereik en precisie)
{
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);

  // Genereer geheel deel tussen -16 en 16
  const intPart = Math.floor(rng() * 33) - 16;

  // Genereer fractioneel deel (max .1111)
  const fractionSteps = Math.floor(rng() * 16); // 0–15
  const fracPart = fractionSteps / 16;

  const floatVal = intPart + fracPart;

  // Zet als IEEE 754 32-bit float (big endian)
  view.setFloat32(0, floatVal, false);

  // Haal 32-bit binaire representatie op
  const binary = [...Array(4)]
    .map((_, i) => view.getUint8(i).toString(2).padStart(8, '0'))
    .join('');

const floatStr = floatVal.toString();
questions.push({
  label: `Converteer het volgende IEEE 754 (single-precision binary) floating-point getal naar een zo kort mogelijk decimaal getal:<br>${binary}<br>(Je mag een punt of komma als decimaalteken gebruiken)`,
  answer: floatStr,
  correctAnswers: [floatStr, floatStr.replace('.', ',')]
});

}


  // Kies willekeurig of we 4 of 8 bits gebruiken
const convBits = rng() < 0.5 ? 4 : 8;
const minVal = -(1 << (convBits - 1));
const maxVal = (1 << (convBits - 1)) - 1;

// Genereer een random getal binnen dat bereik
const convValue = Math.floor(rng() * (maxVal - minVal + 1)) + minVal;

// Voeg de vraag toe
questions.push({
  label: `Zet het decimale getal ${convValue} om naar een two's complement getal van ${convBits} bits:`,
  answer: convValue.toString(),
  binaryAnswer: toTwosComplementBinary(convValue, convBits)
});

// Dynamische vraag: wat verandert er in de IEEE notatie bij vermenigvuldiging met een bepaald getal?
{
  function getRandomFactor(type) {
    switch (type) {
      case 'tekenbit': {
        return -1; // Vermenigvuldiging met -1 verandert alleen tekenbit
      }
      case 'exponent': {
        // Kies een willekeurige macht van 2, behalve 1
        const exp = Math.floor(rng() * 10) - 5; // [-5, 4]
        if (exp === 0) return 2; // vermijd 2^0 = 1
        return Math.pow(2, exp);
      }
      case 'mantisse': {
        // Kies een getal dicht bij 1 maar geen macht van 2 (zoals 1.1, 0.9)
        const base = 1 + ((Math.floor(rng() * 10) + 1) / 10); // [1.1, 2.0]
        return parseFloat(base.toFixed(1));
      }
      case 'exponent en mantisse': {
        // Kies een niet-macht-van-2 getal ver van 1 (zoals 3, 1.5)
        const options = [1.5, 3, 5, 6, 10];
        return options[Math.floor(rng() * options.length)];
      }
      case 'tekenbit en exponent': {
        // Kies negatieve macht van 2
        const exp = Math.floor(rng() * 4) + 1; // 1–4
        return -Math.pow(2, exp);
      }
      case 'tekenbit, exponent en mantisse': {
        // Negatief, niet-macht-van-2
        const options = [-1.5, -3, -5, -10];
        return options[Math.floor(rng() * options.length)];
      }
      default:
        return 1;
    }
  }

  const types = [
    'tekenbit',
    'exponent',
    'mantisse',
    'exponent en mantisse',
    'tekenbit en exponent',
    'tekenbit, exponent en mantisse'
  ];

  const selectedType = types[Math.floor(rng() * types.length)];
  const factor = getRandomFactor(selectedType);

  questions.push({
    label: `Stel een IEEE floating point getal wordt vermenigvuldigd met ${factor}. Wat verandert er dan in de IEEE floating point notatie van het getal?<br>Antwoord met tekenbit, exponent en/of mantisse`,
    answer: selectedType,
    explanation: `Deze factor (${factor}) zorgt voor verandering in: ${selectedType}`
  });
}


  return questions;
}
