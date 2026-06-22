const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let content = fs.readFileSync(path, 'utf8');

// Find the start of window.renderAllQuestionCharts
const startIndex = content.indexOf('window.renderAllQuestionCharts = function() {');
if (startIndex === -1) {
    console.error("Could not find window.renderAllQuestionCharts");
    process.exit(1);
}

const updatedLogic = `window.renderAllQuestionCharts = function() {
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
    if (section.isMediaSection) return;
    
    section.questions.forEach(q => {
      const frequencies = {};
      let options = q.options || [];
      if (!options.length && q.type.startsWith('likert5')) {
          options = ["1", "2", "3", "4", "5"];
      }
      options.forEach(opt => frequencies[opt] = 0);
      
      responsesList.forEach(resp => {
        let ans = resp.answers[q.id];
        if (ans) {
          if (frequencies[ans] !== undefined) frequencies[ans]++;
          else frequencies[ans] = 1;
        }
      });
      
      questionData.push({
          id: q.id,
          title: q.text,
          type: 'standard',
          labels: Object.keys(frequencies),
          data: Object.values(frequencies)
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
              let truthMapped = item.trueType === "real" ? "Authentic" : "AI-Generated";
              if (resp.answers[item.id] === truthMapped) accFreq["Correctly Identified"]++;
              else accFreq["Failed to Identify"]++;
              
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
          <div class="chart-card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1; padding-right: 15px;">
              <h3 class="chart-card-title" style="font-size: 1rem; line-height: 1.4;">\${qd.title}</h3>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="downloadChart('\${qd.id}', '\${qd.title.replace(/'/g, "\\'")}')" title="Download for Word/Docs" style="padding: 5px 10px; font-size: 0.75rem; flex-shrink: 0;">
              <i class="fa-solid fa-download"></i> Save Image
            </button>
          </div>
          <div class="chart-wrapper" style="height: 300px; padding-bottom: 20px; background: white; border-radius: 8px;">
            <canvas id="chart-dyn-\${qd.id}"></canvas>
          </div>
        </div>
      \`;
  });
  
  container.innerHTML = html;
  
  // Inline plugin to draw percentages directly onto the Pie chart slices
  const piePercentagePlugin = {
      id: 'piePercentage',
      afterDraw: (chart) => {
          if (chart.config.type !== 'pie') return;
          const ctx = chart.ctx;
          chart.data.datasets.forEach((dataset, i) => {
              chart.getDatasetMeta(i).data.forEach((element, index) => {
                  const dataVal = dataset.data[index];
                  const total = dataset.data.reduce((a, b) => a + b, 0);
                  if (total === 0 || dataVal === 0) return;
                  
                  const percentage = ((dataVal / total) * 100).toFixed(1) + '%';
                  
                  ctx.fillStyle = '#ffffff'; // White text on colored pie slices
                  ctx.font = 'bold 15px sans-serif';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  
                  // Calculate the position using tooltipPosition
                  const position = element.tooltipPosition();
                  
                  // Add a subtle drop shadow to text so it's readable if slice is light
                  ctx.shadowColor = "rgba(0,0,0,0.5)";
                  ctx.shadowBlur = 4;
                  ctx.fillText(percentage, position.x, position.y);
                  
                  // Reset shadow
                  ctx.shadowBlur = 0;
              });
          });
      }
  };
  
  // Render Chart.js - Optimized for MS Word
  const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim();
  const secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary').trim();
  const accentColor = getComputedStyle(document.body).getPropertyValue('--accent').trim();
  
  const colors = [primaryColor, secondaryColor, accentColor, '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
  const textColor = '#111827'; 
  const gridColor = 'rgba(0,0,0,0.1)'; 
  
  questionData.forEach(qd => {
      const ctx = document.getElementById(\`chart-dyn-\${qd.id}\`);
      if (!ctx) return;
      
      let chartType = 'bar';
      let chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: { display: false }
          },
          scales: {
              y: { 
                 beginAtZero: true, 
                 grid: { color: gridColor }, 
                 ticks: { color: textColor, font: { size: 12, weight: '500' } } 
              },
              x: { 
                 grid: { display: false }, 
                 ticks: { color: textColor, font: { size: 11, weight: '600' }, maxRotation: 45, minRotation: 45 } 
              }
          }
      };
      
      let backgroundColors = [primaryColor];
      let chartPlugins = [];
      
      if (qd.type === 'media_acc') {
          chartType = 'pie';
          backgroundColors = [
              qd.data[0] > qd.data[1] ? primaryColor : secondaryColor, 
              qd.data[1] > qd.data[0] ? '#ef4444' : '#f87171' 
          ];
          chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: { position: 'right', labels: { color: textColor, font: { size: 13, weight: '600' } } }
              }
          };
          // Register the percentage plugin only for pie charts
          chartPlugins = [piePercentagePlugin];
      } else {
          backgroundColors = qd.labels.map((_, i) => colors[i % colors.length]);
      }
      
      const newChart = new Chart(ctx, {
          type: chartType,
          data: {
              labels: qd.labels.map(l => l.length > 25 ? l.substring(0, 25) + '...' : l), 
              datasets: [{
                  label: 'Responses',
                  data: qd.data,
                  backgroundColor: backgroundColors,
                  borderWidth: 1,
                  borderColor: '#ffffff',
                  borderRadius: chartType === 'bar' ? 4 : 0
              }]
          },
          options: chartOptions,
          plugins: chartPlugins
      });
      
      window.allQuestionCharts.push(newChart);
  });
};

// Global Download Function for dynamic charts
window.downloadChart = function(id, title) {
    const canvas = document.getElementById(\`chart-dyn-\${id}\`);
    if (!canvas) return;
    
    // Create an offscreen canvas to apply a solid white background
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const ctx = offscreen.getContext('2d');
    
    // Fill white background for publication standard contrast
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    
    // Draw the chart on top
    ctx.drawImage(canvas, 0, 0);
    
    const link = document.createElement('a');
    // Clean up title for filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    link.download = \`Figure_\${safeTitle}.png\`;
    link.href = offscreen.toDataURL('image/png', 1.0);
    link.click();
    
    if (typeof showAdminToast === 'function') {
      showAdminToast('Chart downloaded successfully as PNG for MS Word!', 'success');
    }
};
`;

const newContent = content.substring(0, startIndex) + updatedLogic;
fs.writeFileSync(path, newContent);
console.log('admin.js updated with pie chart percentages');
