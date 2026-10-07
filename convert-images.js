import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Main images that are visible on website pages
const imagesToConvert = [
    'public/feqad-wolde.jpg',
    'public/mesqal-kebra.jpg', 
    'public/Welcome.png',
    'public/poslogo.png',
    'public/images/genevieve-dallaire-7zT-vbOFoSM-unsplash.jpg',
    'public/images/testimonials/hildegard-avatar.jpg',
    'public/images/testimonials/hugo-avatar.jpg', 
    'public/images/testimonials/carol-avatar.jpg',
    'public/images/testimonials/julia-avatar.jpg'
];

// Files to update with new WebP references
const filesToUpdate = [
    'src/components/home.tsx',
    'src/components/home/Hero.tsx', 
    'src/components/home/about/WhoWeAreSection.tsx',
    'src/pages/retreat-tours-workshops.tsx',
    'src/pages/feqad-services.tsx',
    'src/pages/mesqal-services.tsx',
    'src/utils/imagePreloader.ts'
];

const convertedMappings = [];

async function convertToWebP() {
    console.log('🖼️  Converting main website images to WebP format...');
    
    for (const imagePath of imagesToConvert) {
        if (fs.existsSync(imagePath)) {
            const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            try {
                console.log(`Converting: ${imagePath} -> ${webpPath}`);
                
                await sharp(imagePath)
                    .webp({ quality: 85 })
                    .toFile(webpPath);
                
                const oldRef = '/' + imagePath.replace('public/', '');
                const newRef = '/' + webpPath.replace('public/', '');
                
                convertedMappings.push({
                    original: imagePath,
                    webp: webpPath,
                    oldRef: oldRef,
                    newRef: newRef
                });
                
                console.log(`✅ Converted successfully: ${oldRef} -> ${newRef}`);
            } catch (error) {
                console.error(`❌ Error converting ${imagePath}:`, error.message);
            }
        } else {
            console.log(`⚠️  File not found: ${imagePath}`);
        }
    }
    
    console.log('\n📝 Updating code references...');
    updateCodeReferences();
}

function updateCodeReferences() {
    for (const file of filesToUpdate) {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            let updated = false;
            
            for (const mapping of convertedMappings) {
                const { oldRef, newRef } = mapping;
                
                if (content.includes(oldRef)) {
                    content = content.replace(new RegExp(escapeRegExp(oldRef), 'g'), newRef);
                    updated = true;
                    console.log(`  Updated reference in ${file}: ${oldRef} -> ${newRef}`);
                }
            }
            
            if (updated) {
                fs.writeFileSync(file, content);
                console.log(`✅ Updated ${file}`);
            }
        } else {
            console.log(`⚠️  File not found: ${file}`);
        }
    }
    
    console.log('\n🎉 Conversion complete!');
    console.log(`📊 Converted ${convertedMappings.length} images to WebP format`);
    console.log(`🔧 Updated code references in ${filesToUpdate.length} files`);
    console.log('\n💡 Note: Original images are preserved. You can delete them manually if desired.');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

convertToWebP().catch(console.error);
