const fs = require('fs');
const filePath = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `window.updateCrosstabulation = function() {
  const n = responsesList.length;
  if (n === 0) return;
  
  const selectedDemographic = document.getElementById('crosstab-select-var').value;
  const tbody = document.getElementById('crosstab-table-body');
  
  const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
  const mediaItems = mediaSection ? mediaSection.mediaItems : [];
  
  let options = [];
  let configField = null;
  
  // Custom mapping for Primary Visual Clues
  if (selectedDemographic === 'q14_clues') {
    options = [
      "Physical mistakes (e.g., weird fingers, extra limbs, bad teeth)",
      "Background mistakes or unreadable/gibberish text",
      "Unnatural perfect lighting, 'plastic-like' skin, or excessive gloss",
      "It looked completely natural, flawless, and real to me.",
      "I didn't see any specific clue; I just guessed."
    ];
  } else {
    configField = surveyConfig.sections[0].questions.find(q => q.id === selectedDemographic);
    options = configField ? configField.options : [];
  }
  
  const accuracyBuckets = ["Low (<50%)", "Moderate (50-75%)", "High (>75%)"];
  const matrix = {};
  
  options.forEach(opt => {
    matrix[opt] = { "Low (<50%)": 0, "Moderate (50-75%)": 0, "High (>75%)": 0, "total": 0 };
  });
  
  if (selectedDemographic === 'q14_clues') {
    // Tally based on individual media items rather than total response score
    responsesList.forEach(resp => {
      mediaItems.forEach(item => {
        const clue = resp.answers[\`\${item.id}_clue\`];
        if (clue && matrix[clue]) {
          const isCorrect = resp.answers[item.id] === item.trueType;
          let bucket = isCorrect ? "High (>75%)" : "Low (<50%)"; // Binary representation mapping to existing buckets
          
          matrix[clue][bucket]++;
          matrix[clue]["total"]++;
        }
      });
    });
  } else {
    responsesList.forEach(resp => {
      const demVal = resp.answers[selectedDemographic];
      if (!matrix[demVal]) return;
      
      let correctCount = 0;
      mediaItems.forEach(item => {
        if (resp.answers[item.id] === item.trueType) correctCount++;
      });
      
      const pct = mediaItems.length > 0 ? (correctCount / mediaItems.length) * 100 : 0;
      
      let bucket;
      if (pct < 50) bucket = "Low (<50%)";
      else if (pct <= 75) bucket = "Moderate (50-75%)";
      else bucket = "High (>75%)";
      
      matrix[demVal][bucket]++;
      matrix[demVal]["total"]++;
    });
  }
  
  let html = \`
    <thead>
      <tr>
        <th>\${selectedDemographic === 'q14_clues' ? 'Visual Clues Relied Upon' : configField.text}</th>
        \${accuracyBuckets.map(b => \`<th>\${b} Accuracy</th>\`).join('')}
        <th>Total Row (r)</th>
      </tr>
    </thead>
    <tbody>
  \`;
  
  const colTotals = { "Low (<50%)": 0, "Moderate (50-75%)": 0, "High (>75%)": 0 };
  let grandTotal = 0;
  
  options.forEach(opt => {
    const row = matrix[opt];
    colTotals["Low (<50%)"] += row["Low (<50%)"];
    colTotals["Moderate (50-75%)"] += row["Moderate (50-75%)"];
    colTotals["High (>75%)"] += row["High (>75%)"];
    grandTotal += row["total"];
    
    html += \`
      <tr>
        <td style="font-weight:600;">\${opt}</td>
        <td class="\${row["Low (<50%)"] > row["High (>75%)"] ? 'crosstab-cell-high' : 'crosstab-cell-mid'}">\${row["Low (<50%)"]}</td>
        <td class="crosstab-cell-mid">\${row["Moderate (50-75%)"]}</td>
        <td class="\${row["High (>75%)"] > row["Low (<50%)"] ? 'crosstab-cell-high' : 'crosstab-cell-mid'}">\${row["High (>75%)"]}</td>
        <td style="font-weight:600; background: rgba(255,255,255,0.02);">\${row["total"]}</td>
      </tr>
    \`;
  });
  
  html += \`
      <tr>
        <td style="font-weight:700;">Total Column (c)</td>
        <td>\${colTotals["Low (<50%)"]}</td>
        <td>\${colTotals["Moderate (50-75%)"]}</td>
        <td>\${colTotals["High (>75%)"]}</td>
        <td style="font-weight:700; background: rgba(99,102,241,0.1);">\${grandTotal}</td>
      </tr>
    </tbody>
  \`;
  
  tbody.innerHTML = html;
  
  let chiSquare = 0;
  
  options.forEach(opt => {
    const row = matrix[opt];
    accuracyBuckets.forEach(b => {
      const observed = row[b];
      const expected = (row["total"] * colTotals[b]) / grandTotal;
      if (expected > 0) {
        chiSquare += Math.pow(observed - expected, 2) / expected;
      }
    });
  });
  
  const df = (options.length - 1) * (accuracyBuckets.length - 1);`;

content = content.replace(/window\.updateCrosstabulation = function\(\) \{[\s\S]*?const df = \(options\.length - 1\) \* \(accuracyBuckets\.length - 1\);/, replacement);

fs.writeFileSync(filePath, content);
console.log("Crosstab replaced.");
