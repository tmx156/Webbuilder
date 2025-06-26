// Enhanced Service Worker for Maximum Performance
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `levelonetalent-static-${CACHE_VERSION}`;
const IMAGES_CACHE = `levelonetalent-images-${CACHE_VERSION}`;
const FONTS_CACHE = `levelonetalent-fonts-${CACHE_VERSION}`;
const API_CACHE = `levelonetalent-api-${CACHE_VERSION}`;

// Critical static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/critical.css',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest'
];

// External resources to cache for performance
const EXTERNAL_RESOURCES = [
  // Google Fonts - cache for instant loading
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap',
  // Hero background images - both mobile and desktop versions
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&h=1024&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Enhanced SW: Installing with aggressive caching...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache external resources
      caches.open(IMAGES_CACHE).then(cache => {
        console.log('SW: Caching external images and fonts');
        return cache.addAll(EXTERNAL_RESOURCES.map(url => new Request(url, {
          mode: 'cors',
          credentials: 'omit'
        })));
      })
    ]).then(() => {
      console.log('SW: All critical resources cached');
      return self.skipWaiting();
    }).catch(error => {
      console.log('SW: Cache installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Enhanced SW: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheName.includes(CACHE_VERSION)) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activated and ready');
      return self.clients.claim();
    })
  );
});

// Enhanced fetch event with smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests with optimal caching strategies
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    // Fonts: Cache first (fonts never change)
    event.respondWith(handleFonts(request));
  } else if (url.hostname === 'images.unsplash.com') {
    // Images: Cache first with long TTL
    event.respondWith(handleImages(request));
  } else if (url.pathname.startsWith('/api/')) {
    // API: Network first with short cache (5 minutes)
    event.respondWith(handleAPI(request));
  } else if (url.origin === self.location.origin) {
    // Static assets: Stale while revalidate
    event.respondWith(handleStatic(request));
  }
});

// Cache-first strategy for fonts (never change)
async function handleFonts(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('SW: Font served from cache');
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(FONTS_CACHE);
      cache.put(request, response.clone());
      console.log('SW: Font cached');
    }
    return response;
  } catch (error) {
    console.log('SW: Font fetch failed:', error);
    return caches.match(request);
  }
}

// Cache-first strategy for images
async function handleImages(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('SW: Image served from cache');
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(IMAGES_CACHE);
      cache.put(request, response.clone());
      console.log('SW: Image cached');
    }
    return response;
  } catch (error) {
    console.log('SW: Image fetch failed:', error);
    return caches.match(request);
  }
}

// Network-first with cache fallback for API
async function handleAPI(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      // Cache API responses for 5 minutes
      const responseWithTTL = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          'sw-cache-timestamp': Date.now()
        }
      });
      cache.put(request, responseWithTTL.clone());
      console.log('SW: API response cached');
    }
    return response;
  } catch (error) {
    console.log('SW: API fetch failed, trying cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
      const isExpired = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp) > 300000); // 5 minutes
      if (!isExpired) {
        return cachedResponse;
      }
    }
    throw error;
  }
}

// Stale-while-revalidate for static assets
async function handleStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Serve from cache immediately if available
  if (cachedResponse) {
    console.log('SW: Static asset served from cache');
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
        console.log('SW: Static asset cache updated');
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    return cachedResponse;
  }
  
  // If not in cache, fetch and cache
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      console.log('SW: Static asset cached');
    }
    return response;
  } catch (error) {
    console.log('SW: Static fetch failed:', error);
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    throw error;
  }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-signup') {
    event.waitUntil(handleBackgroundSync());
  }
});

function handleBackgroundSync() {
  console.log('SW: Background sync triggered');
  return Promise.resolve();
}

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    caches.open(IMAGES_CACHE).then(cache => {
      return cache.addAll(urls);
    });
  }
}); 