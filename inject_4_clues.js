const fs = require('fs');

const replacement = '  "consentText": "Hello,\\nThis survey is conducted as part of an academic research study. The purpose of this study is to understand how people identify AI-generated images and videos on social media platforms.\\n\\nYour responses will remain confidential and used only for research purposes.\\n\\n⏳ Time required: 5–7 minutes",\n' +
'  "aiImageClues": [\n' +
'    "Anatomy/Logic Errors: Weird fingers, extra limbs, or melting/merged objects.",\n' +
'    "Background/Text Errors: Unreadable or gibberish text, and illogical background elements.",\n' +
'    "Texture/Lighting Errors: Unnatural perfect lighting, excessive cinematic gloss, or \\"plastic-like\\" skin.",\n' +
'    "I didn\'t see any specific technical mistake; I just guessed."\n' +
'  ],\n' +
'  "aiVideoClues": [\n' +
'    "Lip-sync Mismatch: The audio does not properly align with the mouth movements.",\n' +
'    "Robotic Movements: Unnatural blinking patterns or stiff, robotic facial expressions.",\n' +
'    "Flickering/Glitches: Morphing edges around the face or an unstable, flickering background.",\n' +
'    "I didn\'t see any specific technical mistake; I just guessed."\n' +
'  ],\n' +
'  "authenticImageClues": [\n' +
'    "Natural Textures: Realistic skin pores, blemishes, and accurate natural shadows/lighting.",\n' +
'    "Logical Context: Identifiable real-world backgrounds and perfectly readable text.",\n' +
'    "Natural Imperfections: Normal human asymmetry and a lack of overly polished, artificial perfection.",\n' +
'    "I didn\'t notice any specific cues; it just looked completely flawless and real to me."\n' +
'  ],\n' +
'  "authenticVideoClues": [\n' +
'    "Natural Human Movements: Fluid body language and realistic, spontaneous facial expressions.",\n' +
'    "Perfect Audio-Visual Sync: The voice perfectly matches the natural movement of the lips.",\n' +
'    "Consistent Environment: A highly stable background with no morphing, blurring, or glitches during movement.",\n' +
'    "I didn\'t notice any specific cues; it just looked completely flawless and real to me."\n' +
'  ],';

const oldRegex = /"consentText":[\s\S]*?"authenticClues": \[[^\]]*\],/g;

function replaceInFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (oldRegex.test(content)) {
            content = content.replace(oldRegex, replacement);
            fs.writeFileSync(filePath, content);
            console.log(`Updated clues in ${filePath}`);
        } else {
            console.log(`Could not find clues to replace in ${filePath}`);
        }
    }
}

replaceInFile('d:/Desktop/RESEARCH/survey/research/public/app.js');
replaceInFile('d:/Desktop/RESEARCH/survey/research/public/admin.js');
replaceInFile('d:/Desktop/RESEARCH/survey/research/server.js');
replaceInFile('d:/Desktop/RESEARCH/survey/research/survey_config.json');
