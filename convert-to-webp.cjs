const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images - Copy/Phone'; // Change to your images folder

function convertToWebp(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const output = filePath.replace(ext, '.webp');
  
  // Skip if webp already exists
  if (fs.existsSync(output)) {
    console.log(`Skipping (already exists): ${output}`);
    return;
  }

  sharp(filePath)
    .webp({ quality: 92 })
    .toFile(output)
    .then(() => console.log(`Converted: ${path.basename(filePath)} -> ${path.basename(output)}`))
    .catch(err => console.error(`Error converting ${filePath}:`, err.message));
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }
  
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      convertToWebp(fullPath);
    }
  });
}

console.log(`Converting images in: ${path.resolve(inputDir)}`);
walkDir(inputDir);
