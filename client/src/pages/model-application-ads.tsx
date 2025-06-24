import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import SignupForm from "@/components/signup-form";
import TestimonialForm from "@/components/testimonial-form";
import { FaCamera, FaCheckCircle, FaPhone, FaStar, FaInstagram, FaTwitter, FaFacebook, FaHeart, FaEnvelope } from "react-icons/fa";
// Facebook Pixel tracking - no import needed

// Add type declaration for the window object
declare global {
  interface Window {
    resizeTimeoutId?: ReturnType<typeof setTimeout>;
  }
}

// Helper function to detect device capability
function detectDevicePerformance() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const lowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
  return (isMobile || lowMemory) ? 'low' : 'high';
}

// Custom WebGL Background Overlay (without background image)
function CustomWebGLOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const performanceTier = useMemo(() => detectDevicePerformance(), []);
  const particleCount = useMemo(() => performanceTier === 'high' ? 30 : 15, [performanceTier]);
  const frameSkip = useMemo(() => performanceTier === 'high' ? 1 : 2, [performanceTier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#ff6b9d', '#c8a2c8', '#98fb98', '#fbbf24'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    let animationFrameId: number;
    let frameCount = 0;

    const animate = () => {
      frameCount = (frameCount + 1) % frameSkip;
      if (frameCount !== 0 && performanceTier === 'low') {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
        }

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    const resizeHandler = () => {
      if (window.resizeTimeoutId) {
        clearTimeout(window.resizeTimeoutId);
      }
      window.resizeTimeoutId = setTimeout(resizeCanvas, 250);
    };
    
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, frameSkip, performanceTier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', background: 'transparent' }}
    />
  );
}

// Custom Animated Lights
function CustomAnimatedLights() {
  const performanceTier = useMemo(() => detectDevicePerformance(), []);
  const animationDuration = useMemo(() => 
    performanceTier === 'high' ? { slow: 20, medium: 16, fast: 12 } : { slow: 25, medium: 20, fast: 16 }, 
    [performanceTier]
  );
  const blurAmount = useMemo(() => 
    performanceTier === 'high' ? 'blur-2xl' : 'blur-xl', 
    [performanceTier]
  );
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className={`absolute w-80 h-80 bg-gradient-radial from-pink-300/15 to-transparent rounded-full ${blurAmount}`}
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: animationDuration.medium,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ left: '10%', top: '20%' }}
      />
      <motion.div
        className={`absolute w-64 h-64 bg-gradient-radial from-purple-300/15 to-transparent rounded-full ${blurAmount}`}
        animate={{
          x: [0, -60, 0],
          y: [0, -30, 0],
          scale: [1.1, 1, 1.1]
        }}
        transition={{
          duration: animationDuration.fast,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{ right: '15%', bottom: '30%' }}
      />
      <motion.div
        className={`absolute w-56 h-56 bg-gradient-radial from-yellow-200/10 to-transparent rounded-full ${blurAmount}`}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: animationDuration.slow,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{ left: '30%', bottom: '20%' }}
      />
    </div>
  );
}

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

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-35 bg-cover bg-[65%_center] md:bg-center"
        style={{
          backgroundImage: "url('https://i.imgur.com/p8VZOQ1.jpg?v=1')"
        }}
        aria-label="Fashion model background"
      ></div>
      
      {/* Custom animated overlays */}
      <div className="absolute inset-0 -z-20">
        <CustomWebGLOverlay />
        <CustomAnimatedLights />
      </div>
      
      {/* Main Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4">
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white drop-shadow-2xl mb-4"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            MODELS WANTED
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-8 drop-shadow-lg"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Sign up in seconds. We'll guide you step by step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <SignupForm />
          </motion.div>
        </div>
        
        {/* Location & Opportunities Section */}
        <motion.div 
          className="absolute bottom-8 left-0 right-0 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
              {/* Locations as pink pills */}
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-base md:text-lg font-bold text-white bg-rose-500/80 px-3 py-1 rounded-full backdrop-blur-sm drop-shadow">London</span>
              </motion.div>
              <span className="text-white/60 drop-shadow-lg">•</span>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-base md:text-lg font-bold text-white bg-rose-500/80 px-3 py-1 rounded-full backdrop-blur-sm drop-shadow">Manchester</span>
              </motion.div>
              <span className="text-white/60 drop-shadow-lg">•</span>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-base md:text-lg font-bold text-white bg-rose-500/80 px-3 py-1 rounded-full backdrop-blur-sm drop-shadow">Birmingham</span>
              </motion.div>
              <span className="text-white/60 drop-shadow-lg">•</span>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-base md:text-lg font-bold text-white bg-rose-500/80 px-3 py-1 rounded-full backdrop-blur-sm drop-shadow">Nationwide</span>
              </motion.div>
              <span className="text-white/60 drop-shadow-lg hidden md:inline">•</span>
              {/* Paid Opportunities as pink pill */}
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-base md:text-lg font-bold text-white bg-rose-500/80 px-3 py-1 rounded-full backdrop-blur-sm drop-shadow">Paid opportunities</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// Three Steps Section Component
const ThreeStepsSection = () => {
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  
  const steps = [
    {
      step: "STEP 1",
      title: "Send Us Your Photo",
      description: "Upload a recent photo of yourself (a clear selfie is fine — no filters). If you're under 18, please include your parent's contact details.",
      icon: FaCamera,
      delay: 0.2
    },
    {
      step: "STEP 2", 
      title: "We Review Your Application",
      description: "Our team will review your photo and details. If selected, we'll contact you (by text or phone) within 24–48 hours to invite you for a test shoot and assessment.",
      icon: FaCheckCircle,
      delay: 0.4
    },
    {
      step: "STEP 3",
      title: "Get Ready for Opportunities", 
      description: "Successful models may be invited to castings and auditions — your chance to impress and start booking real work!",
      icon: FaStar,
      delay: 0.6
    }
  ];

  return (
    <>
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your journey to becoming a model starts here. Follow these simple steps to get discovered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: step.delay }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 h-full border border-rose-100 hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="text-white text-2xl" />
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-rose-600 tracking-wider">
                      {step.step}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of successful models who started their careers with us.
              </p>
              <motion.button
                className="bg-white text-rose-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTestimonialForm(true)}
              >
                Apply Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Form Modal */}
      <AnimatePresence>
        {showTestimonialForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTestimonialForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <TestimonialForm 
                onClose={() => setShowTestimonialForm(false)}
                onBack={() => setShowTestimonialForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Custom Footer Component for Model Application Page
const CustomFooter = () => {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      setSubscribeMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSubscribing(true);
    setSubscribeMessage(null);

    try {
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          category: 'newsletter',
          // Add minimal required fields for the API
          name: 'Newsletter Subscriber',
          age: 'N/A',
          gender: 'N/A',
          mobile: 'N/A',
          postcode: 'N/A'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      // ✅ Facebook Pixel tracking only
      try {
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Subscribe', {
            content_name: 'Newsletter Signup',
            value: 1, // £1 newsletter value
            currency: 'GBP'
          });
          console.log('✅ Newsletter signup tracked via Facebook Pixel');
        } else {
          console.warn('⚠️ Facebook Pixel not loaded');
        }
      } catch (error) {
        console.error('❌ Facebook Pixel tracking failed:', error);
      }

      setNewsletterEmail("");
      setSubscribeMessage({ type: 'success', text: 'Successfully subscribed!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubscribeMessage(null);
      }, 3000);
    } catch (error) {
      setSubscribeMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-white to-rose-50/50 overflow-hidden">
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(251, 113, 133, 0.1) 35px, rgba(251, 113, 133, 0.1) 70px)`,
          animation: 'slide 20s linear infinite'
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* Top decorative line */}
        <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
        
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-serif tracking-[0.15em] text-gray-900 mb-4">
                  LEVELONETALENT
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
                  Discover your potential. Join the next generation of models making their mark in the fashion industry.
                </p>
                {/* Newsletter Signup */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Stay Updated</p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                    <div className="flex">
                      <input 
                        type="email" 
                        placeholder="Your email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-l-lg focus:outline-none focus:border-rose-300 bg-white/70"
                        disabled={isSubscribing}
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium rounded-r-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
                        disabled={isSubscribing}
                      >
                        {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                      </button>
                    </div>
                    {subscribeMessage && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs ${subscribeMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {subscribeMessage.text}
                      </motion.p>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">Contact Us</h4>
                <div className="space-y-3">
                  {[
                    { label: "General", email: "Info@levelonetalent.co.uk" },
                    { label: "Bookings", email: "bookings@levelonetalent.co.uk" },
                    { label: "Press", email: "Press@levelonetalent.co.uk" }
                  ].map((item) => (
                    <div 
                      key={item.email}
                      className="group"
                      onMouseEnter={() => setHoveredEmail(item.email)}
                      onMouseLeave={() => setHoveredEmail(null)}
                    >
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <a 
                        href={`mailto:${item.email}`}
                        className="text-sm text-gray-700 hover:text-rose-600 transition-colors duration-300 flex items-center"
                      >
                        <span className="relative">
                          {item.email}
                          <span className={`absolute bottom-0 left-0 w-full h-px bg-rose-500 transform origin-left transition-transform duration-300 ${
                            hoveredEmail === item.email ? 'scale-x-100' : 'scale-x-0'
                          }`}></span>
                        </span>
                        <motion.span
                          className="ml-2 text-rose-500"
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: hoveredEmail === item.email ? 0 : -5, opacity: hoveredEmail === item.email ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </motion.span>
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">Information</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/privacy-policy" className="text-sm text-gray-600 hover:text-rose-600 transition-colors duration-300">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <span className="text-sm text-gray-600">Terms of Service</span>
                  </li>
                  <li>
                    <span className="text-sm text-gray-600">Cookie Policy</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Social Media */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">Follow Us</h4>
                <div className="flex space-x-3">
                  {[
                    { icon: FaInstagram, label: "Instagram" },
                    { icon: FaTwitter, label: "Twitter" },
                    { icon: FaFacebook, label: "Facebook" }
                  ].map((social) => (
                    <div
                      key={social.label}
                      className="group relative"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 transition-all duration-300 cursor-pointer">
                        <social.icon className="text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {social.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="border-t border-gray-200 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>©Level One Talent</span>
                <span className="text-gray-400">•</span>
                <span>All rights reserved</span>
              </div>
              
              {/* Language/Location Selector */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>United Kingdom</span>
                </div>
                
                {/* Back to Top Button */}
                <motion.button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(70px);
          }
        }
      `}</style>
    </footer>
  );
};

export default function ModelApplicationAds() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-rose-50 to-white overflow-x-hidden">
      <EnhancedLogoHeader />
      <div id="hero-section">
        <HeroSection />
      </div>
      <ThreeStepsSection />
      <CustomFooter />
    </div>
  );
} 