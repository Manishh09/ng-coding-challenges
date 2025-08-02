# Contributing to NgCodingChallenges

First off, thank you for considering contributing to NgCodingChallenges! It's people like you that make this project such a great learning resource for Angular developers.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct, which asks that you:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check if the issue has already been reported. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps** or how the enhancement would work.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of the project which the suggestion is related to.
- **Explain why this enhancement would be useful** to most Angular developers.
- **List some other projects where this enhancement exists.**

### Adding New Challenges

We welcome contributions of new coding challenges. To add a new challenge:

1. Create a new branch from `develop`: `git checkout -b add-challenge-[challenge-name]`
2. Follow the challenge structure pattern in the existing challenges
3. Create a new folder in `projects/` with the pattern `challenge-XX-name-of-challenge`
4. Include a detailed `CH-XX-REQUIREMENT.md` file following the format used in existing challenges
5. Add a starter implementation with appropriate placeholder comments
6. Update the challenge list in the main application
7. Submit a pull request with your changes

### Pull Requests

The process described here has several goals:

- Maintain the project's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible learning resource
- Enable a sustainable system for the project's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in the PR template [Pull Request Template](./PULL_REQUEST_TEMPLATE.md)
2. After you submit your pull request, verify that all status checks are passing
3. If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated.

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Development Environment Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19.2.12 or compatible)

### Setup Steps

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
# clone the repo
git clone https://github.com/YOUR-USERNAME/ng-coding-challenges.git

# navigate to project
cd ng-coding-challenges


#checkout develop
git checkout develop

#pull changes
git pull
```

3. Install dependencies:
```bash
npm install
# if any issues, remove package-lock.json file and run `npm install`
```

4. Create a branch for your feature or bugfix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

5. Make your changes and commit them with a descriptive commit message:
```bash
git add .
git commit -m "Add feature: your feature description"
```

6. Push your branch to your fork:
```bash
git push origin feature/your-feature-name
```

7. Open a pull request from your fork to the main repository (develop branch)

### Running Tests

Before submitting a pull request, make sure all tests pass:

```bash
npm test
```

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies

### TypeScript Styleguide

* Follow the Angular style guide: https://angular.dev/style-guide
* Use camelCase for variables, properties, and method names
* Use PascalCase for class names, interfaces, and types
* Use kebab-case for file names and component selectors
* Prefer const over let when the variable won't be reassigned
* Prefer readonly properties when they won't be changed
* Use proper access modifiers (private, protected, public)
* Include type annotations for all function parameters and return types

### HTML Styleguide

* Use 2 spaces for indentation
* Use double quotes for attributes
* Include alt attributes for all images
* Close all HTML tags properly
* Use semantic HTML elements when appropriate
* Follow accessibility best practices

### SCSS/CSS Styleguide

* Use 2 spaces for indentation
* Use kebab-case for class names
* Avoid using !important
* Use the BEM naming convention for components
* Use variables for colors, spacing, etc.
* Group related properties together
* Add comments for complex styles or hacks
* Avoid deep nesting (more than 3 levels)

## Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.
