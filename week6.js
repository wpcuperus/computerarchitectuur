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
      label: `Gegeven is een direct-mapped cache voor een systeem met ${sizeMiB.toFixed(0)}MiB adressen. Op elk adres kan 1 byte aan data worden opgeslagen. De cache heeft 512 regels (elke regel: valid-bit + tag + data).<br>Uit hoeveel bits bestaat het tag-veld van elke regel in de cache?`,
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
      label: `Gegeven met een processor met de volgende gegevens:<br>• ${nsPerCycle} nanoseconde per clock-cycle<br>• cache hit access time = 1 clock-cycle<br>• cache miss penalty = ${missPenalty} clock-cycles<br>• cache miss ratio = ${missRatio}%<br>Wat is de gemiddelde access tijd tot het geheugen?`,
      answer: `${Math.round(amat)} ns`,
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
      label: `Een processor maakt gebruik van een ${addressBits} bits adresbus en een ${dataBits} bits databus. Hoeveel geheugen in KiB (kibibyte) kan men maximaal adresseren?`,
      answer: `${kib} KiB`,
      explanation: `${addressBits} bits adresbus = 2^${addressBits} = ${bytes} bytes → ${kib} KiB`
    });
  }

  // Vraag 4 – Timer reset tijd
  {
    const freq = Math.pow(10, 6) * (Math.floor(rng() * 5) + 1); // 1 MHz – 5 MHz
    const startVal = (Math.floor(rng() * 9000) + 1000); // 1000–9999
    const duration = (startVal / freq) * 1000; // in milliseconden

    questions.push({
      label: `Neem aan dat de systeemklok een frequentie heeft van ${freq / 1e6} MHz. We maken gebruik van een teller die wordt ingesteld met een startwaarde. Elke klokperiode wordt de teller met 1 verlaagd. Als de teller 0 bereikt wordt hij gereset naar de startwaarde. De startwaarde wordt ingesteld op ${startVal}.<br>Hoe lang duurt het voordat de teller wordt gereset?`,
      answer: `${duration.toFixed(2)} ms`,
      explanation: `1 klokperiode = 1/${freq} s. Reset = ${startVal} × (1/${freq}) = ${duration} ms`
    });
  }

  // Vraag 5 – Hoogste geheugenadres hex
  {
    const addressBits = Math.floor(rng() * 6) + 10; // 10 - 15
    const maxAddress = Math.pow(2, addressBits) - 1;
    const hexAddr = `0x${maxAddress.toString(16).toUpperCase()}`;

    questions.push({
      label: `Een geheugenkaart maakt gebruik van een databus van 8 bits en een adresbus van ${addressBits} bits. Het geheugen is byte addresseerbaar. Wat is het hoogste geheugenadres uitgedrukt als hexadecimaal getal?`,
      answer: hexAddr,
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
      label: `De firma Atmel biedt 8-bits RISC-processoren aan waarbij alle instructies in één klokperiode worden uitgevoerd. De frequentie is ${atmelFreq / 1e6} MHz.<br>De firma Interchip biedt een 8-bits platform aan waarbij elke instructie 4 klokperiodes duurt, met een frequentie van ${interchipFreq / 1e6} MHz.<br>Welk van deze beide processors verwerkt meer instructies per seconde?`,
      answer: winner,
      explanation: `Atmel: ${atmelFreq / 1e6}M / 1 = ${atmelIPS} IPS<br>Interchip: ${interchipFreq / 1e6}M / 4 = ${interchipIPS} IPS<br>→ ${winner} is sneller`
    });
  }

  // Vraag 7 – Vast programma met pipelining en forwarding
  {
    const totalCycles = 16;

    questions.push({
      label: `Gegeven onderstaand programma.<br><br><code>
.data<br>
&nbsp;&nbsp;arr: .word 5 10 20 30 40 50 60 70 80 90 100<br><br>
.text<br>
&nbsp;&nbsp;la x31, arr<br>
&nbsp;&nbsp;addi x4, zero, 3<br>
&nbsp;&nbsp;lw x1, 0(x31)<br>
&nbsp;&nbsp;lw x2, 8(x31)<br>
&nbsp;&nbsp;lw x4, 16(x31)<br>
&nbsp;&nbsp;add x3, x1, x2<br>
&nbsp;&nbsp;sw x3, 24(x31)<br>
&nbsp;&nbsp;sw x4, 8(x31)<br>
&nbsp;&nbsp;add x5, x1, x4<br>
&nbsp;&nbsp;sw x5, 32(x31)<br>
&nbsp;&nbsp;add x6, x4, x5
</code><br>
Het programma wordt uitgevoerd door een processor met pipelining en forwarding. In hoeveel klokcycli wordt dit programma uitgevoerd nadat het datasegment geladen is?`,
      answer: `${totalCycles}`,
      explanation: `De 'la' pseudo-instructie bestaat uit 2 instructies. Er zijn dus 12 instructies. Zonder stalls duurt het 12 cycles om de laatste instructie te starten (IF), daarna nog 4 cycles om af te ronden. Dus totaal 16 clockcycles.`
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
      label: `Een embedded computersysteem heeft ${chipCount} geheugenchip${chipCount > 1 ? 's' : ''} van elk ${chipSizeKiB} KiB.<br>Hoeveel adreslijnen heb je nodig om elke byte in elke chip aan te kunnen spreken?`,
      answer: `${addressLines}`,
      explanation: `${chipCount} × ${chipSizeKiB} KiB = ${totalBytes} bytes totaal → log₂(${totalBytes}) = ${addressLines} adreslijnen nodig`
    });
  }


  return questions;
}
