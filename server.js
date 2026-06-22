const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
// Disable caching during development so you never have to hard refresh
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: '0'
}));

const CONFIG_PATH = path.join(__dirname, 'survey_config.json');
const RESPONSES_PATH = path.join(__dirname, 'responses.json');

// Zero-dependency .env file parser
const ENV_PATH = path.join(__dirname, '.env');
if (fs.existsSync(ENV_PATH)) {
  try {
    const envContent = fs.readFileSync(ENV_PATH, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    });
  } catch (err) {
    console.warn("⚠️ Failed to parse local .env configuration file:", err);
  }
}

// Log status of the hybrid cloud data store integration
const FIREBASE_DB_URL = '';
if (FIREBASE_DB_URL) {
  console.log(`⚡ HYBRID CLOUD DATA INTEGRATION: Enabled!`);
  console.log(`   Connected to Firebase Realtime Database at: ${FIREBASE_DB_URL}`);
} else {
  console.log(`📁 HYBRID CLOUD DATA INTEGRATION: Local Fallback Mode (No FIREBASE_DB_URL in .env).`);
}

// Zero-dependency HTTPS cloud REST wrapper (compatible with 100% of Node.js versions)
const https = require('https');
function cloudFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const reqOptions = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      };
      
      const req = https.request(url, reqOptions, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode < 200 || res.statusCode >= 300) {
              reject(new Error(`HTTP Error ${res.statusCode}: ${body}`));
            } else {
              resolve(JSON.parse(body || 'null'));
            }
          } catch (e) {
            resolve(body);
          }
        });
      });
      
      req.on('error', err => reject(err));
      
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Helper to read JSON safely
function readJSON(filePath, defaultData) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

// Helper to write JSON safely (gracefully handles read-only filesystem on Vercel/serverless)
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    if (err.code === 'EROFS' || err.code === 'EACCES') {
      // Read-only filesystem (Vercel serverless) — Firebase is the primary store, so this is OK
      console.warn(`⚠️ Cannot write to local filesystem (read-only). Using cloud storage only.`);
      return true; // Return true so API doesn't send a 500 error
    }
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Default Survey Configuration (matching user's prompt exactly)
const defaultSurveyConfig = {
      "consentText": "Hello,\nThis survey is conducted as part of an academic research study. The purpose of this study is to understand how people identify AI-generated images and videos on social media platforms.\n\nYour responses will remain confidential and used only for research purposes.\n\n⏳ Time required: 5–7 minutes",
  "aiImageClues": [
    "Anatomy/Logic Errors: Weird fingers, extra limbs, or melting/merged objects.",
    "Background/Text Errors: Unreadable or gibberish text, and illogical background elements.",
    "Texture/Lighting Errors: Unnatural perfect lighting, excessive cinematic gloss, or \"plastic-like\" skin.",
    "I didn't see any specific technical mistake; I just guessed."
  ],
  "aiVideoClues": [
    "Lip-sync Mismatch: The audio does not properly align with the mouth movements.",
    "Robotic Movements: Unnatural blinking patterns or stiff, robotic facial expressions.",
    "Flickering/Glitches: Morphing edges around the face or an unstable, flickering background.",
    "I didn't see any specific technical mistake; I just guessed."
  ],
  "authenticImageClues": [
    "Natural Textures: Realistic skin pores, blemishes, and accurate natural shadows/lighting.",
    "Logical Context: Identifiable real-world backgrounds and perfectly readable text.",
    "Natural Imperfections: Normal human asymmetry and a lack of overly polished, artificial perfection.",
    "I didn't notice any specific cues; it just looked completely flawless and real to me."
  ],
  "authenticVideoClues": [
    "Natural Human Movements: Fluid body language and realistic, spontaneous facial expressions.",
    "Perfect Audio-Visual Sync: The voice perfectly matches the natural movement of the lips.",
    "Consistent Environment: A highly stable background with no morphing, blurring, or glitches during movement.",
    "I didn't notice any specific cues; it just looked completely flawless and real to me."
  ],
  "description": "Academic Research Survey",
  "sections": [
    {
      "description": "Objective: To define the demographic boundaries",
      "id": "section_1",
      "questions": [
        {
          "id": "q1",
          "type": "radio",
          "text": "1. What is your age?",
          "options": [
            "18 - 25",
            "26 - 35",
            "36 - 50",
            "Above 50"
          ]
        },
        {
          "id": "q2",
          "type": "radio",
          "text": "2. What is your gender?",
          "options": [
            "Male",
            "Female"
          ]
        },
        {
          "id": "q3",
          "type": "dropdown",
          "text": "3. Which district in the Malabar region do you currently reside in?",
          "options": [
            "Kozhikode",
            "Malappuram",
            "Kannur",
            "Wayanad",
            "Palakkad",
            "Kasaragod"
          ]
        },
        {
          "id": "q4",
          "type": "radio",
          "text": "4. What is your highest educational qualification?",
          "options": [
            "High School / Plus Two",
            "Undergraduate (Degree)",
            "Postgraduate (PG)",
            "Professional Degree / Diploma"
          ]
        }
      ],
      "title": "SECTION 1: Socio-Demographic Profile"
    },
    {
      "description": "Objective: To measure platform usage and exposure to fast-paced content",
      "id": "section_2",
      "questions": [
        {
          "id": "q5",
          "type": "radio",
          "text": "5. Which visual-centric platform do you use the most daily?",
          "options": [
            "Instagram",
            "Facebook",
            "I use both equally"
          ]
        },
        {
          "id": "q6",
          "type": "radio",
          "text": "6. Approximately how much time do you spend scrolling on these platforms per day?",
          "options": [
            "Less than 1 hour",
            "1 to 3 hours",
            "3 to 5 hours",
            "More than 5 hours"
          ]
        }
      ],
      "title": "SECTION 2: Social Media & Algorithmic Feed Behavior"
    },
    {
      "description": "Objective: To measure how quickly the user adopts new Generative AI tools. Will be calculated as 'Technology Adoption Score' in SPSSPlease indicate your level of agreement with the following statements:(Scale: 1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly Agree)",
      "id": "section_3",
      "questions": [
        {
          "id": "q7",
          "type": "likert5",
          "text": "7. I actively experiment with new Generative AI tools (like ChatGPT, Midjourney, AI filters) as soon as they become available."
        },
        {
          "id": "q8",
          "type": "likert5",
          "text": "8. I feel very comfortable interacting with, liking, or sharing content on social media even if I know it is generated by AI."
        },
        {
          "id": "q9",
          "type": "likert5",
          "text": "9. I am highly confident in my personal ability to easily distinguish between a real photograph and a hyper-realistic AI image. (Measures Overconfidence Bias)"
        }
      ],
      "title": "SECTION 3: Technology Adoption (Diffusion of Innovations Scale)"
    },
    {
      "description": "Objective: To measure the actual fact-checking habits. Will be calculated as 'Media Literacy Score' in SPSSPlease rate how often you engage in the following behaviors while using social media:(Scale: 1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Always)",
      "id": "section_4",
      "questions": [
        {
          "id": "q10",
          "type": "likert5Freq",
          "text": "10. When I see a highly sensational or emotional visual on my feed, I pause to doubt its authenticity before believing it."
        },
        {
          "id": "q11",
          "type": "likert5Freq",
          "text": "11. I actively check the comments section or search Google to verify if a viral visual is real before sharing it with others."
        },
        {
          "id": "q12",
          "type": "likert5Freq",
          "text": "12. Before believing a viral visual, I actively check the profile or page that posted it to see if they are a trustworthy source."
        }
      ],
      "title": "SECTION 4: Practical Digital Media Literacy (Content Literacy Scale)"
    },
    {
      "description": "Objective: To test practical accuracy and identify the cues used. Keep this short with just 8 media items to avoid survey fatigue.\nInstructions: Please look closely at the 8 media items below and answer the two questions for each.",
      "id": "section_5",
      "isMediaSection": true,
      "mediaItems": [
        {
          "anomalies": "Symmetry errors in the backpack straps, surreal light source reflecting on the helmet visor showing trees, physics-defying lavender stems.",
          "description": "Photorealistic depiction of an astronaut picking purple lavender under a bright orange Martian sky.",
          "id": "m1",
          "title": "1",
          "trueType": "ai",
          "type": "image",
          "url": "https://cdn.mos.cms.futurecdn.net/43aVbKLKvmqfcfnR2YEvyA-1200-80.png.webp"
        },
        {
          "anomalies": "No AI anomalies. Perfect reflections on wet floor, clear and legible price tags in Japanese kanji, anatomically correct hands holding ice scoop.",
          "description": "Stunning street photography of a vendor smiling behind his seafood stall at Tsukiji Market, Tokyo.",
          "id": "m2",
          "title": "2",
          "trueType": "real",
          "type": "image",
          "url": "https://cdn.mos.cms.futurecdn.net/kPFybQBSrpiuFeqi9UaDZ4-1200-80.jpg.webp"
        },
        {
          "anomalies": "Surreal biological fusion, blending textures between turtle shell and fertile soil, impossible lighting patterns deep underwater.",
          "description": "A giant sea turtle swimming in deep blue ocean waters with an entire tropical forest growing on its shell.",
          "id": "m3",
          "title": "3",
          "trueType": "ai",
          "type": "video",
          "url": "https://youtu.be/cFzsUZyCReo"
        },
        {
          "anomalies": "No AI anomalies. Flawless human anatomy, realistic physics-based liquid viscosity, consistent focus plane, authentic light refraction through honey.",
          "description": "High-contrast close-up shot of liquid honey dripping between fingers, capturing natural skin pores and hair.",
          "id": "m4",
          "title": "4",
          "trueType": "real",
          "type": "video",
          "url": "https://youtube.com/shorts/nJFe0JIcPf4?feature=share"
        },
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
      ],
      "title": "SECTION 5: Practical Visual Test (Simulacra Detection)"
    }
  ],
  "title": "Digital Media Literacy and AI Detection Survey"
};

// API: Get survey config
app.get('/api/survey-config', async (req, res) => {
  if (FIREBASE_DB_URL) {
    try {
      const cloudConfig = await cloudFetch(`${FIREBASE_DB_URL}/config.json`);
      if (cloudConfig && cloudConfig.sections) {
        return res.json(cloudConfig);
      }
    } catch (err) {
      console.warn("⚠️ Cloud config fetch failed. Using local survey_config.json instead:", err.message);
    }
  }
  const config = readJSON(CONFIG_PATH, defaultSurveyConfig);
  res.json(config);
});

// API: Update survey config
app.post('/api/survey-config', async (req, res) => {
  const newConfig = req.body;
  if (!newConfig || !newConfig.sections) {
    return res.status(400).json({ error: "Invalid survey configuration" });
  }
  
  // Save locally first
  const success = writeJSON(CONFIG_PATH, newConfig);
  
  if (FIREBASE_DB_URL) {
    try {
      await cloudFetch(`${FIREBASE_DB_URL}/config.json`, {
        method: 'PUT',
        body: newConfig
      });
      console.log("☁️ Successfully updated survey config in the Cloud!");
    } catch (err) {
      console.error("⚠️ Failed to write config to cloud:", err.message);
    }
  }
  
  if (success) {
    res.json({ message: "Survey configuration updated successfully", config: newConfig });
  } else {
    res.status(500).json({ error: "Failed to save configuration" });
  }
});

// API: Get all responses
app.get('/api/responses', async (req, res) => {
  if (FIREBASE_DB_URL) {
    try {
      const cloudData = await cloudFetch(`${FIREBASE_DB_URL}/responses.json`);
      if (cloudData) {
        // Firebase REST API returns an object with random keys like { "-N1234": { ... } }
        const responses = Object.keys(cloudData).map(key => {
          const item = cloudData[key];
          if (item && typeof item === 'object') {
            return item;
          }
          return null;
        }).filter(Boolean);
        return res.json(responses);
      } else {
        return res.json([]); // Return empty list if cloud DB is blank
      }
    } catch (err) {
      console.warn("⚠️ Cloud responses fetch failed. Reading from local responses.json instead:", err.message);
    }
  }
  const responses = readJSON(RESPONSES_PATH, []);
  res.json(responses);
});

// API: Submit a response
app.post('/api/responses', async (req, res) => {
  const newResponse = req.body;
  if (!newResponse || !newResponse.answers) {
    return res.status(400).json({ error: "Invalid response data" });
  }
  
  newResponse.id = 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  newResponse.timestamp = new Date().toISOString();
  
  // Save locally first
  const responses = readJSON(RESPONSES_PATH, []);
  responses.push(newResponse);
  const success = writeJSON(RESPONSES_PATH, responses);
  
  if (FIREBASE_DB_URL) {
    try {
      await cloudFetch(`${FIREBASE_DB_URL}/responses.json`, {
        method: 'POST',
        body: newResponse
      });
      console.log("☁️ Successfully saved participant response to the Cloud!");
    } catch (err) {
      console.error("⚠️ Failed to write response to cloud:", err.message);
    }
  }
  
  if (success) {
    res.status(201).json({ message: "Response submitted successfully", id: newResponse.id });
  } else {
    res.status(500).json({ error: "Failed to save response" });
  }
});

// API: Clear all responses
app.post('/api/clear-responses', async (req, res) => {
  const success = writeJSON(RESPONSES_PATH, []);
  
  if (FIREBASE_DB_URL) {
    try {
      await cloudFetch(`${FIREBASE_DB_URL}/responses.json`, {
        method: 'DELETE'
      });
      console.log("☁️ Successfully cleared all responses in the Cloud!");
    } catch (err) {
      console.error("⚠️ Failed to clear cloud responses:", err.message);
    }
  }
  
  if (success) {
    res.json({ message: "All survey responses cleared" });
  } else {
    res.status(500).json({ error: "Failed to clear responses" });
  }
});

// API: Delete a selected response record
app.post('/api/delete-response', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing response ID parameter" });
  }
  
  const responses = readJSON(RESPONSES_PATH, []);
  const filtered = responses.filter(r => r.id !== id);
  const success = writeJSON(RESPONSES_PATH, filtered);
  
  if (FIREBASE_DB_URL) {
    try {
      const cloudData = await cloudFetch(`${FIREBASE_DB_URL}/responses.json`);
      if (cloudData) {
        const keyToDelete = Object.keys(cloudData).find(key => cloudData[key] && cloudData[key].id === id);
        if (keyToDelete) {
          await cloudFetch(`${FIREBASE_DB_URL}/responses/${keyToDelete}.json`, {
            method: 'DELETE'
          });
          console.log(`☁️ Successfully deleted cloud response record: ${id}`);
        }
      }
    } catch (err) {
      console.error("⚠️ Failed to delete response from cloud storage:", err.message);
    }
  }
  
  if (success) {
    res.json({ message: "Response record deleted successfully", id: id });
  } else {
    res.status(500).json({ error: "Failed to delete response from server database" });
  }
});

// API: Generate mock responses for MA analysis
app.post('/api/generate-mock', async (req, res) => {
  const count = req.body.count || 50;
  const config = readJSON(CONFIG_PATH, defaultSurveyConfig);
  const responses = readJSON(RESPONSES_PATH, []);
  
  const mockResponses = [];
  const ages = ["18–24", "25–34", "35–44", "45–54", "55+"];
  const genders = ["Male", "Female", "Other", "Prefer not to say"];
  const educations = ["Higher Secondary", "Diploma", "Undergraduate", "Postgraduate", "Other"];
  const platforms = ["Instagram", "Facebook", "Both equally"];
  const times = ["Less than 1 hour", "1–2 hours", "3–4 hours", "5–6 hours", "More than 6 hours"];
  const fakes = ["Yes", "No"];
  const freqAI = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];
  const confAI = ["Very Low", "Low", "Moderate", "High", "Very High"];
  const confidenceOptions = ["Very Uncertain", "Uncertain", "Neutral", "Confident", "Very Confident"];
  const helpOptions = ["Visual details", "Facial/body appearance", "Lighting/shadows", "Caption/context", "Guess", "Other"];

  const mockNames = [
    "Emily Watson", "Alex Carter", "David Chen", "Sofia Martinez", 
    "Jordan Taylor", "Ryan Patterson", "Chloe Jenkins", "Marcus Aurelius", 
    "Olivia Bennett", "Li Wei", "Daniel Kowalski", "Amina Diop", 
    "Lucas Silva", "Emma Larsson", "Tariq Mahmood", "Elena Popova", 
    "Hiroshi Tanaka", "Sarah Al-Farsi", "Gabriel Dupont", "Zoe Henderson"
  ];

  for (let i = 0; i < count; i++) {
    const randomVal = Math.random();
    let profile = "average";
    let age, gender, edu, literacyBias, techBias, accuracyBias;
    
    gender = genders[Math.floor(Math.random() * genders.length)];
    
    if (randomVal < 0.35) {
      profile = "tech-savvy-youth";
      age = ages[Math.floor(Math.random() * 2)]; // 18-24 or 25-34
      edu = Math.random() > 0.3 ? "Undergraduate" : "Postgraduate";
      literacyBias = 4.2; 
      techBias = 4.4;     
      accuracyBias = 0.85; 
    } else if (randomVal < 0.60) {
      profile = "older-traditional";
      age = ages[3 + Math.floor(Math.random() * 2)]; // 45-54 or 55+
      edu = Math.random() > 0.6 ? "Higher Secondary" : "Undergraduate";
      literacyBias = 2.6; 
      techBias = 2.1;     
      accuracyBias = 0.40; 
    } else {
      profile = "average";
      age = ages[Math.floor(Math.random() * ages.length)];
      edu = educations[Math.floor(Math.random() * educations.length)];
      literacyBias = 3.5;
      techBias = 3.3;
      accuracyBias = 0.65;
    }
    
    const answers = {};
    answers.participant_name = mockNames[i % mockNames.length] + ` (Mock #${i+1})`;
    
    // Section 1 Answers
    answers.q1 = age;
    answers.q2 = gender;
    answers.q3 = ["Kozhikode", "Malappuram", "Kannur", "Wayanad", "Palakkad", "Kasaragod"][Math.floor(Math.random() * 6)];
    answers.q4 = edu;
    
    // Section 2 Answers
    answers.q5 = platforms[Math.floor(Math.random() * platforms.length)];
    answers.q6 = times[Math.floor(Math.random() * times.length)];
    
    // Section 3 Answers (Tech Adoption Q7-Q9)
    for (let q = 7; q <= 9; q++) {
      let score = Math.round(techBias + (Math.random() * 2 - 1));
      score = Math.max(1, Math.min(5, score));
      answers[`q${q}`] = score.toString();
    }
    
    // Section 4 Answers (Media Literacy Q10-Q12)
    for (let q = 10; q <= 12; q++) {
      let score = Math.round(literacyBias + (Math.random() * 2 - 1));
      score = Math.max(1, Math.min(5, score));
      answers[`q${q}`] = score.toString();
    }
    
    // Section 5 Answers (Media AI Detection)
    const mediaSection = config.sections.find(s => s.isMediaSection);
    if (mediaSection && mediaSection.mediaItems) {
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
        
        answers[`${item.id}_clue`] = clueOptions[Math.floor(Math.random() * clueOptions.length)];
      });
    }
    
    mockResponses.push({
      id: 'resp_mock_' + i + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(), // random time in last 10 days
      answers: answers
    });
  }
  
  const allResponses = responses.concat(mockResponses);
  const success = writeJSON(RESPONSES_PATH, allResponses);
  
  if (FIREBASE_DB_URL) {
    try {
      const payload = {};
      mockResponses.forEach(r => payload[r.id] = r);
      await cloudFetch(`${FIREBASE_DB_URL}/responses.json`, {
        method: 'PATCH',
        body: payload
      });
      console.log("☁️ Successfully saved mock responses to the Cloud!");
    } catch (err) {
      console.error("⚠️ Failed to write mock responses to cloud:", err.message);
    }
  }
  
  if (success) {
    res.json({ message: `Successfully generated and appended ${count} mock responses!`, count: count, total: allResponses.length });
  } else {
    res.status(500).json({ error: "Failed to save generated responses" });
  }
});

// Start Server (only when running locally, not on Vercel serverless)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` SURVEY & CMS SERVER IS RUNNING`);
    console.log(` View Survey: http://localhost:${PORT}`);
    console.log(` View CMS Dashboard: http://localhost:${PORT}/admin.html`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
