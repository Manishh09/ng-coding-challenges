# 🌟 Contributing Community Challenges

Welcome to the **Community Challenges** contribution guide! This document provides everything you need to know about creating and submitting your own Angular challenges to the `ngc-community` category.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Why Contribute?](#why-contribute)
- [Getting Started](#getting-started)
- [Challenge Creation Process](#challenge-creation-process)
- [Documentation Requirements](#documentation-requirements)
- [Code Quality Standards](#code-quality-standards)
- [Submission Guidelines](#submission-guidelines)
- [Review Process](#review-process)
- [Challenge Ideas & Inspiration](#challenge-ideas--inspiration)
- [Examples](#examples)
- [FAQ](#faq)

---

## 🎯 Overview

The **Community** category (`ngc-community`) is a dedicated space for Angular developers worldwide to:

- Share their knowledge and expertise
- Create educational challenges for the community
- Contribute real-world problem-solving scenarios
- Help others learn Angular through practical examples

**What can you contribute?**

- Any Angular topic: Components, Services, Forms, RxJS, Routing, Signals, Performance, Testing, etc.
- Real-world problems from your projects
- Interview questions and solutions
- Design patterns and best practices
- Experimental features and new Angular APIs

---

## 💡 Why Contribute?

### Benefits of Contributing

✅ **Recognition**: Your name and contribution appear in the challenge  
✅ **Learning**: Teaching others deepens your own understanding  
✅ **Portfolio**: Showcase your Angular expertise publicly  
✅ **Community**: Help fellow developers grow their skills  
✅ **Networking**: Connect with other Angular developers  
✅ **Impact**: Make Angular learning better for everyone  

---

## 🚀 Getting Started

### Prerequisites

Before creating a challenge, ensure you have:

1. **Development Environment**:
   - Node.js (v18+)
   - npm (v9+)
   - Angular CLI (v19+)

2. **Project Setup**:

   ```bash
   # Fork and clone the repository
   git clone https://github.com/YOUR_USERNAME/ng-coding-challenges.git
   cd ng-coding-challenges
   
   # Checkout develop branch
   git checkout develop
   git pull origin develop
   
   # Install dependencies
   npm install
   ```

3. **Familiarize Yourself**:
   - Browse existing challenges in other categories
   - Review [CREATE_CHALLENGE.md](CREATE_CHALLENGE.md) for technical process
   - Read [ANGULAR_BEST_PRACTICES.md](ANGULAR_BEST_PRACTICES.md)
   - Check [Git Commit Messages Guide](GIT_COMMIT_MESSAGES.md)

---

## 📝 Challenge Creation Process

### Step 1: Plan Your Challenge

Before running any scripts, clearly define:

1. **Learning Objective**: What will developers learn?
2. **Difficulty Level**: Beginner, Intermediate, or Advanced?
3. **Core Concept**: What Angular feature/pattern does it teach?
4. **Prerequisites**: What should developers know beforehand?
5. **Time Estimate**: How long should it take to complete?

### Step 2: Run the Creation Script

```bash
npm run create:challenge
```

Follow the prompts:

```text
📦 Available App Categories:
   - ngc-core
   - ngc-routing
   - ngc-rxjs-api
   - ngc-forms
   - ngc-signals
   - ngc-community    👈 SELECT THIS

Enter the category app name: ngc-community

Enter challenge name (kebab-case): my-awesome-challenge

Enter component names (comma-separated): workspace, demo-component

Enter service names (comma-separated): data-service

➕ Would you like to include a models folder? (y/n): y
```

### Step 3: Structure Generated

The script creates:

```
projects/ngc-community/src/app/challenges/
└── challenge-XX-my-awesome-challenge/
    ├── components/
    │   ├── workspace/
    │   │   ├── workspace.component.ts
    │   │   ├── workspace.component.html
    │   │   └── workspace.component.scss
    │   └── demo-component/
    │       ├── demo-component.component.ts
    │       ├── demo-component.component.html
    │       └── demo-component.component.scss
    ├── services/
    │   └── data.service.ts
    ├── models/
    │   └── index.ts
    └── docs/
        ├── CH-XX-REQUIREMENT.md
        └── CH-XX-SOLUTION_GUIDE.md
```

### Step 4: Implement the Challenge

1. **Write the Requirements** (`CH-XX-REQUIREMENT.md`)
2. **Implement the Solution** (components, services, models)
3. **Document the Solution** (`CH-XX-SOLUTION_GUIDE.md`)
4. **Test Everything** thoroughly

---

## 📚 Documentation Requirements

### 1. Requirement Document (CH-XX-REQUIREMENT.md)

Must include:

```markdown
# Challenge XX: [Challenge Title]

## 🎯 Learning Objectives
- What developers will learn
- Skills they'll practice

## 📋 Problem Statement
Clear description of the problem to solve

## ✅ Acceptance Criteria
- [ ] Specific, testable criteria
- [ ] What constitutes a complete solution
- [ ] Expected behavior

## 🔧 Technical Requirements
- Angular version
- Required dependencies
- API endpoints (if any)

## 💡 Hints (Optional)
- Helpful tips without giving away the solution
- Links to relevant documentation

## 🏆 Bonus Challenges (Optional)
- Additional features to implement
- Advanced variations
```

**Example**: See existing challenges in `ngc-forms` or `ngc-core` for reference

### 2. Solution Guide (CH-XX-SOLUTION_GUIDE.md)

Must include:

```markdown
# Solution Guide: Challenge XX

## 📖 Overview
Brief explanation of the solution approach

## 🔍 Step-by-Step Solution

### Step 1: [First Step]
- Explanation
- Code snippets
- Why this approach

### Step 2: [Second Step]
- Continue with clear steps
- Include code examples

## 💻 Complete Code

### Component Code
```typescript
// Full, working code
```

### Service Code

```typescript
// Full, working code
```

## 🎓 Key Concepts Explained

- Explain important Angular concepts used
- Why certain patterns were chosen

## 🚀 Alternative Approaches

- Other ways to solve the problem
- Trade-offs of each approach

## 📚 Further Reading

- Links to Angular docs
- Related resources

```

---

## ✨ Code Quality Standards

Your challenge code must meet these standards:

### 1. Angular Best Practices

- ✅ Use standalone components
- ✅ Follow Angular style guide
- ✅ Use TypeScript strict mode
- ✅ Implement OnPush change detection where appropriate
- ✅ Use Signals for reactive state (Angular 16+)
- ✅ Proper dependency injection
- ✅ Avoid `any` types

### 2. Code Organization

- ✅ Single Responsibility Principle
- ✅ Clear, descriptive naming
- ✅ Proper file structure
- ✅ Separate concerns (component, service, model)

### 3. Documentation

- ✅ JSDoc comments for complex logic
- ✅ Inline comments explaining "why", not "what"
- ✅ README if additional setup needed

### 4. Testing (Recommended)

- Consider including unit tests
- Show testing best practices
- Help learners understand testing

### 5. Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### 6. Performance

- ✅ Avoid memory leaks (unsubscribe from observables)
- ✅ Use async pipe where possible
- ✅ Optimize change detection
- ✅ Lazy loading when appropriate

---

## 📤 Submission Guidelines

### Step 1: Create Feature Branch

```bash
# Create branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/community-challenge-[your-challenge-name]
```

Follow [Branch Naming Guide](BRANCH_NAMING_GUIDE.md)

### Step 2: Commit Your Changes

```bash
git add .
git commit -m "feat(community): add [challenge-name] challenge"
```

Follow [Git Commit Messages Guide](GIT_COMMIT_MESSAGES.md)

### Step 3: Push to Your Fork

```bash
git push origin feature/community-challenge-[your-challenge-name]
```

### Step 4: Open Pull Request

Create a PR against the `develop` branch with:

#### PR Title Format

```
feat(community): Add [Challenge Name] challenge
```

#### PR Description Template

```markdown
## Challenge Overview
Brief description of what the challenge teaches

## Learning Objectives
- Objective 1
- Objective 2

## Challenge Details
- **Difficulty**: [Beginner/Intermediate/Advanced]
- **Topic**: [Components/Services/Forms/RxJS/etc.]
- **Estimated Time**: [XX minutes]

## Why This Challenge?
Explain why this challenge is valuable for learners

## Prerequisites
What developers should know before attempting this

## Checklist
- [ ] Requirement document is complete and clear
- [ ] Solution guide is comprehensive
- [ ] Code follows Angular best practices
- [ ] Code is tested and working
- [ ] Documentation is free of typos
- [ ] All files follow project structure
- [ ] Commit messages follow guidelines

## Additional Notes
Any other relevant information
```

---

## 🔍 Review Process

### What Reviewers Check

1. **Technical Accuracy**
   - Code works as intended
   - Follows Angular best practices
   - No bugs or issues

2. **Educational Value**
   - Clear learning objectives
   - Appropriate difficulty level
   - Well-explained solution

3. **Documentation Quality**
   - Requirements are clear
   - Solution guide is comprehensive
   - No grammatical errors

4. **Code Quality**
   - Clean, readable code
   - Proper structure
   - Good practices demonstrated

5. **Completeness**
   - All required files present
   - Works end-to-end
   - No missing pieces

### Review Timeline

- Initial review: 3-7 days
- Feedback provided via PR comments
- Iterations as needed
- Merge when approved

### After Approval

Once merged:

- Your challenge goes live
- Listed in Community category
- Your contribution is credited
- Thank you! 🎉

---

## 💡 Challenge Ideas & Inspiration

### Beginner Level

- **Component Basics**: Input/Output properties, lifecycle hooks
- **Template Syntax**: *ngIf,*ngFor, pipes
- **Services**: Dependency injection, singleton pattern
- **Forms**: Template-driven forms basics
- **HTTP**: Simple GET requests

### Intermediate Level

- **Component Communication**: Event emitters, services, viewChild
- **Reactive Forms**: FormBuilder, validators, dynamic forms
- **RxJS Operators**: map, filter, switchMap, combineLatest
- **Routing**: Navigation, route parameters, guards
- **State Management**: Simple state service patterns

### Advanced Level

- **Custom Directives**: Structural/attribute directives
- **Custom Pipes**: Pure/impure pipes, async operations
- **Performance**: OnPush strategy, trackBy, virtual scrolling
- **RxJS Patterns**: Error handling, retry logic, complex streams
- **Dynamic Components**: ComponentFactory, ViewContainerRef
- **Signals**: Advanced reactive patterns with Signals API

### Real-World Scenarios

- Authentication flows
- Data table with sorting/filtering
- Infinite scroll implementation
- File upload with progress
- Form validation patterns
- API error handling
- Caching strategies

---

## 📖 Examples

### Good Challenge Example

**Title**: "User Search with Debouncing"

**Learning Objectives**:

- Implement reactive search with RxJS
- Use debounceTime and distinctUntilChanged
- Handle API calls efficiently

**Clear Requirements**:

- Search input triggers API calls
- Debounce user input (300ms)
- Show loading state
- Display results
- Handle errors gracefully

**Comprehensive Solution**:

- Step-by-step explanation
- Complete working code
- Explains RxJS operators
- Alternative approaches discussed

---

## ❓ FAQ

### Q: Can I submit multiple challenges?

**A**: Absolutely! We welcome multiple contributions.

### Q: Can I update an existing challenge?

**A**: Yes, submit a PR with improvements to any community challenge.

### Q: What if my challenge uses external libraries?

**A**: That's fine! Just document the dependencies clearly.

### Q: Can I create a challenge on experimental Angular features?

**A**: Yes! Mark it clearly as experimental/preview in the requirements.

### Q: What difficulty level should I choose?

**A**: Be honest about the difficulty. Consider the prerequisites and time needed.

### Q: Can I collaborate with others?

**A**: Yes! Co-authored challenges are welcome. Credit all contributors.

### Q: My challenge wasn't accepted. What now?

**A**: Review feedback, make improvements, and resubmit. We're here to help!

### Q: Can I use AI to help create challenges?

**A**: AI can assist, but ensure you understand and can explain everything. The challenge must be accurate and educational.

---

## 🤝 Need Help?

- **Questions?** Open an issue with the `question` label
- **Stuck?** Review existing challenges for guidance
- **Discussion?** Start a discussion in the repository

### Connect

- **LinkedIn**: [Manish Boge](https://www.linkedin.com/in/manishboge/)
- **GitHub**: [@Manishh09](https://github.com/Manishh09)

---

## 🎉 Thank You

Your contributions play a vital role in improving Angular learning for developers preparing for interviews. We’re grateful for your time, effort, and expertise in creating meaningful challenges for the community

**Happy coding!** 🚀

---

*Last Updated: January 2026*
