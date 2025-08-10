# Development Environment Setup

## Prerequisites

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
**Note:** if any issues, remove package-lock.json file and run `npm install`

### Running the Application

```bash
# build the libs first
npm run build:libs

# run main app
npm run start:main
```

**Note:** Have any changes in libs ? Always build libs first and then run the main app


