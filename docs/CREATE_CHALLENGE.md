# 📌 CREATE_CHALLENGE_TEMPLATE

This template outlines the steps for adding a new challenge using the automation script located in the **`scripts/`** folder.

---

## Step 1: Run the Challenge Creation Script

```bash
node scripts/create-challenge.js

# OR run below command
npm run create:challenge
```

## Step 2: Select Category

The script will:

1. **List Available Categories**: Shows all categories under `projects/` (excludes `ngc-shell`)
2. **Prompt for Selection**: Ask you to choose which category to add the challenge to

```text
📦 Available App Categories:
   - ngc-core
   - ngc-routing
   - ngc-rxjs-api
   - [your-new-category]

Note: 'ngc-shell' is the main app responsible for controlling the overall application.

Enter the category app name: [selected-category]
```

## Step 3: Define Challenge

Provide the following information:

```text
Enter challenge name (kebab-case): [challenge-name]
Enter component names (comma-separated): comp1, comp2, ...
Enter service names (comma-separated): service1, service2, ...
➕ Would you like to include a models folder? (y/n): [y/n]
```

## Step 4: Auto-Generated Structure

The script creates:

```text
projects/[category]/src/app/challenges/
└── challenge-[XX]-[challenge-name]/
    ├── components/
    │   ├── [component1]/
    │   └── [component2]/
    ├── services/
    │   ├── [service1]/
    │   └── [service2]/
    ├── models/                     # Optional
    └── docs/
        ├── CH-[XX]-REQUIREMENT.md
        └── CH-[XX]-SOLUTION_GUIDE.md
```

**Key Features:**

- **Auto-numbering**: Challenges are automatically numbered sequentially across ALL categories
- **Angular CLI Integration**: Components and services are generated using Angular CLI
- **Documentation**: Requirement and solution guides are auto-created
- **Flexible Structure**: Optional models folder based on needs

---

## 📊 Challenge Numbering System

### Global Sequential Numbering

The `create-challenge-next.js` script implements a sophisticated numbering system:

1. **Scans All Categories**: Examines all challenge folders across all category apps
2. **Finds Maximum Number**: Identifies the highest existing challenge number
3. **Increments**: Assigns the next sequential number (zero-padded to 2 digits)
4. **Global Uniqueness**: Ensures no duplicate challenge numbers across the entire project

### Example Numbering Flow

```text
Current State:
├── ngc-core/challenges/challenge-01-component-basics/
├── ngc-routing/challenges/challenge-02-route-guards/
├── ngc-rxjs-api/challenges/challenge-03-observables/

Next Challenge: challenge-04-[new-challenge-name]
```

---

## 🔍 Script Analysis

### create-category-app_next.js Features

**Input Validation:**

```javascript
const isKebabCase = (str) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
```

**Error Handling:**

- Validates kebab-case format
- Checks for existing directories
- Handles Ctrl+C interruption gracefully
- Provides clear error messages

**Angular CLI Integration:**

```javascript
ng generate application ${category} 
  --standalone 
  --project-root=projects/${category} 
  --routing 
  --style=scss 
  --no-ssr
```

### create-challenge-next.js Features

**Smart Category Detection:**

```javascript
const availableCategories = fs
  .readdirSync(projectsPath, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
```

**Global Challenge Numbering:**

```javascript
function getNextChallengeNumber() {
  // Scans all categories for existing challenges
  // Returns next sequential number
}
```

**Component/Service Generation:**

```javascript
const cmd = `ng generate component challenges/${fullChallengeName}/components/${comp} --project=${category} --standalone`;
```

---

## 🎛️ Configuration & Customization

### Angular CLI Configuration

The generated apps use these configurations:

- **Standalone Components**: Modern Angular approach
- **SCSS Styling**: Enhanced CSS capabilities
- **Routing Enabled**: Navigation support
- **No SSR**: Client-side rendering
- **Custom Project Root**: Organized under `projects/`

### File Templates

Both scripts generate documentation templates:

**Requirement Template:**

```markdown
# Challenge [XX] - Requirement Guide

Describe the requirements, constraints, and expected inputs/outputs for **[challenge-name]**.
```

**Solution Template:**

```markdown
# Challenge [XX] - Solution Guide

Document the step-by-step solution approach, reasoning, and optimizations for **[challenge-name]**.
```

---
