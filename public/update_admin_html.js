const fs = require('fs');
const filePath = 'd:/Desktop/RESEARCH/survey/research/public/admin.html';
let content = fs.readFileSync(filePath, 'utf8');

// Replace descriptive text for Psychometric Scale
content = content.replace(
  "This scale comprises 8 Likert items assessing self-reported confirmation bias",
  "This scale comprises 3 Likert items (Q10-Q12) assessing the participant's Media Literacy Score (Max 15)."
);
content = content.replace(
  "This scale comprises 5 Likert-type items measuring the frequency of fact-checking behaviors",
  "This scale comprises 2 Likert items (Q7-Q8) measuring the Technology Adoption Score (Max 10)."
);

// Chi-Square Section
content = content.replace(
  `              <option value="q4">Field of Study/Work (Section A4)</option>`,
  `              <option value="q14_clues">Primary Visual Clue relied upon (Section 5)</option>`
);

// ANOVA Section (make sure Q9 is included for t-test)
content = content.replace(
  `              <option value="q4">Field of Study/Work (Section A4)</option>`,
  `              <option value="q4">Educational Qualification (Section A4)</option>
              <option value="q9">Overconfidence Bias (Q9)</option>`
);

// Update regression text
content = content.replace(
  "based on two continuous predictors: their Digital Media Literacy Score ($X_1$) and their Verification Behaviour Score ($X_2$)",
  "based on continuous predictors such as Digital Media Literacy Score ($X_1$), Technology Adoption Score ($X_2$), and Time Spent Scrolling ($X_3$)"
);

fs.writeFileSync(filePath, content);
console.log('Updated admin.html text');
