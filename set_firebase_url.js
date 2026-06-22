const fs = require('fs');

const serverJsPath = 'd:/Desktop/RESEARCH/survey/research/server.js';
let content = fs.readFileSync(serverJsPath, 'utf8');

const oldUrlLine = "const FIREBASE_DB_URL = '';";
const newUrlLine = "const FIREBASE_DB_URL = 'https://research-344f8-default-rtdb.asia-southeast1.firebasedatabase.app';";

content = content.replace(oldUrlLine, newUrlLine);

fs.writeFileSync(serverJsPath, content);
console.log('Successfully embedded Firebase URL in server.js');
