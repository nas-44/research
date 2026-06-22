const fs = require('fs');

const configJson = fs.readFileSync('d:/Desktop/RESEARCH/survey/research/survey_config.json', 'utf8');
const replacement = 'const defaultSurveyConfig = ' + configJson + ';';
const regex = /const defaultSurveyConfig = \{[\s\S]*?\n  \]\n\};/;

function syncTo(file) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (regex.test(content)) {
            content = content.replace(regex, replacement);
            fs.writeFileSync(file, content);
            console.log(`Synced default config to ${file}`);
        } else {
            // Also try a more lenient regex if the structure is slightly different
            const fallbackRegex = /const defaultSurveyConfig = \{[\s\S]*?\};\s*\n/g;
            if (fallbackRegex.test(content)) {
                content = content.replace(fallbackRegex, replacement + '\n');
                fs.writeFileSync(file, content);
                console.log(`Synced default config via fallback to ${file}`);
            } else {
                console.log(`Regex not found in ${file}`);
            }
        }
    }
}

syncTo('d:/Desktop/RESEARCH/survey/research/public/app.js');
syncTo('d:/Desktop/RESEARCH/survey/research/public/admin.js');
syncTo('d:/Desktop/RESEARCH/survey/research/server.js');
