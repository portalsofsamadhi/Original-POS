import sharp from 'sharp';
import fs from 'fs';

async function convertBgImage() {
    const bgImage = 'public/images - Copy/alexis-plasencia-tTHLZtGL4Os-unsplash.jpg';
    if (fs.existsSync(bgImage)) {
        const webpPath = bgImage.replace('.jpg', '.webp');
        console.log('Converting background image:', bgImage);
        await sharp(bgImage).webp({ quality: 85 }).toFile(webpPath);
        console.log('✅ Background image converted to WebP');
        
        // Update references in code
        const filesToUpdate = [
            'src/components/home.tsx',
            'src/pages/courses.tsx'
        ];
        
        for (const file of filesToUpdate) {
            if (fs.existsSync(file)) {
                let content = fs.readFileSync(file, 'utf8');
                const oldRef = "'/images/genevieve-dallaire-7zT-vbOFoSM-unsplash.jpg'";
                const newRef = "'/images - Copy/alexis-plasencia-tTHLZtGL4Os-unsplash.webp'";
                
                if (content.includes(oldRef)) {
                    content = content.replace(new RegExp(oldRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef);
                    fs.writeFileSync(file, content);
                    console.log(`✅ Updated background reference in ${file}`);
                }
            }
        }
    } else {
        console.log('Background image not found');
    }
}

convertBgImage();
