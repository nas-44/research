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
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL || 'https://research-344f8-default-rtdb.asia-southeast1.firebasedatabase.app';
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
  "title": "Academic Survey: AI-Generated Content Detection on Social Media",
  "description": "Academic Research Study",
  "consentText": "Hello,\nThis survey is conducted as part of an academic research study. The purpose of this study is to understand how people identify AI-generated images and videos on social media platforms.\n\nYour responses will remain confidential and used only for research purposes.\n\n⏳ Time required: 5–7 minutes",
  "sections": [
    {
      "id": "section_a",
      "title": "SECTION A: Demographic Information",
      "description": "Please provide your demographic details.",
      "questions": [
        {
          "id": "q1",
          "type": "radio",
          "text": "1. Gender",
          "options": [
            "Male",
            "Female",
            "Other",
            "Prefer not to say"
          ]
        },
        {
          "id": "q2",
          "type": "radio",
          "text": "2. Age",
          "options": [
            "18–24",
            "25–34",
            "35–44",
            "45–54",
            "55+"
          ]
        },
        {
          "id": "q3",
          "type": "radio",
          "text": "3. Educational Qualification",
          "options": [
            "Higher Secondary",
            "Diploma",
            "Undergraduate",
            "Postgraduate",
            "Other"
          ]
        },
        {
          "id": "q4",
          "type": "radio",
          "text": "4. Which platform do you use most frequently?",
          "options": [
            "Instagram",
            "Facebook",
            "Both equally"
          ]
        },
        {
          "id": "q5",
          "type": "radio",
          "text": "5. Average daily social media use",
          "options": [
            "Less than 1 hour",
            "1–2 hours",
            "3–4 hours",
            "5–6 hours",
            "More than 6 hours"
          ]
        }
      ]
    },
    {
      "id": "section_b",
      "title": "SECTION B: Digital Media Literacy",
      "description": "Indicate your level of agreement. (1 = Strongly Disagree, 5 = Strongly Agree)",
      "questions": [
        {
          "id": "q6",
          "type": "likert5",
          "text": "Information Evaluation: I verify information before sharing it online."
        },
        {
          "id": "q7",
          "type": "likert5",
          "text": "Information Evaluation: I compare information from multiple sources before believing it."
        },
        {
          "id": "q8",
          "type": "likert5",
          "text": "Information Evaluation: I can identify unreliable online information."
        },
        {
          "id": "q9",
          "type": "likert5",
          "text": "Information Evaluation: I pay attention to the source of information before trusting it."
        },
        {
          "id": "q10",
          "type": "likert5",
          "text": "Platform Awareness: I understand that social media algorithms influence the content I see."
        },
        {
          "id": "q11",
          "type": "likert5",
          "text": "Platform Awareness: I am aware that AI can generate realistic images and videos."
        },
        {
          "id": "q12",
          "type": "likert5",
          "text": "Platform Awareness: I understand that visual content on social media may be manipulated."
        },
        {
          "id": "q13",
          "type": "likert5",
          "text": "Critical Thinking: I question information that seems sensational or emotionally provocative."
        },
        {
          "id": "q14",
          "type": "likert5",
          "text": "Critical Thinking: I look for evidence before accepting online claims."
        },
        {
          "id": "q15",
          "type": "likert5",
          "text": "Critical Thinking: I critically evaluate visual content before believing it."
        }
      ]
    },
    {
      "id": "section_c",
      "title": "SECTION C: Verification Behaviour",
      "description": "Frequency Scale (1 = Never, 5 = Always)",
      "questions": [
        {
          "id": "q16",
          "type": "likert5Freq",
          "text": "I check the original source of a post."
        },
        {
          "id": "q17",
          "type": "likert5Freq",
          "text": "I search online to verify suspicious images."
        },
        {
          "id": "q18",
          "type": "likert5Freq",
          "text": "I read comments or discussions before trusting a post."
        },
        {
          "id": "q19",
          "type": "likert5Freq",
          "text": "I use fact-checking websites or reverse image searches."
        },
        {
          "id": "q20",
          "type": "likert5Freq",
          "text": "I verify information before reposting or sharing it."
        }
      ]
    },
    {
      "id": "section_d",
      "title": "SECTION D: AI-Generated Content Exposure",
      "description": "Please answer the following regarding your exposure to AI-generated content.",
      "questions": [
        {
          "id": "q21",
          "type": "radio",
          "text": "16. Have you previously heard about AI-generated images or videos?",
          "options": [
            "Yes",
            "No"
          ]
        },
        {
          "id": "q22",
          "type": "radio",
          "text": "17. How often do you encounter AI-generated content on social media?",
          "options": [
            "Never",
            "Rarely",
            "Sometimes",
            "Often",
            "Very Often"
          ]
        },
        {
          "id": "q23",
          "type": "radio",
          "text": "18. How confident are you in your ability to identify AI-generated images and videos?",
          "options": [
            "Very Low",
            "Low",
            "Moderate",
            "High",
            "Very High"
          ]
        }
      ]
    },
    {
      "id": "section_e",
      "title": "SECTION E: Detection Test",
      "description": "Look at each image/video shown and select your answer and confidence level.",
      "isMediaSection": true,
      "mediaItems": [
        {
          "id": "m1",
          "type": "image",
          "title": "Image 1",
          "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
          "trueType": "ai",
          "description": "Image 1 Placeholder"
        },
        {
          "id": "m2",
          "type": "image",
          "title": "Image 2",
          "url": "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800",
          "trueType": "real",
          "description": "Image 2 Placeholder"
        },
        {
          "id": "m3",
          "type": "image",
          "title": "Image 3",
          "url": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800",
          "trueType": "ai",
          "description": "Image 3 Placeholder"
        },
        {
          "id": "m4",
          "type": "image",
          "title": "Image 4",
          "url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
          "trueType": "real",
          "description": "Image 4 Placeholder"
        },
        {
          "id": "m5",
          "type": "image",
          "title": "Image 5",
          "url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
          "trueType": "ai",
          "description": "Image 5 Placeholder"
        },
        {
          "id": "v1",
          "type": "video",
          "title": "Video 1",
          "url": "https://www.w3schools.com/html/mov_bbb.mp4",
          "trueType": "ai",
          "description": "Video 1 Placeholder"
        },
        {
          "id": "v2",
          "type": "video",
          "title": "Video 2",
          "url": "https://www.w3schools.com/html/mov_bbb.mp4",
          "trueType": "real",
          "description": "Video 2 Placeholder"
        },
        {
          "id": "v3",
          "type": "video",
          "title": "Video 3",
          "url": "https://www.w3schools.com/html/mov_bbb.mp4",
          "trueType": "ai",
          "description": "Video 3 Placeholder"
        },
        {
          "id": "v4",
          "type": "video",
          "title": "Video 4",
          "url": "https://www.w3schools.com/html/mov_bbb.mp4",
          "trueType": "real",
          "description": "Video 4 Placeholder"
        },
        {
          "id": "v5",
          "type": "video",
          "title": "Video 5",
          "url": "https://www.w3schools.com/html/mov_bbb.mp4",
          "trueType": "ai",
          "description": "Video 5 Placeholder"
        }
      ]
    }
  ]
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
    
    // Section A Answers
    answers.q1 = gender;
    answers.q2 = age;
    answers.q3 = edu;
    answers.q4 = platforms[Math.floor(Math.random() * platforms.length)];
    answers.q5 = times[Math.floor(Math.random() * times.length)];
    
    // Section B Answers (Digital Media Literacy: q6 to q15)
    for (let q = 6; q <= 15; q++) {
      let score = Math.round(literacyBias + (Math.random() * 2 - 1));
      score = Math.max(1, Math.min(5, score));
      answers[`q${q}`] = score;
    }
    
    // Section C Answers (Verification Behaviour: q16 to q20)
    for (let q = 16; q <= 20; q++) {
      let score = Math.round(techBias + (Math.random() * 2 - 1));
      score = Math.max(1, Math.min(5, score));
      answers[`q${q}`] = score;
    }
    
    // Section D Answers (Exposure: q21 to q23)
    answers.q21 = profile === "tech-savvy-youth" ? "Yes" : fakes[Math.floor(Math.random() * fakes.length)];
    answers.q22 = freqAI[Math.floor(Math.random() * freqAI.length)];
    answers.q23 = confAI[Math.floor(Math.random() * confAI.length)];
    
    // Section E Answers (Media AI Detection)
    const mediaSection = config.sections.find(s => s.isMediaSection);
    if (mediaSection && mediaSection.mediaItems) {
      mediaSection.mediaItems.forEach(item => {
        const isCorrect = Math.random() < accuracyBias;
        const answer = isCorrect ? item.trueType : (item.trueType === "real" ? "ai" : "real");
        answers[item.id] = answer;
        
        let confIdx;
        if (isCorrect) {
          confIdx = profile === "tech-savvy-youth" ? (3 + Math.floor(Math.random() * 2)) : (2 + Math.floor(Math.random() * 3));
        } else {
          confIdx = profile === "older-traditional" ? (3 + Math.floor(Math.random() * 2)) : Math.floor(Math.random() * 3);
        }
        confIdx = Math.max(0, Math.min(4, confIdx));
        answers[`${item.id}_confidence`] = confidenceOptions[confIdx];
        
        const selectedHelped = [];
        const helpCount = 1 + Math.floor(Math.random() * 2);
        for (let h = 0; h < helpCount; h++) {
          const rawHelp = helpOptions[Math.floor(Math.random() * helpOptions.length)];
          if (!selectedHelped.includes(rawHelp)) {
            selectedHelped.push(rawHelp);
          }
        }
        answers[`${item.id}_helped`] = selectedHelped;
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
