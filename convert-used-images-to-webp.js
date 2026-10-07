import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const codeDirs = ['src', 'public'];
const imageExts = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
const codeExts = ['.tsx', '.ts', '.js', '.jsx', '.json', '.css', '.html'];

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

function findImageRefs() {
  const refs = new Set();
  for (const dir of codeDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = walk(dir);
    for (const file of files) {
      if (codeExts.some(ext => file.endsWith(ext))) {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(/(["'])(\/[^"']+\.(?:jpg|jpeg|png|JPG|JPEG|PNG))["']/g);
        if (matches) {
          matches.forEach(m => {
            const imgPath = m.match(/(["'])(\/[^"']+\.(?:jpg|jpeg|png|JPG|JPEG|PNG))["']/)[2];
            refs.add(imgPath);
          });
        }
      }
    }
  }
  return Array.from(refs);
}

async function convertUsedImages() {
  const refs = findImageRefs();
  const converted = [];
  for (const ref of refs) {
    let imgFile = ref.startsWith('/') ? path.join('public', ref) : ref;
    if (!fs.existsSync(imgFile)) {
      imgFile = path.join('.', ref);
      if (!fs.existsSync(imgFile)) continue;
    }
    const webpFile = imgFile.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    try {
      await sharp(imgFile).webp({ quality: 85 }).toFile(webpFile);
      converted.push({ old: imgFile, webp: webpFile, ref });
      console.log('Converted:', imgFile, '->', webpFile);
    } catch (e) {
      console.log('Error converting', imgFile, e.message);
    }
  }
  updateReferences(converted);
}

function updateReferences(converted) {
  for (const dir of codeDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = walk(dir);
    for (const file of files) {
      if (codeExts.some(ext => file.endsWith(ext))) {
        let content = fs.readFileSync(file, 'utf8');
        let updated = false;
        for (const { ref, webp } of converted) {
          const webpRef = ref.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          if (content.includes(ref)) {
            content = content.replace(new RegExp(ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), webpRef);
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
  console.log('All used image conversions and reference updates complete!');
}

convertUsedImages();
