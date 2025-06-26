import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Optimize loading by deferring non-critical operations
const optimizeInitialLoad = () => {
  // Preload critical resources
  const criticalResources = [
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=75",
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap"
  ];

  criticalResources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = url.includes('fonts.googleapis') ? 'style' : 'image';
    link.href = url;
    if (url.includes('fonts.googleapis')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

// Register service worker for performance improvements (only in production)
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Initialize app with performance optimizations
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  // Create root and render app
  const root = createRoot(rootElement);
  root.render(<App />);
};

// Optimize loading sequence
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    optimizeInitialLoad();
    initializeApp();
    registerServiceWorker();
  });
} else {
  optimizeInitialLoad();
  initializeApp();
  registerServiceWorker();
}
