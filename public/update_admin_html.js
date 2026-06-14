const fs = require('fs');

let html = fs.readFileSync('d:/Desktop/RESEARCH/survey/research/public/admin.html', 'utf8');

// Dashboard metrics
html = html.replace('Avg. Tech Adoption', 'Avg. Verif. Behaviour');
html = html.replace("their technology adoption category (Rogers' DOI)", "their verification behaviour");

// Reliability
html = html.replace('Technology Adoption Profile (Section D: Q19 - Q24)', 'Verification Behaviour Profile (Section C: Q16 - Q20)');
html = html.replace('This scale comprises 6 Likert items measuring technology exploration enthusiasm, self-directed learning comfort, and reliance, including 2 reverse-coded items.', 'This scale comprises 5 Likert-type items measuring the frequency of fact-checking behaviors such as verifying sources and checking comments.');

// Crosstabs and ANOVA options
const selectOptionsOld = `<option value="q1">Age Group (Section A1)</option>
              <option value="q2">Gender (Section A2)</option>
              <option value="q3">Educational Level (Section A3)</option>
              <option value="q4">Field of Study/Work (Section A4)</option>`;

const selectOptionsNew = `<option value="q1">Gender (Section A1)</option>
              <option value="q2">Age Group (Section A2)</option>
              <option value="q3">Educational Level (Section A3)</option>
              <option value="q4">Preferred Platform (Section A4)</option>`;

html = html.replace(new RegExp(selectOptionsOld.replace(/([\\.\\?\\*\\|\\(\\)\\[\\]\\{\\}\\+\\\\])/g, '\\$1'), 'g'), selectOptionsNew);
html = html.replace('One-Way Analysis of Variance (ANOVA)', 'Independent Samples T-Test & ANOVA');
html = html.replace('What is One-Way ANOVA?', 'What is T-Test / ANOVA?');

// Regression
html = html.replace('their Technology Adoption Score ($X_2$)', 'their Verification Behaviour Score ($X_2$)');
html = html.replace('VIF (Adoption)', 'VIF (Verification)');
html = html.replace('Adoption Score:', 'Verification Score:');

// DOI Chart -> Verification Chart
html = html.replace("Rogers' Diffusion of Innovations (DOI) Curve", 'Verification Behaviour Distribution');
html = html.replace('Distribution of technology adoption categories based on Section D', 'Distribution of verification behaviour scores based on Section C');

// Table Headers
html = html.replace('<th>Tech Adoption</th>', '<th>Verification Behav.</th>');

fs.writeFileSync('d:/Desktop/RESEARCH/survey/research/public/admin.html', html);
console.log('Updated admin.html successfully');
