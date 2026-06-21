import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

const defaultSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  sizes = defaultSizes,
}) => {
  const [loaded, setLoaded] = useState(false);

  // Only generate srcSet for images that actually have responsive versions
  // For now, disable automatic srcSet generation to avoid invalid URLs
  const shouldUseSrcSet = false; // Change to true when you have actual responsive image variants
  
  const srcSet = shouldUseSrcSet ? [320, 640, 1024, 1600]
    .map(size => `${src.replace(/\.[^/.]+$/, `-${size}w$&`)}`)
    .join(', ') : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={`${className || ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setLoaded(true)}
    />
  );
};

export default OptimizedImage;
