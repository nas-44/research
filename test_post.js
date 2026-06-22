const http = require('http');

const payload = JSON.stringify({
  answers: {
    q1: "18-24",
    q2: "Male",
    q3: "Kozhikode",
    q4: "Undergraduate",
    q5: "Instagram",
    q6: "1 to 3 hours",
    q7: "4",
    q8: "4",
    q9: "5",
    q10: "3",
    q11: "4",
    q12: "4",
    m1: "AI-Generated",
    m1_clue: "Anatomy/Logic Errors"
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/responses',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Response:', data));
});

req.on('error', (e) => console.error('Error:', e));
req.write(payload);
req.end();
