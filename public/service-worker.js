// Service Worker for caching images and improving load times
const CACHE_NAME = 'pos-images-v3';
const CRITICAL_IMAGES = [
  '/poslogo.webp',
  '/Welcome.webp',
  '/feqad-wolde.webp',
  '/mesqal-kebra.webp',
  '/images - Copy/Phone/1st mobile.webp',
  '/images - Copy/Phone/2nd mobile.webp',
  '/images - Copy/Phone/3rd mobile.webp',
  '/images - Copy/Phone/4th mobile.webp',
  '/google-logo.svg'
];

// Install event - cache critical images
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical images');
        return cache.addAll(CRITICAL_IMAGES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve images from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Never cache or intercept video files, they must stream from the network
  if (
    event.request.destination === 'video' ||
    event.request.url.includes('.mp4') ||
    event.request.url.includes('.webm')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Short-form thumbnails must always come fresh from the network
  if (event.request.url.includes('/Shorts/thumbnails/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Only handle image requests
  if (event.request.destination === 'image' ||
      event.request.url.includes('.png') || 
      event.request.url.includes('.jpg') || 
      event.request.url.includes('.jpeg') || 
      event.request.url.includes('.svg') || 
      event.request.url.includes('.webp')) {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version only if it is a real image
          if (response) {
            const type = response.headers.get('content-type') || '';
            if (type.startsWith('image/')) {
              return response;
            }
          }
          
          // Fetch from network and cache the response
          return fetch(event.request)
            .then((response) => {
              // Don't cache if not a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clone the response
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Return fallback image if available
              if (event.request.url.includes('profile') || event.request.url.includes('avatar')) {
                return caches.match('/poslogo.webp');
              }
            });
        })
    );
  } else {
    // For non-image requests, use basic caching strategy
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
