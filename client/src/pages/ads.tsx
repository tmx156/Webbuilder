import React, { useState, useEffect } from 'react';
import HeroSection from "@/components/hero-section";
import CategoriesSection from "@/components/categories-section";
import TestimonialsSection from "@/components/testimonials-section";
import BrandsSection from "@/components/brands-section";
import Footer from "@/components/footer";

// Enhanced Logo Header Component
const EnhancedLogoHeader = () => {
  const [animatedLogo, setAnimatedLogo] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const logoText = "LEVELONETALENT";

  // Enhanced logo animation effect
  useEffect(() => {
    setAnimatedLogo([]);
    
    const logoChars = logoText.split('');
    let timer: ReturnType<typeof setTimeout>;
    
    // Keep elegant timing for animation, but faster completion on mobile
    const isMobile = window.innerWidth < 768;
    const animationDelay = 120; // Keep original elegant timing for all
    const finalDelay = isMobile ? 400 : 800; // Only completion is faster on mobile
    
    logoChars.forEach((char, index) => {
      timer = setTimeout(() => {
        setAnimatedLogo(prev => [...prev, char]);
        
        if (index === logoChars.length - 1) {
          setTimeout(() => setIsAnimating(false), finalDelay);
        }
      }, animationDelay * index);
    });
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-3 transition-all duration-500 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-orange-200/30" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto flex justify-center md:justify-start">
        <div className="relative">
          <span 
            className={`text-xl md:text-lg lg:text-xl tracking-[0.3em] font-light overflow-hidden transition-all duration-500 ${
              scrolled ? "text-[#8B3A3A]" : "text-white"
            }`}
            style={{
              textShadow: scrolled 
                ? '2px 2px 4px rgba(139, 58, 58, 0.1)' 
                : '2px 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.6)',
              fontWeight: '300',
              letterSpacing: '0.3em'
            }}
          >
            {animatedLogo.map((char, index) => (
              <span 
                key={index} 
                className="inline-block"
                style={{ 
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? 'translateY(20px) rotateX(90deg)' : 'translateY(0) rotateX(0deg)',
                  transition: `all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
                  transitionDelay: `${index * 0.12}s`,
                  transformOrigin: 'center bottom',
                  display: 'inline-block',
                  animation: !isAnimating ? `glow 3s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {char}
              </span>
            ))}
          </span>
          
          {/* Glowing underline effect */}
          <div 
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#F8B195] to-[#F67E7E] transition-all duration-1000"
            style={{
              width: isAnimating ? '0%' : '100%',
              boxShadow: '0 0 10px rgba(248, 177, 149, 0.6)',
              transitionDelay: `${logoText.length * 0.12 + 0.5}s`
            }}
          />
          
          {/* Ambient glow effect */}
          <div 
            className="absolute inset-0 -z-10 blur-xl opacity-20 bg-gradient-to-r from-[#F8B195] to-[#F67E7E] transition-opacity duration-2000"
            style={{
              opacity: isAnimating ? 0 : 0.3,
              transitionDelay: `${logoText.length * 0.12 + 1}s`
            }}
          />
        </div>
      </div>
      
      {/* CSS for glow animation */}
      <style>{`
        @keyframes glow {
          0% { text-shadow: 2px 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.6); }
          100% { text-shadow: 2px 2px 8px rgba(0,0,0,0.3), 0 0 25px rgba(248, 177, 149, 0.8), 0 0 35px rgba(248, 177, 149, 0.4); }
        }
      `}</style>
    </header>
  );
};

export default function AdsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-rose-50 to-white overflow-x-hidden">
      <EnhancedLogoHeader />
      <HeroSection categoryOverride="ads" />
      <BrandsSection />
      <CategoriesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
} 