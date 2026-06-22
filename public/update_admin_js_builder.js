const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Populate Clue Textareas on Load
const populateRegex = /document\.getElementById\('builder-survey-title'\)\.value = surveyConfig\.title;[\s\S]*?document\.getElementById\('builder-survey-consent'\)\.value = surveyConfig\.consentText;/;
const newPopulate = `document.getElementById('builder-survey-title').value = surveyConfig.title;
    document.getElementById('builder-survey-description').value = surveyConfig.description;
    document.getElementById('builder-survey-consent').value = surveyConfig.consentText;
    
    // Populate Clues
    if (document.getElementById('builder-ai-clues')) {
      document.getElementById('builder-ai-clues').value = (surveyConfig.aiClues || []).join('\\n');
    }
    if (document.getElementById('builder-authentic-clues')) {
      document.getElementById('builder-authentic-clues').value = (surveyConfig.authenticClues || []).join('\\n');
    }`;
content = content.replace(populateRegex, newPopulate);

// 2. Save Clue Textareas on Save
const saveRegex = /surveyConfig\.title = document\.getElementById\('builder-survey-title'\)\.value;[\s\S]*?surveyConfig\.consentText = document\.getElementById\('builder-survey-consent'\)\.value;/;
const newSave = `surveyConfig.title = document.getElementById('builder-survey-title').value;
  surveyConfig.description = document.getElementById('builder-survey-description').value;
  surveyConfig.consentText = document.getElementById('builder-survey-consent').value;
  
  // Save Clues
  if (document.getElementById('builder-ai-clues')) {
    surveyConfig.aiClues = document.getElementById('builder-ai-clues').value.split('\\n').map(s => s.trim()).filter(Boolean);
  }
  if (document.getElementById('builder-authentic-clues')) {
    surveyConfig.authenticClues = document.getElementById('builder-authentic-clues').value.split('\\n').map(s => s.trim()).filter(Boolean);
  }`;
content = content.replace(saveRegex, newSave);

// 3. Update Chart Logic to use the global arrays instead of hardcoded clues
const chartLogicRegex = /const possibleClues = \[[\s\S]*?\];/;
const newChartLogic = `const possibleClues = window.getCluesList ? window.getCluesList(item.trueType === "real" ? "Authentic" : "AI-Generated") : (surveyConfig.aiClues || []).concat(surveyConfig.authenticClues || []);`;
// Replace all instances of the hardcoded clues in the charting logic
content = content.replace(chartLogicRegex, newChartLogic);
content = content.replace(chartLogicRegex, newChartLogic); // Do it a few times just in case

// Write back
fs.writeFileSync(path, content);
console.log('admin.js updated with form builder clue logic');
