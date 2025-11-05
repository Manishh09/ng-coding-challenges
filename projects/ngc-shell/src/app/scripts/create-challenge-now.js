#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BASE_PATH = path.join(__dirname, '../projects/ngc-shell/src/app/challenges');

// Helper: Get next challenge number
function getNextChallengeNumber() {
  if (!fs.existsSync(BASE_PATH)) return 1;
  const dirs = fs.readdirSync(BASE_PATH).filter(name => /^challenge-\d+/.test(name));
  const numbers = dirs.map(name => {
    const match = name.match(/^challenge-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

// Prompt user
rl.question('Enter the challenge name (e.g., product-list): ', (inputName) => {
  if (!inputName.trim()) {
    console.log('❌ Challenge name is required!');
    rl.close();
    return;
  }

  const challengeNumber = getNextChallengeNumber();
  const paddedNum = String(challengeNumber).padStart(2, '0');
  const folderName = `challenge-${paddedNum}-${inputName.trim().toLowerCase().replace(/\s+/g, '-')}`;
  const challengePath = path.join(BASE_PATH, folderName);

  // Check if folder exists
  if (fs.existsSync(challengePath)) {
    console.log(`❌ Challenge "${folderName}" already exists. Please create a unique one.`);
    rl.close();
    return;
  }

  // Create folder structure
  const folders = ['components', 'models', 'services', 'docs'];
  try {
    fs.mkdirSync(challengePath, { recursive: true });
    folders.forEach(folder => fs.mkdirSync(path.join(challengePath, folder)));

    // Create markdown files
    const docsPath = path.join(challengePath, 'docs');
    fs.writeFileSync(
      path.join(docsPath, `CH-${paddedNum}-REQUIREMENT.md`),
      `# Challenge ${paddedNum} - Requirement\n\nDescribe the problem for "${inputName}" here...`
    );
    fs.writeFileSync(
      path.join(docsPath, `CH-${paddedNum}-SOLUTION_GUIDE.md`),
      `# Challenge ${paddedNum} - Solution Guide\n\nExplain the solution for "${inputName}" here...`
    );

    console.log(`✅ Challenge "${folderName}" created successfully at:`);
    console.log(`   → ${challengePath}`);
  } catch (err) {
    console.error('❌ Error creating challenge:', err);
  }

  rl.close();
});
