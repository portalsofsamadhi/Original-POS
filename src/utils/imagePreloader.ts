/**
 * Utility to force immediate loading of critical images
 * This prevents the browser preload warning by ensuring images are used quickly
 */

export const forceImageLoad = (imagePaths: string[]): void => {
  imagePaths.forEach(path => {
    const img = new Image();
    img.src = path;
    
    // Add loading attribute for better performance
    img.loading = 'eager';
    img.decoding = 'async';
    
    img.onload = () => {
      // Image loaded successfully - reduce console noise
      // console.log(`Critical image loaded: ${path}`);
    };
    img.onerror = () => {
      console.warn(`Failed to load critical image: ${path}`);
    };
  });
};

// Preload critical images with WebP support detection
export const preloadCriticalImages = (): void => {
  const criticalImages = [
    '/poslogo.webp',
    '/Welcome.webp',
    '/images - Copy/Phone/1st mobile.webp',
    '/images - Copy/Phone/2nd mobile.webp', 
    '/images - Copy/Phone/3rd mobile.webp',
    '/images - Copy/Phone/4th mobile.webp',
    '/samadhi-productions-logo.webp',
    '/samadhi-transparent-logo.png'
  ];

  // Check for WebP support
  const supportsWebP = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();

  if (supportsWebP) {
    // WebP is supported - reduce console noise
    // console.log('WebP supported - consider converting images');
  }

  forceImageLoad(criticalImages);
};

// Auto-load critical images when this module is imported
preloadCriticalImages();
