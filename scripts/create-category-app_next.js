#!/usr/bin/env node

/**
 * create-category-app.js
 * Usage: node create-category-app.js
 *
 * Interactive prompt to create a new Angular category app under projects/
 *
 * This script runs Angular CLI command to generate a new standalone Angular application
 * under projects/<category-name> and creates a 'challenges' folder inside src/app.
 * cmd:  "node scripts/create-category-app.js",
*/

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// clear the console
process.on("SIGINT", () => {
  console.log("\n❌ Operation cancelled by user (Ctrl+C)");
  rl.close();
  process.exit(1);
});
const isKebabCase = (str) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  let category = "";

  while (true) {
    category = (await ask("Enter new category app name (kebab-case): ")).trim();

    if (!isKebabCase(category)) {
      console.log(
        "❌ Invalid name. Use kebab-case (lowercase letters, numbers, hyphens)."
      );
      continue;
    }

    const projectRoot = path.join("projects", category);
    if (fs.existsSync(projectRoot)) {
      console.log(
        `❌ Category '${category}' already exists at ${projectRoot}. Choose another name.`
      );
      continue;
    }

    // Valid category name & folder doesn't exist, break loop
    break;
  }

  rl.close();

  try {
    // Run Angular CLI command to generate the new app
    // show the command being run

    console.log(
      `\n Creating with Angular CLI command: ng generate application ${category} --standalone --project-root=projects/${category} --routing --style=scss --no-ssr`
    );

    console.log(`\nGenerating Angular application '${category}'...`);
    execSync(
      `ng generate application ${category} --standalone --project-root=projects/${category} --routing --style=scss --no-ssr`,
      {
        stdio: "inherit",
      }
    );

    const challengesPath = path.join(
      "projects",
      category,
      "src",
      "app",
      "challenges"
    );
    fs.mkdirSync(challengesPath, { recursive: true });

    fs.writeFileSync(
      path.join("projects", category, "README.md"),
      `# ${category}\n\nChallenge category application '${category}'. Place challenges inside 'src/app/challenges'.\n`
    );
    console.log(
      `\n📄 README.md created for Angular Challenge App '${category}'.`
    );
    console.log(
      `🅰️ Angular Challenge App '${category}' successfully created under 'projects/'.`
    );
    console.log(
      `\n📁 Folder 'src/app/challenges' initialized inside '${category}' app.`
    );
  } catch (err) {
    console.error("\nError generating Angular application:", err.message);
    console.error("\nPlease ensure you have the Angular CLI installed and try again.");
    process.exit(1);
  }
}

main();
