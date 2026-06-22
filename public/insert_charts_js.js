const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add array to store chart instances globally so we can destroy them
if (!content.includes('window.allQuestionCharts = [];')) {
    content = content.replace(/let chartBell = null;/, "let chartBell = null;\nwindow.allQuestionCharts = [];");
}

// 2. Add to Tab Routing
if (!content.includes("else if (activeTab === 'tab-visual-charts')")) {
    content = content.replace(
        /else if \(activeTab === 'tab-database'\) \{\s*renderResponsesTable\(\);\s*\}/,
        `else if (activeTab === 'tab-database') {
      renderResponsesTable();
    } else if (activeTab === 'tab-visual-charts') {
      if (typeof window.renderAllQuestionCharts === 'function') window.renderAllQuestionCharts();
    }`
    );
}

// 3. Add the logic for renderAllQuestionCharts
const chartLogic = `
// ==========================================
// VISUAL QUESTION CHARTS TAB ENGINE
// ==========================================
window.renderAllQuestionCharts = function() {
  const container = document.getElementById('all-questions-charts-container');
  if (!container) return;
  
  if (responsesList.length === 0 || !surveyConfig) {
    container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 50px;">Awaiting dataset... Generate mock responses first.</div>';
    return;
  }
  
  // Clear previous canvases and charts
  window.allQuestionCharts.forEach(c => c.destroy());
  window.allQuestionCharts = [];
  container.innerHTML = '';
  
  let html = '';
  const questionData = [];
  
  // 1. Process Standard Sections
  surveyConfig.sections.forEach(section => {
    if (section.isMediaSection) return; // Handle media separately
    
    section.questions.forEach(q => {
      // Tally frequencies
      const frequencies = {};
      
      let options = q.options || [];
      if (!options.length && q.type.startsWith('likert5')) {
          options = ["1", "2", "3", "4", "5"];
      }
      
      options.forEach(opt => frequencies[opt] = 0);
      
      responsesList.forEach(resp => {
        let ans = resp.answers[q.id];
        if (ans) {
          if (frequencies[ans] !== undefined) {
             frequencies[ans]++;
          } else {
             frequencies[ans] = 1;
          }
        }
      });
      
      const labels = Object.keys(frequencies);
      const data = Object.values(frequencies);
      
      questionData.push({
          id: q.id,
          title: q.text,
          type: 'standard',
          labels,
          data
      });
    });
  });
  
  // 2. Process Media Section
  const mediaSection = surveyConfig.sections.find(s => s.isMediaSection);
  if (mediaSection && mediaSection.mediaItems) {
      mediaSection.mediaItems.forEach((item, idx) => {
          const accFreq = { "Correctly Identified": 0, "Failed to Identify": 0 };
          const clueFreq = {};
          const possibleClues = [
            "Physical mistakes (e.g., weird fingers, extra limbs, bad teeth)",
            "Background mistakes or unreadable/gibberish text",
            "Unnatural perfect lighting, 'plastic-like' skin, or excessive gloss",
            "It looked completely natural, flawless, and real to me.",
            "I didn't see any specific clue; I just guessed."
          ];
          possibleClues.forEach(c => clueFreq[c] = 0);
          
          responsesList.forEach(resp => {
              // Accuracy
              let truthMapped = item.trueType === "real" ? "Authentic" : "AI-Generated";
              if (resp.answers[item.id] === truthMapped) accFreq["Correctly Identified"]++;
              else accFreq["Failed to Identify"]++;
              
              // Clues
              let clue = resp.answers[\`\${item.id}_clue\`];
              if (clue) {
                 if (clueFreq[clue] !== undefined) clueFreq[clue]++;
                 else clueFreq[clue] = 1;
              }
          });
          
          questionData.push({
              id: \`media_acc_\${item.id}\`,
              title: \`Item \${idx + 1}: \${item.title} (Accuracy)\`,
              type: 'media_acc',
              labels: Object.keys(accFreq),
              data: Object.values(accFreq)
          });
          
          questionData.push({
              id: \`media_clue_\${item.id}\`,
              title: \`Item \${idx + 1}: \${item.title} (Clues Relied Upon)\`,
              type: 'media_clue',
              labels: Object.keys(clueFreq),
              data: Object.values(clueFreq)
          });
      });
  }
  
  // Render HTML structure
  questionData.forEach(qd => {
      html += \`
        <div class="chart-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title" style="font-size: 1rem; line-height: 1.4;">\${qd.title}</h3>
            </div>
          </div>
          <div class="chart-wrapper" style="height: 300px; padding-bottom: 20px;">
            <canvas id="chart-dyn-\${qd.id}"></canvas>
          </div>
        </div>
      \`;
  });
  
  container.innerHTML = html;
  
  // Render Chart.js
  const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim();
  const secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary').trim();
  const accentColor = getComputedStyle(document.body).getPropertyValue('--accent').trim();
  const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();
  const gridColor = 'rgba(255,255,255,0.05)';
  
  const colors = [primaryColor, secondaryColor, accentColor, '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
  
  questionData.forEach(qd => {
      const ctx = document.getElementById(\`chart-dyn-\${qd.id}\`);
      if (!ctx) return;
      
      // Decide if it should be a pie chart or bar chart
      // We will use Bar chart generally, but Pie chart for Media Accuracy
      let chartType = 'bar';
      let chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: { display: false }
          },
          scales: {
              y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
              x: { grid: { display: false }, ticks: { color: textColor, maxRotation: 45, minRotation: 45 } }
          }
      };
      
      let backgroundColors = [primaryColor];
      
      if (qd.type === 'media_acc') {
          chartType = 'pie';
          backgroundColors = [
              qd.data[0] > qd.data[1] ? primaryColor : secondaryColor, // Dynamic coloring based on success
              qd.data[1] > qd.data[0] ? '#ef4444' : '#f87171' 
          ];
          chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: { position: 'right', labels: { color: textColor } }
              }
          };
      } else {
          // For regular bars, color them uniquely
          backgroundColors = qd.labels.map((_, i) => colors[i % colors.length]);
      }
      
      const newChart = new Chart(ctx, {
          type: chartType,
          data: {
              labels: qd.labels.map(l => l.length > 25 ? l.substring(0, 25) + '...' : l), // Truncate long labels for X axis
              datasets: [{
                  label: 'Responses',
                  data: qd.data,
                  backgroundColor: backgroundColors,
                  borderWidth: 0,
                  borderRadius: chartType === 'bar' ? 4 : 0
              }]
          },
          options: chartOptions
      });
      
      window.allQuestionCharts.push(newChart);
  });
};
`;

if (!content.includes('window.renderAllQuestionCharts = function()')) {
    content += '\n' + chartLogic;
}

fs.writeFileSync(path, content);
console.log('admin.js updated with dynamic charts engine successfully.');
