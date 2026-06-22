const fs = require('fs');
const responses = JSON.parse(fs.readFileSync('d:/Desktop/RESEARCH/survey/research/responses.json'));
const surveyConfig = JSON.parse(fs.readFileSync('d:/Desktop/RESEARCH/survey/research/survey_config.json'));

const mediaItems = surveyConfig.sections.find(s => s.isMediaSection).mediaItems;

let litSum = 0, adoptSum = 0, accSum = 0;
let litValid = 0, adoptValid = 0;

const testData = [];

responses.forEach(resp => {
    let correctCount = 0;
    mediaItems.forEach(item => {
        let truthMapped = item.trueType === "real" ? "Authentic" : "AI-Generated";
        if (resp.answers[item.id] === truthMapped) correctCount++;
    });
    let acc = (correctCount / mediaItems.length) * 100;
    
    let lCount = 0, lRow = 0;
    for (let q = 10; q <= 12; q++) {
        let score = parseInt(resp.answers[`q${q}`]);
        if (!isNaN(score)) { lRow += score; lCount++; }
    }
    let lit = lCount > 0 ? lRow / lCount : 0;

    let aCount = 0, aRow = 0;
    for (let q = 7; q <= 8; q++) {
        let score = parseInt(resp.answers[`q${q}`]);
        if (!isNaN(score)) { aRow += score; aCount++; }
    }
    let adopt = aCount > 0 ? aRow / aCount : 0;
    
    testData.push({ acc, lit, adopt, lCount, aCount, q1: resp.answers.q1 });
});

console.log("Sample 5 tests:");
console.log(testData.slice(0, 5));

// Compute alpha
console.log("Alpha Literacy (Q10-Q12):");
// ...

