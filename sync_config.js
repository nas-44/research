const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Desktop/RESEARCH/survey/research';
const appJsPath = path.join(baseDir, 'public/app.js');
const adminJsPath = path.join(baseDir, 'public/admin.js');
const serverJsPath = path.join(baseDir, 'server.js');
const configJsonPath = path.join(baseDir, 'survey_config.json');

const appCode = fs.readFileSync(appJsPath, 'utf8');

const match = appCode.match(/const defaultSurveyConfig = (\{[\s\S]*?\n  \]\n\});/);
if (match) {
  const configText = match[1];
  fs.writeFileSync(configJsonPath, configText);
  console.log('Saved to survey_config.json');
  
  let adminCode = fs.readFileSync(adminJsPath, 'utf8');
  adminCode = adminCode.replace(/const defaultSurveyConfig = \{[\s\S]*?\n  \]\n\};/, 'const defaultSurveyConfig = ' + configText + ';');
  
  const oldApiBase = "const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';";
  const newApiBase = "const API_BASE = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '';";
  
  adminCode = adminCode.replace(oldApiBase, newApiBase);
  fs.writeFileSync(adminJsPath, adminCode);
  console.log('Updated admin.js');
  
  let serverCode = fs.readFileSync(serverJsPath, 'utf8');
  serverCode = serverCode.replace(/const defaultSurveyConfig = \{[\s\S]*?\n  \]\n\};/, 'const defaultSurveyConfig = ' + configText + ';');
  fs.writeFileSync(serverJsPath, serverCode);
  console.log('Updated server.js');
  
  let appCodeUpdated = appCode.replace(oldApiBase, newApiBase);
  fs.writeFileSync(appJsPath, appCodeUpdated);
  console.log('Updated app.js');
} else {
  console.log('Config not found in app.js');
}
