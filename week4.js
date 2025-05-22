// Week 4: Basic Assembly
function generateWeek4Questions() {
  const questions = [];

  {
    const rng = mulberry32(seed);
    const bitPosition = Math.floor(rng() * 8); // 0 t/m 7

    const bitTexts = [
      "Het 1e bit van rechts in x12 wordt op 1 gezet.",
      "Het 2e bit van rechts in x12 wordt op 1 gezet.",
      "Het 3e bit van rechts in x12 wordt op 1 gezet.",
      "Het 4e bit van rechts in x12 wordt op 1 gezet.",
      "Het 5e bit van rechts in x12 wordt op 1 gezet.",
      "Het 6e bit van rechts in x12 wordt op 1 gezet.",
      "Het 7e bit van rechts in x12 wordt op 1 gezet.",
      "Het 8e bit van rechts in x12 wordt op 1 gezet.",
    ];

    const wrongBitTexts = [
      "Het 1e bit van rechts in x12 wordt op 0 gezet.",
      "Het 2e bit van rechts in x12 wordt op 0 gezet.",
      "Het 3e bit van rechts in x12 wordt op 0 gezet.",
      "Het 4e bit van rechts in x12 wordt op 0 gezet.",
      "Het 5e bit van rechts in x12 wordt op 0 gezet.",
      "Het 6e bit van rechts in x12 wordt op 0 gezet.",
      "Het 7e bit van rechts in x12 wordt op 0 gezet.",
      "Het 8e bit van rechts in x12 wordt op 0 gezet.",
    ];

    const correctAnswer = bitTexts[bitPosition];
    const options = [correctAnswer];

    // Unieke foutieve antwoorden toevoegen
    while (options.length < 6) {
      const source = rng() < 0.5 ? bitTexts : wrongBitTexts;
      const choice = source[Math.floor(rng() * source.length)];
      if (!options.includes(choice)) options.push(choice);
    }

    // Shuffle en label
    const shuffledOptions = options
      .map((text) => ({ text, sort: rng() }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.text);

    const labels = ["A", "B", "C", "D", "E", "F"];
    const correctLabel = labels[shuffledOptions.indexOf(correctAnswer)];

    const html = `
<p>In onderstaande code worden de registers <code>x12</code> en <code>x13</code> aangepast.</p>
<pre><code>addi x13, zero, 1
slli x13, x13, ${bitPosition}
or   x12, x12, x13</code></pre>
<p>Neem aan dat in het 1e bit van rechts het LSB bit van die byte is.</p>
<p><strong>Wat is het resultaat van bovenstaand programma?</strong></p>
<p>Kies het juiste antwoord:</p>
<ol type="A">
  ${shuffledOptions.map(option => `<li>${option}</li>`).join('')}
</ol>
<p>Typ de letter van je antwoord:</p>`;

    questions.push({
      label: html,
      answer: correctLabel,
      correctAnswers: [correctLabel]
    });
  }

  return questions;
}
