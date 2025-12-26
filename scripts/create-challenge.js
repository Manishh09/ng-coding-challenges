#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Delay for smoother UX
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Base path to challenge folder in monorepo
const BASE_PATH = path.join(__dirname, "../projects/coding-challenges/src/app/challenges");

// Helper: Get next challenge number
function getNextChallengeNumber() {
  if (!fs.existsSync(BASE_PATH)) return 1;
  const dirs = fs.readdirSync(BASE_PATH).filter((name) => /^challenge-\d+/.test(name));
  const numbers = dirs.map((name) => {
    const match = name.match(/^challenge-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

// Helper: Yes/No prompt
function askYesNo(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

// Main function
async function main() {
  rl.question("Enter the challenge name (e.g., product-list): ", async (inputName) => {
    if (!inputName.trim()) {
      console.log("❌ Challenge name is required!");
      rl.close();
      return;
    }

    const challengeNumber = getNextChallengeNumber();
    const paddedNum = String(challengeNumber).padStart(2, "0");
    const folderName = `challenge-${paddedNum}-${inputName.trim().toLowerCase().replace(/\s+/g, "-")}`;
    const challengePath = path.join(BASE_PATH, folderName);

    console.log(`\n⚙️  Creating challenge "${folderName}"...`);
    await wait(300);

    if (fs.existsSync(challengePath)) {
      console.log(`❌ Challenge "${folderName}" already exists. Please choose a different name.`);
      rl.close();
      return;
    }

    // Ask for optional folders
    const includeComponents = await askYesNo("➕ Include components folder?");
    const includeModels = await askYesNo("➕ Include models folder?");
    const includeServices = await askYesNo("➕ Include services folder?");
    await wait(300);

    const folders = ["docs"];
    if (includeComponents) folders.push("components");
    if (includeModels) folders.push("models");
    if (includeServices) folders.push("services");

    try {
      fs.mkdirSync(challengePath, { recursive: true });

      for (const folder of folders) {
        const folderPath = path.join(challengePath, folder);
        fs.mkdirSync(folderPath);
        console.log(`📁 Created folder: ${folder}`);
        await wait(200);
      }

      // Docs
      const docsPath = path.join(challengePath, "docs");

      console.log(`\n📝 Generating CH-${paddedNum}-REQUIREMENT.md...`);
      await wait(300);
      fs.writeFileSync(
        path.join(docsPath, `CH-${paddedNum}-REQUIREMENT.md`),
        `# Challenge ${paddedNum} - Requirement\n\nDescribe the problem for "${inputName}" here...`
      );
      console.log(`✅ CH-${paddedNum}-REQUIREMENT.md created.`);
      await wait(200);

      console.log(`\n📝 Generating CH-${paddedNum}-SOLUTION_GUIDE.md...`);
      await wait(300);
      fs.writeFileSync(
        path.join(docsPath, `CH-${paddedNum}-SOLUTION_GUIDE.md`),
        `# Challenge ${paddedNum} - Solution Guide\n\nExplain the solution for "${inputName}" here...`
      );
      console.log(`✅ CH-${paddedNum}-SOLUTION_GUIDE.md created.`);

      await wait(200);
      console.log(`\n🚀 Challenge "${folderName}" created successfully at:`);
      console.log(`   → ${challengePath}\n`);
    } catch (err) {
      console.error("❌ Error creating challenge:", err);
    }

    rl.close();
  });
}

// Start the script
main();
