# 📌 CREATE_CHALLENGE_TEMPLATE

This template outlines the steps for adding a new challenge using the automation script located in the **`scripts/`** folder.

---

## 1️. Run the Automation Script
Navigate to the project root and run the challenge creation script:

**Script Location:** `./scripts/create-challenge.js`

```bash
# Using Node.js
node ./scripts/create-challenge.js

# OR Using npm
npm run create:challenge
```
___

## 2. Script Prompts & Output

Once you ran the command in terminal, it will ask you the following details one by one:
 
 - 1. Challenge Name: Give the name of the challenge you will create
 - 2. Components Folder Creation - Give Y / N
 - 3. Service Folder Creation - Give Y / N
 - 4. Model Folder Creation - Give Y / N
 - 5. Shared Folder Creation - Give Y / N

**The script will automatically:**
- Create a requirements markdown file.
- Create a solution guide markdown file.
 
  
Sample Output of the command:

![Create Challenge](/scripts/create-challenge-output.png)
___

## 3. Add Challenge Implementation
- Implement components, services, and models according to the requirements.
- Follow the generated challenge markdown file as your guide.