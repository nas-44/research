const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(path, 'utf8');

// Replace all instances of `=== item.trueType` with `=== (item.trueType === "real" ? "Authentic" : "AI-Generated")`

content = content.replace(/=== item\.trueType/g, '=== (item.trueType === "real" ? "Authentic" : "AI-Generated")');

// Also check if there's any `answers[item.id] === item.trueType`
content = content.replace(/choice === item\.trueType/g, 'choice === (item.trueType === "real" ? "Authentic" : "AI-Generated")');

fs.writeFileSync(path, content);
console.log('Fixed item.trueType comparisons in admin.js');
