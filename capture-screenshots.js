const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('index.html');
const outDir = path.resolve('screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 1350 },
  { name: 'tablet-768', width: 768, height: 1600 },
  { name: 'mobile-375', width: 375, height: 2100 }
];

viewports.forEach(vp => {
  const outFile = path.join(outDir, `${vp.name}.png`);
  console.log(`Capturing ${vp.name}...`);
  try {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=2000 --window-size=${vp.width},${vp.height} --screenshot="${outFile}" "file://${htmlPath}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log(`Success: ${outFile} exists?`, fs.existsSync(outFile));
  } catch (err) {
    console.error(`Failed ${vp.name}:`, err.message);
  }
});
