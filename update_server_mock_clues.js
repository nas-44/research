const fs = require('fs');

const serverJsPath = 'd:/Desktop/RESEARCH/survey/research/server.js';
let content = fs.readFileSync(serverJsPath, 'utf8');

const oldMockCluesRegex = /const clues = \[[\s\S]*?\];\s*if \(mediaSection && mediaSection\.mediaItems\) \{\s*mediaSection\.mediaItems\.forEach\(item => \{[\s\S]*?\}\);\s*\}/;

const newMockClues = `if (mediaSection && mediaSection.mediaItems) {
      mediaSection.mediaItems.forEach(item => {
        const isCorrect = Math.random() < accuracyBias;
        const answer = isCorrect ? item.trueType : (item.trueType === "real" ? "ai" : "real");
        
        // The frontend saves it as "Authentic" or "AI-Generated"
        const classification = answer === "real" ? "Authentic" : "AI-Generated";
        answers[item.id] = classification;
        
        // Select a clue based on 4 conditions
        let clueOptions = [];
        const itemType = item.type || 'image';
        
        if (classification === 'AI-Generated') {
          clueOptions = itemType === 'video' ? (config.aiVideoClues || []) : (config.aiImageClues || []);
        } else {
          clueOptions = itemType === 'video' ? (config.authenticVideoClues || []) : (config.authenticImageClues || []);
        }
        
        if (clueOptions.length === 0) {
            clueOptions = ["I didn't see any specific technical mistake; I just guessed."]; // Fallback
        }
        
        answers[\`\${item.id}_clue\`] = clueOptions[Math.floor(Math.random() * clueOptions.length)];
      });
    }`;

if (oldMockCluesRegex.test(content)) {
    content = content.replace(oldMockCluesRegex, newMockClues);
    fs.writeFileSync(serverJsPath, content);
    console.log('Updated server.js mock generator clues logic');
} else {
    console.log('Could not find mock clues logic to replace in server.js');
}
