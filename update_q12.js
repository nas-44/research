const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Desktop/RESEARCH/survey/research';
const files = [
  path.join(baseDir, 'survey_config.json'),
  path.join(baseDir, 'public', 'app.js'),
  path.join(baseDir, 'public', 'admin.js'),
  path.join(baseDir, 'server.js')
];

// We use regex to match both escaped and unescaped quotes just to be completely safe
const oldTextRegex = /12\. I practically use fact-checking tools like \\?"Reverse Image Search\\?" to check the original source of a suspicious photo\./g;
const newText = '12. Before believing a viral visual, I actively check the profile or page that posted it to see if they are a trustworthy source.';

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (oldTextRegex.test(content)) {
      content = content.replace(oldTextRegex, newText);
      fs.writeFileSync(file, content);
      console.log(`Updated Q12 in ${path.basename(file)}`);
    } else {
      console.log(`Regex not found in ${path.basename(file)}, let's try a fallback replace...`);
      // Fallback: match any string starting with "12."
      const fallbackRegex = /12\.\s+I practically use fact-checking tools like [^"]*"Reverse Image Search"[^"]* to check the original source of a suspicious photo\./g;
      if (fallbackRegex.test(content)) {
          content = content.replace(fallbackRegex, newText);
          fs.writeFileSync(file, content);
          console.log(`Updated Q12 via fallback in ${path.basename(file)}`);
      } else {
          // Absolute fallback
          const absoluteFallback = /12\. I practically use fact-checking tools like.*suspicious photo\./g;
          if (absoluteFallback.test(content)) {
              content = content.replace(absoluteFallback, newText);
              fs.writeFileSync(file, content);
              console.log(`Updated Q12 via absolute fallback in ${path.basename(file)}`);
          } else {
              console.log(`COULD NOT FIND Q12 in ${path.basename(file)}`);
          }
      }
    }
  }
});
