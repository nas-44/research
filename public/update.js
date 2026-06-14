const fs = require('fs');
let code = fs.readFileSync('d:/Desktop/RESEARCH/survey/research/public/app.js', 'utf8');

const newConfig = {
  title: 'Academic Survey: AI-Generated Content Detection on Social Media',
  description: 'Academic Research Study',
  consentText: 'Hello,\nThis survey is conducted as part of an academic research study. The purpose of this study is to understand how people identify AI-generated images and videos on social media platforms.\n\nYour responses will remain confidential and used only for research purposes.\n\n⏳ Time required: 5–7 minutes',
  sections: [
    {
      id: 'section_a',
      title: 'SECTION A: Demographic Information',
      description: 'Please provide your demographic details.',
      questions: [
        { id: 'q1', type: 'radio', text: '1. Gender', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        { id: 'q2', type: 'radio', text: '2. Age', options: ['18–24', '25–34', '35–44', '45–54', '55+'] },
        { id: 'q3', type: 'radio', text: '3. Educational Qualification', options: ['Higher Secondary', 'Diploma', 'Undergraduate', 'Postgraduate', 'Other'] },
        { id: 'q4', type: 'radio', text: '4. Which platform do you use most frequently?', options: ['Instagram', 'Facebook', 'Both equally'] },
        { id: 'q5', type: 'radio', text: '5. Average daily social media use', options: ['Less than 1 hour', '1–2 hours', '3–4 hours', '5–6 hours', 'More than 6 hours'] }
      ]
    },
    {
      id: 'section_b',
      title: 'SECTION B: Digital Media Literacy',
      description: 'Indicate your level of agreement. (1 = Strongly Disagree, 5 = Strongly Agree)',
      questions: [
        { id: 'q6', type: 'likert5', text: 'Information Evaluation: I verify information before sharing it online.' },
        { id: 'q7', type: 'likert5', text: 'Information Evaluation: I compare information from multiple sources before believing it.' },
        { id: 'q8', type: 'likert5', text: 'Information Evaluation: I can identify unreliable online information.' },
        { id: 'q9', type: 'likert5', text: 'Information Evaluation: I pay attention to the source of information before trusting it.' },
        { id: 'q10', type: 'likert5', text: 'Platform Awareness: I understand that social media algorithms influence the content I see.' },
        { id: 'q11', type: 'likert5', text: 'Platform Awareness: I am aware that AI can generate realistic images and videos.' },
        { id: 'q12', type: 'likert5', text: 'Platform Awareness: I understand that visual content on social media may be manipulated.' },
        { id: 'q13', type: 'likert5', text: 'Critical Thinking: I question information that seems sensational or emotionally provocative.' },
        { id: 'q14', type: 'likert5', text: 'Critical Thinking: I look for evidence before accepting online claims.' },
        { id: 'q15', type: 'likert5', text: 'Critical Thinking: I critically evaluate visual content before believing it.' }
      ]
    },
    {
      id: 'section_c',
      title: 'SECTION C: Verification Behaviour',
      description: 'Frequency Scale (1 = Never, 5 = Always)',
      questions: [
        { id: 'q16', type: 'likert5Freq', text: 'I check the original source of a post.' },
        { id: 'q17', type: 'likert5Freq', text: 'I search online to verify suspicious images.' },
        { id: 'q18', type: 'likert5Freq', text: 'I read comments or discussions before trusting a post.' },
        { id: 'q19', type: 'likert5Freq', text: 'I use fact-checking websites or reverse image searches.' },
        { id: 'q20', type: 'likert5Freq', text: 'I verify information before reposting or sharing it.' }
      ]
    },
    {
      id: 'section_d',
      title: 'SECTION D: AI-Generated Content Exposure',
      description: 'Please answer the following regarding your exposure to AI-generated content.',
      questions: [
        { id: 'q21', type: 'radio', text: '16. Have you previously heard about AI-generated images or videos?', options: ['Yes', 'No'] },
        { id: 'q22', type: 'radio', text: '17. How often do you encounter AI-generated content on social media?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { id: 'q23', type: 'radio', text: '18. How confident are you in your ability to identify AI-generated images and videos?', options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'] }
      ]
    },
    {
      id: 'section_e',
      title: 'SECTION E: Detection Test',
      description: 'Look at each image/video shown and select your answer and confidence level.',
      isMediaSection: true,
      mediaItems: [
        { id: 'm1', type: 'image', title: 'Image 1', url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800', trueType: 'ai', description: 'Image 1 Placeholder' },
        { id: 'm2', type: 'image', title: 'Image 2', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800', trueType: 'real', description: 'Image 2 Placeholder' },
        { id: 'm3', type: 'image', title: 'Image 3', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800', trueType: 'ai', description: 'Image 3 Placeholder' },
        { id: 'm4', type: 'image', title: 'Image 4', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800', trueType: 'real', description: 'Image 4 Placeholder' },
        { id: 'm5', type: 'image', title: 'Image 5', url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800', trueType: 'ai', description: 'Image 5 Placeholder' },
        { id: 'v1', type: 'video', title: 'Video 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', trueType: 'ai', description: 'Video 1 Placeholder' },
        { id: 'v2', type: 'video', title: 'Video 2', url: 'https://www.w3schools.com/html/mov_bbb.mp4', trueType: 'real', description: 'Video 2 Placeholder' },
        { id: 'v3', type: 'video', title: 'Video 3', url: 'https://www.w3schools.com/html/mov_bbb.mp4', trueType: 'ai', description: 'Video 3 Placeholder' },
        { id: 'v4', type: 'video', title: 'Video 4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', trueType: 'real', description: 'Video 4 Placeholder' },
        { id: 'v5', type: 'video', title: 'Video 5', url: 'https://www.w3schools.com/html/mov_bbb.mp4', trueType: 'ai', description: 'Video 5 Placeholder' }
      ]
    }
  ]
};

code = code.replace(/const defaultSurveyConfig = \{[\s\S]*?\n\};\n/m, `const defaultSurveyConfig = ${JSON.stringify(newConfig, null, 2)};\n`);

// Remove helped validation
code = code.replace(/const helped = participantAnswers\[\`\$\{item\.id\}_helped\`\] \|\| \[\];/g, '');
code = code.replace(/if \(!classification \|\| !confidence \|\| helped\.length === 0\) \{/g, 'if (!classification || !confidence) {');

fs.writeFileSync('d:/Desktop/RESEARCH/survey/research/public/app.js', code);
console.log('Update complete');
