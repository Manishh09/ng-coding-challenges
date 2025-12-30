# StackBlitz Terminal & Auto-Start Configuration

## Overview

This document explains how the StackBlitz integration is configured to show the terminal, install dependencies, and auto-start the dev server.

## Configuration Changes Made

### 1. **Terminal Visibility**

Updated embed options to ensure terminal is visible:

```typescript
{
  hideDevTools: false,      // Show terminal/console panel
  devToolsHeight: 50,       // Terminal takes 50% of vertical space
  terminalHeight: 50,       // Explicitly set terminal height
  showSidebar: true,        // Show file explorer
  hideNavigation: false,    // Show navigation bar
}
```

### 2. **Automatic Dependency Installation**

StackBlitz WebContainer automatically:
1. Detects `package.json` in the project
2. Runs `npm install` automatically when project loads
3. Shows installation progress in terminal
4. Caches dependencies for faster subsequent loads

**No manual configuration needed** - StackBlitz handles this automatically!

### 3. **Automatic Dev Server Start**

StackBlitz automatically starts the dev server after dependency installation by:

1. Looking for the `"start"` script in `package.json`:
   ```json
   {
     "scripts": {
       "start": "ng serve"
     }
   }
   ```

2. Running the start command automatically after `npm install` completes

3. Showing the preview in the preview panel

### 4. **Project Configuration**

Our `package.json` template includes:

```json
{
  "name": "angular-challenge",
  "version": "19.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build"
  },
  "dependencies": {
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/compiler": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/platform-browser-dynamic": "^19.0.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.7.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.0.0",
    "@angular/cli": "^19.0.0",
    "@angular/compiler-cli": "^19.0.0",
    "typescript": "~5.6.0"
  }
}
```

## How It Works

### Step-by-Step Process:

1. **User Opens Playground**
   - Navigates to `/playground?category=rxjs-api&challenge=fetch-products`

2. **Challenge Loads**
   - `ChallengeLoaderService` fetches challenge from `challenges.json`
   - Generates complete Angular 19 file system with `package.json`

3. **StackBlitz Embeds**
   - Creates WebContainer VM
   - Displays loading overlay

4. **Automatic Installation (Terminal Visible)**
   - Terminal panel appears (50% height)
   - Shows: `npm install` running
   - Displays dependency installation progress
   - User can see exactly what's happening

5. **Automatic Dev Server Start**
   - After `npm install` completes
   - Terminal shows: `npm start` or `ng serve`
   - Angular CLI compiles the app
   - Preview panel shows the running app

6. **Live Development**
   - User edits code in Monaco Editor
   - Changes sync to StackBlitz
   - Hot reload updates preview
   - Terminal shows compilation logs

## Terminal Features

### What Users See in Terminal:

```bash
npm install
# Installing dependencies...
# Added 1234 packages in 15s

npm start
# Starting Angular development server...
# ✔ Browser application bundle generation complete
# Initial chunk files | Names         |  Raw size
# main.js             | main          | 123.45 kB
# styles.css          | styles        |  12.34 kB
#
# ** Angular Live Development Server is listening on localhost:4200 **
# ✔ Compiled successfully
```

### Terminal Capabilities:

- **Read-only console output** - Shows logs but doesn't accept commands
- **Scrollable history** - Users can scroll through installation logs
- **Color-coded output** - Errors in red, success in green
- **Persistent logs** - Console history is preserved (clearConsole: false)

## Troubleshooting

### If Terminal Doesn't Show:

1. Check embed options are not overridden elsewhere
2. Verify `hideDevTools: false` is set
3. Check browser console for StackBlitz SDK errors

### If Dependencies Don't Install:

1. Verify `package.json` is in the files object
2. Check `package.json` has valid JSON syntax
3. Look for npm errors in terminal

### If Dev Server Doesn't Start:

1. Verify `"start"` script exists in `package.json`
2. Check if all Angular dependencies are listed
3. Look for TypeScript compilation errors in terminal

## Advanced Configuration

### Custom Terminal Height:

```typescript
stackblitzOptions = computed(() => ({
  devToolsHeight: 60,  // Terminal takes 60% of height
  terminalHeight: 60,
}));
```

### Hide Terminal After Start:

```typescript
// Not recommended - hides the terminal, but you can set:
stackblitzOptions = computed(() => ({
  hideDevTools: true,
}));
```

### Open Specific File:

```typescript
stackblitzOptions = computed(() => ({
  openFile: 'src/app/components/my-component.ts',
}));
```

## Files Modified

1. **stackblitz-host.component.ts**
   - Added `devToolsHeight`, `terminalHeight`, `showSidebar` to input options
   - Updated embed configuration with terminal visibility options

2. **playground-container.component.ts**
   - Updated `stackblitzOptions` computed signal
   - Added terminal-related options

3. **challenge-loader.service.ts**
   - Already generates proper `package.json` with `start` script
   - No changes needed

## Browser Compatibility

StackBlitz WebContainers (including terminal) work in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari 15.2+
- ❌ Internet Explorer (not supported)

## Performance Notes

- First load: ~15-30 seconds (npm install)
- Cached loads: ~3-5 seconds (dependencies cached)
- Terminal adds negligible overhead (~1-2MB memory)

## References

- [StackBlitz SDK Documentation](https://developer.stackblitz.com/platform/api/javascript-sdk)
- [StackBlitz WebContainers](https://developer.stackblitz.com/platform/webcontainers)
- [Embed Options API](https://developer.stackblitz.com/platform/api/javascript-sdk-options)
