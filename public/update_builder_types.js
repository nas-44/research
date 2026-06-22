const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(path, 'utf8');

const regex = /<option value="likert5" \$\{q\.type === 'likert5' \? 'selected' : ''\}>Likert 5-Scale<\/option>/;
const replacement = `<option value="likert5" \${q.type === 'likert5' ? 'selected' : ''}>Likert 5-Scale (Agreement)</option>
                <option value="likert5Freq" \${q.type === 'likert5Freq' ? 'selected' : ''}>Likert 5-Scale (Frequency)</option>
                <option value="dropdown" \${q.type === 'dropdown' ? 'selected' : ''}>Dropdown Menu</option>`;

content = content.replace(regex, replacement);

const regex2 = /const isSelectType = q\.type === 'radio' \|\| q\.type === 'checkbox';/;
const replacement2 = `const isSelectType = q.type === 'radio' || q.type === 'checkbox' || q.type === 'dropdown';`;
content = content.replace(regex2, replacement2);

const regex3 = /if \(selectEl\.value === 'radio' \|\| selectEl\.value === 'checkbox'\) \{/;
const replacement3 = `if (selectEl.value === 'radio' || selectEl.value === 'checkbox' || selectEl.value === 'dropdown') {`;
content = content.replace(regex3, replacement3);

const regex4 = /if \(type === 'radio' \|\| type === 'checkbox'\) \{/;
const replacement4 = `if (type === 'radio' || type === 'checkbox' || type === 'dropdown') {`;
content = content.replace(regex4, replacement4);

fs.writeFileSync(path, content);
console.log('admin.js updated with new question types for the builder');
