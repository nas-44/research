const fs = require('fs');

const replacement = '  "consentText": "Hello,\\nThis survey is conducted as part of an academic research study. The purpose of this study is to understand how people identify AI-generated images and videos on social media platforms.\\n\\nYour responses will remain confidential and used only for research purposes.\\n\\n⏳ Time required: 5–7 minutes",\n' +
'  "aiClues": [\n' +
'    "Anatomy/Logic Errors: Weird fingers, extra limbs, melting objects, or unreadable/gibberish text. (For Images)",\n' +
'    "Texture/Lighting Errors: Unnatural perfect lighting, \\"plastic-like\\" skin, or excessive cinematic gloss. (For Images)",\n' +
'    "Movement Errors: Lip-sync mismatch, robotic blinking, or unnatural body physics. (For Videos)",\n' +
'    "I didn\'t see any specific technical mistake; it just felt artificial to me."\n' +
'  ],\n' +
'  "authenticClues": [\n' +
'    "Natural Imperfections: Realistic skin textures, natural asymmetry, and normal lighting/shadows.",\n' +
'    "Logical Context: Identifiable real-world location, readable text, and a natural, unblurred background.",\n' +
'    "I didn\'t see any specific proof; it just looked completely flawless and real to me."\n' +
'  ],';

const appJsPath = 'd:/Desktop/RESEARCH/survey/research/public/app.js';
let appContent = fs.readFileSync(appJsPath, 'utf8');
if (!appContent.includes('"aiClues"')) {
    appContent = appContent.replace(/"consentText": ".*",/, replacement);
    fs.writeFileSync(appJsPath, appContent);
}

const adminJsPath = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let adminContent = fs.readFileSync(adminJsPath, 'utf8');
if (!adminContent.includes('"aiClues"')) {
    adminContent = adminContent.replace(/"consentText": ".*",/, replacement);
    fs.writeFileSync(adminJsPath, adminContent);
}

const serverJsPath = 'd:/Desktop/RESEARCH/survey/research/server.js';
let serverContent = fs.readFileSync(serverJsPath, 'utf8');
if (!serverContent.includes('"aiClues"')) {
    serverContent = serverContent.replace(/"consentText": ".*",/, replacement);
    fs.writeFileSync(serverJsPath, serverContent);
}

const configJsPath = 'd:/Desktop/RESEARCH/survey/research/survey_config.json';
let configContent = fs.readFileSync(configJsPath, 'utf8');
if (!configContent.includes('"aiClues"')) {
    configContent = configContent.replace(/"consentText": ".*",/, replacement);
    fs.writeFileSync(configJsPath, configContent);
}

console.log('Clues injected into all config instances successfully.');
