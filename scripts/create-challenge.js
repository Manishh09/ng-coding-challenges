#!/usr/bin/env node

/**
 * This script helps to create a new challenge application in the monorepo.
 * It creates the necessary folder structure and configuration files.
 * 
 * Usage: node scripts/create-challenge.js challenge-name "Challenge Title"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get challenge name from command line arguments
const challengeName = process.argv[2];
const challengeTitle = process.argv[3] || `${challengeName.charAt(0).toUpperCase() + challengeName.slice(1)} Challenge`;

if (!challengeName) {
  console.error('Please provide a challenge name!');
  console.log('Usage: node scripts/create-challenge.js challenge-name "Challenge Title"');
  process.exit(1);
}

// Paths
const projectRoot = path.resolve(__dirname, '..');
const challengeDir = path.join(projectRoot, 'projects', challengeName);

// Check if challenge already exists
if (fs.existsSync(challengeDir)) {
  console.error(`Challenge "${challengeName}" already exists!`);
  process.exit(1);
}

// Create challenge using Angular CLI
console.log(`Creating new challenge: ${challengeName}`);
try {
  execSync(`npx ng generate application ${challengeName} --routing=true --style=scss --project-root=projects/${challengeName}`, { 
    stdio: 'inherit', 
    cwd: projectRoot 
  });
} catch (error) {
  console.error('Failed to create challenge application:', error);
  process.exit(1);
}

// Create REQUIREMENT.md template
const requirementContent = `# ${challengeTitle} - Requirements

## Title: ${challengeTitle}

## Description
[Add a brief description of the challenge]

## 1. Goal
[Describe the primary goal of this challenge]

## 2. Core Features / Requirements
[List the core features and requirements]

## 3. Technical Requirements
[List any specific technical requirements or constraints]

## 4. Evaluation Criteria
[Describe how the solution will be evaluated]
`;

fs.writeFileSync(
  path.join(challengeDir, 'src', 'REQUIREMENT.md'),
  requirementContent
);

// Update package.json with new scripts
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = require(packageJsonPath);

packageJson.scripts[`start:${challengeName}`] = `ng serve ${challengeName}`;
packageJson.scripts[`build:${challengeName}`] = `ng build ${challengeName}`;
packageJson.scripts[`test:${challengeName}`] = `ng test ${challengeName}`;

fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2)
);

console.log(`
Challenge "${challengeName}" created successfully!

Added scripts to package.json:
- npm run start:${challengeName}
- npm run build:${challengeName}
- npm run test:${challengeName}

Don't forget to:
1. Update the REQUIREMENT.md with the challenge details
2. Import any required shared libraries in your app.module.ts
3. Configure the components, services, and routes for your challenge
`);
