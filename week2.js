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

  return questions;
}
