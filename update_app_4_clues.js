const fs = require('fs');

const appJsPath = 'd:/Desktop/RESEARCH/survey/research/public/app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

const oldGetClues = /window\.getCluesList = function\(type\) \{[\s\S]*?return \[\];\s*\};\s*/;
const newGetClues = `window.getCluesList = function(classification, itemType) {
    if (!surveyConfig) return [];
    if (classification === 'AI-Generated') {
      return itemType === 'video' ? (surveyConfig.aiVideoClues || []) : (surveyConfig.aiImageClues || []);
    }
    if (classification === 'Authentic') {
      return itemType === 'video' ? (surveyConfig.authenticVideoClues || []) : (surveyConfig.authenticImageClues || []);
    }
    return [];
  };

`;

content = content.replace(oldGetClues, newGetClues);

const oldHandleChange = /const clues = window\.getCluesList\(classificationValue\);/g;
const newHandleChange = `// Find the item to get its type
    let itemType = 'image';
    if (surveyConfig && surveyConfig.sections) {
      const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
      if (mediaSection && mediaSection.mediaItems) {
        const item = mediaSection.mediaItems.find(m => m.id === itemId);
        if (item && item.type) {
          itemType = item.type;
        }
      }
    }
    const clues = window.getCluesList(classificationValue, itemType);`;

content = content.replace(oldHandleChange, newHandleChange);

fs.writeFileSync(appJsPath, content);
console.log('Updated app.js clues logic');
