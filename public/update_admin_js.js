const fs = require('fs');
const filePath = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace Literacy Score calculation loop
content = content.replace(
  /\/\/ Literacy Score Averages \(Q11-Q18\)[\s\S]*?\/\/ Tech Adoption Averages \(Q19-Q24\)/,
  `// Literacy Score Averages (Q10-Q12)
    let litSum = 0;
    let litCount = 0;
    for (let i = 10; i <= 12; i++) {
      if (answers[\`q\${i}\`] !== undefined) {
        litSum += parseInt(answers[\`q\${i}\`]);
        litCount++;
      }
    }
    if (litCount > 0) totalLiteracySum += (litSum / litCount);
    
    // Tech Adoption Averages (Q7-Q8)`
);

// Replace Tech Adoption calculation loop
content = content.replace(
  /for \(let i = 16; i <= 20; i\+\+\) \{[\s\S]*?if \(adoptCount > 0\) totalAdoptionSum \+= \(adoptSum \/ adoptCount\);/,
  `for (let i = 7; i <= 8; i++) {
      if (answers[\`q\${i}\`] !== undefined) {
        let val = parseInt(answers[\`q\${i}\`]);
        adoptSum += val;
        adoptCount++;
      }
    }
    if (adoptCount > 0) totalAdoptionSum += (adoptSum / adoptCount);`
);

// Also need to rewrite the Regression Logic which hardcodes predictor arrays
// It currently uses x1 (lit) and x2 (adopt) correctly but the questions extracted might be old
content = content.replace(
  /function updateRegressionModel\(\) \{[\s\S]*?const predictors = \[\];/,
  `function updateRegressionModel() {
  const n = responsesList.length;
  if (n < 5) return;
  
  let yData = []; // AI Detection Acc
  let x1Data = []; // Literacy
  let x2Data = []; // Tech Adoption
  
  const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
  const mediaItems = mediaSection ? mediaSection.mediaItems : [];
  
  responsesList.forEach(resp => {
    let litSum = 0; let litC = 0;
    for (let i = 10; i <= 12; i++) { if(resp.answers[\`q\${i}\`]){ litSum += parseInt(resp.answers[\`q\${i}\`]); litC++; } }
    let adoptSum = 0; let adoptC = 0;
    for (let i = 7; i <= 8; i++) { if(resp.answers[\`q\${i}\`]){ adoptSum += parseInt(resp.answers[\`q\${i}\`]); adoptC++; } }
    
    let acc = 0; let attempt = 0;
    mediaItems.forEach(item => {
      if(resp.answers[item.id]) {
        attempt++;
        if(resp.answers[item.id] === item.trueType) acc++;
      }
    });
    
    if (litC > 0 && adoptC > 0 && attempt > 0) {
      x1Data.push(litSum); // Use sum for regression
      x2Data.push(adoptSum);
      yData.push(acc); // Total correct
    }
  });

  const predictors = [];`
);

fs.writeFileSync(filePath, content);
console.log('Updated admin.js scoring logic successfully.');
