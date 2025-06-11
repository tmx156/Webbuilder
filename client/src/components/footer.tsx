import { motion } from "framer-motion";
import { FaInstagram, FaTiktok, FaFacebook, FaTwitter, FaShieldAlt, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";

const socialLinks = [
  { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500" },
  { icon: FaTiktok, href: "#", label: "TikTok", color: "hover:bg-gradient-to-r hover:from-black hover:to-gray-800" },
  { icon: FaFacebook, href: "#", label: "Facebook", color: "hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500" },
  { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-300" }
];

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Careers", href: "/careers" },
  { label: "FAQ", href: "/faq" },
];

const contactInfo = [
  { icon: FaEnvelope, text: "Info@levelonetalent.co.uk", label: "Info" },
  { icon: FaEnvelope, text: "bookings@levelonetalent.co.uk", label: "Bookings" },
  { icon: FaEnvelope, text: "Press@levelonetalent.co.uk", label: "Press" },
];

// Helper function to detect device capability
function detectDevicePerformance() {
  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check device memory if available
  const lowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
  
  // Set quality based on device capability
  if (isMobile || lowMemory) {
    return 'low';
  }
  
  return 'high';
}

export default function Footer() {
  // Detect device performance once
  const performanceTier = useMemo(() => detectDevicePerformance(), []);
  
  // Check if the window is available (to avoid SSR issues)
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Adjust effects based on performance tier
  const starCount = useMemo(() => performanceTier === 'high' ? 150 : 50, [performanceTier]);
  const mediumStarCount = useMemo(() => performanceTier === 'high' ? 30 : 10, [performanceTier]);
  const shootingStarCount = useMemo(() => performanceTier === 'high' ? 5 : 0, [performanceTier]);
  
  // Reduce animation complexity on mobile
  const animationDuration = useMemo(() => 
    performanceTier === 'high' ? { slow: 15, medium: 10, fast: 5 } : { slow: 20, medium: 15, fast: 10 }, 
    [performanceTier]
  );

  // Generate random positions for stars but keep them stable - with reduced count for mobile
  const starsPositions = useMemo(() => 
    Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    })),
    [starCount]
  );
  
  // Generate medium stars with glow - with reduced count for mobile
  const mediumStarsPositions = useMemo(() => 
    Array.from({ length: mediumStarCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      glowSize: Math.random() * 5 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3
    })),
    [mediumStarCount]
  );
  
  // Generate shooting stars - only on high performance devices
  const shootingStarsPositions = useMemo(() => 
    Array.from({ length: shootingStarCount }, () => ({
      y: Math.random() * 80 + 10,
      width: Math.random() * 100 + 50,
      angle: Math.random() * 20 - 10,
      delay: Math.random() * 10,
      duration: Math.random() * 2 + 1,
      repeatDelay: Math.random() * 15 + 10
    })),
    [shootingStarCount]
  );

  return (
    <footer className="relative overflow-hidden">
      {/* Top curved edge */}
      <div className="absolute top-0 left-0 right-0 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -top-16 left-0 w-full">
          <path fill="#111827" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,224C840,245,960,267,1080,261.3C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Main footer content with enhanced background */}
      <div className="pt-24 pb-16 px-6 relative z-10">
        {/* Static background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black -z-20" />
        
        {/* Animated star field background - only render when client-side and conditionally based on device */}
        {isClient && (
          <div className="absolute inset-0 -z-10 opacity-100">
            {/* Small stars */}
            {starsPositions.map((star, i) => (
              <motion.div 
                key={`small-star-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  backgroundColor: `rgba(255, 255, 255, ${star.opacity})`,
                }}
                animate={{
                  opacity: [star.opacity * 0.7, star.opacity, star.opacity * 0.7]
                }}
                transition={{
                  duration: star.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: star.delay
                }}
              />
            ))}
            
            {/* Medium stars with glow - simplified for mobile */}
            {mediumStarsPositions.map((star, i) => (
              <motion.div 
                key={`medium-star-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  backgroundColor: 'white',
                  boxShadow: performanceTier === 'high' 
                    ? `0 0 ${star.glowSize}px rgba(255, 255, 255, 0.8)` 
                    : `0 0 ${star.glowSize * 0.5}px rgba(255, 255, 255, 0.6)`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: star.duration * 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: star.delay
                }}
              />
            ))}
            
            {/* Shooting stars - only on high performance devices */}
            {performanceTier === 'high' && shootingStarsPositions.map((star, i) => (
              <motion.div
                key={`shooting-star-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
                style={{
                  width: `${star.width}px`,
                  top: `${star.y}%`,
                  left: '-100px',
                  transform: `rotate(${star.angle}deg)`,
                  opacity: 0
                }}
                animate={{
                  x: [0, window.innerWidth + 200],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: star.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: star.repeatDelay,
                  delay: star.delay
                }}
              />
            ))}
          </div>
        )}
        
        {/* Subtle grid pattern overlay - only on high performance devices */}
        {performanceTier === 'high' && (
          <div className="absolute inset-0 -z-10 opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="footer-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#footer-grid)" />
            </svg>
          </div>
        )}
        
        {/* Gradient glow effects - only on high performance devices with reduced complexity */}
        {performanceTier === 'high' && (
          <>
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 mix-blend-overlay filter blur-3xl"
              animate={{
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: animationDuration.slow,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-900/20 mix-blend-overlay filter blur-3xl"
              animate={{
                opacity: [0.1, 0.25, 0.1]
              }}
              transition={{
                duration: animationDuration.slow + 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: 5
              }}
            />
          </>
        )}
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top section with logo and social */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-gray-800/50 pb-8">
            <div className="mb-8 md:mb-0">
              <h3 className="text-3xl font-serif font-bold text-white mb-2 bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">LevelOneTalent</h3>
              <p className="text-gray-400 text-sm">Discover your modeling potential</p>
            </div>
            
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-800/80 backdrop-blur-sm text-gray-300 ${social.color} hover:text-white transition-all duration-300`}
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* About column */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="w-6 h-1 bg-gradient-to-r from-rose-400 to-purple-500 mr-3"></span>
                About Us
              </h4>
              <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed mb-6">
                Connecting diverse talent with the world's leading fashion brands. Your journey to becoming a professional model starts here.
              </p>
              <div className="flex items-center">
                <FaShieldAlt className="text-rose-400 mr-2" />
                <span className="text-xs text-gray-500">Verified - UKMA Registered</span>
              </div>
            </div>
            
            {/* Contact column */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="w-6 h-1 bg-gradient-to-r from-rose-400 to-purple-500 mr-3"></span>
                Contact
              </h4>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={index} className="flex items-start">
                      <IconComponent className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-400 font-semibold mr-2">{item.label}:</span>
                      <span className="text-sm text-gray-400">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {/* Quick links column */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="w-6 h-1 bg-gradient-to-r from-rose-400 to-purple-500 mr-3"></span>
                Quick Links
              </h4>
              <ul className="grid grid-cols-2 gap-3">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center"
                    >
                      <span className="w-1 h-1 bg-rose-400 rounded-full mr-2"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="text-center border-t border-gray-800/50 pt-8">
            <p className="text-gray-400 text-sm mb-2">
              No registration fees • Professional guidance • Industry connections
            </p>
            <p className="text-gray-500 text-xs">
              © 2016–2025 LevelOneTalent. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
