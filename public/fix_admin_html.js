const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\(Section C: Q11 - Q18\)/g, "(Q10 - Q12)");
content = content.replace(/\(Section C: Q16 - Q20\)/g, "(Q7 - Q8)");
content = content.replace(/1\. What is your age\?/g, "Demographic Group");
content = content.replace(/H0 \(Null Hypothesis\): 1\. What is your age/g, "H0 (Null Hypothesis): The selected demographic group");
content = content.replace(/1\. What is your age/g, "Demographic Group");

fs.writeFileSync(path, content);
console.log('Fixed text in admin.html');
