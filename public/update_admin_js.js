const fs = require('fs');

let code = fs.readFileSync('d:/Desktop/RESEARCH/survey/research/public/admin.js', 'utf8');

// Replace Q11-Q18 to Q6-Q15
code = code.replace(/for \((let|var) ([a-zA-Z]+) = 11; \2 <= 18; \2\+\+\)/g, 'for ($1 $2 = 6; $2 <= 15; $2++)');
code = code.replace(/const literacyQ = \[11,12,13,14,15,16,17,18\];/g, 'const literacyQ = [6,7,8,9,10,11,12,13,14,15];');

// Replace Q19-Q24 to Q16-Q20
code = code.replace(/for \((let|var) ([a-zA-Z]+) = 19; \2 <= 24; \2\+\+\)/g, 'for ($1 $2 = 16; $2 <= 20; $2++)');
code = code.replace(/const adoptionQ = \[19,20,21,22,23,24\];/g, 'const adoptionQ = [16,17,18,19,20];');

// Remove single-line reverse-coded corrections
code = code.replace(/if \([a-zA-Z]+ === 23 \|\| [a-zA-Z]+ === 24\) [a-zA-Z]+ = 6 - [a-zA-Z]+;.*?\n/g, '');
code = code.replace(/if\([a-zA-Z]+ === 23 \|\| [a-zA-Z]+ === 24\) [a-zA-Z]+ = 6 - [a-zA-Z]+;.*?\n/g, '');

// Clean up alpha calculation reverse coding
code = code.replace(/if \(scaleName === 'adoption' && \([a-zA-Z]+ === 23 \|\| [a-zA-Z]+ === 24\)\) \{\n\s*val = 6 - val;\n\s*\}/g, '');

// Clean up mock generator reverse coding
code = code.replace(/if \(q === 23 \|\| q === 24\) \{\n\s*score = Math\.round\(\(6 - techBias\) \+ \(Math\.random\(\) \* 2 - 1\)\);\n\s*\} else \{\n\s*score = Math\.round\(techBias \+ \(Math\.random\(\) \* 2 - 1\)\);\n\s*\}/g, 'score = Math.round(techBias + (Math.random() * 2 - 1));');

// Fix headers
code = code.replace(/for \((let|var) ([a-zA-Z]+) = 6; \2 <= 15; \2\+\+\) headers\.push\(`C\$\{\2\}_Literacy`\);/g, 'for ($1 $2 = 6; $2 <= 15; $2++) headers.push(`B${$2}_Literacy`);');
code = code.replace(/for \((let|var) ([a-zA-Z]+) = 16; \2 <= 20; \2\+\+\) headers\.push\(`D\$\{\2\}_TechAdopt`\);/g, 'for ($1 $2 = 16; $2 <= 20; $2++) headers.push(`C${$2}_Verification`);');

// Fix ages array
code = code.replace(/const ages = \["18–21", "22–25", "26–30", "31–40", "41\+"\];/g, 'const ages = ["18–24", "25–34", "35–44", "45–54", "55+"];');

// Fix platform array
code = code.replace(/const platforms = \["Instagram", "Facebook", "Twitter", "TikTok", "LinkedIn"\];/gi, 'const platforms = ["Instagram", "Facebook", "Both equally"];'); // Just in case it was old

fs.writeFileSync('d:/Desktop/RESEARCH/survey/research/public/admin.js', code);
console.log('admin.js updated successfully!');
