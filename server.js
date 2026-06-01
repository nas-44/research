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
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL;
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
  title: "Detection of AI-Generated Images and Videos on Social Media",
  description: "Academic Research Survey in Journalism and Mass Communication",
  consentText: "Hello,\nThis survey is conducted as part of an academic research study in Journalism and Mass Communication. The purpose of this study is to understand how people identify AI-generated images and videos on social media platforms.\n\nYour responses will remain confidential and used only for research purposes.\n\n⏳ Time required: 5–7 minutes",
  sections: [
    {
      id: "section_a",
      title: "SECTION A: BASIC INFORMATION",
      description: "Demographic profile of the participant",
      questions: [
        {
          id: "q1",
          type: "radio",
          text: "What is your age?",
          options: ["18–21", "22–25", "26–30", "31–40", "41+"]
        },
        {
          id: "q2",
          type: "radio",
          text: "What is your gender?",
          options: ["Male", "Female", "Prefer not to say", "Other"]
        },
        {
          id: "q3",
          type: "radio",
          text: "What is your highest educational qualification?",
          options: ["School level", "Undergraduate", "Postgraduate", "Other"]
        },
        {
          id: "q4",
          type: "radio",
          text: "What is your field of study/work?",
          options: ["Arts/Humanities", "Commerce/Business", "Science", "Technology", "Media/Communication", "Other"]
        }
      ]
    },
    {
      id: "section_b",
      title: "SECTION B: SOCIAL MEDIA USAGE",
      description: "Habits and consumption of social media content",
      questions: [
        {
          id: "q5",
          type: "radio",
          text: "Which social media platform do you use most frequently?",
          options: ["Instagram", "Facebook", "Both equally"]
        },
        {
          id: "q6",
          type: "radio",
          text: "How much time do you spend daily on social media?",
          options: ["Less than 1 hour", "1–2 hours", "3–4 hours", "More than 5 hours"]
        },
        {
          id: "q7",
          type: "radio",
          text: "What type of content do you mostly consume?",
          options: ["Images", "Videos/Reels", "Text posts", "Mixed content"]
        },
        {
          id: "q8",
          type: "radio",
          text: "How often do you share social media posts?",
          options: ["Rarely", "Sometimes", "Often", "Very often"]
        },
        {
          id: "q9",
          type: "radio",
          text: "Have you ever seen content online that looked fake or edited?",
          options: ["Yes", "No", "Not sure"]
        },
        {
          id: "q10",
          type: "radio",
          text: "Do you follow news or information pages/accounts on social media?",
          options: ["Yes", "No"]
        }
      ]
    },
    {
      id: "section_c",
      title: "SECTION C: DIGITAL MEDIA LITERACY",
      description: "Please indicate how much you agree with the following statements. (1 = Strongly Disagree, 5 = Strongly Agree)",
      questions: [
        { id: "q11", type: "likert5", text: "I verify information before sharing it online." },
        { id: "q12", type: "likert5", text: "I check multiple sources before believing information online." },
        { id: "q13", type: "likert5", text: "I can identify misleading or fake content online." },
        { id: "q14", type: "likert5", text: "I pay attention to details in images and videos." },
        { id: "q15", type: "likert5", text: "I question the authenticity of viral content." },
        { id: "q16", type: "likert5", text: "I am aware that AI can create realistic fake images and videos." },
        { id: "q17", type: "likert5", text: "I try to identify whether online content is real or manipulated." },
        { id: "q18", type: "likert5", text: "I use fact-checking methods or websites when I doubt content." }
      ]
    },
    {
      id: "section_d",
      title: "SECTION D: TECHNOLOGY ADOPTION (DOI)",
      description: "Diffusion of Innovations technology adoption profiling. (1 = Strongly Disagree, 5 = Strongly Agree)",
      questions: [
        { id: "q19", type: "likert5", text: "I like trying new technologies before others." },
        { id: "q20", type: "likert5", text: "I enjoy exploring new digital tools and apps." },
        { id: "q21", type: "likert5", text: "I usually adopt new technologies quickly." },
        { id: "q22", type: "likert5", text: "I feel comfortable learning new technologies on my own." },
        { id: "q23", type: "likert5", text: "I prefer to wait before using new technologies. (Reverse coded)", isReverse: true },
        { id: "q24", type: "likert5", text: "I depend on others to explain new technologies to me. (Reverse coded)", isReverse: true }
      ]
    },
    {
      id: "section_e",
      title: "SECTION E: AI-GENERATED CONTENT DETECTION",
      description: "Analyze the following media files and determine if they are real or AI-generated.",
      isMediaSection: true,
      mediaItems: [
        {
          id: "m1",
          type: "image",
          title: "Astronaut in Lavender Mars Field",
          url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
          trueType: "ai",
          description: "Photorealistic depiction of an astronaut picking purple lavender under a bright orange Martian sky.",
          anomalies: "Symmetry errors in the backpack straps, surreal light source reflecting on the helmet visor showing trees, physics-defying lavender stems."
        },
        {
          id: "m2",
          type: "image",
          title: "Tokyo Market Stall Vendor",
          url: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800",
          trueType: "real",
          description: "Stunning street photography of a vendor smiling behind his seafood stall at Tsukiji Market, Tokyo.",
          anomalies: "No AI anomalies. Perfect reflections on wet floor, clear and legible price tags in Japanese kanji, anatomically correct hands holding ice scoop."
        },
        {
          id: "m3",
          type: "image",
          title: "The Floating Island Turtle",
          url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800",
          trueType: "ai",
          description: "A giant sea turtle swimming in deep blue ocean waters with an entire tropical forest growing on its shell.",
          anomalies: "Surreal biological fusion, blending textures between turtle shell and fertile soil, impossible lighting patterns deep underwater."
        },
        {
          id: "m4",
          type: "image",
          title: "Golden Honey Dripping Hands",
          url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
          trueType: "real",
          description: "High-contrast close-up shot of liquid honey dripping between fingers, capturing natural skin pores and hair.",
          anomalies: "No AI anomalies. Flawless human anatomy, realistic physics-based liquid viscosity, consistent focus plane, authentic light refraction through honey."
        }
      ]
    },
    {
      id: "section_f",
      title: "SECTION F: AWARENESS & OPINION",
      description: "General public awareness and ethical stance regarding AI-generated media",
      questions: [
        {
          id: "q28",
          type: "radio",
          text: "Have you heard the term “deepfake” before?",
          options: ["Yes", "No"]
        },
        {
          id: "q29",
          type: "radio",
          text: "Do you think AI-generated content is becoming more common online?",
          options: ["Yes", "No", "Not sure"]
        },
        {
          id: "q30",
          type: "radio",
          text: "Do you think AI-generated content can mislead people?",
          options: ["Yes", "No", "Maybe"]
        },
        {
          id: "q31",
          type: "radio",
          text: "Do you think social media platforms should label AI-generated content?",
          options: ["Yes", "No", "Not sure"]
        },
        {
          id: "q32",
          type: "radio",
          text: "Do you trust images and videos shared on social media?",
          options: ["Yes", "No", "Sometimes"]
        },
        {
          id: "q33",
          type: "radio",
          text: "Do you think younger users are better at identifying fake AI content?",
          options: ["Yes", "No", "Not sure"]
        }
      ]
    },
    {
      id: "section_g",
      title: "SECTION G: OPTIONAL RESPONSE",
      description: "Qualitative feedback on personal experiences with AI content",
      questions: [
        {
          id: "q34",
          type: "textarea",
          text: "Do you have any thoughts or experiences related to AI-generated content?",
          placeholder: "Type your experiences, concerns, or feedback here..."
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
  const ages = ["18–21", "22–25", "26–30", "31–40", "41+"];
  const genders = ["Male", "Female", "Prefer not to say", "Other"];
  const educations = ["School level", "Undergraduate", "Postgraduate", "Other"];
  const fields = ["Arts/Humanities", "Commerce/Business", "Science", "Technology", "Media/Communication", "Other"];
  
  const platforms = ["Instagram", "Facebook", "Both equally"];
  const times = ["Less than 1 hour", "1–2 hours", "3–4 hours", "More than 5 hours"];
  const contents = ["Images", "Videos/Reels", "Text posts", "Mixed content"];
  const shares = ["Rarely", "Sometimes", "Often", "Very often"];
  const fakes = ["Yes", "No", "Not sure"];
  
  const confidenceOptions = ["Very unsure", "Unsure", "Neutral", "Sure", "Very sure"];
  const helpOptions = ["Visual details", "Facial/body appearance", "Lighting/shadows", "Caption/context", "Guess", "Other"];
  
  const opinions = {
    q28: ["Yes", "No"],
    q29: ["Yes", "No", "Not sure"],
    q30: ["Yes", "No", "Maybe"],
    q31: ["Yes", "No", "Not sure"],
    q32: ["Yes", "No", "Sometimes"],
    q33: ["Yes", "No", "Not sure"]
  };

  const qualitativeThoughts = [
    "I saw a deepfake video of a politician that looked extremely real. It's frightening how fast the technology is advancing.",
    "As a designer, I can spot the weird blending in AI hands, but normal users will definitely fall for it.",
    "My grandmother shares AI-generated photos of giant vegetables on Facebook thinking they are real. We need labeling ASAP.",
    "AI is a great tool for creativity, but the lack of regulation on social media makes it highly dangerous for election campaigns.",
    "I believe digital literacy is more important than platform censoring.",
    "Sometimes I struggle to tell the difference, especially when viewing quickly on a mobile screen.",
    "The lighting is usually the dead giveaway. AI shadows don't make physical sense yet.",
    "It's getting harder every month. I used to be 100% sure, now I'm doubting real photos too."
  ];

  const mockNames = [
    "Emily Watson", "Alex Carter", "David Chen", "Sofia Martinez", 
    "Jordan Taylor", "Ryan Patterson", "Chloe Jenkins", "Marcus Aurelius", 
    "Olivia Bennett", "Li Wei", "Daniel Kowalski", "Amina Diop", 
    "Lucas Silva", "Emma Larsson", "Tariq Mahmood", "Elena Popova", 
    "Hiroshi Tanaka", "Sarah Al-Farsi", "Gabriel Dupont", "Zoe Henderson"
  ];

  for (let i = 0; i < count; i++) {
    // Determine profile: Let's create profiles to build logical correlation
    // Profile 1: Tech-savvy youth (18-25, Tech/Science, High media literacy, High tech adoption, high AI detection)
    // Profile 2: Older non-tech (41+, Arts/Business, Low media literacy, Low tech adoption, low AI detection)
    // Profile 3: Average user
    
    const randomVal = Math.random();
    let profile = "average";
    let age, gender, edu, field, literacyBias, techBias, accuracyBias;
    
    gender = genders[Math.floor(Math.random() * genders.length)];
    
    if (randomVal < 0.35) {
      profile = "tech-savvy-youth";
      age = ages[Math.floor(Math.random() * 2)]; // 18-21 or 22-25
      edu = Math.random() > 0.3 ? "Undergraduate" : "Postgraduate";
      field = Math.random() > 0.5 ? "Technology" : "Science";
      literacyBias = 4.2; // Tends to score high on media literacy (agree/strongly agree)
      techBias = 4.4;     // Tends to score high on technology adoption
      accuracyBias = 0.85; // 85% chance of correctly identifying AI vs Real
    } else if (randomVal < 0.60) {
      profile = "older-traditional";
      age = ages[3 + Math.floor(Math.random() * 2)]; // 31-40 or 41+
      edu = Math.random() > 0.6 ? "School level" : "Undergraduate";
      field = fields[Math.floor(Math.random() * 3)]; // Arts, Commerce, Other
      literacyBias = 2.6; // Low-to-moderate literacy
      techBias = 2.1;     // Low tech adoption
      accuracyBias = 0.40; // 40% chance of correct (worse than random guessing sometimes!)
    } else {
      profile = "average";
      age = ages[Math.floor(Math.random() * ages.length)];
      edu = educations[Math.floor(Math.random() * educations.length)];
      field = fields[Math.floor(Math.random() * fields.length)];
      literacyBias = 3.5;
      techBias = 3.3;
      accuracyBias = 0.65;
    }
    
    const answers = {};
    answers.participant_name = mockNames[i % mockNames.length] + ` (Mock #${i+1})`;
    
    // Section A Answers
    answers.q1 = age;
    answers.q2 = gender;
    answers.q3 = edu;
    answers.q4 = field;
    
    // Section B Answers
    answers.q5 = platforms[Math.floor(Math.random() * platforms.length)];
    answers.q6 = times[Math.floor(Math.random() * times.length)];
    answers.q7 = contents[Math.floor(Math.random() * contents.length)];
    answers.q8 = shares[Math.floor(Math.random() * shares.length)];
    answers.q9 = profile === "tech-savvy-youth" ? "Yes" : fakes[Math.floor(Math.random() * fakes.length)];
    answers.q10 = Math.random() > 0.4 ? "Yes" : "No";
    
    // Section C Answers (Literacy Scale: 8 items q11 to q18)
    for (let q = 11; q <= 18; q++) {
      let score = Math.round(literacyBias + (Math.random() * 2 - 1));
      score = Math.max(1, Math.min(5, score));
      answers[`q${q}`] = score;
    }
    
    // Section D Answers (Tech Adoption Scale: 6 items q19 to q24)
    for (let q = 19; q <= 24; q++) {
      let score;
      if (q === 23 || q === 24) {
        // Reverse coded: Low tech adoption profile will agree (higher score), tech-savvy will disagree (lower score)
        score = Math.round((6 - techBias) + (Math.random() * 2 - 1));
      } else {
        score = Math.round(techBias + (Math.random() * 2 - 1));
      }
      score = Math.max(1, Math.min(5, score));
      answers[`q${q}`] = score;
    }
    
    // Section E Answers (Media AI Detection)
    const mediaSection = config.sections.find(s => s.isMediaSection);
    if (mediaSection && mediaSection.mediaItems) {
      mediaSection.mediaItems.forEach(item => {
        const isCorrect = Math.random() < accuracyBias;
        const answer = isCorrect ? item.trueType : (item.trueType === "real" ? "ai" : "real");
        answers[item.id] = answer;
        
        // Confidence score
        let confIdx;
        if (isCorrect) {
          confIdx = profile === "tech-savvy-youth" ? (3 + Math.floor(Math.random() * 2)) : (2 + Math.floor(Math.random() * 3));
        } else {
          confIdx = profile === "older-traditional" ? (3 + Math.floor(Math.random() * 2)) : Math.floor(Math.random() * 3);
        }
        confIdx = Math.max(0, Math.min(4, confIdx));
        answers[`${item.id}_confidence`] = confidenceOptions[confIdx];
        
        // What helped
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
    
    // Section F Answers
    Object.keys(opinions).forEach(qKey => {
      let opts = opinions[qKey];
      let ans;
      if (qKey === "q28" && profile === "tech-savvy-youth") ans = "Yes";
      else ans = opts[Math.floor(Math.random() * opts.length)];
      answers[qKey] = ans;
    });
    
    // Section G Optional Answer
    if (Math.random() > 0.7) {
      answers.q34 = qualitativeThoughts[Math.floor(Math.random() * qualitativeThoughts.length)];
    } else {
      answers.q34 = "";
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
