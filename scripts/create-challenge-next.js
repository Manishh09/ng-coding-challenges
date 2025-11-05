#!/usr/bin/env node

/**
 * screate-challenge-next.js
 * ----------------------
 * Usage: node create-challenge-next.js
 *
 * Interactively scaffolds a challenge inside an existing Angular app category.
 *
 * Auto-prefixes challenge numbers (challenge-01, challenge-02, ...)
 * Creates CH-XX-SOLUTION-GUIDE.md and CH-XX-REQUIREMENT-GUIDE.md under /docs
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");
const rootDir = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) =>
    rl.question(question, (answer) => resolve(answer.trim()))
  );
}

// Helper: Yes/No prompt
function askYesNo(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

const isKebabCase = (str) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);

// Delay for smoother UX
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Scans all challenge folders under all categories
 * and returns the next challenge number (padded 2 digits).
 */
function getNextChallengeNumber() {
  const projectsPath = path.join(rootDir, "projects");
  if (!fs.existsSync(projectsPath)) return "01";

  let maxNum = 0;

  const categories = fs
    .readdirSync(projectsPath)
    .filter((dir) =>
      fs.existsSync(path.join(projectsPath, dir, "src", "app", "challenges"))
    );

  for (const category of categories) {
    const challengesPath = path.join(
      projectsPath,
      category,
      "src",
      "app",
      "challenges"
    );

    const challenges = fs
      .readdirSync(challengesPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const challenge of challenges) {
      const match = challenge.match(/^challenge-(\d{2})/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
  }

  const nextNum = (maxNum + 1).toString().padStart(2, "0");
  return nextNum;
}

async function main() {
  let category = "";

  // List available categories
  const projectsPath = path.join(rootDir, "projects");

  const availableCategories = fs
    .readdirSync(projectsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (availableCategories.length === 0) {
    console.log("❌ No categories found under 'projects/'.");
    process.exit(1);
  }

  console.log("\n📦 Available App Categories:");
  // exclude 'ngc-shell' since it is main app
  const filteredCategories = availableCategories.filter(cat => cat !== 'ngc-shell');
  for (const cat of filteredCategories) {
    console.log(`   - ${cat}`);
  }

  console.log("\nNote: 'ngc-shell' is the main app responsible for controlling the overall application.\n");

  // Prompt for category (validate kebab-case and existence)
  while (true) {
    category = await prompt("Enter the category app name: ");
    if (!isKebabCase(category)) {
      console.log("❌ Must be in kebab-case. Try again.");
      continue;
    }

    const categoryPath = path.join(rootDir, "projects", category);
    if (!fs.existsSync(categoryPath)) {
      console.log(
        `❌ Category '${category}' not found in projects/. Try again.`
      );
    } else {
      break;
    }
  }

  // Prompt for challenge name
  let challengeName = "";
  while (true) {
    challengeName = await prompt("Enter challenge name (kebab-case): ");
    if (isKebabCase(challengeName)) break;
    console.log("❌ Challenge name must be in kebab-case.");
  }

  // Get next challenge number
  const challengeNum = getNextChallengeNumber();
  const fullChallengeName = `challenge-${challengeNum}-${challengeName}`;

  // Prompt for components & services
  const componentsInput = await prompt(
    "Enter component names (comma-separated): "
  );
  const servicesInput = await prompt("Enter service names (comma-separated): ");

  const components = componentsInput
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const services = servicesInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Base path for challenge
  const basePath = path.join(
    "projects",
    category,
    "src",
    "app",
    "challenges",
    fullChallengeName
  );
  fs.mkdirSync(basePath, { recursive: true });

  // Generate Angular components
  for (const comp of components) {
    const cmd = `ng generate component challenges/${fullChallengeName}/components/${comp} --project=${category} --standalone`;
    console.log(`\n⚙️  Generating component: ${comp}`);
    execSync(cmd, { stdio: "inherit" });
    await wait(500);
  }

  // Generate Angular services
  for (const serv of services) {
    const cmd = `ng generate service challenges/${fullChallengeName}/services/${serv}/${serv} --project=${category}`;
    console.log(`\n⚙️  Generating service: ${serv}`);
    execSync(cmd, { stdio: "inherit" });
    await wait(500);
  }

  // Ask for models folder
  const includeModels = await askYesNo("➕ Would you like to include a models folder?");
  if (includeModels) {
    const modelsPath = path.join(basePath, "models");
    fs.mkdirSync(modelsPath, { recursive: true });
    console.log(`\n✅ Models folder created at ${modelsPath}`);
    await wait(200);
  }


  // Create docs folder
  const challengeDocsPath = path.join(basePath, "docs");
  fs.mkdirSync(challengeDocsPath, { recursive: true });

  await wait(500);

  // Create docs folder and add two guide files
  const docsPath = path.join(challengeDocsPath);
  fs.mkdirSync(docsPath, { recursive: true });

  const requirementGuideFile = path.join(
    docsPath,
    `CH-${challengeNum}-REQUIREMENT.md`
  );
  const solutionGuideFile = path.join(
    docsPath,
    `CH-${challengeNum}-SOLUTION_GUIDE.md`
  );

  fs.writeFileSync(
    requirementGuideFile,
    `# Challenge ${challengeNum} - Requirement Guide

Describe the requirements, constraints, and expected inputs/outputs for **${challengeName}**.
`
  );

  await wait(200);

  fs.writeFileSync(
    solutionGuideFile,
    `# Challenge ${challengeNum} - Solution Guide

Document the step-by-step solution approach, reasoning, and optimizations for **${challengeName}**.
`
  );
  await wait(200);

  console.log(`\n✅ Challenge '${fullChallengeName}' scaffolded under '${category}'`);


  console.log(`\n📝 Generating CH-${challengeNum}-REQUIREMENT.md...`);
  console.log(`✅ CH-${challengeNum}-REQUIREMENT.md created.`);

  console.log(`\n📝 Generating CH-${challengeNum}-SOLUTION_GUIDE.md...`);
  console.log(`✅ CH-${challengeNum}-SOLUTION_GUIDE.md created.`);


  rl.close();
}

main();
