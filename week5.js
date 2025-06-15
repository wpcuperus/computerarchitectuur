const questions = [];

function generateWeek5Questions() {
    // Vraag 1: Instructie voor stack opslag
// Vraag 1: Instructie voor stack opslag – meerkeuzevraag met unieke opties
{
  const bitOptions = [8, 16, 32, 64];
  const selectedBits = bitOptions[Math.floor(rng() * bitOptions.length)];
  const bytes = selectedBits / 8;

  const correct = `addi sp, sp, -${bytes}`;
  const correctValue = -bytes;

  // Genereer unieke alternatieve offsetwaarden die ongelijk zijn aan het correcte antwoord
  const uniqueOffsets = new Set();
  uniqueOffsets.add(correctValue);

  // Gebruik een reeks plausibele afwijkende waarden
  const candidateOffsets = [-1, -2, -4, -8, -16, -32, -64, -3, -5, -6, -12, -24, -0];

  while (uniqueOffsets.size < 6 && candidateOffsets.length > 0) {
    const idx = Math.floor(rng() * candidateOffsets.length);
    const val = candidateOffsets.splice(idx, 1)[0];
    uniqueOffsets.add(val);
  }

  // Zet alle unieke offsets om in instructies
  const allOptions = Array.from(uniqueOffsets).map(v => `addi sp, sp, ${v}`);
  // Shuffle op basis van seed
  const shuffled = allOptions
    .map(opt => ({ opt, sort: rng() }))
    .sort((a, b) => a.sort - b.sort)
    .map(o => o.opt);

  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const labelHtml = shuffled.map((option, idx) => {
    return `<strong>${labels[idx]}.</strong> <code>${option}</code>`;
  }).join('<br>');

  const correctIndex = shuffled.findIndex(opt => opt === correct);
  const correctLabel = labels[correctIndex];

  const html = `
    <p>Een programmeur schrijft een procedure waarbij hij/zij aan het begin de waarde van register <code>x20</code> in de stack wil opslaan. 
    Welke instructie moet hij voorafgaand aan de opslag uitvoeren, als er gebruik gemaakt wordt van ${selectedBits}-bits registers?</p>
    <p>Kies de juiste optie:</p>
    ${labelHtml}
  `;

  const explanation = `Voor ${selectedBits}-bits registers is elk register ${bytes} byte${bytes > 1 ? 's' : ''} groot. De stack groeit naar beneden, dus moet je de stack pointer met ${bytes} verlagen: <code>${correct}</code>.`;

  questions.push({
    id: `stack-storage-multiple-choice`,
    title: 'Stack Opslaan',
    label: html,
    categories: ['Stack storage', 'RISC-V'],
    hint: 'De stack groeit naar lagere adressen; een register moet helemaal passen.',
    answer: correctLabel,
    correctAnswers: [correctLabel],
    explanation: explanation,
  });
}

  // VRAAG 1 — Primaire functie van stack
  {
    const correct = 'Tijdelijke opslag voor registerwaarden en lokale variabelen van procedures';
    const distractors = [
      'Het permanent opslaan van globale variabelen',
      'Beheren van het heapgeheugen',
      'Opslaan van instructies',
      'Uitvoeren van systeemaanroepen',
      'Opslaan van constante waarden',
      'Versnellen van rekenkundige operaties',
      'Opslaan van het besturingssysteem',
      'Verwerken van interruptaanvragen',
      'Beheren van geheugenmapping',
      'Bewaren van statusflags'
    ];

    const allOptions = [correct, ...distractors.sort(() => rng() - 0.5).slice(0, 7)];
    const shuffled = allOptions.sort(() => rng() - 0.5);
    const labels = 'ABCDEFGH'.split('');
    const correctLabel = labels[shuffled.indexOf(correct)];

    const labelHtml = shuffled.map((opt, i) => `<strong>${labels[i]}.</strong> ${opt}`).join('<br>');

    questions.push({
      id: 'stack-function',
      title: 'Primaire functie van stack',
      label: `<p>Wat is de primaire functie van een stack in het geheugen van een processor?</p>${labelHtml}`,
      categories: ['Stack storage'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      explanation: `De stack wordt gebruikt voor tijdelijke opslag van informatie die nodig is tijdens procedure-uitvoering, zoals lokale variabelen en registerwaarden.`,
    });
  }

  // VRAAG 2 — Stack groeirichting (4 vaste opties)
  {
    const options = [
      'Van hogere adressen naar lagere adressen',
      'Van lagere adressen naar hogere adressen',
      'De groeirichting is afhankelijk van het besturingssysteem',
      'De stack heeft een vaste grootte en groeit niet'
    ];
    const shuffled = options.sort(() => rng() - 0.5);
    const labels = 'ABCD'.split('');
    const correct = 'Van hogere adressen naar lagere adressen';
    const correctLabel = labels[shuffled.indexOf(correct)];

    const labelHtml = shuffled.map((opt, i) => `<strong>${labels[i]}.</strong> ${opt}`).join('<br>');

    questions.push({
      id: 'stack-growth-direction',
      title: 'Stack groeirichting',
      label: `<p>In de RISC-V architectuur, hoe groeit de stack typisch in het geheugen?</p>${labelHtml}`,
      categories: ['Stack storage', 'RISC-V'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      explanation: `De stack groeit omlaag, dus van hogere naar lagere geheugensadressen.`,
    });
  }

  // VRAAG 3 — Stack pointer register
  {
    const correct = 'x2, en het wijst naar het meest recent toegewezen adres op de stack (de "top")';
    const distractors = [
      'x1, en het wijst naar de onderkant van de stack',
      'x3, en het bevat de start van de heap',
      'x2, en het wijst naar een constant adres',
      'x5, en het slaat lokale variabelen op',
      'x10, en het bevat de return value',
      'x8, en het slaat argumenten op',
      'x31, en het is het stack limit register',
      'x0, want het is altijd nul',
      'x4, gebruikt voor loop control',
      'x6, een temporary register'
    ];
    const allOptions = [correct, ...distractors.sort(() => rng() - 0.5).slice(0, 7)];
    const shuffled = allOptions.sort(() => rng() - 0.5);
    const labels = 'ABCDEFGH'.split('');
    const correctLabel = labels[shuffled.indexOf(correct)];

    const labelHtml = shuffled.map((opt, i) => `<strong>${labels[i]}.</strong> ${opt}`).join('<br>');

    questions.push({
      id: 'stack-pointer-register',
      title: 'Stack pointer in RISC-V',
      label: `<p>Welk RISC-V register fungeert als de stack pointer (sp) en waar wijst het naar?</p>${labelHtml}`,
      categories: ['Stack storage'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      explanation: `x2 is het stack pointer register in RISC-V. Het wijst naar het meest recent gebruikte (hoogste) adres in de stack.`,
    });
  }

  // VRAAG 4 — Jump and link
  {
    const correct = 'Het springt naar een adres en slaat het adres van de volgende instructie (PC+4) op in het return address register (x1)';
    const distractors = [
      'Het springt naar een adres en slaat het huidige Program Counter (PC) op in register x0',
      'Het springt onvoorwaardelijk naar een adres zonder iets op te slaan',
      'Het roept een interrupt handler aan',
      'Het springt naar een subroutine zonder terugkeeradres',
      'Het schakelt over naar supervisor mode',
      'Het gebruikt het global pointer register (x3)',
      'Het roept automatisch een leaf procedure aan',
      'Het schakelt register windows',
      'Het wijzigt het stack pointer register direct'
    ];
    const allOptions = [correct, ...distractors.sort(() => rng() - 0.5).slice(0, 7)];
    const shuffled = allOptions.sort(() => rng() - 0.5);
    const labels = 'ABCDEFGH'.split('');
    const correctLabel = labels[shuffled.indexOf(correct)];

    const labelHtml = shuffled.map((opt, i) => `<strong>${labels[i]}.</strong> ${opt}`).join('<br>');

    questions.push({
      id: 'jal-function',
      title: 'Functie van JAL',
      label: `<p>Wat is de functie van de <code>jal</code> (jump-and-link) instructie in RISC-V bij procedure calls?</p>${labelHtml}`,
      categories: ['Procedure Calls (Leaf and non-leaf)', 'RISC-V'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      explanation: `De <code>jal</code> instructie springt naar het doeladres en slaat <code>PC + 4</code> op in <code>x1</code> (return address).`,
    });
  }

  // VRAAG 5 — Leaf vs non-leaf
  {
    const correct = 'Een leaf procedure roept geen andere procedures aan, terwijl een non-leaf procedure wel andere procedures aanroept';
    const distractors = [
      'Een leaf procedure gebruikt alleen temporary registers, terwijl een non-leaf procedure saved registers gebruikt',
      'Leaf procedures zijn altijd recursief, non-leaf procedures nooit.',
      'Non-leaf procedures retourneren een waarde, leaf procedures niet.',
      'Leaf procedures gebruiken geen stack',
      'Non-leaf procedures kunnen niet worden geïnlineerd',
      'Leaf procedures zijn langzamer',
      'Non-leaf procedures worden alleen in supervisor mode uitgevoerd',
      'Leaf procedures gebruiken altijd JALR'
    ];
    const allOptions = [correct, ...distractors.sort(() => rng() - 0.5).slice(0, 7)];
    const shuffled = allOptions.sort(() => rng() - 0.5);
    const labels = 'ABCDEFGH'.split('');
    const correctLabel = labels[shuffled.indexOf(correct)];

    const labelHtml = shuffled.map((opt, i) => `<strong>${labels[i]}.</strong> ${opt}`).join('<br>');

    questions.push({
      id: 'leaf-vs-nonleaf',
      title: 'Leaf vs Non-leaf procedures',
      label: `<p>Wat is het belangrijkste verschil tussen een leaf procedure en een non-leaf procedure?</p>${labelHtml}`,
      categories: ['Procedure Calls (Leaf and non-leaf)'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      explanation: `Leaf procedures roepen geen andere functies aan; non-leaf procedures doen dat wel.`,
    });
  }

  // VRAAG 6 — Saved registers callee responsibility
  {
    const correct = 'Saved registers (x8-x9, x18-x27) en het return address register (x1)';
    const distractors = [
      'Temporary registers (x5-x7, x28-x31)',
      'Argument/result registers (x10-x17)',
      'De stack pointer (x2) en global pointer (x3)',
      'Alle registers behalve x0',
      'Registers met even nummers',
      'Floating-point registers',
      'x0, omdat het niet mag worden overschreven',
      'Alle environment call registers',
      'Alle registers in volgorde van prioriteit'
    ];
    const allOptions = [correct, ...distractors.sort(() => rng() - 0.5).slice(0, 7)];
    const shuffled = allOptions.sort(() => rng() - 0.5);
    const labels = 'ABCDEFGH'.split('');
    const correctLabel = labels[shuffled.indexOf(correct)];

    const labelHtml = shuffled.map((opt, i) => `<strong>${labels[i]}.</strong> ${opt}`).join('<br>');

    questions.push({
      id: 'callee-saved-registers',
      title: 'Registers die een callee moet bewaren',
      label: `<p>Welke categorie registers moeten door een callee (de aangeroepen procedure) worden bewaard (saved en later hersteld) als deze registers door de caller (de aanroepende procedure) worden gebruikt?</p>${labelHtml}`,
      categories: ['Procedure Calls (Leaf and non-leaf)', 'RISC-V'],
      answer: correctLabel,
      correctAnswers: [correctLabel],
      explanation: `Saved registers en x1 (return address) moeten door de callee bewaard worden, volgens de RISC-V calling convention.`,
    });
  }

    // VRAAG 7 — Welke registers moeten worden bewaard in fact?
  {
    const html = `
<p>Gegeven is onderstaand programma.</p>
<pre><code>.data
 arr: .word 1 3 4 5 6 7 8 9

.text
  la s3, arr
  addi s4, zero, 4
  addi s5, zero, 7
  lw x10, 12(s3)
  jal fact
  sw x10, 12(s3)
  addi s4, s4, 1
  j end
fact:
  # write to stack
  lw s4, 0(s3)
  sub x10, s4, s5
  # read from stack
  jalr x0, 0(x1)
end:
  add s5, s5, s5
</code></pre>
<p>Welke register(s) moeten in de procedure <code>fact</code> op de stack worden bewaard aan het begin van de procedure en aan het eind weer worden uitgelezen van de stack?</p>
<p>Kies het juiste antwoord:</p>
<strong>A.</strong> Alle "saved" registers s0, s1, ..., s10, s11<br>
<strong>B.</strong> Alleen s3, s4, s5 en x10<br>
<strong>C.</strong> Alleen s4<br>
<strong>D.</strong> Geen enkel register
`;

    const correctLabel = 'C';

    const explanation = `
De procedure <code>fact</code> gebruikt het register <code>s4</code> op een manier die de oorspronkelijke waarde zou overschrijven (door <code>lw s4, 0(s3)</code>). 
Omdat <code>s4</code> een saved register is (volgens de calling convention) en het wordt overschreven, moet het bewaard en hersteld worden. 
De andere registers die gebruikt worden (<code>x10</code>, <code>s3</code>, <code>s5</code>) worden niet overschreven of zijn geen saved registers waarvoor de callee verantwoordelijk is.
`;

    questions.push({
      id: 'fact-saved-registers',
      title: 'Registers bewaren in fact',
      label: html,
      categories: ['Procedure Calls (Leaf and non-leaf)', 'RISC-V'],
      hint: 'Welke saved registers worden in de procedure aangepast?',
      answer: correctLabel,
      correctAnswers: [correctLabel],
      explanation: explanation.trim(),
    });
  }


  return questions;
}
