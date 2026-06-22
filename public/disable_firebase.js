const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Desktop/RESEARCH/survey/research/public';
const appJsPath = path.join(baseDir, 'app.js');
const adminJsPath = path.join(baseDir, 'admin.js');

let appContent = fs.readFileSync(appJsPath, 'utf8');
appContent = appContent.replace(/const FIREBASE_DB_URL = 'https:\/\/research-344f8-default-rtdb\.asia-southeast1\.firebasedatabase\.app';/g, "const FIREBASE_DB_URL = '';");
fs.writeFileSync(appJsPath, appContent);

let adminContent = fs.readFileSync(adminJsPath, 'utf8');
adminContent = adminContent.replace(/const FIREBASE_DB_URL = 'https:\/\/research-344f8-default-rtdb\.asia-southeast1\.firebasedatabase\.app';/g, "const FIREBASE_DB_URL = '';");
// Also disable USE_CLOUD_STORAGE if present
adminContent = adminContent.replace(/const USE_CLOUD_STORAGE = true;/g, "const USE_CLOUD_STORAGE = false;");
fs.writeFileSync(adminJsPath, adminContent);

console.log('Disabled Firebase Cloud integration on the frontend.');
