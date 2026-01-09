# ngc-community

Community-Driven Angular Challenges - a space for developers worldwide to contribute their own Angular challenges, share solutions, and learn from each other. This category welcomes challenges on any Angular topic including components, services, forms, routing, state management, performance optimization, and more.

## Project Structure

```
src/app/
├── challenges/                    # All challenge implementations
│   ├── challenge-XX-[name]/       # Individual challenge folder
│   │   ├── components/            # Challenge workspace components
│   │   ├── services/              # Optional services
│   │   ├── models/                # Optional TypeScript interfaces
│   │   └── docs/                  # Challenge documentation
│   │       ├── CH-XX-REQUIREMENT.md
│   │       └── CH-XX-SOLUTION_GUIDE.md
├── app.component.ts               # Root component
├── app.config.ts                  # Application configuration
└── app.routes.ts                  # Routing configuration
```

## Challenge List

_No challenges have been created yet. This category is open for community contributions!_

**Want to contribute a challenge?**

We'd love to have your contribution! Follow these steps:

1. **Read the Complete Guide**: [Community Challenges Contribution Guide](../../docs/COMMUNITY_CHALLENGES.md)
2. **Quick Start**:

   ```bash
   npm run create:challenge
   # Select 'ngc-community' when prompted
   ```

3. **Get Help**: Check [CONTRIBUTING.md](../../CONTRIBUTING.md) for general guidelines
4. **Submit**: Create a PR following the [submission guidelines](../../docs/COMMUNITY_CHALLENGES.md#submission-guidelines)

**📚 Documentation**:

- [Full Contribution Guide](../../docs/COMMUNITY_CHALLENGES.md) - Complete walkthrough
- [Challenge Creation Process](../../docs/CREATE_CHALLENGE.md) - Technical details
- [Git Commit Guide](../../docs/GIT_COMMIT_MESSAGES.md) - Commit message format
- [Branch Naming Guide](../../docs/BRANCH_NAMING_GUIDE.md) - Branch conventions

---

## Category Metadata

**Route:** `/challenges/community`  
**Import Alias:** `@ngc-community`  
**Exported Routes:** `NGC_COMMUNITY_ROUTES`  
**Category ID:** `community`  
**Category Order:** `7`

## About Community Challenges

This category is designed to encourage community participation and knowledge sharing. Challenges contributed here can cover:

- **Any Angular Topic**: Core, Forms, RxJS, Signals, Routing, Performance, Testing, etc.
- **Real-World Problems**: Share challenges from your actual projects
- **Learning Exercises**: Help others learn by creating educational challenges
- **Best Practices**: Demonstrate Angular patterns and techniques
- **Experimental Features**: Explore new Angular features and APIs

### Contribution Guidelines

- Follow the established challenge structure and documentation format
- Include clear requirements and acceptance criteria
- Provide a solution guide to help reviewers and learners
- Ensure code quality and follows Angular best practices
- Test your challenge thoroughly before submitting

**Join the community and make Angular learning better for everyone!** 🚀
