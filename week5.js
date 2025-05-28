const questions = [];

function generateWeek5Questions() {
    // Vraag 1: Instructie voor stack opslag
    {
  const bitOptions = [8, 16, 32, 64];
  const selectedBits = bitOptions[Math.floor(rng() * bitOptions.length)];

  const bytes = selectedBits / 8;
  const html = `
  <p>Een programmeur schrijft een procedure waarbij hij/zij aan het begin de waarde van register x20 in de stack wil opslaan. 
  Welke instructie moet hij voorafgaand aan de opslag uit laten voeren als er gebruik gemaakt wordt van ${selectedBits}-bits registers?</p>`;

  const correctAnswer = `addi sp, sp, -${bytes}`;
  const altAnswer = `addi sp,sp,-${bytes}`; // zonder spaties

  const explanation = `Voor ${selectedBits}-bits registers moet er ${bytes} byte${bytes > 1 ? 's' : ''} op de stack worden gereserveerd. Dit gebeurt door de stack pointer (sp) met ${bytes} byte${bytes > 1 ? 's' : ''} omlaag te verplaatsen: \`${correctAnswer}\`.`;

  questions.push({
    label: html,
    answer: correctAnswer,
    correctAnswers: [correctAnswer, altAnswer],
    explanation: explanation,
  });
}

  // Vraag 2: Willekeurige stack instructie met offset en initiële waarde
  {
    const initialValueOptions = [0x1000, 0x2000, 0x3000, 0x4000];
    const offsetOptions = [1, 2, 4, 8];

    const initIndex = Math.floor(rng() * initialValueOptions.length);
    const offsetIndex = Math.floor(rng() * offsetOptions.length);

    const initialSP = initialValueOptions[initIndex];
    const offset = offsetOptions[offsetIndex];
    const newSP = initialSP - offset;

    const html = `
      <p>In een 64-bit RISC-V architectuur wordt de stack gebruikt voor tijdelijke opslag van registerwaarden tijdens procedure calls. 
      Het <code>sp</code> register (x2) wijst naar de top van de stack, en de stack groeit naar lagere geheugenadressen. 
      Stel het <code>sp</code> register heeft initieel de waarde <code>0x${initialSP.toString(16).toUpperCase()}</code>. 
      Welke waarde heeft het <code>sp</code> register na het uitvoeren van de instructie 
      <code>addi sp, sp, -${offset}</code>?</p>`;

    const correctAnswer = `0x${newSP.toString(16).toUpperCase()}`;
    const altAnswer = `0x${newSP.toString(16)}`; // ook kleine letters accepteren

    const explanation = `De instructie verlaagt de waarde van sp met ${offset} bytes. 
      ${initialSP.toString(16)} - ${offset.toString(16)} = ${newSP.toString(16)}.`;

    questions.push({
      label: html,
      answer: correctAnswer,
      correctAnswers: [correctAnswer, altAnswer],
      explanation: explanation,
    });
  }

    // Vraag 3: Leaf Procedure Calls
  {
    // Mogelijke sets van gebruikte registers
    const registerScenarios = [
      { used: ['t0 (x5)', 't1 (x6)'], answer: 'geen', explanationRegisters: 't0 en t1 zijn caller-saved registers.' },
      { used: ['s0 (x8)', 's1 (x9)'], answer: 's0, s1', explanationRegisters: 's0 en s1 zijn callee-saved registers en moeten gesaved/gerestored worden.' },
      { used: ['t0 (x5)', 's1 (x9)'], answer: 's1', explanationRegisters: 't0 is caller-saved, s1 is callee-saved.' },
      { used: ['a1 (x11)', 't2 (x7)'], answer: 'geen', explanationRegisters: 'a1 en t2 zijn beide caller-saved.' },
      { used: ['s2 (x18)'], answer: 's2', explanationRegisters: 's2 is een callee-saved register.' }
    ];

    const scenario = registerScenarios[Math.floor(rng() * registerScenarios.length)];
    const registersUsed = scenario.used.join(' en ');

    const html = `
      <p>Een <strong>leaf procedure</strong> is een procedure die geen andere procedures aanroept. 
      Volgens de RISC-V calling conventions heeft een leaf procedure specifieke verantwoordelijkheden met betrekking tot het gebruik van registers. 
      Sommige registers (<em>tijdelijke registers</em>) mogen worden gewijzigd zonder te saven/restoren door de procedure zelf, 
      terwijl andere (<em>saved registers</em>) wel gesaved/gerestored moeten worden als de procedure ze gebruikt.<br><br>
      Gegeven een RISC-V leaf procedure <code>bereken_iets_simpels</code> die een integer argument krijgt in <code>a0 (x10)</code>, 
      en enkele berekeningen uitvoert met behulp van ${registersUsed}, en een integer resultaat retourneert in <code>a0</code>.<br><br>
      Welke van de volgende registers moet <code>bereken_iets_simpels</code> zelf saven en restoren op de stack voordat het ze wijzigt, volgens de standaard RISC-V calling conventions?<br>
      Antwoord met de registernaam/na(a)m(en) of met "<code>geen</code>".</p>
    `;

    const correctAnswer = scenario.answer;
    const explanation = `Volgens de RISC-V calling convention: ${scenario.explanationRegisters} 
      Alleen callee-saved registers moeten door een leaf procedure gesaved/gerestored worden.`;

    questions.push({
      label: html,
      answer: correctAnswer,
      correctAnswers: [correctAnswer.toLowerCase(), correctAnswer.toUpperCase()],
      explanation: explanation,
    });
  }

    // Vraag 4: Non-leaf procedure stackverantwoordelijkheden
  {
    const scenarios = [
      {
        procName: 'proc_A',
        calledProc: 'proc_B',
        used: ['s0 (x8)', 't0 (x5)'],
        expected: 'ra (x1) en s0 (x8)',
        explanation: 'Omdat proc_A een non-leaf procedure is (het roept proc_B aan), moet het de huidige return address (ra) saven voordat het proc_B aanroept, omdat de jal-instructie naar proc_B de waarde in ra zal overschrijven. Omdat proc_A het saved register s0 gebruikt, moet het s0 saven voordat het s0 wijzigt en restoren voordat het zelf terugkeert, om de waarde van s0 voor zijn eigen caller te bewaren. Het register t0 is caller-saved; proc_A hoeft t0 dus niet te saven/restoren.'
      },
      {
        procName: 'doe_iets',
        calledProc: 'bereken_max',
        used: ['s1 (x9)'],
        expected: 'ra (x1) en s1 (x9)',
        explanation: 'Omdat doe_iets een non-leaf procedure is (het roept bereken_max aan), moet het ra saven/restoren. s1 is een callee-saved register, dus ook deze moet worden gesaved en gerestored.'
      },
      {
        procName: 'verwerk_data',
        calledProc: 'lees_input',
        used: ['t1 (x6)', 'a1 (x11)'],
        expected: 'ra (x1)',
        explanation: 'Omdat verwerk_data een non-leaf procedure is, moet ra gesaved worden. De registers t1 en a1 zijn caller-saved, dus hoeven niet door verwerk_data gesaved/restored te worden.'
      },
      {
        procName: 'analyseer',
        calledProc: 'filter_data',
        used: ['s2 (x18)', 's3 (x19)'],
        expected: 'ra (x1) en s2 (x18) en s3 (x19)',
        explanation: 'De procedure analyseer roept een andere procedure aan, dus ra moet worden gesaved. s2 en s3 zijn saved registers en worden gebruikt, dus moeten ook worden gesaved en hersteld.'
      }
    ];

    const scenario = scenarios[Math.floor(rng() * scenarios.length)];
    const usedRegisters = scenario.used.join(' en ');

    const html = `
      <p>Een <strong>non-leaf procedure</strong> is een procedure die wel andere procedures aanroept. 
      Non-leaf procedures hebben additionele verantwoordelijkheden ten opzichte van leaf procedures, 
      met name wat betreft het saven van het <em>return address</em> op de stack. Daarnaast moeten non-leaf procedures, net als leaf procedures, 
      de <em>saved registers</em> (s0-s11) saven en restoren als ze deze registers zelf wijzigen.<br><br>
      Overweeg een RISC-V procedure <code>${scenario.procName}</code> die de procedure <code>${scenario.calledProc}</code> aanroept. 
      Procedure <code>${scenario.procName}</code> gebruikt de volgende registers voor eigen berekeningen: ${usedRegisters}.<br><br>
      Welke van de volgende registers moet <code>${scenario.procName}</code> saven op de stack voordat het <code>${scenario.calledProc}</code> aanroept 
      en/of voordat het deze registers wijzigt, en vervolgens restoren voordat het zelf retourneert?<br>
      Antwoord in het formaat: <code>ra (x1)</code> of <code>ra (x1) en s0 (x8)</code>.</p>
    `;

const correctAnswer = scenario.expected;
const explanation = scenario.explanation;

// Automatisch correcte alternatieve antwoorden genereren
const registerParts = scenario.expected.split(' en ');

const namesOnly = registerParts.map(r => r.match(/^[a-z]+\d*/i)?.[0]).join(' en ');
const numbersOnly = registerParts.map(r => r.match(/x\d+/i)?.[0]).join(' en ');

// Alle vormen toevoegen
const correctAnswers = [
  correctAnswer.toLowerCase(),  // bv. "ra (x1) en s1 (x9)"
  namesOnly?.toLowerCase(),     // bv. "ra en s1"
  numbersOnly?.toLowerCase()    // bv. "x1 en x9"
].filter(Boolean);

questions.push({
  label: html,
  answer: correctAnswer,
  correctAnswers: correctAnswers,
  explanation: explanation
});


  }

  return questions;
}
