const fs = require('fs');
const https = require('https');

const FIREBASE_DB_URL = 'https://research-344f8-default-rtdb.asia-southeast1.firebasedatabase.app';
const configJson = fs.readFileSync('d:/Desktop/RESEARCH/survey/research/survey_config.json', 'utf8');

const req = https.request(`${FIREBASE_DB_URL}/config.json`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(configJson)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Firebase sync complete. Status:', res.statusCode);
  });
});

req.on('error', (e) => {
  console.error('Error syncing to Firebase:', e);
});

req.write(configJson);
req.end();
