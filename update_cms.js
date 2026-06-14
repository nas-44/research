const fs = require('fs');

let adminJs = fs.readFileSync('public/admin.js', 'utf8');
let adminHtml = fs.readFileSync('public/admin.html', 'utf8');
const configJson = fs.readFileSync('survey_config.json', 'utf8');

// 1. Replace defaultSurveyConfig in admin.js
adminJs = adminJs.replace(/const defaultSurveyConfig = \{[\s\S]*?\n\};\n/, 'const defaultSurveyConfig = ' + configJson + ';\n');

// 2. Update updateExecutiveMetrics logic in admin.js
adminJs = adminJs.replace(/let totalAdoptionSum = 0;/g, 'let totalVerifSum = 0;');
adminJs = adminJs.replace(/for \(let i = 11; i <= 18; i\+\+\)/g, 'for (let i = 6; i <= 15; i++)');
adminJs = adminJs.replace(/\/\/ Tech Adoption Averages \(Q19-Q24\)/g, '// Verification Behaviour Averages (Q16-Q20)');
adminJs = adminJs.replace(/let adoptSum = 0;/g, 'let verifSum = 0;');
adminJs = adminJs.replace(/let adoptCount = 0;/g, 'let verifCount = 0;');
adminJs = adminJs.replace(/for \(let i = 19; i <= 24; i\+\+\) \{[\s\S]*?adoptCount\+\+;\n      \}\n    \}/g, `for (let i = 16; i <= 20; i++) {\n      if (answers[\`q\${i}\`] !== undefined) {\n        let val = parseInt(answers[\`q\${i}\`]);\n        verifSum += val;\n        verifCount++;\n      }\n    }`);
adminJs = adminJs.replace(/if \(adoptCount > 0\) totalAdoptionSum \+= \(adoptSum \/ adoptCount\);/g, 'if (verifCount > 0) totalVerifSum += (verifSum / verifCount);');
adminJs = adminJs.replace(/const avgAdopt = \(totalAdoptionSum \/ n\)\.toFixed\(2\);/g, 'const avgVerif = (totalVerifSum / n).toFixed(2);');
adminJs = adminJs.replace(/document\.getElementById\('stat-avg-adoption'\)\.textContent = `\$\{avgAdopt\}\/5`;/g, 'document.getElementById(\'stat-avg-verif\').textContent = `${avgVerif}/5`;');
adminJs = adminJs.replace(/Rogers' Innovation profile stands at <strong>\$\{avgAdopt\}<\/strong>/g, 'Verification Behaviour stands at <strong>${avgVerif}</strong>');

// 3. Update admin.html
adminHtml = adminHtml.replace(/id="stat-avg-adoption"/g, 'id="stat-avg-verif"');
adminHtml = adminHtml.replace(/Avg\. Tech Adoption/g, 'Avg. Verif. Behaviour');

// 4. Update runStatisticalAnalysis in admin.js to match new questions
// Replace indices in loop
adminJs = adminJs.replace(/for \(let i = 11; i <= 18; i\+\+\) \{/g, 'for (let i = 6; i <= 15; i++) {');
adminJs = adminJs.replace(/for \(let i = 19; i <= 24; i\+\+\) \{/g, 'for (let i = 16; i <= 20; i++) {');
// Remove reverse coding logic everywhere
adminJs = adminJs.replace(/if \(i === 23 \|\| i === 24\) val = 6 - val; \/\/ Reverse Coded correction\n/g, '');

// Update labels
adminJs = adminJs.replace(/Tech Adoption/g, 'Verification Behaviour');
adminJs = adminJs.replace(/adoption/g, 'verif');
adminJs = adminJs.replace(/Adoption/g, 'Verification');
adminJs = adminJs.replace(/DOI /g, 'Verification ');

adminHtml = adminHtml.replace(/Tech Adoption/g, 'Verification Behaviour');
adminHtml = adminHtml.replace(/adoption/g, 'verif');
adminHtml = adminHtml.replace(/Adoption/g, 'Verification');
adminHtml = adminHtml.replace(/DOI /g, 'Verification ');
adminHtml = adminHtml.replace(/Diffusion of Innovations \(DOI\)/g, 'Verification Behaviour');
adminHtml = adminHtml.replace(/Rogers' Diffusion of Innovations/g, 'Verification Behaviour');
adminHtml = adminHtml.replace(/Section D/g, 'Section C'); // Section C is verification now
adminHtml = adminHtml.replace(/Q11 - Q18/g, 'Q6 - Q15'); // Literacy is Q6-15
adminHtml = adminHtml.replace(/Q19 - Q24/g, 'Q16 - Q20'); // Verification is Q16-Q20

fs.writeFileSync('public/admin.js', adminJs);
fs.writeFileSync('public/admin.html', adminHtml);
console.log('Update completed');
