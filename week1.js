function generateWeek1Questions() {
  const questions = [];

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

  // Conversies naar decimaal
  {
    const hexVal = Math.floor(rng() * (65535 - 4096 + 1)) + 4096;
    const hex = hexVal.toString(16).toUpperCase().padStart(4, '0');
    questions.push({
      label: `Zet het hexadecimale getal ${hex} om naar decimaal:`,
      answer: parseInt(hex, 16),
      explanation: `Het hexadecimale getal ${hex} is gelijk aan ${parseInt(hex, 16)} in decimaal.`
    });
  }

  {
    const bin = getRandomNumber(2, 8, 255);
    questions.push({
      label: `Zet het binaire getal ${bin} om naar decimaal:`,
      answer: parseInt(bin, 2),
      explanation: `Het binaire getal ${bin} is gelijk aan ${parseInt(bin, 2)} in decimaal.`
    });
  }

  {
    const octVal = Math.floor(rng() * (511 - 64 + 1)) + 64;
    const oct = octVal.toString(8).padStart(3, '0');
    questions.push({
      label: `Zet het octale getal ${oct} om naar decimaal:`,
      answer: parseInt(oct, 8),
      explanation: `Het octale getal ${oct} is gelijk aan ${parseInt(oct, 8)} in decimaal.`
    });
  }

  {
    const base = Math.floor(rng() * 5) + 5;
    const custom = getRandomNumber(base, 10, 500);
    questions.push({
      label: `Zet het getal ${custom} van het ${base}-tallige stelsel om naar decimaal:`,
      answer: parseInt(custom, base),
      explanation: `Het getal ${custom} in het ${base}-tallige stelsel is gelijk aan ${parseInt(custom, base)} in decimaal.`
    });
  }

  // Conversies naar hexadecimaal
  {
    const bin = getRandomNumber(2, 8, 255);
    questions.push({
      label: `Zet het binaire getal ${bin} om naar hexadecimaal:`,
      answer: binaryToHex(bin),
      explanation: `Het binaire getal ${bin} is gelijk aan ${parseInt(bin, 2)} in decimaal, wat ${binaryToHex(bin)} is in hexadecimaal.`
    });
  }

  {
    const octVal = Math.floor(rng() * (511 - 64 + 1)) + 64;
    const oct = octVal.toString(8).padStart(3, '0');
    questions.push({
      label: `Zet het octale getal ${oct} om naar hexadecimaal:`,
      answer: octToHex(oct),
      explanation: `Het octale getal ${oct} is gelijk aan ${parseInt(oct, 8)} in decimaal, wat ${octToHex(oct)} is in hexadecimaal.`
    });
  }

  {
    const dec = getRandomNumber(10, 100, 999);
    questions.push({
      label: `Zet het decimale getal ${dec} om naar hexadecimaal:`,
      answer: decimalToHex(dec),
      explanation: `Het decimale getal ${dec} is gelijk aan ${decimalToHex(dec)} in hexadecimaal.`
    });
  }

  // Binaire vermenigvuldiging
  {
    const bin1 = getRandomNumber(2, 8, 31);
    const bin2 = getRandomNumber(2, 8, 31);
    questions.push({
      label: `Wat is ${bin1} × ${bin2} (binair)?`,
      answer: decimalToBinary(parseInt(bin1, 2) * parseInt(bin2, 2))
      
    });
  }

  // Binaire optelling en aftrekking
  {
    const val1 = Math.floor(rng() * 256);
    const val2 = Math.floor(rng() * 256);
    questions.push({
      label: `Wat is ${toBinary8Bits(val1)} + ${toBinary8Bits(val2)} (binair)?`,
      answer: decimalToBinary(val1 + val2)
    });
  }

  {
    const val1 = Math.floor(rng() * 256) + 128;
    const val2 = Math.floor(rng() * 128);
    questions.push({
      label: `Wat is ${toBinary8Bits(val1)} - ${toBinary8Bits(val2)} (binair)?`,
      answer: decimalToBinary(Math.max(0, val1 - val2))
    });
  }

  // Hexadecimale berekeningen
  {
    const a = getRandomNumber(16).toUpperCase();
    const b = getRandomNumber(16).toUpperCase();
    questions.push({
      label: `Wat is ${a} + ${b} (hexadecimaal)?`,
      answer: decimalToHex(parseInt(a, 16) + parseInt(b, 16))
    });
  }

  {
    const a = getRandomNumber(16).toUpperCase();
    const b = getRandomNumber(16).toUpperCase();
    questions.push({
      label: `Wat is ${a} - ${b} (hexadecimaal)?`,
      answer: decimalToHex(Math.max(0, parseInt(a, 16) - parseInt(b, 16)))
    });
  }

  // Octale berekeningen
  {
    const a = Math.floor(rng() * 512);
    const b = Math.floor(rng() * 512);
    questions.push({
      label: `Wat is ${a.toString(8).padStart(3, '0')} + ${b.toString(8).padStart(3, '0')} (octaal)?`,
      answer: (a + b).toString(8)
    });
  }

  {
    const a = Math.floor(rng() * 512);
    const b = Math.floor(rng() * 512);
    questions.push({
      label: `Wat is ${a.toString(8).padStart(3, '0')} - ${b.toString(8).padStart(3, '0')} (octaal)?`,
      answer: (a - b).toString(8)
    });
  }

  // Subnet vraag
  {
    function getRandomIP() {
      return Array.from({ length: 4 }, () => Math.floor(rng() * 256));
    }

    const mask = [255, 255, 254, 0];
    const ipA = getRandomIP();
    let ipB;

    const sameSubnet = rng() < 0.5;
    if (sameSubnet) {
      ipB = ipA.map((octet, i) => (mask[i] === 255 ? octet : Math.floor(rng() * 256) & ~mask[i]));
    } else {
      ipB = ipA.slice();
      const changeIndex = [2, 1, 0][Math.floor(rng() * 3)];
      ipB[changeIndex] = ipA[changeIndex] ^ 1;
    }

    function andIP(ip, mask) {
      return ip.map((octet, i) => octet & mask[i]).join('.');
    }

    const aNet = andIP(ipA, mask);
    const bNet = andIP(ipB, mask);
    const correct = aNet === bNet ? 'juist' : 'onjuist';

    questions.push({
      label: `Adres A: ${ipA.join('.')}<br>Adres B: ${ipB.join('.')}<br>Masker: ${mask.join('.')}<br><strong>Behoren deze IP-adressen tot dezelfde reeks?</strong><br><em>(Antwoord: "juist" of "onjuist")</em>`,
      answer: correct,
      explanation: (aNet === bNet)
        ? `✔️ Adressen zitten in hetzelfde subnet want ${aNet} == ${bNet}`
        : `❌ Adressen zitten *niet* in hetzelfde subnet want ${aNet} ≠ ${bNet}`
    });
  }

    // Optelling in willekeurig talstelsel, resultaat in hex
  {
    const base = Math.floor(rng() * 6) + 5; // willekeurig stelsel tussen 5 en 10
    const val1Dec = Math.floor(rng() * 100) + 1;
    const val2Dec = Math.floor(rng() * 100) + 1;
    const val1Base = val1Dec.toString(base).toUpperCase();
    const val2Base = val2Dec.toString(base).toUpperCase();
    const sumDec = val1Dec + val2Dec;
    const sumHex = sumDec.toString(16).toUpperCase().padStart(2, '0');
    
    questions.push({
      label: `Tel de getallen ${val1Base} (${val1Base} in het ${base}-tallige stelsel) en ${val2Base} (${val2Base} in het ${base}-tallige stelsel) op en geef het antwoord als een hexadecimaal getal.`,
      answer: `0x${sumHex}`,
      explanation: `${val1Base} (${val1Dec}) + ${val2Base} (${val2Dec}) = ${sumDec} = 0x${sumHex}`
    });
  }


  return questions;
}
