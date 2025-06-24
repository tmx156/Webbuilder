import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SignupForm from "./signup-form";
import WebGLBackground from "./webgl-background";

// Add categories data for the boxes at the bottom
const categories = [
  {
    id: "child-teen",
    title: "Child & Teen",
    description: "Fresh faces, big dreams",
  },
  {
    id: "male",
    title: "Male",
    description: "Editorial. Commercial. Iconic.",
  },
  {
    id: "female",
    title: "Female",
    description: "From beauty to catwalk.",
  },
  {
    id: "mature",
    title: "Mature",
    description: "Style has no age.",
  }
];

export default function HeroSection({ categoryOverride }: { categoryOverride?: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);

  // Preload critical background image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    // Use smaller, optimized image for mobile
    const isMobile = window.innerWidth < 768;
    img.src = isMobile 
      ? "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=75"
      : "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80";
  }, []);

  // Delay WebGL loading to prioritize critical content
  useEffect(() => {
    const timer = setTimeout(() => setShowWebGL(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const backgroundImageUrl = typeof window !== 'undefined' && window.innerWidth < 768
    ? "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=75"
    : "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80";

  return (
    <div className="relative min-h-screen">
      {/* Critical CSS background with immediate fallback */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      
      {/* Background Image - Optimized loading */}
      <div
        className={`absolute inset-0 -z-20 bg-cover bg-center transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          willChange: 'opacity'
        }}
        aria-label="Diverse fashion models in editorial style"
      ></div>
      
      {/* WebGL-style animated overlay - Lazy loaded */}
      {showWebGL && (
        <div className="absolute inset-0 -z-10">
          <WebGLBackground />
        </div>
      )}
      
      {/* Main Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4">
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white drop-shadow-2xl mb-4"
            style={{ 
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
              willChange: 'transform'
            }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            MODELS WANTED
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-8 drop-shadow-lg"
            style={{ 
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              willChange: 'transform'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            All ages. All backgrounds. One chance to shine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{ willChange: 'transform' }}
          >
            <SignupForm categoryOverride={categoryOverride} />
          </motion.div>
        </div>
      </section>
      
      {/* Category boxes in a separate section below the hero */}
      <section className="py-4 relative z-10">
        <div className="grid grid-cols-4 gap-2 px-4 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:bg-black/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="p-3 text-white text-center">
                <h3 className="text-sm md:text-base font-medium">{category.title}</h3>
                <p className="text-xs text-white/80 hidden md:block">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
