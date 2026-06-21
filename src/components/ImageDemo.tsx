import React from 'react';
import OptimizedImage from './ui/OptimizedImage';

type ImageDemoProps = Record<string, never>;

const ImageDemo: React.FC<ImageDemoProps> = () => {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-2xl font-bold text-primary">Optimized Images Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example usage with different sizes and properties */}
        <div className="flex flex-col gap-2">
          <OptimizedImage 
            src="/images/your-image.jpg" 
            alt="Description" 
            className="rounded-lg shadow-md"
          />
          <span className="text-sm text-center text-muted-foreground">Basic usage</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <OptimizedImage 
            src="/public/images/silas-baisch-K785Da4A_JA-unsplash.jpg" 
            alt="Mountain landscape" 
            className="rounded-lg shadow-md hover:shadow-lg transition-all" 
            width={400}
            height={300}
          />
          <span className="text-sm text-center text-muted-foreground">With specified dimensions</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <OptimizedImage 
            src="/public/images/francesco-ungaro-nlqqldluDBw-unsplash.jpg" 
            alt="Nature scene" 
            className="rounded-lg shadow-md aspect-square object-cover" 
            loading="eager"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <span className="text-sm text-center text-muted-foreground">Custom loading and sizes</span>
        </div>
      </div>
      
      <p className="max-w-2xl text-center text-muted-foreground mt-6">
        The OptimizedImage component automatically handles responsive image loading, 
        lazy loading, and smooth fade-in transitions to improve user experience and page performance.
      </p>
    </div>
  );
};

export default ImageDemo;
