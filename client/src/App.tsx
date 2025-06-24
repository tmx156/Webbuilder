import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

// Lazy load non-critical pages for better performance
const Home = lazy(() => import("@/pages/home"));
const LandingPage = lazy(() => import("@/pages/landing-page"));
const ModelApplication = lazy(() => import("@/pages/model-application"));
const ModelApplicationAds = lazy(() => import("@/pages/model-application-ads"));
const NotFound = lazy(() => import("@/pages/not-found"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const FAQ = lazy(() => import("@/pages/faq"));
const Careers = lazy(() => import("@/pages/careers"));
const AdsPage = lazy(() => import("@/pages/ads"));
const LandingAdsPage = lazy(() => import("@/pages/landingads"));
const Snapchat = lazy(() => import("@/pages/snapchat"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/landing" component={LandingPage} />
        <Route path="/model-application" component={ModelApplication} />
        <Route path="/model-application-ads" component={ModelApplicationAds} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/faq" component={FAQ} />
        <Route path="/careers" component={Careers} />
        <Route path="/ads" component={AdsPage} />
        <Route path="/landingads" component={LandingAdsPage} />
        <Route path="/snapchat" component={Snapchat} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
