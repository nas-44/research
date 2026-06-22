const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/app.js';
let content = fs.readFileSync(path, 'utf8');

const regex = /else if \(q\.type === 'checkbox'\) \{/;
const replacement = `else if (q.type === 'dropdown') {
        const savedVal = participantAnswers[q.id] || '';
        html += \`
          <div style="margin-top: 15px;">
            <select name="\${q.id}" class="form-input" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: var(--text-primary); font-size: 1rem; cursor: pointer;" onchange="saveAnswer('\${q.id}', this.value)">
              <option value="" disabled \${!savedVal ? 'selected' : ''}>-- Select an option --</option>
              \${q.options.map(opt => \`<option value="\${opt}" \${savedVal === opt ? 'selected' : ''}>\${opt}</option>\`).join('')}
            </select>
          </div>
        \`;
      }
      else if (q.type === 'checkbox') {`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
console.log('app.js updated with dropdown rendering logic');
