const https = require('https');
const fs = require('fs');

const FIREBASE_DB_URL = 'https://research-344f8-default-rtdb.asia-southeast1.firebasedatabase.app';
const configPath = 'd:/Desktop/RESEARCH/survey/research/survey_config.json';
const configData = fs.readFileSync(configPath, 'utf8');

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
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data ? JSON.parse(data) : null);
          } else {
            reject(new Error(`HTTP Error ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (e) => reject(e));

      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function initCloud() {
  try {
    console.log('Pushing local config to Firebase...');
    await cloudFetch(`${FIREBASE_DB_URL}/config.json`, {
      method: 'PUT',
      body: configData
    });
    
    console.log('Pushing empty responses array to Firebase...');
    await cloudFetch(`${FIREBASE_DB_URL}/responses.json`, {
      method: 'PUT',
      body: '[]'
    });
    
    console.log('Initialization complete!');
  } catch(err) {
    console.error('Initialization failed:', err);
  }
}

initCloud();
