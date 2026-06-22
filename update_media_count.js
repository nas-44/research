const fs = require('fs');
const configPath = 'd:/Desktop/RESEARCH/survey/research/survey_config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const mediaSection = config.sections.find(s => s.isMediaSection);

if (mediaSection) {
  mediaSection.description = "Objective: To test practical accuracy and identify the cues used. Keep this short with just 8 media items to avoid survey fatigue.\nInstructions: Please look closely at the 8 media items below and answer the two questions for each.";
  
  // Add 4 more mock items (2 real, 2 AI)
  mediaSection.mediaItems.push(
    {
      "anomalies": "No anomalies. Clear depth of field and realistic shadows.",
      "description": "A bustling city street with neon lights reflecting on a wet pavement.",
      "id": "m5",
      "title": "5",
      "trueType": "real",
      "type": "image",
      "url": "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800"
    },
    {
      "anomalies": "Unnatural lighting and overly smooth textures. Text in the background is unreadable gibberish.",
      "description": "Futuristic cyberpunk character standing in an alleyway.",
      "id": "m6",
      "title": "6",
      "trueType": "ai",
      "type": "image",
      "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800"
    },
    {
      "anomalies": "Slight anatomical inconsistencies in background characters and unnatural depth separation.",
      "description": "Aerial view of a fantastical castle built into the side of a massive waterfall.",
      "id": "m7",
      "title": "7",
      "trueType": "ai",
      "type": "image",
      "url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800"
    },
    {
      "anomalies": "No anomalies. Natural lighting and true-to-life textures.",
      "description": "Close-up of a person's hands holding a warm cup of coffee.",
      "id": "m8",
      "title": "8",
      "trueType": "real",
      "type": "image",
      "url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"
    }
  );
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// Push via server if running
fetch('http://localhost:3000/api/survey-config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(config)
})
.then(res => res.json())
.then(data => console.log('Successfully updated the questionnaire to 8 items!'))
.catch(err => console.log('Server is not running, so I saved the file locally.'));
