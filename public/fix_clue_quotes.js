const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/app.js';
let content = fs.readFileSync(path, 'utf8');

const regex = /clueOptionsContainer\.innerHTML = clues\.map\(cOption => `[\s\S]*?`\)\.join\(''\);/;
const replacement = `clueOptionsContainer.innerHTML = clues.map(cOption => {
      const safeVal = cOption.replace(/"/g, '&quot;');
      const safeJsArgs = cOption.replace(/'/g, "\\\\'").replace(/"/g, '&quot;');
      return \`
      <label class="option-item \${savedClue === cOption ? 'checked-item' : ''}" style="padding: 10px 16px; justify-content: flex-start;" onclick="toggleOptionClass(this)">
        <input type="radio" name="\${itemId}_clue" value="\${safeVal}" \${savedClue === cOption ? 'checked' : ''} onchange="saveAnswer('\${itemId}_clue', '\${safeJsArgs}')">
        <div class="custom-indicator" style="margin-right: 8px;"></div>
        <span class="option-label" style="font-size: 0.9rem;">\${cOption}</span>
      </label>
      \`;
    }).join('');`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
console.log('app.js updated with safe HTML encoding for clues');
