const { execSync } = require('child_process');
const path = require('path');

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}

// Switch to prod paths for library builds
run('node scripts/switch-tsconfig-paths.js prod');
run('ng build shared-models');
run('ng build shared-services');
run('ng build shared-ui');

// Switch back to dev paths for app build
run('node scripts/switch-tsconfig-paths.js dev');
run('ng build coding-challenges');

console.log('\n✅ Full build completed successfully!');
