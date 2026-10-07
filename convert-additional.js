import sharp from 'sharp';
import fs from 'fs';

const additionalImages = [
    'public/images/genevieve-dallaire-7zT-vbOFoSM-unsplash.jpg',
    'public/images/testimonials/hildegard-avatar.jpg',
    'public/images/testimonials/hugo-avatar.jpg', 
    'public/images/testimonials/carol-avatar.jpg',
    'public/images/testimonials/julia-avatar.jpg'
];

async function convertAdditional() {
    console.log('Converting additional images...');
    
    for (const imagePath of additionalImages) {
        if (fs.existsSync(imagePath)) {
            const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            console.log('Converting:', imagePath, '->', webpPath);
            
            try {
                await sharp(imagePath).webp({ quality: 85 }).toFile(webpPath);
                console.log('✅ Converted:', webpPath);
            } catch (error) {
                console.log('❌ Error:', error.message);
            }
        } else {
            console.log('❌ Not found:', imagePath);
        }
    }
    console.log('Additional conversions complete!');
}

convertAdditional();
