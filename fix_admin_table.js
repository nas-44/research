const fs = require('fs');

const adminJsPath = 'd:/Desktop/RESEARCH/survey/research/public/admin.js';
let adminJs = fs.readFileSync(adminJsPath, 'utf8');

const regex = /<td>\$\{resp\.answers\.q1 \|\| ''\}<\/td><td>\$\{resp\.answers\.q2 \|\| ''\}<\/td><td>\$\{resp\.answers\.q3 \|\| ''\}<\/td><td>\$\{resp\.answers\.q4 \|\| ''\}<\/td><td>\$\{resp\.answers\.q5 \|\| ''\}<\/td><td>\$\{resp\.answers\.q6 \|\| ''\}<\/td>/g;

const replacement = "<td>${resp.answers.q1 || ''}</td><td>${resp.answers.q2 || ''}</td><td>${resp.answers.q4 || ''}</td>";

if (adminJs.match(regex)) {
  adminJs = adminJs.replace(regex, replacement);
  fs.writeFileSync(adminJsPath, adminJs);
  console.log("Successfully fixed table alignment in admin.js");
} else {
  console.log("Could not find the old row HTML in admin.js. Ensure string matches exactly.");
}
