const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/survey_config.json';
let config = JSON.parse(fs.readFileSync(path, 'utf8'));

config.aiClues = [
    "Anatomy/Logic Errors: Weird fingers, extra limbs, melting objects, or unreadable/gibberish text. (For Images)",
    "Texture/Lighting Errors: Unnatural perfect lighting, \"plastic-like\" skin, or excessive cinematic gloss. (For Images)",
    "Movement Errors: Lip-sync mismatch, robotic blinking, or unnatural body physics. (For Videos)",
    "I didn't see any specific technical mistake; it just felt artificial to me."
];

config.authenticClues = [
    "Natural Imperfections: Realistic skin textures, natural asymmetry, and normal lighting/shadows.",
    "Logical Context: Identifiable real-world location, readable text, and a natural, unblurred background.",
    "I didn't see any specific proof; it just looked completely flawless and real to me."
];

fs.writeFileSync(path, JSON.stringify(config, null, 2));

// Also inject them into app.js's defaultSurveyConfig to prevent sync_config.js from deleting them again
const appJsPath = 'd:/Desktop/RESEARCH/survey/research/public/app.js';
let appContent = fs.readFileSync(appJsPath, 'utf8');

if (!appContent.includes('"aiClues"')) {
    const replacement = \`  "consentText": "Hello,\\nThis survey is conducted as part of an academic research study. The purpose of this study is to understand how people identify AI-generated images and videos on social media platforms.\\n\\nYour responses will remain confidential and used only for research purposes.\\n\\n⏳ Time required: 5–7 minutes",
  "aiClues": [
    "Anatomy/Logic Errors: Weird fingers, extra limbs, melting objects, or unreadable/gibberish text. (For Images)",
    "Texture/Lighting Errors: Unnatural perfect lighting, \\"plastic-like\\" skin, or excessive cinematic gloss. (For Images)",
    "Movement Errors: Lip-sync mismatch, robotic blinking, or unnatural body physics. (For Videos)",
    "I didn't see any specific technical mistake; it just felt artificial to me."
  ],
  "authenticClues": [
    "Natural Imperfections: Realistic skin textures, natural asymmetry, and normal lighting/shadows.",
    "Logical Context: Identifiable real-world location, readable text, and a natural, unblurred background.",
    "I didn't see any specific proof; it just looked completely flawless and real to me."
  ],\`;

    appContent = appContent.replace(/"consentText": ".*",/, replacement);
    fs.writeFileSync(appJsPath, appContent);
}

// And sync to admin.js
const adminJsPath = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let adminContent = fs.readFileSync(adminJsPath, 'utf8');
if (!adminContent.includes('"aiClues"')) {
    adminContent = adminContent.replace(/"consentText": ".*",/, replacement);
    fs.writeFileSync(adminJsPath, adminContent);
}

// And server.js
const serverJsPath = 'd:/Desktop/RESEARCH/survey/research/server.js';
let serverContent = fs.readFileSync(serverJsPath, 'utf8');
if (!serverContent.includes('"aiClues"')) {
    serverContent = serverContent.replace(/"consentText": ".*",/, replacement);
    fs.writeFileSync(serverJsPath, serverContent);
}

console.log('Clues injected into all config instances');
