import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const exts = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
const rootDirs = ['public', 'src'];
const converted = [];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

async function convertImages() {
  for (const root of rootDirs) {
    if (!fs.existsSync(root)) continue;
    const files = walk(root);
    for (const file of files) {
      if (exts.some(ext => file.endsWith(ext))) {
        const webpFile = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        try {
          await sharp(file).webp({ quality: 85 }).toFile(webpFile);
          converted.push({ old: file, webp: webpFile });
          console.log('Converted:', file, '->', webpFile);
        } catch (e) {
          console.log('Error converting', file, e.message);
        }
      }
    }
  }
  updateReferences();
}

function updateReferences() {
  // Update all .tsx, .ts, .js, .jsx, .json, .css files
  const codeExts = ['.tsx', '.ts', '.js', '.jsx', '.json', '.css', '.html'];
  for (const root of rootDirs) {
    if (!fs.existsSync(root)) continue;
    const files = walk(root);
    for (const file of files) {
      if (codeExts.some(ext => file.endsWith(ext))) {
        let content = fs.readFileSync(file, 'utf8');
        let updated = false;
        for (const { old, webp } of converted) {
          const oldRef = '/' + path.relative('public', old).replace(/\\/g, '/');
          const webpRef = '/' + path.relative('public', webp).replace(/\\/g, '/');
          if (content.includes(oldRef)) {
            content = content.replace(new RegExp(oldRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), webpRef);
            updated = true;
          }
        }
        if (updated) {
          fs.writeFileSync(file, content);
          console.log('Updated references in', file);
        }
      }
    }
  }
  console.log('All image conversions and reference updates complete!');
}

convertImages();
