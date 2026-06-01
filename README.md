# 🎓 AI-Generated Content Detection Survey & CMS Dashboard
### *A High-Fidelity Academic Research and Statistical Analytics Suite for Journalism and Mass Communication MA Dissertations*

---

## 📘 Project Overview

This is a comprehensive, full-stack survey and Content Management System (CMS) custom-tailored for research on **"Detection of AI-Generated Images and Videos on Social Media"**. 

It is designed to address two major requirements for a Master of Arts (MA) level dissertation:
1. **Interactive Participant Survey Interface (`index.html`)**: A gorgeous, glassmorphism-themed, multi-step questionnaire that guides respondents smoothly through informed consent and Sections A to G. It includes an interactive media magnifier (zoom modal) for high-resolution visual analysis of AI assets.
2. **Google Forms-style Admin CMS (`admin.html`)**: A robust portal enabling real-time adjustments to questions, options, and test media items.
3. **Advanced Dissertation Statistical Center**: On-the-fly math engines in Javascript running multivariate statistical checks, psychometric diagnostics, and visual correlations—perfect for copying directly into a Master's thesis.

---

## 📊 The MA-Level Dissertation Statistical Arsenal

For a Master’s Thesis in Journalism and Mass Communication, descriptive percentages are rarely sufficient. This system automatically calculates and reports advanced quantitative diagnostics:

### 1. Psychometric Scale Reliability (Cronbach's Alpha $\alpha$)
* **What it is**: A measure of internal consistency reliability for Likert scale indexes (Section C: Digital Media Literacy, 8 items; Section D: Technology Adoption, 6 items). It mathematically verifies if the questions consistently measure the exact same latent concept.
* **The Mathematics**:
  $$\alpha = \frac{K}{K - 1} \left(1 - \frac{\sum s_i^2}{s_X^2}\right)$$
  Where $K$ is the item count, $s_i^2$ is the variance of individual item $i$, and $s_X^2$ is the variance of the cumulative scale sum.
* **Interpretation**: An $\alpha \ge 0.70$ is the standard academic threshold for acceptable scale coherence. The CMS calculates this on-the-fly, auto-correcting for **reverse-coded questions** (Q23 and Q24), and gives a text analysis explaining if the construct meets scholarship criteria.

### 2. Bivariate Contingency Matrices & Chi-Square Significance ($\chi^2$)
* **What it is**: Cross-tabulating demographic independent variables (Age, Gender, Education, Field) against empirical AI detection accuracy categories (Low $<50\%$, Moderate $50\text{--}75\%$, High $>75\%$).
* **Statistical Significance**: Performs a **Pearson Chi-Square Test of Independence** with custom p-value estimation:
  $$\chi^2 = \sum \frac{(O - E)^2}{E}$$
  Where $O$ is observed cell counts, and $E$ is expected counts under the Null Hypothesis ($H_0$).
* **Interpretation**: If $p < 0.05$, we reject $H_0$ and prove a statistically robust relationship between a participant's background and their AI spotting ability. The CMS prints a fully formatted scientific commentary based on the active dataset!

### 3. Pearson Correlation Scatter & Regression ($r$)
* **What it is**: Analyzing whether higher self-reported Digital Media Literacy (Section C) mathematically correlates with superior empirical accuracy in identifying synthetic assets (Section E).
* **Visualization**: Plots participants as individual points in an interactive scatter chart, calculates **Pearson's r**, and superimposes a calculated **linear regression trendline** ($y = mx + b$).
* **Interpretation**: Tells you the exact Pearson $r$ coefficient, demonstrating whether the research hypothesis holds statistical validity.

### 4. Diffusion of Innovations (DOI) Profiling
* **What it is**: Categorizing participants based on Everett Rogers' classic sociological curve using their Section D scores.
* **Profiling Curves**: Classifies respondents into **Innovators**, **Early Adopters**, **Early Majority**, **Late Majority**, and **Laggards**, rendering a gorgeous bell curve showing where your active participant cohort lies.

---

## 🛠️ Step-by-Step Guide to Run Locally (Windows)

The system is built on a light, zero-compilation **Express + Vanilla SPA** stack. It uses Node.js's built-in file system (`fs`) to read and write database records as clean JSON files (`survey_config.json` and `responses.json`). There are no complex SQL databases, Docker setups, or compilers required.

### 1. Initialize Project Directory
Ensure all workspace files are in place in `d:\Desktop\RESEARCH\survey`.

### 2. Install Node.js Dependencies
Open your PowerShell or Command Prompt, navigate to the folder, and run:
```powershell
npm install
```
*This installs `express` and `cors`.*

### 3. Start the Server
Run the local survey host:
```powershell
node server.js
```

You will see the confirmation screen in the console:
```text
=======================================================
 SURVEY & CMS SERVER IS RUNNING
 View Survey: http://localhost:3000
 View CMS Dashboard: http://localhost:3000/admin.html
=======================================================
```

---

## 🧙‍♂️ How to Use the Administration CMS

1. **Accessing the CMS**: Navigate to `http://localhost:3000/admin.html` in your browser.
2. **Injecting Sample Data (Highly Recommended First Step)**:
   * A blank survey database means empty charts and zero-variance math. 
   * Click **"Inject 50 Samples"** in the left sidebar.
   * This immediately populates your database with 50 high-fidelity, randomized respondent sheets. The generator builds distinct theoretical sub-profiles (e.g., highly literate, tech-savvy youth with high detection success rates versus traditional older users with lower success rates) so your **Chi-Square, Cronbach's Alpha, and Pearson Correlation Scatter plots immediately populate with realistic, statistically beautiful trends** for your presentations and writing.
3. **Form Customization (Google Forms style)**:
   * Go to **"Form Builder & Editor"**.
   * Change the Survey Title, University Subtitle, or consent agreement text. Click **"Save Settings"**.
   * Manage Section E assets: Add a new image test, input its URL, specify the ground-truth classification ("AI-Generated" or "Real"), add a description, and record its physical anomalies. Click **"Save Media Configuration"**.
   * *The participant frontend (`index.html`) is fully dynamic and will update its screens instantly on reload.*
4. **Data Audits**:
   * Under **"Response Database"**, view all participant rows.
   * Click **"Inspect Sheet"** on any row to open a full digital response sheet of that respondent, highlighting their correct/incorrect answers in green/red, and detailing their open-ended inputs.
   * Click **"Export to CSV"** to download a beautifully formatted `.csv` spreadsheet. The exported spreadsheet calculates scale means, reverse-codes Likert scores, and formats binary correctness vectors—making it 100% ready for immediate drag-and-drop import into **SPSS, Excel, or R studio**.

---

## 📂 File Architecture
```text
survey/
├── package.json          # Node dependencies definition
├── server.js             # Express API Server and Mock Responses Generator
├── survey_config.json    # Created dynamically on first boot - holds survey config
├── responses.json        # Created dynamically on submission - holds response database
└── public/
    ├── index.html        # Elegant multi-step participant questionnaire
    ├── admin.html        # Advanced statistical analysis CMS dashboard
    ├── style.css         # Custom Indigo-Slate glassmorphic UI stylesheet
    ├── app.js            # Frontend questionnaire navigation and submission JS
    └── admin.js          # Cronbach, Chi-Square, Pearson, and Form editor engine JS
```

This system has been constructed following elite web standards: SEO optimization, unique identifiers for validation testing, semantic HTML5 tags, elegant micro-animations, and full responsiveness on mobile screens. Happy research!
