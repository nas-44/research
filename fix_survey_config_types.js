const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/survey_config.json';
let config = JSON.parse(fs.readFileSync(path, 'utf8'));

// Fix Section 4 (Q10, Q11, Q12) types
const sec4 = config.sections.find(s => s.id === 'section_4');
if (sec4) {
  sec4.questions.forEach(q => {
    if (q.id === 'q10' || q.id === 'q11' || q.id === 'q12') {
      q.type = 'likert5Freq';
      if (q.options) {
        delete q.options;
      }
    }
  });
}

// Ensure Q3 is dropdown
const sec1 = config.sections.find(s => s.id === 'section_1');
if (sec1) {
  const q3 = sec1.questions.find(q => q.id === 'q3');
  if (q3) {
    q3.type = 'dropdown';
    q3.options = [
      "Kozhikode",
      "Malappuram",
      "Kannur",
      "Wayanad",
      "Palakkad",
      "Kasaragod"
    ];
  }
}

fs.writeFileSync(path, JSON.stringify(config, null, 2));
console.log('survey_config.json corrected Q10-Q12 types to likert5Freq');
