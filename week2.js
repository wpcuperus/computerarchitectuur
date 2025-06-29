// Converteer een decimaal getal naar two's complement binair formaat
function toTwosComplement(value, bits) {
  const max = 1 << bits;
  if (value < 0) {
    value = max + value; // Two's complement voor negatieve getallen
  }
  return value.toString(2).padStart(bits, '0');
}

function toOnesComplement(value, bits) {
  if (value >= 0) {
    return value.toString(2).padStart(bits, '0');
  } else {
    const max = (1 << bits) - 1;
    return (~(-value) & max).toString(2).padStart(bits, '0');
  }
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
    questionnumber: 17,
    id: `twos-complement-4-add`,
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
    questionnumber: 18,
    id: `twos-complement-4-sub`,
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
    questionnumber: 19,
    id: `twos-complement-8-add`,
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
    questionnumber: 20,
    id: `twos-complement-8-sub`,
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

const bin = [...Array(4)]
  .map((_, i) => view.getUint8(i).toString(2).padStart(8, '0'))
  .join('');


function getIEEEExplanationFromHex(hex, binary, floatVal) {
  const signBit = binary[0];
  const exponentBits = binary.slice(1, 9);
  const mantissaBits = binary.slice(9);

  const exponentVal = parseInt(exponentBits, 2);
  const bias = 127;
  const power = exponentVal - bias;

  

  return `Om het hexadecimale IEEE 754 getal <code>0x${hex}</code> om te zetten naar decimaal:<br><br>
1. Zet de hex om naar binaire 32-bit representatie: <code>${binary}</code><br>
2. **Tekenbit**: <code>${signBit}</code> → het getal is ${signBit === '1' ? 'negatief' : 'positief'}<br>
3. **Exponentbits**: <code>${exponentBits}</code> → decimaal: ${exponentVal} → exponent = ${exponentVal} - 127 = <code>${power}</code><br>
4. **Mantissebits**: <code>${mantissaBits}</code> → interpretatie: 1 + binair fractioneel deel<br><br>
5. Gebruik de formule:<br>
<code>(-1)^tekenbit × (1 + mantisse) × 2^(exponent)</code><br>
Voor dit voorbeeld: <code>(-1)^${signBit} × (1 + ${parseInt(mantissaBits, 2) / (1 << mantissaBits.length)}) × 2^(${power})</code><br><br>
✅ Het resulterende decimale getal is ongeveer <strong>${floatVal}</strong>.`;
}


questions.push({
  questionnumber: 16,
  id: `hex-to-float`,
  title: 'Hex naar IEEE 754 floating point',
  label: `Welk decimaal getal hoort bij het IEEE 754 hexadecimale getal 0x${hex}? (Je mag een punt of komma als decimaalteken gebruiken)`,
  categories: ['Floating Point'],
  hint: `Converteer eerst de hexadecimale waarde 0x${hex} naar een IEEE 754 (32-bit single precision) floating point getal. Een floating point getal heeft de volgende formule: (-1)^S * (1 + Mantisse) * 2^(Exponent - Bias).`,
  answer: correctFloat,
  correctAnswers: [correctFloat, correctFloat.replace('.', ',')],
  explanation: getIEEEExplanationFromHex(hex, bin, correctFloat),
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
function getIEEEExplanationFromDecimal(val, hex, binary) {
  const signBit = binary[0];
  const exponentBits = binary.slice(1, 9);
  const mantissaBits = binary.slice(9);

  const exponentVal = parseInt(exponentBits, 2);
  const bias = 127;
  const power = exponentVal - bias;

  return `Om het decimale getal ${val} om te zetten naar IEEE 754 (32-bit):<br><br>
1. **Tekenbit:** Omdat ${val} ${val < 0 ? 'negatief' : 'positief'} is, is het tekenbit: <code>${signBit}</code><br>
2. **Normaliseer:** Zet ${val} om in de vorm <code>±1.m × 2^e</code> → exponent = <code>${power}</code><br>
3. **Exponent:** ${power} + bias (127) = <code>${exponentVal}</code> → binair: <code>${exponentBits}</code><br>
4. **Mantisse:** Neem de binaire fractie na het eerste 1-bit. De eerste 23 bits vormen de mantisse: <code>${mantissaBits}</code><br><br>
5. Combineer de bits:<br>
<code>${binary.slice(0, 1)} ${binary.slice(1, 9)} ${binary.slice(9)}</code><br><br>
6. Zet de 32 bits om in hex (4 bits per groep): <code>0x${hex}</code><br><br>
✅ De juiste hexadecimale IEEE 754 representatie van ${val} is <strong>0x${hex}</strong>.`;
}

// Genereer uitlegdata
const bin = [...Array(4)].map((_, i) => view.getUint8(i).toString(2).padStart(8, '0')).join('');
const ieeeExplanation = getIEEEExplanationFromDecimal(floatVal, hexStr, bin);

questions.push({
  id: `float-to-hex`,
  title: 'IEEE 754 floating point naar hexadecimaal',
  label: `Wat is de IEEE 754 (32-bit single precision) hexadecimale representatie van ${floatVal}?`,
  categories: ['Floating Point'],
  hint: `Converteer het decimale getal ${floatVal} naar een IEEE 754 (32-bit single precision) floating point getal...`,
  answer: `0x${hexStr}`,
  correctAnswers: [`0x${hexStr}`, hexStr],
  explanation: ieeeExplanation
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

// Maak een dynamische uitleg voor de vraag waarmee dynamisch de stappen worden uitgelegd met de juiste getallen om van een IEEE 754 binaire string naar decimaal te gaan




const floatStr = floatVal.toString();
questions.push({
  id: `ieee-binary-to-decimal`,
  title: 'IEEE 754 floating point naar decimaal',
  label: `Converteer het volgende IEEE 754 (single-precision binary) floating-point getal naar een zo kort mogelijk decimaal getal:<br>${binary}`,
  categories: ['Floating Point'],
  hint: `Converteer eerst de binaire string naar een IEEE 754 (32-bit single precision) floating point getal. Een floating point getal heeft de volgende formule: (-1^tekenbit) * (1 + mantisse) * 2^(exponent-127).`,
  answer: floatStr,
  correctAnswers: [floatStr, floatStr.replace('.', ',')],
  explanation: `Om van de binaire string ${binary} naar decimaal te gaan, volg deze stappen:<br>
  1. Bepaal de tekenbit (eerste bit).<br>
  2. Bepaal de exponent (bits 2-9) en converteer deze naar decimaal.<br>
  3. Bepaal de mantisse (bits 10-32) en converteer deze naar decimaal.<br>
  4. Gebruik de formule (-1^tekenbit) * (1 + mantisse) * 2^(exponent-127) om het decimale getal te berekenen.<br>
  Het resultaat is ${floatStr}.`
});

}

// Vraag: Decimaal naar Two's Complement


  // Kies willekeurig of we 4 of 8 bits gebruiken
const convBits = rng() < 0.5 ? 4 : 8;
const minVal = -(1 << (convBits - 1));
const maxVal = (1 << (convBits - 1)) - 1;

// Genereer een random getal binnen dat bereik
const convValue = Math.floor(rng() * (maxVal - minVal + 1)) + minVal;

// Functionaliteit om een dynamische uitleg te genereren voor de vraag: afhankelijk van of het decimale getal positief of negatief is, worden de stappen anders
const isNegative = convValue < 0;
const explanation = isNegative
  ? `Omdat het getal ${convValue} negatief is, zetten we eerst de absolute waarde om naar binair, keren we alle bits om en tellen we 1 op.`
  : `Omdat het getal ${convValue} positief is, zetten we het direct om naar binair zonder verdere aanpassingen.`;


// Voeg de vraag toe
questions.push({
  id: `dec-to-twos-complement`,
  title: 'Decimaal naar Two\'s Complement',
  label: `Zet het decimale getal ${convValue} om naar een two's complement getal van ${convBits} bits:`,
  categories: ['Two\'s Complement', 'Signed en Unsigned Getallen'],
  hint: `Stap 1: Bepaal of het getal ${convValue} positief of negatief is. Stap 2: Zet het absolute waarde om naar binair. Stap 3: Als het getal negatief is, pas two\'s complement toe door alle bits om te keren en 1 op te tellen.`,
  answer: convValue.toString(),
  binaryAnswer: toTwosComplementBinary(convValue, convBits),
  explanation: `${explanation} Het two's complement getal van ${convValue} in ${convBits} bits is: ${toTwosComplement(convValue, convBits)}`
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

    // Klein beetje kans dat factor als hex wordt weergegeven
  const asHex = rng() < 0.5; // 50% kans
  const factorDisplay = asHex
    ? 'het hexadecimale getal 0x' + factor.toString(16)
    : factor;

  questions.push({
    id: `ieee-multiplication`,
    title: 'IEEE Floating Point Vermenigvuldiging',
    label: `Stel een IEEE floating point getal wordt vermenigvuldigd met ${factorDisplay}. Wat verandert er dan in de IEEE floating point notatie van het getal?<br>Antwoord met tekenbit, exponent en/of mantisse`,
    hint: `Denk na over hoe vermenigvuldiging met ${factorDisplay} de waarde van een getal beïnvloedt. Welke delen van de IEEE notatie (tekenbit, exponent, mantisse) worden aangepast als je een getal vermenigvuldigd met ${factorDisplay}?`,
    categories: ['Floating Point'],
    answer: selectedType,
    explanation: generateIEEEExplanation(factor, selectedType)
  });
}
// Dynamische vraag: Unsigned integer bewerking via delen/verm.
{
  const bitsOptions = [4, 5, 6, 7, 8];
  const bits = bitsOptions[Math.floor(rng() * bitsOptions.length)];
  const maxUnsigned = (1 << bits) - 1;

  const initialValue = Math.floor(rng() * (maxUnsigned + 1)); // tussen 0 en max
  const factors = [2, 4, 8];
  const div = factors[Math.floor(rng() * factors.length)];
  const mul = factors[Math.floor(rng() * factors.length)];
  const order = rng() < 0.5 ? 'div-first' : 'mul-first';

  let intermediate, finalValue, operationsText;

  if (order === 'div-first') {
    intermediate = Math.floor(initialValue / div);
    finalValue = intermediate * mul;
    operationsText = `We delen de waarde van dit register met '${div}'. Hierna vermenigvuldigen we de waarde met '${mul}'.`;
  } else {
    intermediate = initialValue * mul;
    finalValue = Math.floor(intermediate / div);
    operationsText = `We vermenigvuldigen de waarde van dit register met '${mul}'. Hierna delen we de waarde met '${div}'.`;
  }

  // Beperk tot binnen bereik, anders opnieuw genereren
  if (finalValue <= maxUnsigned) {
    questions.push({
      id: `unsigned-register-${bits}-${order}-${initialValue}-${div}-${mul}`,
      title: 'Unsigned Integer Register Bewerking',
      label: `In een ${bits}-bits register is het decimale getal '${initialValue}' opgeslagen. ${operationsText}<br><br>
Wat is hierna de decimale waarde van dit register als we de waarde interpreteren als een <strong>unsigned integer</strong>?`,
      categories: ['Unsigned Getallen', 'Binair', 'Registerbewerking'],
      hint: `Bij unsigned integers is er geen negatieve waarde. Na elke stap (delen of vermenigvuldigen), controleer of het resultaat nog past binnen ${bits} bits (max. ${maxUnsigned}).`,
      answer: finalValue.toString(),
      binaryAnswer: finalValue.toString(2).padStart(bits, '0'),
      explanation: `Het begingetal is ${initialValue}. Eerst wordt het ${order === 'div-first' ? `gedeeld door ${div}: ⌊${initialValue}/${div}⌋ = ${intermediate}` : `vermenigvuldigd met ${mul}: ${initialValue} × ${mul} = ${intermediate}`}. Daarna wordt het ${order === 'div-first' ? `vermenigvuldigd met ${mul}: ${intermediate} × ${mul}` : `gedeeld door ${div}: ⌊${intermediate}/${div}⌋`} = ${finalValue}.`
    });
  }
}

{
  // Kies 4 of 12 bits
  const bits = rng() < 0.5 ? 4 : 12;
  const min = -(1 << (bits - 1)) + 1; // One's complement min is -(2^(bits-1) - 1)
  const max = (1 << (bits - 1)) - 1;
  
  // Genereer een getal binnen het valid bereik van one's complement
  const value = Math.floor(rng() * (max - min + 1)) + min;
  
  // Kies randomly one's of two's complement
  const useOnes = rng() < 0.5;

  // Bepaal de binary representatie
  const binary = useOnes ? toOnesComplement(value, bits) : toTwosComplement(value, bits);

  questions.push({
    questionnumber: 21,
    id: `complement-${bits}-${useOnes ? 'ones' : 'twos'}`,
    title: `Decimaal naar One's of Two's Complement`,
    label: `Schrijf het decimale getal ${value} als een ${bits} bits ${useOnes ? "one's" : "two's"} complement getal.`,
    categories: ["Signed en Unsigned Getallen", "Two's Complement"],
    hint: `Zet het decimale getal ${value} om naar ${bits} bits ${useOnes ? "one's" : "two's"} complement binair.`,
    answer: value.toString(),
    binaryAnswer: binary,
    explanation: `Het getal ${value} in ${bits} bits ${useOnes ? "one's" : "two's"} complement is: ${binary}`
  });
}

// Nieuwe vraag: IEEE754 hex getal met tabel en multiple choice
{
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);

  // Willekeurig float getal genereren via seed rng(), in bereik [-100, 100)
  const floatVal = (rng() * 200 - 100).toFixed(6);
  view.setFloat32(0, parseFloat(floatVal), false); // big endian

  // Haal hex representatie (4 bytes)
  const hex = [...Array(4)]
    .map((_, i) => view.getUint8(i).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  // Haal 32-bit binair
  const binary = [...Array(4)]
    .map((_, i) => view.getUint8(i).toString(2).padStart(8, '0'))
    .join('');

  // Bits opsplitsen
  const signBit = binary[0];
  const exponentBits = binary.slice(1, 9);
  const fractionBits = binary.slice(9);

  // Antwoord bepalen (voor eenvoud):
  // Negatief = signBit 1
  // Absoluut getal groter dan 1 als exponent-127 > 0
  const exponentVal = parseInt(exponentBits, 2);
  const exponentBias = 127;
  const exponentActual = exponentVal - exponentBias;

  let correctAnswer;
  if (signBit === '1' && exponentActual < 0) correctAnswer = 'A';  // negatief, groter dan -1
  else if (signBit === '0' && exponentActual < 0) correctAnswer = 'B'; // positief, kleiner dan 1
  else if (signBit === '1' && exponentActual >= 0) correctAnswer = 'C'; // negatief, kleiner dan -1
  else correctAnswer = 'D'; // positief, groter dan 1

  // HTML tabel van bits (format rij 31 t/m 0, met labels)
  const bitLabels = [
    's', 'exponent', 'fraction'
  ];

  // Maak tabel rij met bits: 31..0
  const bitIndices = [...Array(32)].map((_, i) => 31 - i);

  // Rijen voor labels (s, exponent, fraction) per bit
  // s: bit 31
  // exponent: bits 30..23 (8 bits)
  // fraction: bits 22..0 (23 bits)

  // Functie om een cel te kleuren of labelen
  function bitCell(bitIndex) {
    if (bitIndex === 31) return `<td style="background:#ffcccc;text-align:center;">s</td>`;
    if (bitIndex >= 23 && bitIndex <= 30) return `<td style="background:#ccffcc;text-align:center;">e</td>`;
    return `<td style="background:#ccccff;text-align:center;">f</td>`;
  }

  // Maak rij met bit posities
  const rowBits = bitIndices.map(i => `<td style="border:1px solid #000;text-align:center;">${i}</td>`).join('');
  // Rij met bit labels
  const rowLabels = bitIndices.map(i => bitCell(i)).join('');
  // Rij met bitwaarden
  const rowValues = bitIndices.map(i => `<td style="border:1px solid #000;text-align:center;">${binary[i]}</td>`).join('');

  questions.push({
    questionnumber: 21,
    id: `ieee754-hex-question`,
    title: 'IEEE 754 Floating Point Getal Analyse',
    label: `Gegeven het IEEE 754 floating point getal <code>0x${hex}</code> volgens onderstaande tabel:<br><br>
<table style="border-collapse: collapse; margin: 1em 0;">
  <tr>${rowBits}</tr>
  <tr>${rowLabels}</tr>
</table>
<p>Wat weet je van dit getal?</p>
<ol type="A">
<li>Het getal is negatief en groter dan -1</li>
<li>Het getal is positief en kleiner dan 1</li>
<li>Het getal is negatief en kleiner dan -1</li>
<li>Het getal is positief en groter dan 1</li>
</ol>
<p>Typ de letter van het antwoord dat je geeft.</p>`,
    categories: ['Floating Point'],
    hint: `Bekijk het tekenbit (s), de exponent en het effect van de exponent op de waarde. Exponent = exponent_bits - 127.`,
    answer: correctAnswer
  });
}


  return questions;
}
