const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.html';
let content = fs.readFileSync(path, 'utf8');

const cluesHtml = `
          <div class="form-group" style="margin-top: 20px;">
            <label class="form-label" for="builder-ai-clues">AI-Generated Media Clues (One per line)</label>
            <textarea id="builder-ai-clues" class="text-input" rows="4"></textarea>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">These options will appear in Q14 when a user selects 'AI-Generated' for Q13.</p>
          </div>
          <div class="form-group" style="margin-top: 20px;">
            <label class="form-label" for="builder-authentic-clues">Authentic Media Clues (One per line)</label>
            <textarea id="builder-authentic-clues" class="text-input" rows="4"></textarea>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">These options will appear in Q14 when a user selects 'Authentic' for Q13.</p>
          </div>
`;

// Find where <button class="btn btn-primary" id="btn-save-builder-meta"> is
// We want to insert the cluesHtml BEFORE the save button div
content = content.replace(
    /<div style="margin-top: 20px;">\s*<button class="btn btn-primary" id="btn-save-builder-meta">/,
    match => cluesHtml + "\n" + match
);

fs.writeFileSync(path, content);
console.log('admin.html updated successfully with Clue Builder fields');
