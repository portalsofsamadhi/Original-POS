// Social Media Crawler Detection and Meta Tag Injection
// This script must run IMMEDIATELY to catch social media crawlers

(function() {
    // List of social media crawler user agents
    const socialMediaCrawlers = [
        'facebookexternalhit',
        'Twitterbot', 
        'LinkedInBot',
        'WhatsApp',
        'Applebot',
        'SkypeUriPreview',
        'Slackbot',
        'TelegramBot',
        'DiscordBot',
        'Googlebot',
        'bingbot',
        'facebookcatalog',
        'LinkedInBot',
        'Discordbot',
        'Twitterbot',
        'WhatsApp',
        'SkypeUriPreview'
    ];
    
    // Get current user agent
    const userAgent = navigator.userAgent || '';
    
    // Check if current user agent is a social media crawler
    const isSocialCrawler = socialMediaCrawlers.some(crawler => 
        userAgent.toLowerCase().includes(crawler.toLowerCase())
    );
    
    // Also check for common crawler patterns
    const crawlerPatterns = ['bot', 'crawler', 'spider', 'scraper'];
    const isCrawlerPattern = crawlerPatterns.some(pattern => 
        userAgent.toLowerCase().includes(pattern)
    );
    
    if (isSocialCrawler || isCrawlerPattern) {
        console.log('Social media crawler detected:', userAgent);
        
        // Get current path
        const currentPath = window.location.pathname;
        
        // Clear existing title and meta tags
        document.title = '';
        const existingMetas = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[name="author"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]');
        existingMetas.forEach(meta => meta.remove());
        
        // Define meta tags for each page
        let pageData = {};
        
        switch(currentPath) {
            case '/feqad-services':
                pageData = {
                    title: 'Dr. Feqad Wolde | Authentic Jamaican Traditional Healing & Spiritual Guidance',
                    description: 'Experience transformative traditional healing and spiritual guidance with Dr. Feqad Wolde, master Jamaican healer. Offering authentic energy healing, chakra alignment, and indigenous spiritual practices to global clients.',
                    keywords: 'jamaican traditional healer, dr feqad wolde, spiritual guidance, energy healing, chakra alignment, indigenous healing, traditional healing jamaica',
                    image: 'https://portalsofsamadhi.com/feqad-wolde.webp',
                    imageAlt: 'Dr. Feqad Wolde - Authentic Jamaican Traditional Healer',
                    canonical: 'https://portalsofsamadhi.com/feqad-services'
                };
                break;
            case '/mesqal-services':
                pageData = {
                    title: 'Mesqal Kebra | Global Virtual Assistant & Creative Business Support',
                    description: 'Professional virtual assistant and creative business support services designed specifically for wellness practitioners, healers, coaches, and impact-driven entrepreneurs worldwide.',
                    keywords: 'virtual assistant, business support, wellness practitioners, creative business, remote assistant, global virtual services, mesqal kebra',
                    image: 'https://portalsofsamadhi.com/mesqal-kebra.webp',
                    imageAlt: 'Mesqal Kebra - Global Virtual Assistant & Creative Business Support',
                    canonical: 'https://portalsofsamadhi.com/mesqal-services'
                };
                break;
            case '/lifestyle-shift':
                pageData = {
                    title: 'Lifestyle Shift | Holistic Transformation Programs',
                    description: 'Transform your life with integrated holistic healing and strategic business support. Combining traditional healing mastery with virtual assistance excellence for complete lifestyle transformation.',
                    keywords: 'lifestyle transformation, holistic healing, wellness programs, life coaching, spiritual transformation, lifestyle shift',
                    image: 'https://portalsofsamadhi.com/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp',
                    imageAlt: 'Lifestyle Shift - Holistic Transformation Programs',
                    canonical: 'https://portalsofsamadhi.com/lifestyle-shift'
                };
                break;
            case '/retreat-tours-workshops':
                pageData = {
                    title: 'Jamaica Retreat Tours & Healing Adventures | Authentic Cultural Immersion',
                    description: 'Experience authentic Jamaican retreat tours combining traditional healing, cultural immersion, and natural beauty. Join our family-led adventures to hidden gems and transformative experiences.',
                    keywords: 'jamaica retreats, healing tours, cultural immersion, jamaican adventures, wellness retreats, spiritual tours jamaica',
                    image: 'https://portalsofsamadhi.com/images - Copy/Phone/IMG_20250619_144257012_HDR.webp',
                    imageAlt: 'Jamaica Retreat Tours - Authentic Cultural Healing Adventures',
                    canonical: 'https://portalsofsamadhi.com/retreat-tours-workshops'
                };
                break;
            case '/blog':
                pageData = {
                    title: 'Wellness Blog | Holistic Health & Spiritual Growth',
                    description: 'Explore holistic wellness insights, spiritual growth practices, and transformative healing wisdom. Discover authentic approaches to mind, body, and spirit wellness.',
                    keywords: 'wellness blog, holistic health, spiritual growth, healing wisdom, wellness insights, mind body spirit',
                    image: 'https://portalsofsamadhi.com/images - Copy/Site Files/dji_fly_20241106_071758_19_1730895488211_photo_edited.webp',
                    imageAlt: 'Wellness Blog - Holistic Health & Spiritual Growth',
                    canonical: 'https://portalsofsamadhi.com/blog'
                };
                break;
            default:
                pageData = {
                    title: 'Samadhi Productions | Thoughtful Media. Immersive Worlds.',
                    description: 'High-end short-form series, music videos, and immersive digital experiences rooted in Afro-futurist beauty and spiritual depth. Samadhi Productions, the cinematic studio of Portals of Samadhi.',
                    keywords: 'samadhi productions, afro-futurist cinematic production, short form video, music visuals, portals of samadhi',
                    image: 'https://portalsofsamadhi.com/samadhi-productions-logo.webp',
                    imageAlt: 'Samadhi Productions phoenix logo, Afro-futuristic cinematic production studio',
                    canonical: 'https://portalsofsamadhi.com'
                };
        }
        
        // Set page title
        document.title = pageData.title;
        
        // Create basic meta tags
        const metaTags = [
            { name: 'description', content: pageData.description },
            { name: 'keywords', content: pageData.keywords },
            { name: 'author', content: 'Portals of Samadhi' }
        ];
        
        // Create canonical link
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = pageData.canonical;
        document.head.appendChild(canonical);
        
        // Create Open Graph meta tags
        const ogTags = [
            { property: 'og:title', content: pageData.title },
            { property: 'og:description', content: pageData.description },
            { property: 'og:image', content: pageData.image },
            { property: 'og:image:alt', content: pageData.imageAlt },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:type', content: 'image/webp' },
            { property: 'og:url', content: pageData.canonical },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'Portals of Samadhi' },
            { property: 'og:locale', content: 'en_US' }
        ];
        
        // Create Twitter Card meta tags
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: pageData.title },
            { name: 'twitter:description', content: pageData.description },
            { name: 'twitter:image', content: pageData.image },
            { name: 'twitter:image:alt', content: pageData.imageAlt },
            { name: 'twitter:site', content: '@portalsofsamadhi' },
            { name: 'twitter:creator', content: '@portalsofsamadhi' }
        ];
        
        // Add all meta tags to head
        [...metaTags, ...ogTags, ...twitterTags].forEach(tag => {
            const meta = document.createElement('meta');
            Object.entries(tag).forEach(([key, value]) => {
                meta.setAttribute(key, value);
            });
            document.head.appendChild(meta);
        });
        
        console.log('Meta tags injected for social crawler');
    }
})();
