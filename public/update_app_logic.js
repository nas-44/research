const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/app.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Dropdown Logic
// Around line 600, it renders normal questions.
// Replace:
// if (q.type === 'radio') {
//   // render radio
// } else if (q.type.startsWith('likert')) {
//   // render likert
// }

const dropdownLogic = `
      if (q.type === 'radio') {
        html += \`<div class="options-list">\`;
        q.options.forEach((opt, oIdx) => {
          html += \`
            <label class="option-item \${savedVal === opt ? 'checked-item' : ''}" onclick="toggleOptionClass(this)">
              <input type="radio" name="\${q.id}" value="\${opt}" \${savedVal === opt ? 'checked' : ''} onchange="saveAnswer('\${q.id}', '\${opt.replace(/'/g, "\\'")}')">
              <div class="custom-indicator"></div>
              <span class="option-label">\${opt}</span>
            </label>
          \`;
        });
        html += \`</div>\`;
      } else if (q.type === 'dropdown') {
        html += \`
          <div style="margin-top: 15px;">
            <select name="\${q.id}" class="form-input" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: var(--text-primary); font-size: 1rem; cursor: pointer;" onchange="saveAnswer('\${q.id}', this.value)">
              <option value="" disabled \${!savedVal ? 'selected' : ''}>-- Select an option --</option>
              \${q.options.map(opt => \`<option value="\${opt}" \${savedVal === opt ? 'selected' : ''}>\${opt}</option>\`).join('')}
            </select>
          </div>
        \`;
      } else if (q.type.startsWith('likert')) {
`;

content = content.replace(/if \(q\.type === 'radio'\) \{[\s\S]*?\} else if \(q\.type\.startsWith\('likert'\)\) \{/, dropdownLogic);

// 2. Media Section Q13/Q14 Conditional Logic
// Find the rendering of Q13 and Q14 in app.js
const mediaRegex = /<!-- Q13: Classification -->[\s\S]*?<!-- Q14: Clue -->[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newMediaLogic = `
          <!-- Q13: Classification -->
          <div class="form-group">
            <label class="question-text">
              <span class="question-num"></span> 13. Do you think this media is:
            </label>
            <div class="options-list">
              <label class="option-item \${savedVal === 'Authentic' ? 'checked-item' : ''}" onclick="toggleOptionClass(this)">
                <input type="radio" name="\${item.id}" value="Authentic" \${savedVal === 'Authentic' ? 'checked' : ''} onchange="handleMediaClassificationChange('\${item.id}', 'Authentic')">
                <div class="custom-indicator"></div>
                <span class="option-label">Authentic (A real photograph/video captured by a camera)</span>
              </label>
              <label class="option-item \${savedVal === 'AI-Generated' ? 'checked-item' : ''}" onclick="toggleOptionClass(this)">
                <input type="radio" name="\${item.id}" value="AI-Generated" \${savedVal === 'AI-Generated' ? 'checked' : ''} onchange="handleMediaClassificationChange('\${item.id}', 'AI-Generated')">
                <div class="custom-indicator"></div>
                <span class="option-label">AI-Generated (Created using Artificial Intelligence)</span>
              </label>
            </div>
          </div>
          
          <!-- Q14: Clue (Conditional) -->
          <div class="form-group conditional-clue-group" id="clue-group-\${item.id}" style="\${savedVal ? 'display: block;' : 'display: none;'} margin-top: 25px;">
            <label class="question-text">
              <span class="question-num"></span> 14. Based on your selection, what was the PRIMARY visual clue you relied on?
            </label>
            <div class="options-list" id="clue-options-\${item.id}" style="flex-direction: column; gap: 8px;">
              <!-- Options populated by JS -->
            </div>
          </div>
        </div>
`;

content = content.replace(mediaRegex, newMediaLogic);

// Add the JS logic for handleMediaClassificationChange and initializing the clues
const jsFunctions = `
// Expose surveyConfig clues to global for dynamic rendering
window.getCluesList = function(type) {
  if (!surveyConfig) return [];
  if (type === 'AI-Generated') return surveyConfig.aiClues || [];
  if (type === 'Authentic') return surveyConfig.authenticClues || [];
  return [];
};

window.handleMediaClassificationChange = function(itemId, value) {
  saveAnswer(itemId, value);
  
  // Clear the existing clue answer because the category changed
  saveAnswer(itemId + '_clue', '');
  
  renderClueOptions(itemId, value);
};

window.renderClueOptions = function(itemId, classificationValue) {
  const clueGroup = document.getElementById('clue-group-' + itemId);
  const clueOptionsContainer = document.getElementById('clue-options-' + itemId);
  
  if (!clueGroup || !clueOptionsContainer) return;
  
  const clues = window.getCluesList(classificationValue);
  const savedClue = participantAnswers[itemId + '_clue'] || '';
  
  if (clues.length > 0) {
    clueGroup.style.display = 'block';
    
    clueOptionsContainer.innerHTML = clues.map(cOption => \`
      <label class="option-item \${savedClue === cOption ? 'checked-item' : ''}" style="padding: 10px 16px; justify-content: flex-start;" onclick="toggleOptionClass(this)">
        <input type="radio" name="\${itemId}_clue" value="\${cOption}" \${savedClue === cOption ? 'checked' : ''} onchange="saveAnswer('\${itemId}_clue', '\${cOption.replace(/'/g, "\\\\'")}')">
        <div class="custom-indicator" style="margin-right: 8px;"></div>
        <span class="option-label" style="font-size: 0.9rem;">\${cOption}</span>
      </label>
    \`).join('');
  } else {
    clueGroup.style.display = 'none';
  }
};
`;

if (!content.includes('window.handleMediaClassificationChange')) {
  content += '\n' + jsFunctions;
}

// We also need to inject the initial renderClueOptions call when the survey mounts, 
// so that previously saved answers correctly show their conditional clues.
const mountInjection = `
  // Render Survey UI
  renderSurvey();
  
  // Initialize conditional media clues
  if (surveyConfig.sections) {
    const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
    if (mediaSection && mediaSection.mediaItems) {
      mediaSection.mediaItems.forEach(item => {
        const savedVal = participantAnswers[item.id];
        if (savedVal) {
          window.renderClueOptions(item.id, savedVal);
        }
      });
    }
  }
`;
content = content.replace(/renderSurvey\(\);/, mountInjection);


fs.writeFileSync(path, content);
console.log('app.js updated with dropdown and conditional media logic');
