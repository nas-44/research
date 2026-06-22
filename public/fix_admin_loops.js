const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Cronbach's Alpha arguments
// calculateCronbachAlpha('literacy', 11, 18);
content = content.replace(/calculateCronbachAlpha\('literacy',\s*\d+,\s*\d+\);/g, "calculateCronbachAlpha('literacy', 10, 12);");
content = content.replace(/calculateCronbachAlpha\('adoption',\s*\d+,\s*\d+\);/g, "calculateCronbachAlpha('adoption', 7, 8);");

// 2. Multiple Regression Loops
content = content.replace(/for \(let q = 6; q <= 15; q\+\+\)/g, "for (let q = 10; q <= 12; q++)");
content = content.replace(/for \(let q = 16; q <= 20; q\+\+\)/g, "for (let q = 7; q <= 8; q++)");

// 3. DOI Bell Curve
content = content.replace(/let aCount = 0, aRow = 0;\s*for \(let q = 16; q <= 20; q\+\+\)/g, "let aCount = 0, aRow = 0;\n    for (let q = 7; q <= 8; q++)");
content = content.replace(/if \(scaleName === 'adoption' && \(q === 23 \|\| q === 24\)\)/g, "if (scaleName === 'adoption' && (q === 0))"); // No reverse coding in the new questions, wait, are there any?

// 4. Pearson Scatter Chart
content = content.replace(/let lCount = 0, lRow = 0;\s*for \(let q = 6; q <= 15; q\+\+\)/g, "let lCount = 0, lRow = 0;\n    for (let q = 10; q <= 12; q++)");

fs.writeFileSync(path, content);
console.log('Fixed loops in admin.js');
