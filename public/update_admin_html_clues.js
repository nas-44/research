const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.html';
let content = fs.readFileSync(path, 'utf8');

const cluesHtml = `
          <div class="form-group" style="margin-top: 20px;">
            <label class="form-label" for="builder-ai-clues">AI-Generated Media Clues (One per line)</label>
            <textarea id="builder-ai-clues" class="form-input" rows="4"></textarea>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">These options will appear in Q14 when a user selects 'AI-Generated' for Q13.</p>
          </div>
          <div class="form-group" style="margin-top: 20px;">
            <label class="form-label" for="builder-authentic-clues">Authentic Media Clues (One per line)</label>
            <textarea id="builder-authentic-clues" class="form-input" rows="4"></textarea>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">These options will appear in Q14 when a user selects 'Authentic' for Q13.</p>
          </div>
`;

// Insert the new fields right after the builder-survey-consent field
content = content.replace(
    /(<textarea id="builder-survey-consent" class="form-input" rows="3"><\/textarea>[\s\S]*?<\/div>)/,
    match => match + cluesHtml
);

fs.writeFileSync(path, content);
console.log('admin.html updated with Clue Builder fields');
