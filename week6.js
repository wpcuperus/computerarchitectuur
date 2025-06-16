// Week 6: Processor en optimalisatie
// Categorieën:
// - Datapath
// - System Bus inc. address lines, data lines and control lines
// - Pipelining
// - Caching

function generateWeek6Questions() {
  const questions = [];

  // Vraag 1 – Cache tag berekening met willekeurige geheugengrootte
  {
    const power = Math.floor(rng() * 5) + 20; // 20..24 (1MiB - 16MiB)
    const addressBits = power + 1;
    const cacheLines = 512;
    const indexBits = Math.log2(cacheLines);
    const offsetBits = 0; // 1 byte per adres
    const tagBits = addressBits - indexBits - offsetBits;

    const sizeMiB = Math.pow(2, power) / (1024 * 1024);

    questions.push({
      id: `tag-bits-direct-mapped-cache`,
      title: 'Tag-bits in direct-mapped cache',
      label: `Gegeven is een direct-mapped cache voor een systeem met ${sizeMiB.toFixed(0)}MiB adressen. Op elk adres kan 1 byte aan data worden opgeslagen. De cache heeft 512 regels (elke regel: valid-bit + tag + data).<br>Uit hoeveel bits bestaat het tag-veld van elke regel in de cache?`,
      hint: `Bepaal het totaal aantal bits voor een adres (op basis van de geheugengrootte), trek daar het aantal indexbits af (log₂(aantal cacheregels)) en trek eventueel offsetbits af als een cache-regel meerdere bytes bevat. Let op: 1 MiB = 1024 KiB = 2^20 bytes.`,
      categories: ['Caching'],
      answer: tagBits,
      explanation: `${sizeMiB} MiB = 2^${addressBits} adressen = ${addressBits} adresbits. Cache: 512 regels = 2^${indexBits} → indexbits = ${indexBits}. Geen offsetbits. tag = ${addressBits} - ${indexBits} = ${tagBits}.`
    });
  }

  // Vraag 2 – AMAT berekening met willekeurige tijd en miss ratio
  {
    const nsPerCycle = (Math.floor(rng() * 91) + 10); // 10 - 100 ns
    const missPenalty = 10;
    const missRatio = Math.floor(rng() * 21) + 10; // 10% - 30%

    const amat = (1 + (missRatio / 100) * missPenalty) * nsPerCycle;

    questions.push({
      id: `amat-calculation`,
      title: 'Gemiddelde toegangstijd tot geheugen (AMAT)',
      label: `Gegeven een processor met de volgende gegevens:<br>
      • ${nsPerCycle} nanoseconde per clock-cycle<br>• cache hit access time = 1 clock-cycle<br>• cache miss penalty = ${missPenalty} clock-cycles<br>
      • cache miss ratio = ${missRatio}%<br>
      Wat is de gemiddelde access tijd tot het geheugen?<br>
      Geef het antwoord in nanoseconden (ns).`,
      hint: `Gebruik de formule: AMAT = (1 + miss ratio × miss penalty) × tijd per clock-cycle. Vergeet niet om miss ratio in decimale vorm te gebruiken (bijv. 20% = 0.20).`,      
      categories: ['Caching'],
      answer: `${Math.round(amat)}`,
      correctAnswers: [`${Math.round(amat)}`, amat, amat + ' ns', `${Math.round(amat)} ns`],
      explanation: `AMAT = (1 + ${missRatio / 100} * ${missPenalty}) × ${nsPerCycle} = ${amat.toFixed(2)} ns`
    });
  }

  // Vraag 3 – Maximale geheugenruimte bij random adres-/databus
  {
    const addressBits = Math.floor(rng() * 6) + 10; // 10-15
    const dataBits = Math.pow(2, Math.floor(rng() * 3) + 3); // 8, 16, 32 bits
    const bytes = Math.pow(2, addressBits);
    const kib = bytes / 1024;

    questions.push({
      id: `max-addressable-memory`,
      title: 'Maximaal adresseren geheugen',
      label: `Een processor maakt gebruik van een ${addressBits} bits adresbus en een ${dataBits} bits databus. Hoeveel geheugen in KiB (kibibyte) kan men maximaal adresseren?`,
      hint: `Gebruik 2^adresbits om te berekenen hoeveel geheugenadressen beschikbaar zijn. Elk adres vertegenwoordigt 1 byte. Deel het totaal door 1024 om naar KiB om te rekenen.`,
      categories: ['Datapath'],
      answer: `${kib} KiB`,
      correctAnswers: [`${kib} KiB`, `${kib}`],
      explanation: `${addressBits} bits adresbus = 2^${addressBits} = ${bytes} bytes → ${kib} KiB`
    });
  }

  // Vraag 4 – Timer reset tijd
  {
    const freq = Math.pow(10, 6) * (Math.floor(rng() * 5) + 1); // 1 MHz – 5 MHz
    const startVal = (Math.floor(rng() * 9000) + 1000); // 1000–9999
    const duration = (startVal / freq) * 1000; // in milliseconden

    questions.push({
      id: `timer-reset-time`,
      title: 'Teller reset tijd',
      label: `Neem aan dat de systeemklok een frequentie heeft van ${freq / 1e6} MHz. We maken gebruik van een teller die wordt ingesteld met een startwaarde. Elke klokperiode wordt de teller met 1 verlaagd. Als de teller 0 bereikt wordt hij gereset naar de startwaarde. De startwaarde wordt ingesteld op ${startVal}.<br>Hoe lang duurt het voordat de teller wordt gereset? Geef het antwoord in milliseconden (ms).`,
      categories: ['Pipelining'],
      hint: `De duur van één klokperiode is 1 / frequentie. Vermenigvuldig dat met de startwaarde om de tijd tot reset te vinden. Vermenigvuldig eventueel met 1000 voor milliseconden.`,      
      answer: `${duration.toFixed(2)} ms`,
      correctAnswers: [`${duration.toFixed(2)} ms`, `${duration.toFixed(2)}`],
      explanation: `1 klokperiode = 1/${freq} s. Reset = ${startVal} × (1/${freq}) = ${duration} ms`
    });
  }

  // Vraag 5 – Hoogste geheugenadres hex
  {
    const addressBits = Math.floor(rng() * 6) + 10; // 10 - 15
    const maxAddress = Math.pow(2, addressBits) - 1;
    const hexAddr = `${maxAddress.toString(16).toUpperCase()}`;

    questions.push({
      id: `highest-memory-address-hex`,
      title: 'Hoogste geheugenadres in hexadecimaal',
      label: `Een geheugenkaart maakt gebruik van een databus van 8 bits en een adresbus van ${addressBits} bits. Het geheugen is byte addresseerbaar. Wat is het hoogste geheugenadres uitgedrukt als hexadecimaal getal?`,
      hint: `Bepaal het hoogste adres als 2^adresbits - 1. Zet dit getal om naar hexadecimale notatie.`,
      categories: ['Datapath'],
      answer: hexAddr,
      correctAnswers: [hexAddr, `0x${hexAddr}`],
      explanation: `${addressBits} bits → hoogste adres = 2^${addressBits} - 1 = ${maxAddress} = ${hexAddr}`
    });
  }

  // Vraag 6 – Atmel vs Interchip frequentie/instructie vergelijking
  {
    const atmelFreq = (Math.floor(rng() * 30) + 10) * 1e6; // 10 – 39 MHz
    const interchipFreq = (Math.floor(rng() * 90) + 10) * 1e6; // 10 – 99 MHz

    const atmelIPS = atmelFreq / 1; // 1 klok per instructie
    const interchipIPS = interchipFreq / 4; // 4 klokperiodes per instructie

    const winner = atmelIPS > interchipIPS ? 'Atmel' : 'Interchip';

    questions.push({
      id: `atmel-vs-interchip`,
      title: 'Vergelijking Atmel en Interchip processors',
      label: `De firma Atmel biedt 8-bits RISC-processoren aan waarbij alle instructies in één klokperiode worden uitgevoerd. De frequentie is ${atmelFreq / 1e6} MHz.<br>De firma Interchip biedt een 8-bits platform aan waarbij elke instructie 4 klokperiodes duurt, met een frequentie van ${interchipFreq / 1e6} MHz.<br>Welk van deze beide processors verwerkt meer instructies per seconde?`,
      hint: `Bereken het aantal instructies per seconde (IPS) voor beide processoren. IPS = frequentie / cycli per instructie. Vergelijk de uitkomsten.`,
      categories: ['Datapath'],
      answer: winner,
      explanation: `Atmel: ${atmelFreq / 1e6}M / 1 = ${atmelIPS} IPS<br>Interchip: ${interchipFreq / 1e6}M / 4 = ${interchipIPS} IPS<br>→ ${winner} is sneller`
    });
  }

// Vraag 7 – Dynamisch programma met pipelining en forwarding
{
  const baseInstructions = [
    'la x31, arr',             // pseudo-instructie (2 echte instructies)
    'addi x4, zero, 3',
    'lw x1, 0(x31)',
    'lw x2, 8(x31)',
    'lw x4, 16(x31)',
    'add x3, x1, x2',
    'sw x3, 24(x31)',
    'sw x4, 8(x31)',
    'add x5, x1, x4',
    'sw x5, 32(x31)',
    'add x6, x4, x5'
  ];

  const additionalInstructions = [
    'lw x7, 20(x31)',
    'add x8, x7, x4',
    'sw x8, 36(x31)',
    'addi x9, x8, 1',
    'add x10, x6, x9',
    'sw x10, 40(x31)'
  ];

  // Bepaal hoeveel extra instructies we toevoegen (0–6)
  const extraCount = Math.floor(rng() * (additionalInstructions.length + 1));
  const extraInstrs = additionalInstructions.slice(0, extraCount);

  const allInstructions = [...baseInstructions, ...extraInstrs];

  // Bepaal het totaal aantal effectieve instructies
  const instructionCount = allInstructions.reduce((count, line) => {
    return count + (line.startsWith('la ') ? 2 : 1);
  }, 0);

  const totalCycles = instructionCount + 4;

  // Bouw de HTML codeweergave op
  const formattedCode = ['<code>.data', '&nbsp;&nbsp;arr: .word 5 10 20 30 40 50 60 70 80 90 100', '', '.text']
    .concat(allInstructions.map(instr => '&nbsp;&nbsp;' + instr))
    .join('<br>');

  const html = `Gegeven onderstaand programma.<br><br>${formattedCode}<br><br></code>
Het programma wordt uitgevoerd door een processor met pipelining en forwarding. 
In hoeveel klokcycli wordt dit programma uitgevoerd nadat het datasegment geladen is?`;

  const explanation = `De pseudo-instructie <code>la</code> telt als 2 instructies. In totaal zijn er ${instructionCount} instructies. 
Met pipelining en forwarding duurt het ${instructionCount} klokcycli om alle instructies te starten, plus 4 extra cycli voor afronding (laatste instructie door WB): 
dus ${instructionCount} + 4 = ${totalCycles} klokcycli.`;

  questions.push({
    id: `pipelining-forwarding-riscv-dynamic`,
    title: 'Pipelining en Forwarding in RISC-V',
    label: html,
    hint: `Tel het aantal echte instructies (let op pseudo-instructies zoals 'la') en pas de pipeliningregel toe. Let op: in pipelining bestaat elke instructie uit 5 fasen: IF (instruction fetch), ID (instruction decode), EX (execute), MEM (memory access), WB (write back).`,
    answer: `${totalCycles}`,
    categories: ['Pipelining'],
    explanation: explanation
  });
}



  // Vraag 8 – Geheugenchips met willekeurige aantallen en groottes
  {
    const chipCount = Math.floor(rng() * 4) + 1; // 1 - 4 chips
    const chipSizePower = Math.floor(rng() * 4) + 15; // 32KiB - 256KiB (2^15..2^18)
    const chipSizeKiB = Math.pow(2, chipSizePower - 10); // in KiB
    const totalBytes = chipCount * Math.pow(2, chipSizePower);
    const addressLines = Math.ceil(Math.log2(totalBytes));

    questions.push({
      id: `address-lines-memory-chips`,
      title: 'Adreslijnen voor geheugenchips',
      label: `Een embedded computersysteem heeft ${chipCount} geheugenchip${chipCount > 1 ? 's' : ''} van elk ${chipSizeKiB} KiB.<br>Hoeveel adreslijnen heb je nodig om elke byte in elke chip aan te kunnen spreken?`,
      hint: `Zoek eerst de macht van 2 die uitkomt op ${chipSizeKiB}. Houd rekening met dat 1 KiB = 2^10 bytes, dus tel dat op de macht van 2 die uitkomt op ${chipSizeKiB}. Vermenigvuldig de macht van 2 die je vindt met het aantal geheugenchips om het totale aantal adressen te krijgen.`,
      answer: `${addressLines}`,
      categories: ['Datapath'],
      explanation: `Elke chip: ${chipSizeKiB} KiB = 2^${chipSizePower - 10} * 2^10 bytes = 2^${chipSizePower} bytes adressen<br>
      ${chipCount} chip${chipCount > 1 ? 's' : ''} dus ${chipCount} * 2^${chipSizePower} = 2^${Math.log2(totalBytes)} bytes adressen<br>
      Dus ${addressLines} adreslijnen om elke byte aan te kunnen spreken<br>
      Onthoud dat 1 KiB = 2^10`

    });
  }

  // Vraag 8 – Adreslijnen voor geheugengrootte
  {
    const sizeMB = Math.pow(2, Math.floor(rng() * 5) + 1); // 2, 4, 8, 16, 32 MB
    const sizeBytes = sizeMB * 1024 * 1024;
    const addressLines = Math.ceil(Math.log2(sizeBytes));

    questions.push({
      id: `address-lines-memory-card`,
      title: 'Adreslijnen voor geheugenkaart',
      label: `Een geheugenkaart bevat ${sizeMB} MiB geheugenadressen, hoeveel adreslijnen zijn nodig om dit geheugen te adresseren?`,
      hint: `Gebruik de formule log₂(geheugengrootte in bytes) om het aantal adreslijnen te berekenen. Voorbeeld: log₂(1024) = 10 (2^10 = 1024), dus 10 bits zijn nodig om 1024 adressen aan te duiden.`,
      answer: `${addressLines}`,
      categories: ['Datapath'],
      explanation: `${sizeMB} MiB = ${sizeBytes.toLocaleString()} bytes. Aantal bits om elk uniek adres aan te wijzen = log₂(${sizeBytes}) = ${addressLines} bits.`
    });
  }

  // Vraag 9 – Videoframe (beperkt tot 4:3 of 16:9 resoluties tot 720p)
  {
    const resolutions = [
      { width: 640, height: 480 },   // 4:3
      { width: 800, height: 600 },   // 4:3
      { width: 1024, height: 768 },  // 4:3
      { width: 640, height: 360 },   // 16:9
      { width: 854, height: 480 },   // 16:9
      { width: 1280, height: 720 }   // 16:9
    ];
    const resIndex = Math.floor(rng() * resolutions.length);
    const { width, height } = resolutions[resIndex];

    const numColors = [1, 3][Math.floor(rng() * 2)]; // 1 (grijs) of 3 (RGB)
    const shadesPerColor = Math.pow(2, Math.floor(rng() * 4) + 6); // 64–512
    const bitsPerPixel = numColors * Math.ceil(Math.log2(shadesPerColor));
    const totalBits = width * height * bitsPerPixel;
    const totalBytes = Math.ceil(totalBits / 8);

    questions.push({
      id: `videoframe-uncompressed`,
      title: 'Videoframe ongecomprimeerd versturen',
      label: `Gegeven een videoframe van ${width}×${height} beeldpunten (pixels). Elk beeldpunt heeft ${numColors} kleur(en). Elke kleur kent ${shadesPerColor} tinten. Dit videoframe wordt ongecomprimeerd over een netwerk verstuurd. <br> Hoeveel bytes worden er dan minimaal verzonden?`,
      hint: `Bereken eerst het aantal pixels (breedte × hoogte). Bepaal hoeveel bits elke pixel nodig heeft (aantal kleuren × log₂(aantal tinten)). Vermenigvuldig en deel het totaal door 8 om naar bytes om te rekenen.`,
      answer: `${totalBytes}`,
      categories: ['Datapath'],
explanation: `${width} × ${height} = ${width * height} pixels. `
  + `Elk pixel heeft ${numColors} kleur(en). `
  + `Elke kleur heeft ${shadesPerColor} tinten → log₂(${shadesPerColor}) = ${Math.log2(shadesPerColor)} bits per kleur. `
  + `Bits per pixel: ${numColors} × ${Math.log2(shadesPerColor)} = ${bitsPerPixel} bits. `
  + `Totaal aantal bits: ${width * height} × ${bitsPerPixel} = ${totalBits} bits. `
  + `Omrekenen naar bytes: ${totalBits} ÷ 8 = ${Math.floor(totalBits / 8)} bytes `
  + `(afgerond naar boven: ${totalBytes} bytes om volledige bytes te hebben).`
    });
  }


  // Vraag 10 – Tag-bits bij direct mapped cache
  {
    const memoryMB = Math.pow(2, Math.floor(rng() * 5) + 1); // 2–32 MB
    const memoryBytes = memoryMB * 1024 * 1024;
    const cacheKB = Math.pow(2, Math.floor(rng() * 4) + 1); // 2–16 KB
    const cacheLines = (cacheKB * 1024) / 1; // 1 byte per blok
    const addressBits = Math.ceil(Math.log2(memoryBytes));
    const indexBits = Math.ceil(Math.log2(cacheLines));
    const offsetBits = 0; // 1 byte per blok
    const tagBits = addressBits - indexBits - offsetBits;

    questions.push({
      id: `tag-bits-direct-mapped-cache`,
      title: 'Tag-bits bij direct mapped cache',
      label: `Gegeven een systeem met een woordbreedte van 1 byte, een (maximaal) geheugen van ${memoryMB} MiB en een cache van ${cacheKB} KiB. <br> Bij direct mapped cache, hoeveel bits is het tag-veld van dit systeem?`,
      hint: `Onthoud dat 1 MiB gelijkstaat aan 2^20 bytes <a href="https://nl.wikipedia.org/wiki/Veelvouden_van_bytes">meer info</a>. Bereken met deze informatie het aantal bits voor adres. De cache is gelijk aan een macht van 2 (bijv. 512 regels = 2^9 regels). Adres - index - offset = tag bits.`,
      answer: `${tagBits}`,
      categories: ['Caching'],
      explanation: `Geheugen: ${memoryBytes.toLocaleString()} bytes → ${addressBits} adresbits.<br>Cache met ${cacheKB} KB = ${cacheLines} regels → ${indexBits} indexbits.<br>Tag = ${addressBits} - ${indexBits} - ${offsetBits} = ${tagBits} bits.`
    });
  }

  return questions;
}
