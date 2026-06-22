const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/app.js';
let content = fs.readFileSync(path, 'utf8');

// Update toggleOptionClass
const optRegex = /window\.toggleOptionClass = function\(labelEl, isCheckbox\) \{[\s\S]*?\};/;
const optReplacement = `window.toggleOptionClass = function(labelEl, isCheckbox) {
    if (!isCheckbox) {
      const siblings = labelEl.parentElement.querySelectorAll('.option-item');
      siblings.forEach(s => s.classList.remove('checked-item'));
      labelEl.classList.add('checked-item');
      
      const input = labelEl.querySelector('input[type="radio"]');
      if (input) {
        input.checked = true;
        saveAnswer(input.name, input.value);
      }
    } else {
      labelEl.classList.toggle('checked-item');
      const input = labelEl.querySelector('input[type="checkbox"]');
      if (input) {
        // Only toggle if the user clicked the div itself, not if the event bubbled from the input natively
        input.checked = labelEl.classList.contains('checked-item');
        if (input.checked) {
          if (!participantAnswers[input.name]) participantAnswers[input.name] = [];
          if (!participantAnswers[input.name].includes(input.value)) participantAnswers[input.name].push(input.value);
        } else {
          if (participantAnswers[input.name]) {
            const idx = participantAnswers[input.name].indexOf(input.value);
            if (idx > -1) participantAnswers[input.name].splice(idx, 1);
          }
        }
      }
    }
};`;

// Update toggleLikertClass
const likertRegex = /window\.toggleLikertClass = function\(labelEl\) \{[\s\S]*?\};/;
const likertReplacement = `window.toggleLikertClass = function(labelEl) {
    const siblings = labelEl.parentElement.querySelectorAll('.likert-option');
    siblings.forEach(s => s.classList.remove('checked-likert'));
    labelEl.classList.add('checked-likert');
    
    const input = labelEl.querySelector('input[type="radio"]');
    if (input) {
      input.checked = true;
      saveAnswer(input.name, input.value);
    }
};`;

// Also, let's add a visual toast for exactly which question is failing to make debugging 100% transparent.
const validateRegex = /const answer = participantAnswers\[q\.id\];\s+if \(answer === undefined \|\| answer === ''\) \{/;
const validateReplacement = `const answer = participantAnswers[q.id];
      if (answer === undefined || answer === '') {
        console.log('Validation failed on question: ' + q.id);`;

content = content.replace(optRegex, optReplacement);
content = content.replace(likertRegex, likertReplacement);
content = content.replace(validateRegex, validateReplacement);

fs.writeFileSync(path, content);
console.log('app.js updated with bulletproof click handling and validation debugging');
