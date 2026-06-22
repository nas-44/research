const fs = require('fs');
const filePath = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace updateCrosstabulation to handle q14_clues
const crossTabRegex = /function updateCrosstabulation\(\) \{[\s\S]*?const df = \(r - 1\) \* \(c - 1\);/m;

const replacement = `function updateCrosstabulation() {
  const tbody = document.getElementById('crosstab-table-body');
  const resCard = document.getElementById('chisquare-results-card');
  const selectEl = document.getElementById('crosstab-select-var');
  if (!tbody || !resCard || !selectEl) return;
  
  if (responsesList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No data for crosstabulations</td></tr>';
    resCard.innerHTML = '';
    return;
  }
  
  const indVar = selectEl.value;
  const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
  const mediaItems = mediaSection ? mediaSection.mediaItems : [];
  
  const crossData = {}; 
  
  responsesList.forEach(resp => {
    if (indVar === 'q14_clues') {
      // For each media item, get the clue and the outcome
      mediaItems.forEach(item => {
        const ivVal = resp.answers[\`\${item.id}_clue\`] || "Unknown Clue";
        const isCorrect = resp.answers[item.id] === item.trueType;
        const outcome = isCorrect ? "Accurate Detection" : "Failed Detection";
        
        if (!crossData[ivVal]) crossData[ivVal] = { "Accurate Detection": 0, "Failed Detection": 0 };
        crossData[ivVal][outcome]++;
      });
    } else {
      let ivVal = resp.answers[indVar] || "Unknown";
      let correctCount = 0;
      mediaItems.forEach(item => {
        if (resp.answers[item.id] === item.trueType) correctCount++;
      });
      let outcome = "Failed Detection";
      // Threshold: if > 50% accurate, count as accurate overall
      if (mediaItems.length > 0 && (correctCount / mediaItems.length) > 0.5) {
        outcome = "Accurate Detection";
      }
      
      if (!crossData[ivVal]) crossData[ivVal] = { "Accurate Detection": 0, "Failed Detection": 0 };
      crossData[ivVal][outcome]++;
    }
  });
  
  let html = '<thead><tr><th style="text-align: left;">Category / Subgroup</th><th>Accurate Detection</th><th>Failed Detection</th><th>Subtotal (Margin)</th></tr></thead><tbody>';
  
  let grandTotal = 0;
  let totalAccurate = 0;
  let totalFailed = 0;
  
  const categories = Object.keys(crossData);
  categories.forEach(cat => {
    const acc = crossData[cat]["Accurate Detection"];
    const fail = crossData[cat]["Failed Detection"];
    const sub = acc + fail;
    
    totalAccurate += acc;
    totalFailed += fail;
    grandTotal += sub;
    
    html += \`<tr>
      <td style="font-weight: 600;">\${cat}</td>
      <td>\${acc}</td>
      <td>\${fail}</td>
      <td style="font-weight: 700;">\${sub}</td>
    </tr>\`;
  });
  
  html += \`<tr style="border-top: 2px solid var(--border-color); font-weight: 700; color: var(--primary);">
    <td>Marginal Totals</td>
    <td>\${totalAccurate}</td>
    <td>\${totalFailed}</td>
    <td>N = \${grandTotal}</td>
  </tr></tbody>\`;
  
  tbody.innerHTML = html;
  
  // Calculate Chi-Square
  let chiSquare = 0;
  categories.forEach(cat => {
    const rowSub = crossData[cat]["Accurate Detection"] + crossData[cat]["Failed Detection"];
    
    const expAcc = (rowSub * totalAccurate) / grandTotal;
    const expFail = (rowSub * totalFailed) / grandTotal;
    
    const obsAcc = crossData[cat]["Accurate Detection"];
    const obsFail = crossData[cat]["Failed Detection"];
    
    if (expAcc > 0) chiSquare += Math.pow(obsAcc - expAcc, 2) / expAcc;
    if (expFail > 0) chiSquare += Math.pow(obsFail - expFail, 2) / expFail;
  });
  
  const r = categories.length;
  const c = 2; // Accurate vs Failed
  const df = (r - 1) * (c - 1);`;

content = content.replace(crossTabRegex, replacement);
fs.writeFileSync(filePath, content);
console.log("updateCrosstabulation updated");
