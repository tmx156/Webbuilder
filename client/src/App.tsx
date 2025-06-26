import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Lazy load all pages for better performance
const Home = lazy(() => import('@/pages/home'));
const LandingPage = lazy(() => import('@/pages/landing-page'));
const LandingAds = lazy(() => import('@/pages/landingads'));
const ModelApplication = lazy(() => import('@/pages/model-application'));
const ModelApplicationAds = lazy(() => import('@/pages/model-application-ads'));
const Careers = lazy(() => import('@/pages/careers'));
const FAQ = lazy(() => import('@/pages/faq'));
const Ads = lazy(() => import('@/pages/ads'));
const Snapchat = lazy(() => import('@/pages/snapchat'));
const PrivacyPolicy = lazy(() => import('@/pages/privacy-policy'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
      <p className="text-white text-lg font-light">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/landingads" element={<LandingAds />} />
              <Route path="/model-application" element={<ModelApplication />} />
              <Route path="/model-application-ads" element={<ModelApplicationAds />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/snapchat" element={<Snapchat />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
