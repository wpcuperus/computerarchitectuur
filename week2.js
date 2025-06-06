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

function generateIEEEExplanation(factor, changedParts) {
  const example = 1.5;
  const result = example * factor;

  function floatToBinParts(f) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, f);
    const binary = [...Array(4)].map((_, i) =>
      view.getUint8(i).toString(2).padStart(8, '0')).join('');
    return {
      binary,
      sign: binary[0],
      exponent: binary.slice(1, 9),
      mantissa: binary.slice(9),
    };
  }

  const before = floatToBinParts(example);
  const after = floatToBinParts(result);

  return `Deze factor (${factor}) zorgt voor verandering in: ${changedParts}.<br>

**Voorbeeld:**
Getal \`1.5\` in IEEE 754:<br>
- Binair: \`${before.binary}\`<br>
  - Tekenbit: \`${before.sign}\`<br>
  - Exponent: \`${before.exponent}\`<br>
  - Mantisse: \`${before.mantissa}\`<br><br>

Na vermenigvuldiging met ${factor} → \`${result}\`:<br>

- Binair: \`${after.binary}\`<br>
  - Tekenbit: \`${after.sign}\`<br>
  - Exponent: \`${after.exponent}\`<br>
  - Mantisse: \`${after.mantissa}\`<br>

💡 Verandering in: **${changedParts}**<br>
`;
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

  function getSafeTwosComplementPair(bits, operation) {
  const min = -(1 << (bits - 1));
  const max = (1 << (bits - 1)) - 1;
  let a, b, result;

  do {
    a = Math.floor(rng() * (max - min + 1)) + min;
    b = Math.floor(rng() * (max - min + 1)) + min;
    result = operation === 'add' ? a + b : a - b;
  } while (result < min || result > max);

  return [a, b];
}

{
  const [a, b] = getSafeTwosComplementPair(4, 'add');
  const result = a + b;
  const binaryAnswer = toTwosComplement(result, 4);
  questions.push({
    title: 'Two\'s Complement (4-bits) Optelling',
    label: `Wat is ${a} + ${b} in two's complement (4 bits)?`,
    categories: ['Two\'s Complement', 'Signed en Unsigned Getallen'],
    hint: `Zet de two\'s complement getallen om naar decimaal door "1" af te trekken en dan het getal om te keren. Voer daarna de berekening uit en zet het resultaat weer om naar two's complement.`,
    answer: result.toString(),
    binaryAnswer
  });
}


{
  const [a, b] = getSafeTwosComplementPair(4, 'sub');
  const result = a - b;
  const binaryAnswer = toTwosComplement(result, 4);
  questions.push({
    title: 'Two\'s Complement (4-bits) Aftrekking',
    label: `Wat is ${a} - ${b} in two's complement (4 bits)?`,
    categories: ['Two\'s Complement', 'Signed en Unsigned Getallen'],
    hint: `Zet de two\'s complement getallen eerst om naar decimaal, door "1" af te trekken en dan het getal om te keren. Voer daarna de berekening uit en zet het resultaat weer om naar two's complement.`,
    answer: result.toString(),
    binaryAnswer
  });
}


{
  const [a, b] = getSafeTwosComplementPair(8, 'add');
  const result = a + b;
  const binaryAnswer = toTwosComplement(result, 8);
  questions.push({
    title: 'Two\'s Complement (8-bits) Optelling',
    label: `Wat is ${a} + ${b} in two's complement (8 bits)?`,
    categories: ['Two\'s Complement', 'Signed en Unsigned Getallen'],
    hint: `Zet de two\'s complement getallen eerst om naar decimaal, door "1" af te trekken en dan het getal om te keren. Voer daarna de berekening uit en zet het resultaat weer om naar two's complement.`,
    answer: result.toString(),
    binaryAnswer
  });
}


{
  const [a, b] = getSafeTwosComplementPair(8, 'sub');
  const result = a - b;
  const binaryAnswer = toTwosComplement(result, 8);
  questions.push({
    title: 'Two\'s Complement (8-bits) Aftrekking',
    label: `Wat is ${a} - ${b} in two's complement (8 bits)?`,
    categories: ['Two\'s Complement', 'Signed en Unsigned Getallen'],
    hint: `Zet de two\'s complement getallen eerst om naar decimaal, door "1" af te trekken en dan het getal om te keren. Voer daarna de berekening uit en zet het resultaat weer om naar two's complement.`,
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
  title: 'Hex naar IEEE 754 floating point',
  label: `Welk decimaal getal hoort bij het IEEE 754 hexadecimale getal 0x${hex}? (Je mag een punt of komma als decimaalteken gebruiken)`,
  categories: ['Floating Point'],
  hint: `Converteer eerst de hexadecimale waarde 0x${hex} naar een IEEE 754 (32-bit single precision) floating point getal. Een floating point getal heeft de volgende formule: tekenbit * mantisse * 2^exponent. De exponent is een gebiaste waarde.`,
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
  title: 'IEEE 754 floating point naar hexadecimaal',
  label: `Wat is de IEEE 754 (32-bit single precision) hexadecimale representatie van ${floatVal}? (Je mag het antwoord met of zonder "0x" prefix geven)`,
  categories: ['Floating Point'],
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
  title: 'IEEE 754 floating point naar decimaal',
  label: `Converteer het volgende IEEE 754 (single-precision binary) floating-point getal naar een zo kort mogelijk decimaal getal:<br>${binary}<br>(Je mag een punt of komma als decimaalteken gebruiken)`,
  categories: ['Floating Point'],
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
  title: 'Decimaal naar Two\'s Complement',
  label: `Zet het decimale getal ${convValue} om naar een two's complement getal van ${convBits} bits:`,
  categories: ['Two\'s Complement', 'Signed en Unsigned Getallen'],
  hint: `Stap 1: Bepaal of het getal ${convValue} positief of negatief is. Stap 2: Zet het absolute waarde om naar binair. Stap 3: Als het getal negatief is, pas two\'s complement toe door alle bits om te keren en 1 op te tellen.`,
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
    title: 'IEEE Floating Point Vermenigvuldiging',
    label: `Stel een IEEE floating point getal wordt vermenigvuldigd met ${factor}. Wat verandert er dan in de IEEE floating point notatie van het getal?<br>Antwoord met tekenbit, exponent en/of mantisse`,
    hint: `Denk na over hoe vermenigvuldiging met ${factor} de waarde van een getal beïnvloedt. Welke delen van de IEEE notatie (tekenbit, exponent, mantisse) worden aangepast als je een getal vermenigvuldigd met ${factor}?`,
    categories: ['Floating Point'],
    answer: selectedType,
    explanation: generateIEEEExplanation(factor, selectedType)
  });
}


  return questions;
}
