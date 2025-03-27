const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SPEC_PATH = path.resolve(__dirname, '../openapi/OOSA.openapi.json');
const BACKUP_PATH = SPEC_PATH + '.bak';
const specRaw = fs.readFileSync(SPEC_PATH, 'utf-8');
const specJson = JSON.parse(specRaw);

const CURRENT_VERSION = specJson.openapi;
const TARGET_VERSION = '3.0.3';

if (CURRENT_VERSION !== TARGET_VERSION) {
  console.warn(`⚠️  OpenAPI version is ${CURRENT_VERSION}, downgrading to ${TARGET_VERSION}...`);

  // 備份原始檔案
  fs.copyFileSync(SPEC_PATH, BACKUP_PATH);
  console.log(`📦 Backup created at: ${BACKUP_PATH}`);

  // 替換版本
  specJson.openapi = TARGET_VERSION;
  fs.writeFileSync(SPEC_PATH, JSON.stringify(specJson, null, 2));
  console.log(`✅ Version updated to ${TARGET_VERSION}`);
} else {
  console.log(`✅ OpenAPI version is already ${TARGET_VERSION}`);
}

// 自動 format using prettier
try {
  execSync(`npx prettier --write ${SPEC_PATH}`, { stdio: 'inherit' });
  console.log('✨ Prettier formatted the OpenAPI JSON');
} catch (error) {
  console.warn('⚠️  Prettier format failed. Is Prettier installed?');
}