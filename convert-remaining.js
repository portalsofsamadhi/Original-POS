import sharp from 'sharp';
import fs from 'fs';

const remainingImages = [
    'public/images/Cell Phone/Picsart_25-06-23_02-22-07-116.png',
    'public/images/Cell Phone/Picsart_25-06-23_02-26-36-945.png',
    'public/images/Cell Phone/Picsart_25-06-23_02-29-13-465.png',
    'public/images/Cell Phone/Picsart_25-06-23_02-30-52-289.png',
    'public/images/Cell Phone/Picsart_25-06-23_02-43-32-743.png',
    'public/images - Copy/Phone/IMG_20250619_144257012_HDR.jpg',
    'public/images - Copy/Phone/Picsart_25-07-16_20-20-28-046.png',
    'public/images - Copy/Site Files/Picsart_22-06-21_21-55-35-921_edited.jpg',
    'public/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.jpg'
];

async function convertRemainingImages() {
    console.log('Converting remaining images to WebP...');
    const conversions = [];
    
    for (const imagePath of remainingImages) {
        if (fs.existsSync(imagePath)) {
            const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            try {
                console.log(`Converting: ${imagePath}`);
                await sharp(imagePath).webp({ quality: 85 }).toFile(webpPath);
                
                const oldRef = '/' + imagePath.replace('public/', '');
                const newRef = '/' + webpPath.replace('public/', '');
                
                conversions.push({ oldRef, newRef });
                console.log(`✅ Converted: ${newRef}`);
            } catch (error) {
                console.log(`❌ Error converting ${imagePath}:`, error.message);
            }
        } else {
            console.log(`⚠️  Not found: ${imagePath}`);
        }
    }
    
    // Update code references
    const filesToUpdate = [
        'src/pages/retreat-tours-workshops.tsx',
        'src/components/home.tsx',
        'src/components/home/about/WhoWeAreSection.tsx',
        'src/styles/preload-images.css'
    ];
    
    for (const file of filesToUpdate) {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            let updated = false;
            
            for (const { oldRef, newRef } of conversions) {
                if (content.includes(oldRef)) {
                    content = content.replace(new RegExp(oldRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRef);
                    updated = true;
                }
            }
            
            if (updated) {
                fs.writeFileSync(file, content);
                console.log(`✅ Updated ${file}`);
            }
        }
    }
    
    console.log('All remaining images converted!');
}

convertRemainingImages();
