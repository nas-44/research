const fs = require('fs');
const path = 'd:/Desktop/RESEARCH/survey/research/public/admin.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Insert Sidebar Button
const sidebarButton = `
      <button class="sidebar-tab" data-tab="tab-visual-charts">
        <i class="fa-solid fa-chart-bar"></i> Visual Question Charts
      </button>`;

if (!content.includes('data-tab="tab-visual-charts"')) {
    content = content.replace(
        /<button class="sidebar-tab" data-tab="tab-database">[\s\S]*?<\/button>/,
        match => match + sidebarButton
    );
}

// 2. Insert Section
const newSection = `
      <!-- 5. VISUAL QUESTION CHARTS TAB -->
      <section id="tab-visual-charts" class="tab-content" style="display: none;">
        <div class="card-header">
          <span class="section-tag">Empirical Data Visualizations</span>
          <h1 class="card-title">Survey Question Visualizations</h1>
          <p class="card-description">Frequency distributions and detailed breakdown charts for every individual question and media test item in your study.</p>
        </div>
        
        <div id="all-questions-charts-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px;">
          <!-- Charts will be dynamically generated here -->
        </div>
      </section>
`;

if (!content.includes('id="tab-visual-charts"')) {
    content = content.replace(
        /<\/main>/,
        match => newSection + '\n    ' + match
    );
}

fs.writeFileSync(path, content);
console.log('admin.html updated successfully.');
