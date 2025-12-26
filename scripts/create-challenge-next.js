#!/usr/bin/env node

/**
 * scaffold-challenge.js (no external dependencies)
 * Usage: node scaffold-challenge.js
 *
 * Interactively scaffolds a challenge inside an existing Angular app category.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) =>
    rl.question(question, (answer) => resolve(answer.trim()))
  );
}

const isKebabCase = (str) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);

async function main() {
  let category = "";

  while (true) {
    category = await prompt("Enter the category app name: ");
    if (!isKebabCase(category)) {
      console.log("❌ Must be in kebab-case. Try again.");
      continue;
    }

    const categoryPath = path.join("projects", category);
    if (!fs.existsSync(categoryPath)) {
      console.log(
        `❌ Category '${category}' not found in projects/. Try again.`
      );
    } else {
      break;
    }
  }

  let challenge = "";
  while (true) {
    challenge = await prompt("Enter challenge name (kebab-case): ");
    if (isKebabCase(challenge)) break;
    console.log("❌ Challenge name must be in kebab-case.");
  }

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

  const basePath = path.join(
    "projects",
    category,
    "src",
    "app",
    "challenges",
    challenge
  );
  fs.mkdirSync(basePath, { recursive: true });

  // Components
  for (const comp of components) {
    const cmd = `ng generate component challenges/${challenge}/${comp} --project=${category} --standalone`;
    console.log(`\n⚙️  Generating component: ${comp}`);
    execSync(cmd, { stdio: "inherit" });
  }

  // Services
  for (const serv of services) {
    const cmd = `ng generate service challenges/${challenge}/services/${serv}/${serv} --project=${category}`;
    console.log(`\n⚙️  Generating service: ${serv}`);
    execSync(cmd, { stdio: "inherit" });
  }

  // REQUIREMENT.md
  const requirementFile = path.join(basePath, "REQUIREMENT.md");
  if (!fs.existsSync(requirementFile)) {
    fs.writeFileSync(
      requirementFile,
      `# ${challenge.replace(/-/g, " ").toUpperCase()}

## Problem Statement

(Describe the challenge requirements here)
`
    );
  }

  console.log(`\n✅ Challenge '${challenge}' scaffolded under '${category}'`);
  console.log(`\n📄 REQUIREMENT.md created at: ${requirementFile}`);

  rl.close();
}

main();
