// Social Media Crawler Fallback Script
// This ensures meta tags are available for social media crawlers that don't execute JavaScript
(function() {
  // Only run if React hasn't loaded yet (for social media crawlers)
  if (typeof window !== 'undefined' && !window.React) {
    const head = document.head;
    
    // Default meta tags for social media sharing
    const defaultTags = [
      { property: 'og:title', content: 'Samadhi Productions | Thoughtful Media. Immersive Worlds.' },
      { property: 'og:description', content: 'High-end short-form series, music videos, and immersive digital experiences rooted in Afro-futurist beauty and spiritual depth.' },
      { property: 'og:image', content: 'https://portalsofsamadhi.com/samadhi-productions-logo.webp' },
      { property: 'og:image:alt', content: 'Samadhi Productions phoenix logo, Afro-futuristic cinematic production studio' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/webp' },
      { property: 'og:url', content: 'https://portalsofsamadhi.com' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Samadhi Productions' },
      { property: 'og:locale', content: 'en_US' }
    ];
    
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Samadhi Productions | Thoughtful Media. Immersive Worlds.' },
      { name: 'twitter:description', content: 'Premium short-form series, music videos, and immersive digital experiences rooted in Afro-futurist beauty and spiritual depth.' },
      { name: 'twitter:image', content: 'https://portalsofsamadhi.com/samadhi-productions-logo.webp' },
      { name: 'twitter:image:alt', content: 'Samadhi Productions phoenix logo' },
      { name: 'twitter:site', content: '@portalsofsamadhi' },
      { name: 'twitter:creator', content: '@portalsofsamadhi' }
    ];
    
    // Add Open Graph tags
    defaultTags.forEach(tag => {
      if (!head.querySelector(`meta[property="${tag.property}"]`)) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        head.appendChild(meta);
      }
    });
    
    // Add Twitter Card tags
    twitterTags.forEach(tag => {
      if (!head.querySelector(`meta[name="${tag.name}"]`)) {
        const meta = document.createElement('meta');
        meta.setAttribute('name', tag.name);
        meta.setAttribute('content', tag.content);
        head.appendChild(meta);
      }
    });
  }
})();
