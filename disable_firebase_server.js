const fs = require('fs');
const path = require('path');

const serverJsPath = 'd:/Desktop/RESEARCH/survey/research/server.js';
let content = fs.readFileSync(serverJsPath, 'utf8');

// Disable Firebase by hardcoding FIREBASE_DB_URL to empty string
content = content.replace(/const FIREBASE_DB_URL = process\.env\.FIREBASE_DB_URL \|\| 'https:\/\/research-344f8-default-rtdb\.asia-southeast1\.firebasedatabase\.app';/, "const FIREBASE_DB_URL = '';");

fs.writeFileSync(serverJsPath, content);
console.log('Firebase disabled in server.js');
