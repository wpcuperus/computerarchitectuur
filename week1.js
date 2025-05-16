// Functie voor willekeurige getallen in een bepaald talstelsel
function getRandomNumber(base, min = 0, max = Math.pow(base, 3) - 1) {
  const range = max - min + 1;
  const randomValue = Math.floor(rng() * range) + min;
  return randomValue.toString(base);
}

// Converteer een decimaal getal naar binair
function decimalToBinary(decimal) {
  return parseInt(decimal, 10).toString(2);
}

// Converteer een hexadecimaal getal naar binair
function hexToBinary(hex) {
  return parseInt(hex, 16).toString(2);
}

// Converteer een octaal getal naar binair
function octToBinary(octal) {
  return parseInt(octal, 8).toString(2);
}

// Converteer een binair getal naar hexadecimaal
function binaryToHex(binary) {
  return parseInt(binary, 2).toString(16).toUpperCase();
}

// Converteer een octaal getal naar hexadecimaal
function octToHex(octal) {
  return parseInt(octal, 8).toString(16).toUpperCase();
}

// Converteer een decimaal getal naar hexadecimaal
function decimalToHex(decimal) {
  return parseInt(decimal, 10).toString(16).toUpperCase();
}

// Zet waarde om naar een binair getal van 8 bits
function toBinary8Bits(value) {
  return value.toString(2).padStart(8, '0');
}

// Genereer de vragen voor week 1
function generateWeek1Questions() {
  const hexDecVal = Math.floor(rng() * (65535 - 4096 + 1)) + 4096;
  const hex = hexDecVal.toString(16).toUpperCase().padStart(4, '0');
  const bin = getRandomNumber(2, 8, 255); // binair tussen 1000 en 111111
  const octDecVal = Math.floor(rng() * (511 - 64 + 1)) + 64;
  const oct = octDecVal.toString(8).padStart(3, '0');

  const base = Math.floor(rng() * 5) + 5; // willekeurig stelsel tussen 5 en 9
  const custom = getRandomNumber(base, 10, 500); // aangepast stelsel tussen 10 en 200 decimaal

  const dec = getRandomNumber(10, 100, 999); // Voor hex-conversie

// Binaire waarden voor optelling
const binAdd1Val = Math.floor(rng() * 256);
const binAdd2Val = Math.floor(rng() * 256);
const binAdd1 = toBinary8Bits(binAdd1Val);
const binAdd2 = toBinary8Bits(binAdd2Val);

// Binaire waarden voor aftrekking
// Binaire waarden voor aftrekking (zorg ervoor dat binSub1Val > binSub2Val)
const binSub1Val = Math.floor(rng() * 256) + 128; // Verhoogt de minimale waarde voor binSub1
const binSub2Val = Math.floor(rng() * 128); // Verlaag de maximale waarde voor binSub2
const binSub1 = toBinary8Bits(binSub1Val);
const binSub2 = toBinary8Bits(binSub2Val);


// Hexadecimale waarden voor optelling
const hexAdd1 = getRandomNumber(16).toUpperCase();
const hexAdd2 = getRandomNumber(16).toUpperCase();

// Hexadecimale waarden voor aftrekking
const hexSub1 = getRandomNumber(16).toUpperCase();
const hexSub2 = getRandomNumber(16).toUpperCase();

// Octale waarden voor optelling
const octAdd1Val = Math.floor(rng() * 512);
const octAdd1 = octAdd1Val.toString(8).padStart(3, '0');
const octAdd2Val = Math.floor(rng() * 512);
const octAdd2 = octAdd2Val.toString(8).padStart(3, '0');

// Octale waarden voor aftrekking
const octSub1Val = Math.floor(rng() * 512);
const octSub1 = octSub1Val.toString(8).padStart(3, '0');
const octSub2Val = Math.floor(rng() * 512);
const octSub2 = octSub2Val.toString(8).padStart(3, '0');


  const bin1 = getRandomNumber(2, 8, 31); // 4 tot 5 bits
  const bin2 = getRandomNumber(2, 8, 31);

  return [
    // Conversies naar decimaal
    { label: `Zet het hexadecimale getal ${hex} om naar decimaal:`, answer: parseInt(hex, 16) },
    { label: `Zet het binaire getal ${bin} om naar decimaal:`, answer: parseInt(bin, 2) },
    { label: `Zet het octale getal ${oct} om naar decimaal:`, answer: parseInt(oct, 8) },
    { label: `Zet het getal ${custom} in stelsel-${base} om naar decimaal:`, answer: parseInt(custom, base) },

    // Conversies naar hexadecimaal
    { label: `Zet het binaire getal ${bin} om naar hexadecimaal:`, answer: binaryToHex(bin) },
    { label: `Zet het octale getal ${oct} om naar hexadecimaal:`, answer: octToHex(oct) },
    { label: `Zet het decimale getal ${dec} om naar hexadecimaal:`, answer: decimalToHex(dec) },


    // Binaire vermenigvuldiging
    { label: `Wat is ${bin1} × ${bin2} (binair)?`, answer: decimalToBinary(parseInt(bin1, 2) * parseInt(bin2, 2)) },

// Rekenen in binaire stelsel
{ label: `Wat is ${binAdd1} + ${binAdd2} (binair)?`, answer: decimalToBinary(binAdd1Val + binAdd2Val) },
{ label: `Wat is ${binSub1} - ${binSub2} (binair)?`, answer: decimalToBinary(Math.max(0, binSub1Val - binSub2Val)) },

// Rekenen in hexadecimaal
{ label: `Wat is ${hexAdd1} + ${hexAdd2} (hexadecimaal)?`, answer: decimalToHex(parseInt(hexAdd1, 16) + parseInt(hexAdd2, 16)) },
{ label: `Wat is ${hexSub1} - ${hexSub2} (hexadecimaal)?`, answer: decimalToHex(Math.max(0, parseInt(hexSub1, 16) - parseInt(hexSub2, 16))) },

// Rekenen in octaal
{ label: `Wat is ${octAdd1} + ${octAdd2} (octaal)?`, answer: (octAdd1Val + octAdd2Val).toString(8) },
{ label: `Wat is ${octSub1} - ${octSub2} (octaal)?`, answer: (octSub1Val - octSub2Val).toString(8) },

    // Subnetvraag (juist/onjuist)
    (function () {
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

      function ipToString(ip) {
        return ip.join('.');
      }

      function andIP(ip, mask) {
        return ip.map((octet, i) => octet & mask[i]).join('.');
      }

      const aNet = andIP(ipA, mask);
      const bNet = andIP(ipB, mask);
      const correct = (aNet === bNet) ? 'juist' : 'onjuist';

      const uitleg = (aNet === bNet)
        ? `✔️ Adressen zitten in hetzelfde subnet want ${aNet} == ${bNet}`
        : `❌ Adressen zitten *niet* in hetzelfde subnet want ${aNet} ≠ ${bNet}`;

      return {
        label: `Adres A: ${ipToString(ipA)}<br>Adres B: ${ipToString(ipB)}<br>Masker: ${ipToString(mask)}<br><strong>Behoren deze IP-adressen tot dezelfde reeks?</strong><br><em>(Antwoord: "juist" of "onjuist")</em>`,
        answer: correct,
        explanation: uitleg
      };
    })()
  ];
}
