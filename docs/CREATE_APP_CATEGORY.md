# 📦 CREATE APP CATEGORY DOCUMENTATION

This document provides comprehensive information about the app category creation functionality in the ng-coding-challenges project. The project includes sophisticated automation scripts to streamline the creation of new Angular application categories and challenges.

---

## 📋 Overview

The ng-coding-challenges project supports a modular architecture where challenges are organized into different categories, each as a separate Angular application. This approach provides:

- **Isolation**: Each category runs independently
- **Scalability**: Easy to add new categories without affecting existing ones
- **Organization**: Logical grouping of related challenges
- **Maintainability**: Easier to manage and test individual categories

---

## 🔧 Available Scripts

### Create Category App Script

**File**: `scripts/create-category-app_next.js`

**Purpose**: Creates a new Angular application category under the `projects/` directory

---

## 🚀 Creating a New Category App

### Step 1: Run the Category Creation Script

```bash
# Navigate to project root
cd ng-coding-challenges

# Run the category creation script
node scripts/create-category-app_next.js

# OR run below command
npm run create:category-app
```

### Step 2: Provide Category Details

The script will prompt you for:

```text
Enter new category app name (kebab-case): [your-category-name]
```

**Requirements:**

- Name must be in kebab-case format (lowercase letters, numbers, hyphens only)
- Name must be unique (category folder doesn't already exist)
- Examples: `form-handling`, `data-visualization`, `user-management`

### Step 3: Automatic Generation

The script performs the following actions:

1. **Validates Input**: Checks kebab-case format and uniqueness
2. **Runs Angular CLI**: Executes the following command:

   ```bash
   ng generate application [category-name] --standalone --project-root=projects/[category-name] --routing --style=scss --no-ssr
   ```

3. **Creates Challenge Directory**: Adds `src/app/challenges/` folder
4. **Generates README**: Creates category-specific documentation

### Step 4: Generated Structure

After successful execution, you'll have:

```text
projects/
└── [category-name]/
    ├── README.md                    # Category documentation
    ├── tsconfig.app.json           # TypeScript config
    ├── tsconfig.spec.json          # Test TypeScript config
    ├── public/                     # Static assets
    └── src/
        ├── index.html              # App entry point
        ├── main.ts                 # Bootstrap file
        ├── styles.scss             # Global styles
        └── app/
            ├── app.component.*     # Root component files
            ├── app.config.ts       # App configuration
            ├── app.routes.ts       # Routing configuration
            └── challenges/         # 📁 Challenge container (empty)
```

---

## 🏗️ Architecture Benefits

### Modular Design

- Each category is an independent Angular application
- Isolated dependencies and configurations
- Easier testing and debugging

### Scalable Structure

- Add new categories without affecting existing ones
- Clear separation of concerns
- Consistent project organization

### Developer Experience

- Automated setup reduces manual errors
- Consistent naming conventions
- Pre-generated documentation templates

---

## 📝 Best Practices

### Category Naming

- Use descriptive, kebab-case names
- Group related challenges logically
- Examples: `form-validation`, `api-integration`, `component-communication`

### Challenge Organization

- Follow the auto-generated folder structure
- Use the documentation templates consistently
- Implement components, services, and models in their respective folders

### Documentation

- Update requirement and solution guides promptly
- Include clear examples and explanations
- Maintain consistency across challenges

---

## 🔧 npm Scripts Integration

### Current Integration

```json
{
  "scripts": {
    "create:challenge": "node scripts/create-challenge.js"
  }
}
```

### Recommended Additions

```json
{
  "scripts": {
    "create:challenge": "node scripts/create-challenge.js",
    "create:category": "node scripts/create-category-app_next.js",
    "create:challenge:next": "node scripts/create-challenge-next.js"
  }
}
```

---

## 🚨 Troubleshooting

### Common Issues

**1. Angular CLI Not Found**

```
Error: ng command not found
Solution: Install Angular CLI globally: npm install -g @angular/cli
```

**2. Permission Errors**

```
Error: EACCES permission denied
Solution: Run with appropriate permissions or check folder permissions
```

**3. Invalid Category Name**

```
Error: Invalid name format
Solution: Use kebab-case (lowercase, hyphens, numbers only)
```

**4. Category Already Exists**

```
Error: Category already exists
Solution: Choose a different category name or remove existing directory
```

---

## 🔮 Future Enhancements

### Potential Improvements

1. **Interactive GUI**: Web-based interface for script execution
2. **Template Customization**: Configurable file templates
3. **Dependency Management**: Auto-install category-specific dependencies
4. **Testing Setup**: Automated test file generation
5. **CI/CD Integration**: Build configuration for new categories

### Script Evolution

The project shows progression from legacy (`create-challenge.js`) to modern (`create-challenge-next.js`) approaches, indicating ongoing improvements and best practice adoption.

---

## 📚 Related Documentation

- [CREATE_CHALLENGE.md](./CREATE_CHALLENGE.md) - Legacy challenge creation guide
- [SETUP_AND_RUN_APP_GUIDE.md](./SETUP_AND_RUN_APP_GUIDE.md) - Project setup instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall project architecture
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

---

*Last Updated: November 2025*
*Version: 1.0*
