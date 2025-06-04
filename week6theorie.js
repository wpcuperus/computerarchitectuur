function generateWeek6TheoryQuestions() {
  const questions = [];

  // Cache parameters
  const cacheSize = 16; // aantal entries
  const indexBits = 4;  // log2(16)
  const addressBits = 8; // gegeven in de vraag
  const tagBits = addressBits - indexBits;
  const blockSize = 1;

  // Willekeurig geheugenadres tussen 3 en 191
  const address = Math.floor(rng() * (191 - 3 + 1)) + 3;
  const binaryAddress = address.toString(2).padStart(addressBits, '0');
  const indexBinary = binaryAddress.slice(-indexBits);
  const tagBinary = binaryAddress.slice(0, tagBits);
  const indexDecimal = parseInt(indexBinary, 2);
  const dataValue = Math.floor(rng() * 256); // 1 byte data

  // Cache is leeg bij start, dus altijd miss
  const hitMiss = 'miss';
  const dataNaarCache = `${address}`;

  // De student moet dit invullen:
  const correctAnswerLine = [
    binaryAddress,
    tagBinary,
    indexBinary,
    indexDecimal.toString(),
    hitMiss,
    dataNaarCache
  ].join(', ');

  const questionText = `
<p>Cache geheugen is een belangrijk middel om de performance van een computersysteem te verhogen.
Gegeven is dat de <strong>cache size</strong> (aantal entries) 16 is en dat de <strong>blokgrootte</strong> (aantal bytes data per entry) 1 is.
Onderstaande tabel geeft een deel van het (RAM) geheugen weer:</p>

<table border="1" style="border-collapse: collapse;">
<tr><th>Geheugenadres (hex)</th><th>Geheugenadres (dec)</th><th>Data (decimaal)</th></tr>
<tr><td>0x${address.toString(16).padStart(2, '0').toUpperCase()}</td><td>${address}</td><td>${dataValue}</td></tr>
</table>

<p>De volgende <strong>reference string</strong>, d.w.z. een lijst van (decimale) geheugen adressen die
achtereenvolgens worden benaderd door de CPU, is gegeven: <strong>${address}</strong></p>

<p>Verder is gegeven dat de cache van het type ‘direct mapped’ is, de cache bij aanvang <u>leeg</u> is
en dat een geheugenadres uit <strong>8 bits</strong> bestaat.</p>

<p><strong>Maak de volgende tabel af.</strong> Geef voor elk van de adressen uit de reference string:
het binaire adres, de tag, de cache index, en of het een “hit” of “miss” tot gevolg heeft.</p>

<table border="1" style="border-collapse: collapse;">
<tr>
  <th>memory address decimal</th>
  <th>binary address</th>
  <th>tag</th>
  <th>index</th>
  <th>index (dec)</th>
  <th>hit/miss</th>
  <th>data naar cache</th>
</tr>
<tr>
  <td>${address}</td>
  <td>...</td>
  <td>...</td>
  <td>...</td>
  <td>...</td>
  <td>...</td>
  <td>...</td>
</tr>
</table>
  `;

  questions.push({
    title: 'Cache: binaire analyse van geheugenadres',
    label: questionText,
    answer: correctAnswerLine,
    categories: ['Cache', 'Binaire representatie'],
    correctAnswers: [correctAnswerLine],
    hint: `Zet het adres om naar een 8-bit binaire representatie. Gebruik de laatste 4 bits als index. De rest is tag. Omdat de cache leeg is, is het altijd een miss.`
  });

  return questions;
}
