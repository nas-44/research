const fs = require('fs');

const adminJsPath = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(adminJsPath, 'utf8');

// Update renderFormBuilder
const populateRegex = /if \(document\.getElementById\('builder-ai-clues'\)\) \{[\s\S]*?\}\s*\n\s*if \(document\.getElementById\('builder-authentic-clues'\)\) \{[\s\S]*?\}/;
const populateReplacement = `if (document.getElementById('builder-ai-image-clues')) {
      document.getElementById('builder-ai-image-clues').value = (surveyConfig.aiImageClues || []).join('\\n');
    }
    if (document.getElementById('builder-ai-video-clues')) {
      document.getElementById('builder-ai-video-clues').value = (surveyConfig.aiVideoClues || []).join('\\n');
    }
    if (document.getElementById('builder-authentic-image-clues')) {
      document.getElementById('builder-authentic-image-clues').value = (surveyConfig.authenticImageClues || []).join('\\n');
    }
    if (document.getElementById('builder-authentic-video-clues')) {
      document.getElementById('builder-authentic-video-clues').value = (surveyConfig.authenticVideoClues || []).join('\\n');
    }`;

// Update scrapeBuilderInputs
const scrapeRegex = /if \(document\.getElementById\('builder-ai-clues'\)\) \{[\s\S]*?\}\s*\n\s*if \(document\.getElementById\('builder-authentic-clues'\)\) \{[\s\S]*?\}/;
const scrapeReplacement = `if (document.getElementById('builder-ai-image-clues')) {
      surveyConfig.aiImageClues = document.getElementById('builder-ai-image-clues').value.split('\\n').map(s => s.trim()).filter(Boolean);
    }
    if (document.getElementById('builder-ai-video-clues')) {
      surveyConfig.aiVideoClues = document.getElementById('builder-ai-video-clues').value.split('\\n').map(s => s.trim()).filter(Boolean);
    }
    if (document.getElementById('builder-authentic-image-clues')) {
      surveyConfig.authenticImageClues = document.getElementById('builder-authentic-image-clues').value.split('\\n').map(s => s.trim()).filter(Boolean);
    }
    if (document.getElementById('builder-authentic-video-clues')) {
      surveyConfig.authenticVideoClues = document.getElementById('builder-authentic-video-clues').value.split('\\n').map(s => s.trim()).filter(Boolean);
    }`;

content = content.replace(populateRegex, populateReplacement);
content = content.replace(scrapeRegex, scrapeReplacement);

fs.writeFileSync(adminJsPath, content);
console.log('Updated admin.js clues logic');
