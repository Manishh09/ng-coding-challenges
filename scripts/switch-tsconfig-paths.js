const fs = require('fs');
const path = require('path');

const mode = process.argv[2]; // 'dev' or 'prod'
if (!['dev', 'prod'].includes(mode)) {
  console.error('Usage: node scripts/switch-tsconfig-paths.js <dev|prod>');
  process.exit(1);
}

const mainTsconfig = path.join(__dirname, '../tsconfig.json');
const devPaths = path.join(__dirname, '../tsconfig.paths.dev.json');
const prodPaths = path.join(__dirname, '../tsconfig.paths.prod.json');

const tsconfig = JSON.parse(fs.readFileSync(mainTsconfig, 'utf8'));
const pathsConfig = JSON.parse(fs.readFileSync(mode === 'prod' ? prodPaths : devPaths, 'utf8'));

tsconfig.compilerOptions.paths = pathsConfig.compilerOptions.paths;
fs.writeFileSync(mainTsconfig, JSON.stringify(tsconfig, null, 2));
console.log(`Switched tsconfig paths to ${mode}`);
