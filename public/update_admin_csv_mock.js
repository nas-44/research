const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Rewrite CSV Exporter
const csvExportRegex = /btnExportCSV\.addEventListener\('click', \(\) => \{[\s\S]*?showAdminToast\('Data exported as CSV successfully\.', 'success'\);\n\}\);/;

const newCsvExport = `btnExportCSV.addEventListener('click', () => {
    if (responsesList.length === 0) {
      showAdminToast('No data available to export.', 'danger');
      return;
    }
    
    // Build Header Columns
    const headers = ['RespondentID', 'Timestamp', 'Q1_Age', 'Q2_Gender', 'Q3_District', 'Q4_Education', 'Q5_Platform', 'Q6_TimeSpend', 'Q7_Adoption_1', 'Q8_Adoption_2', 'Q9_Overconfidence', 'Q10_Literacy_1', 'Q11_Literacy_2', 'Q12_Literacy_3'];
    
    headers.push('Tech_Adoption_Score');
    headers.push('Media_Literacy_Score');
    
    // Section E media assets
    const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
    const mediaItems = mediaSection ? mediaSection.mediaItems : [];
    
    mediaItems.forEach(item => {
      headers.push("Media_" + item.id + "_Answer");
      headers.push("Media_" + item.id + "_Clue");
      headers.push("Media_" + item.id + "_Correct");
    });
    headers.push('AI_Detection_Accuracy_Rate');
    
    // Row content mapping
    let csvContent = "data:text/csv;charset=utf-8," + headers.map(h => "\\"" + h + "\\"").join(",") + "\\n";
    
    responsesList.forEach(resp => {
      const answers = resp.answers;
      const row = [];
      
      row.push(resp.id);
      row.push(resp.timestamp);
      
      for (let i = 1; i <= 12; i++) {
        row.push(answers["q" + i] || '');
      }
      
      let adoptionScore = 0;
      for (let i = 7; i <= 8; i++) adoptionScore += parseInt(answers["q" + i] || 0);
      row.push(adoptionScore);
      
      let literacyScore = 0;
      for (let i = 10; i <= 12; i++) {
        let val = answers["q" + i];
        let num = 0;
        if (val === 'Never') num = 1;
        if (val === 'Rarely') num = 2;
        if (val === 'Sometimes') num = 3;
        if (val === 'Often') num = 4;
        if (val === 'Always') num = 5;
        literacyScore += num;
      }
      row.push(literacyScore);
      
      let correctAnswers = 0;
      let totalMedia = 0;
      
      mediaItems.forEach(item => {
        totalMedia++;
        let ans = answers[item.id] || '';
        let clue = answers[item.id + "_clue"] || '';
        
        let truthMapped = item.trueType === "real" ? "Authentic" : "AI-Generated";
        let isCorrect = (ans === truthMapped);
        if (isCorrect) correctAnswers++;
        
        row.push(ans);
        row.push(clue.replace(/"/g, '""'));
        row.push(isCorrect ? '1' : '0');
      });
      
      const accuracyRate = totalMedia > 0 ? (correctAnswers / totalMedia) : 0;
      row.push(accuracyRate.toFixed(4));
      
      csvContent += row.map(v => "\\"" + String(v).replace(/"/g, '""') + "\\"").join(",") + "\\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "survey_data_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAdminToast('Data exported as CSV successfully.', 'success');
});`;

content = content.replace(csvExportRegex, newCsvExport);

// 2. Rewrite Mock Generator
const mockGenRegex = /btnGenerateMock\.addEventListener\('click', async \(\) => \{[\s\S]*?renderDescriptiveStatistics\(\);\n  \}\);\n\}\);/;

const newMockGen = `btnGenerateMock.addEventListener('click', async () => {
  btnGenerateMock.disabled = true;
  btnGenerateMock.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Injecting...';
  
  try {
    const mockResponses = [];
    const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
    
    const ages = ["Under 18 (Screen out / End Survey)", "18 - 25", "26 - 35", "36 - 50", "Above 50"];
    const genders = ["Male", "Female"];
    const districts = ["Kozhikode", "Malappuram", "Kannur", "Wayanad", "Palakkad", "Kasaragod"];
    const edus = ["High School / Plus Two", "Undergraduate (Degree)", "Postgraduate (PG)", "Professional Degree / Diploma"];
    
    const platforms = ["Instagram", "Facebook", "I use both equally"];
    const times = ["Less than 1 hour", "1 to 3 hours", "3 to 5 hours", "More than 5 hours"];
    const freqOpts = ["Never", "Rarely", "Sometimes", "Often", "Always"];
    
    const aiCluesArr = surveyConfig.aiClues && surveyConfig.aiClues.length ? surveyConfig.aiClues : ["Anatomy/Logic Errors", "Texture/Lighting Errors", "Movement Errors", "Guessed"];
    const authCluesArr = surveyConfig.authenticClues && surveyConfig.authenticClues.length ? surveyConfig.authenticClues : ["Natural Imperfections", "Logical Context", "Looked flawless"];

    for (let i = 0; i < 50; i++) {
      let isAstute = Math.random() > 0.5; // Defines if the user has high literacy
      
      const answers = {};
      
      // A: Demographics
      answers.q1 = ages[Math.floor(Math.random() * (ages.length - 1)) + 1]; // Skip Under 18
      answers.q2 = genders[Math.floor(Math.random() * genders.length)];
      answers.q3 = districts[Math.floor(Math.random() * districts.length)];
      answers.q4 = edus[Math.floor(Math.random() * edus.length)];
      
      // B: Behavior
      answers.q5 = platforms[Math.floor(Math.random() * platforms.length)];
      answers.q6 = times[Math.floor(Math.random() * times.length)];
      
      // C: Adoption
      answers.q7 = Math.floor(Math.random() * 3) + (isAstute ? 1 : 3) + ""; // 1-3 or 3-5
      answers.q8 = Math.floor(Math.random() * 3) + (isAstute ? 1 : 3) + "";
      answers.q9 = Math.floor(Math.random() * 3) + 3 + ""; // Often confident
      
      // D: Literacy
      answers.q10 = freqOpts[Math.floor(Math.random() * 3) + (isAstute ? 2 : 0)];
      answers.q11 = freqOpts[Math.floor(Math.random() * 3) + (isAstute ? 2 : 0)];
      answers.q12 = freqOpts[Math.floor(Math.random() * 3) + (isAstute ? 2 : 0)];
      
      // E: Media
      if (mediaSection && mediaSection.mediaItems) {
        mediaSection.mediaItems.forEach(item => {
          let truthMapped = item.trueType === "real" ? "Authentic" : "AI-Generated";
          let userGuess = "";
          
          if (isAstute) {
             userGuess = Math.random() > 0.2 ? truthMapped : (truthMapped === "Authentic" ? "AI-Generated" : "Authentic");
          } else {
             userGuess = Math.random() > 0.6 ? truthMapped : (truthMapped === "Authentic" ? "AI-Generated" : "Authentic");
          }
          
          answers[item.id] = userGuess;
          
          if (userGuess === "AI-Generated") {
             answers[item.id + "_clue"] = aiCluesArr[Math.floor(Math.random() * aiCluesArr.length)];
          } else {
             answers[item.id + "_clue"] = authCluesArr[Math.floor(Math.random() * authCluesArr.length)];
          }
        });
      }
      
      mockResponses.push({
        id: 'mock_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        answers: answers
      });
    }
    
    const response = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockResponses)
    });
    
    if (response.ok) {
      responsesList = await response.json();
      renderResponsesTable();
      renderDescriptiveStatistics();
      showAdminToast('50 Mock Responses injected successfully!', 'success');
    }
  } catch (err) {
    showAdminToast('Failed to inject mock data', 'danger');
  } finally {
    btnGenerateMock.disabled = false;
    btnGenerateMock.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--secondary);"></i> Inject 50 Samples';
    if (activeTab === 'tab-visual-charts') window.renderAllQuestionCharts();
  }
});`;

content = content.replace(mockGenRegex, newMockGen);

const tableHeaderRegex = /<th>A1_Age<\/th>[\s\S]*?<th>B10_FollowNews<\/th>/;
const newTableHeaders = "<th>Q1 Age</th><th>Q2 Gender</th><th>Q3 District</th><th>Q4 Education</th><th>Q5 Platform</th><th>Q6 Time</th>";
content = content.replace(tableHeaderRegex, newTableHeaders);

const tableRowRegex = /<td>\$\{resp\.answers\.q1 \|\| '18-21'\}<\/td>[\s\S]*?<td>\$\{resp\.answers\.q3 \|\| 'School'\}<\/td>/;
const newTableRow = "<td>${resp.answers.q1 || ''}</td><td>${resp.answers.q2 || ''}</td><td>${resp.answers.q3 || ''}</td><td>${resp.answers.q4 || ''}</td><td>${resp.answers.q5 || ''}</td><td>${resp.answers.q6 || ''}</td>";
content = content.replace(tableRowRegex, newTableRow);

fs.writeFileSync(path, content);
console.log('admin.js updated with new CSV Exporter and Mock Generator');
