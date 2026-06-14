// SURVEY FRONTEND LOGIC

// State Management
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

// Base API configuration and hybrid routing
const FIREBASE_DB_URL = 'https://research-344f8-default-rtdb.asia-southeast1.firebasedatabase.app';
const USE_CLOUD_STORAGE = false; // CRITICAL FIX: Always route through Vercel backend (server.js) for security
const API_BASE = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '';

let surveyConfig = null;
let currentSectionIndex = 0;
const participantAnswers = {};
let totalSectionsCount = 0;

// DOM Elements
const btnConsentNext = document.getElementById('btn-consent-next');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const screenConsent = document.getElementById('screen-consent');
const screenQuestions = document.getElementById('screen-questions');
const screenEnd = document.getElementById('screen-end');
const screenDecline = document.getElementById('screen-decline');
const progressWrapper = document.getElementById('survey-progress-wrapper');
const progressBar = document.getElementById('survey-progress');
const placeholderCard = document.getElementById('dynamic-card-placeholder');

// Media Zoom Modal elements
const modalZoom = document.getElementById('media-zoom-modal');
const modalZoomImg = document.getElementById('modal-zoomed-img');
const modalCaption = document.getElementById('modal-caption-text');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Force Light Theme (permanently aligned with academic standards)
document.body.classList.add('light-theme');

// Toast System
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast-notify');
  const icon = document.getElementById('toast-icon');
  const text = document.getElementById('toast-message');
  
  text.textContent = message;
  toast.className = 'toast show';
  
  if (type === 'success') {
    toast.classList.add('toast-success');
    icon.className = 'fa-solid fa-circle-check';
  } else if (type === 'danger') {
    toast.classList.add('toast-danger');
    icon.className = 'fa-solid fa-triangle-exclamation';
  } else {
    icon.className = 'fa-solid fa-circle-info';
  }
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Linkify Helper: Auto-convert URLs into clickable HTML anchors
function linkify(text) {
  if (!text) return '';
  const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(urlRegex, function(url) {
    return `<a href="${url}" target="_blank" class="survey-inline-link" style="color: var(--primary); text-decoration: underline; font-weight: 500;">${url} <i class="fa-solid fa-up-right-from-square" style="font-size:0.75rem; margin-left:4px;"></i></a>`;
  });
}

// Fallback for broken images (e.g. if user pastes a web page link instead of an image link)
window.handleImageError = function(imgEl, title, url) {
  const container = imgEl.closest('.media-container');
  if (container) {
    container.outerHTML = `
      <div class="link-card" style="display: flex; align-items: center; gap: 20px; padding: 20px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 25px; transition: var(--transition);">
        <div style="width: 52px; height: 52px; border-radius: 12px; background: var(--primary-glow); color: var(--warning); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink:0;">
          <i class="fa-solid fa-link"></i>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <span style="font-weight: 700; font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-primary);">${title}</span>
          <span style="color: var(--warning); font-size: 0.8rem; margin-bottom: 4px;">Direct image preview unavailable. Click below to view:</span>
          <a href="${url}" target="_blank" style="color: var(--primary); font-size: 0.9rem; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            Open Resource Link <i class="fa-solid fa-up-right-from-square" style="font-size: 0.75rem;"></i>
          </a>
        </div>
      </div>
    `;
  }
};

// Fetch Survey Configuration
async function loadSurveyConfig() {
  try {
    let data;
    if (USE_CLOUD_STORAGE) {
      const response = await fetch(`${FIREBASE_DB_URL}/config.json`);
      if (!response.ok) throw new Error('Failed to retrieve cloud Firebase survey config');
      data = await response.json();
    } else {
      const response = await fetch(`${API_BASE}/api/survey-config`);
      if (!response.ok) throw new Error('Failed to retrieve Express survey config');
      data = await response.json();
    }
    
    if (data && data.sections) {
      surveyConfig = data;
    } else {
      surveyConfig = defaultSurveyConfig;
    }
  } catch (err) {
    console.warn("Express/Firebase connection offline. Falling back to default offline configuration context.", err);
    surveyConfig = defaultSurveyConfig;
  }
  
  totalSectionsCount = surveyConfig.sections.length;
  
  // Set headers
  document.getElementById('survey-title-main').innerHTML = linkify(surveyConfig.title);
  document.getElementById('survey-subtitle-main').innerHTML = linkify(surveyConfig.description);
  document.getElementById('consent-body-text').innerHTML = linkify(surveyConfig.consentText);
  document.getElementById('survey-end-note-text').innerHTML = linkify(surveyConfig.endNote || "Thank you for participating in this study. Your response is valuable for understanding public awareness and detection of AI-generated media.");
}

// Handle Consent Page
btnConsentNext.addEventListener('click', () => {
  const selectedConsent = document.querySelector('input[name="consent-agreement"]:checked');
  const nameInput = document.getElementById('participant-name-input');
  
  if (!nameInput || !nameInput.value.trim()) {
    showToast('Please enter your Name or Anonymous Code identifier to proceed.', 'danger');
    return;
  }
  
  if (!selectedConsent) {
    showToast('Please specify whether you agree to participate in order to proceed.', 'danger');
    return;
  }
  
  if (selectedConsent.value === 'yes') {
    // Record participant name/ID into answers payload
    participantAnswers['participant_name'] = nameInput.value.trim();
    
    screenConsent.style.display = 'none';
    screenQuestions.style.display = 'block';
    progressWrapper.style.display = 'block';
    currentSectionIndex = 0;
    renderSection(currentSectionIndex);
  } else {
    screenConsent.style.display = 'none';
    screenDecline.style.display = 'block';
  }
});

// Render Section dynamically
function renderSection(index) {
  if (!surveyConfig || !surveyConfig.sections || index >= totalSectionsCount) return;
  
  const section = surveyConfig.sections[index];
  
  // Progress calculations
  const progressPercent = ((index + 1) / totalSectionsCount) * 100;
  progressBar.style.width = `${progressPercent}%`;
  
  // Build Section HTML Card
  const hasColon = section.title.includes(':');
  const tagText = hasColon ? section.title.split(':')[0].trim() : 'SURVEY SECTION';
  const titleText = hasColon ? section.title.split(':').slice(1).join(':').trim() : section.title;
  
  let html = `
    <div class="card" id="section-card-${section.id}">
      <div class="card-header">
        <span class="section-tag">${tagText}</span>
        <h1 class="card-title">${linkify(titleText)}</h1>
        <p class="card-description">${linkify(section.description)}</p>
      </div>
      <div class="card-body">
  `;
  
  // Render based on section type
  if (section.isMediaSection) {
    // Section E: AI Generated Media Items
    section.mediaItems.forEach((item, itemIdx) => {
      const savedVal = participantAnswers[item.id] || '';
      const savedConf = participantAnswers[`${item.id}_confidence`] || '';
      const savedHelped = participantAnswers[`${item.id}_helped`] || [];
      
      const mediaType = item.type || 'image';
      const isVideo = mediaType === 'video' || item.url.match(/\.(mp4|webm|ogg)$/i);
      const isYouTube = item.url.includes('youtube.com') || item.url.includes('youtu.be');
      
      // Transform Google Drive and Dropbox URLs to direct image/video links
      let processedUrl = item.url;
      if (processedUrl.includes('drive.google.com/file/d/')) {
        const match = processedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          processedUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
        }
      } else if (processedUrl.includes('dropbox.com/') && processedUrl.includes('?dl=0')) {
        processedUrl = processedUrl.replace('?dl=0', '?raw=1');
      }

      let mediaHtml = '';
      if (isYouTube) {
        let embedUrl = processedUrl;
        if (processedUrl.includes('watch?v=')) {
          const videoId = processedUrl.split('v=')[1].split('&')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (processedUrl.includes('youtu.be/')) {
          const videoId = processedUrl.split('youtu.be/')[1].split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (processedUrl.includes('/shorts/')) {
          const videoId = processedUrl.split('/shorts/')[1].split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        mediaHtml = `
          <div class="media-container" style="background: #000; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 25px; border: 1px solid var(--border-color); aspect-ratio: 16/9;">
            <iframe src="${embedUrl}" loading="lazy" style="width: 100%; height: 100%; border: none;" allowfullscreen id="iframe-asset-${item.id}"></iframe>
          </div>
        `;
      } else if (isVideo) {
        mediaHtml = `
          <div class="media-container" style="background: #000; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 25px; border: 1px solid var(--border-color); aspect-ratio: 16/9;">
            <video src="${processedUrl}" controls id="video-asset-${item.id}" style="width: 100%; height: 100%; object-fit: contain;"></video>
          </div>
        `;
      } else if (mediaType === 'link') {
        mediaHtml = `
          <div class="link-card" style="display: flex; align-items: center; gap: 20px; padding: 20px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 25px; transition: var(--transition);">
            <div style="width: 52px; height: 52px; border-radius: 12px; background: var(--primary-glow); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink:0;">
              <i class="fa-solid fa-link"></i>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-weight: 700; font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-primary);">${item.title}</span>
              <a href="${processedUrl}" target="_blank" style="color: var(--primary); font-size: 0.9rem; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                Open Resource Link <i class="fa-solid fa-up-right-from-square" style="font-size: 0.75rem;"></i>
              </a>
            </div>
          </div>
        `;
      } else {
        mediaHtml = `
          <!-- Media Display -->
          <div class="media-container">
            <img src="${processedUrl}" loading="lazy" alt="${item.title}" id="img-asset-${item.id}" onerror="handleImageError(this, '${item.title.replace(/'/g, "\\'")}', '${processedUrl.replace(/'/g, "\\'")}')">
            <button class="zoom-overlay-btn" onclick="openZoomModal('${processedUrl}', '${item.title.replace(/'/g, "\\'")}')">
              <i class="fa-solid fa-expand"></i> Fullscreen Toggle
            </button>
          </div>
        `;
      }

      html += `
        <div class="media-question-block" id="media-block-${item.id}" style="margin-bottom: 50px; padding-bottom: 40px; border-bottom: 1px dashed var(--border-color); transition: all 0.5s ease;">
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; margin-bottom: 15px; color: var(--primary);">
            Media Test Item #${itemIdx + 1}: ${item.title}
          </h3>
          
          ${mediaHtml}
          
          <!-- Q25: Classification -->
          <div class="form-group">
            <label class="question-text">
              <span class="question-num"></span> Is this image:
            </label>
            <div class="options-list">
              <label class="option-item ${savedVal === 'real' ? 'checked-item' : ''}" onclick="toggleOptionClass(this)">
                <input type="radio" name="${item.id}" value="real" ${savedVal === 'real' ? 'checked' : ''} onchange="saveAnswer('${item.id}', 'real')">
                <div class="custom-indicator"></div>
                <span class="option-label">Real</span>
              </label>
              <label class="option-item ${savedVal === 'ai' ? 'checked-item' : ''}" onclick="toggleOptionClass(this)">
                <input type="radio" name="${item.id}" value="ai" ${savedVal === 'ai' ? 'checked' : ''} onchange="saveAnswer('${item.id}', 'ai')">
                <div class="custom-indicator"></div>
                <span class="option-label">AI Generated</span>
              </label>
            </div>
          </div>
          
          <!-- Q26: Confidence -->
          <div class="form-group" style="margin-top: 25px;">
            <label class="question-text">
              <span class="question-num"></span> Confidence Level:
            </label>
            <div class="options-list" style="flex-direction: row; flex-wrap: wrap; gap: 8px;">
              ${["Very Uncertain", "Uncertain", "Neutral", "Confident", "Very Confident"].map((cOption, cIdx) => `
                <label class="option-item ${savedConf === cOption ? 'checked-item' : ''}" style="padding: 10px 16px; flex-grow: 1; justify-content: center;" onclick="toggleOptionClass(this)">
                  <input type="radio" name="${item.id}_confidence" value="${cOption}" ${savedConf === cOption ? 'checked' : ''} onchange="saveAnswer('${item.id}_confidence', '${cOption}')">
                  <div class="custom-indicator" style="margin-right: 8px;"></div>
                  <span class="option-label" style="font-size: 0.9rem;">${cOption}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    });
  } else {
    // Normal Section Questions
    section.questions.forEach((q, qIdx) => {
      const savedVal = participantAnswers[q.id] || '';
      
      html += `
        <div class="form-group" id="group-${q.id}">
          <label class="question-text">
            <span class="question-num">${q.number ? q.number + '.' : ''}</span> ${linkify(q.text)}
          </label>
      `;
      
      if (q.type === 'radio') {
        html += `<div class="options-list">`;
        q.options.forEach(opt => {
          const isChecked = savedVal === opt;
          html += `
            <label class="option-item ${isChecked ? 'checked-item' : ''}" onclick="toggleOptionClass(this)">
              <input type="radio" name="${q.id}" value="${opt}" ${isChecked ? 'checked' : ''} onchange="saveAnswer('${q.id}', '${opt.replace(/'/g, "\\'")}')">
              <div class="custom-indicator"></div>
              <span class="option-label">${opt}</span>
            </label>
          `;
        });
        html += `</div>`;
      } 
      else if (q.type === 'checkbox') {
        html += `<div class="options-list">`;
        q.options.forEach(opt => {
          const savedArr = participantAnswers[q.id] || [];
          const isChecked = savedArr.includes(opt);
          html += `
            <label class="option-item ${isChecked ? 'checked-item' : ''}" onclick="toggleOptionClass(this, true)">
              <input type="checkbox" name="${q.id}" value="${opt}" ${isChecked ? 'checked' : ''} onchange="saveCheckboxAnswer('${q.id}', '${opt.replace(/'/g, "\\'")}')">
              <div class="custom-indicator"></div>
              <span class="option-label">${opt}</span>
            </label>
          `;
        });
        html += `</div>`;
      }
      else if (q.type === 'likert5') {
        html += `
          <div class="likert-scale">
            ${[1, 2, 3, 4, 5].map(score => {
              const scoreVal = parseInt(savedVal);
              const isChecked = scoreVal === score;
              const textMap = {
                1: 'Strongly.Disagree',
                2: 'Disagree',
                3: 'Neutral',
                4: 'Agree',
                5: 'Strongly.Agree'
              };
              return `
                <label class="likert-option ${isChecked ? 'checked-likert' : ''}" onclick="toggleLikertClass(this)">
                  <input type="radio" name="${q.id}" value="${score}" ${isChecked ? 'checked' : ''} onchange="saveAnswer('${q.id}', ${score})">
                  <span class="likert-score">${score}</span>
                  <span class="likert-text">${textMap[score].split(' ')[0]}</span>
                </label>
              `;
            }).join('')}
          </div>
        `;
      }
      else if (q.type === 'likert5Freq') {
        html += `
          <div class="likert-scale">
            ${[1, 2, 3, 4, 5].map(score => {
              const scoreVal = parseInt(savedVal);
              const isChecked = scoreVal === score;
              const textMap = {
                1: 'Never',
                2: 'Rarely',
                3: 'Sometimes',
                4: 'Often',
                5: 'Always'
              };
              return `
                <label class="likert-option ${isChecked ? 'checked-likert' : ''}" onclick="toggleLikertClass(this)">
                  <input type="radio" name="${q.id}" value="${score}" ${isChecked ? 'checked' : ''} onchange="saveAnswer('${q.id}', ${score})">
                  <span class="likert-score">${score}</span>
                  <span class="likert-text">${textMap[score]}</span>
                </label>
              `;
            }).join('')}
          </div>
        `;
      }
      else if (q.type === 'textarea') {
        html += `
          <textarea class="text-input" placeholder="${q.placeholder || 'Write response...'}" oninput="saveAnswer('${q.id}', this.value)">${savedVal}</textarea>
        `;
      }
      
      html += `</div>`;
    });
  }
  
  html += `
      </div>
    </div>
  `;
  
  placeholderCard.innerHTML = html;
  
  // Navigation states
  btnPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
  
  if (index === totalSectionsCount - 1) {
    btnNext.innerHTML = 'Submit Survey <i class="fa-solid fa-paper-plane"></i>';
    btnNext.className = 'btn btn-success';
  } else {
    btnNext.innerHTML = 'Next Section <i class="fa-solid fa-arrow-right"></i>';
    btnNext.className = 'btn btn-primary';
  }
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Option Styling visual helper (Radio list)
window.toggleOptionClass = function(labelEl, isCheckbox = false) {
  if (!isCheckbox) {
    const siblingLabels = labelEl.parentElement.querySelectorAll('.option-item');
    siblingLabels.forEach(l => l.classList.remove('checked-item'));
  }
  
  // Brief delay to allow input to check
  setTimeout(() => {
    const input = labelEl.querySelector('input');
    if (input && input.checked) {
      labelEl.classList.add('checked-item');
    } else {
      labelEl.classList.remove('checked-item');
    }
  }, 50);
};

// Option Styling visual helper (Likert list)
window.toggleLikertClass = function(labelEl) {
  const siblings = labelEl.parentElement.querySelectorAll('.likert-option');
  siblings.forEach(s => s.classList.remove('checked-likert'));
  labelEl.classList.add('checked-likert');
};

// Save standard answer to in-memory state
window.saveAnswer = function(qId, val) {
  participantAnswers[qId] = val;
};

// Save checkbox multiple array answer
window.saveCheckboxAnswer = function(qId, val) {
  if (!participantAnswers[qId]) {
    participantAnswers[qId] = [];
  }
  
  const index = participantAnswers[qId].indexOf(val);
  if (index > -1) {
    participantAnswers[qId].splice(index, 1); // remove if checked off
  } else {
    participantAnswers[qId].push(val);
  }
};

// Open magnifying picture details
window.openZoomModal = function(url, title) {
  modalZoomImg.src = url;
  modalCaption.textContent = title;
  modalZoom.style.display = 'flex';
};

// Close modal zoom
modalCloseBtn.addEventListener('click', () => {
  modalZoom.style.display = 'none';
});
modalZoom.addEventListener('click', (e) => {
  if (e.target === modalZoom) {
    modalZoom.style.display = 'none';
  }
});

// Navigate back
btnPrev.addEventListener('click', () => {
  if (currentSectionIndex > 0) {
    currentSectionIndex--;
    renderSection(currentSectionIndex);
  }
});

// Navigate Next & Validate Section
btnNext.addEventListener('click', () => {
  if (!validateCurrentSection()) {
    showToast('Please answer all questions in this section before continuing.', 'danger');
    return;
  }
  
  if (currentSectionIndex < totalSectionsCount - 1) {
    currentSectionIndex++;
    renderSection(currentSectionIndex);
  } else {
    // End reached, Submit
    submitSurvey();
  }
});

// Question Validation
function validateCurrentSection() {
  const section = surveyConfig.sections[currentSectionIndex];
  let isValid = true;
  let firstInvalidElement = null;
  
  if (section.isMediaSection) {
    // Validate Section E: Each item must have classification, confidence, and helped options filled
    section.mediaItems.forEach(item => {
      const classification = participantAnswers[item.id];
      const confidence = participantAnswers[`${item.id}_confidence`];
      
      
      if (!classification || !confidence) {
        isValid = false;
        
        const grp = document.getElementById(`media-block-${item.id}`);
        if (grp) {
          if (!firstInvalidElement) firstInvalidElement = grp;
          
          grp.style.borderLeft = "4px solid var(--danger)";
          grp.style.paddingLeft = "15px";
          setTimeout(() => {
            grp.style.transition = "all 0.5s ease";
            grp.style.borderLeft = "none";
            grp.style.paddingLeft = "0";
          }, 3500);
        }
      }
    });
  } else {
    // Validate standard questions (Except optional ones, e.g. section_g)
    if (section.id === 'section_g') return true; // Section G is optional
    
    section.questions.forEach(q => {
      const answer = participantAnswers[q.id];
      if (answer === undefined || answer === '') {
        isValid = false;
        
        // Highlight visual container with standard CSS animation alert
        const grp = document.getElementById(`group-${q.id}`);
        if (grp) {
          if (!firstInvalidElement) firstInvalidElement = grp;
          
          grp.style.borderLeft = "4px solid var(--danger)";
          grp.style.paddingLeft = "15px";
          setTimeout(() => {
            grp.style.transition = "all 0.5s ease";
            grp.style.borderLeft = "none";
            grp.style.paddingLeft = "0";
          }, 3500);
        }
      }
    });
  }
  
  if (!isValid && firstInvalidElement) {
    // Scroll the first missing question into view smoothly
    firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  return isValid;
}

// Post response to Server
async function submitSurvey() {
  // Show standard loading UI
  placeholderCard.innerHTML = `
    <div class="card text-center" style="padding: 60px 40px;">
      <div class="loading-spinner"></div>
      <h2 style="font-family: var(--font-heading); margin-top: 20px;">Submitting Questionnaire</h2>
      <p style="color: var(--text-secondary); margin-top: 10px;">Please wait while we secure your responses in the database...</p>
    </div>
  `;
  btnPrev.style.display = 'none';
  btnNext.style.display = 'none';
  
  try {
    const payload = {
      answers: participantAnswers
    };
    
    // Generate unique academic record tracking parameters on the client
    payload.id = 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    payload.timestamp = new Date().toISOString();
    
    let response;
    if (USE_CLOUD_STORAGE) {
      response = await fetch(`${FIREBASE_DB_URL}/responses.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(`${API_BASE}/api/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }
    
    if (!response.ok) throw new Error('Submission server error');
    
    showToast('Survey responses submitted successfully!', 'success');
    
    // Redirect to End screen
    setTimeout(() => {
      progressWrapper.style.display = 'none';
      screenQuestions.style.display = 'none';
      screenEnd.style.display = 'block';
    }, 1000);
    
  } catch (err) {
    console.error(err);
    showToast('Failed to connect to the server. Please try submitting again.', 'danger');
    
    // Re-enable navigation
    btnPrev.style.display = 'block';
    btnNext.style.display = 'block';
    renderSection(currentSectionIndex);
  }
}

// Entry Point
document.addEventListener('DOMContentLoaded', () => {
  loadSurveyConfig();
});
